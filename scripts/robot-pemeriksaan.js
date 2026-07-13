async function runPemeriksaan(iData, defData) {
    showPanelMessage(
        `Mulai Pemeriksaan untuk ${iData.no}-${iData.nik}-${iData.nama}`,
    );
    const tgl_pemeriksaan = localStorage.getItem(LOCAL_STORAGE.TGL_PEMERIKSAAN);
    const result = await runPemeriksaanAutofill({
        aktifData: iData,
        defData,
        url: MAIN_URL.PELAYANAN,
        tgl_pemeriksaan,
    });
    appendPanelMessage(
        `Konfirmasi Mulai Pemeriksaan. Status: ${result.status} - ${result.message}`,
    );
    if (result.success) {
        iData.pemeriksaan = "OK";
        iData.status_input = result.status;
        iData.keterangan = result.message;
    } else {
        if (result.status == "ERROR") {
            iData.keterangan = result.message;
        } else if (result.status == "TIMEOUT") {
            iData.keterangan = result.message;
        } else {
            iData.pemeriksaan = "GAGAL";
            iData.status_input = result.status;
            iData.keterangan = result.message;
        }
    }
    await new Promise((r) => setTimeout(r, 1500));
    return iData;
}

async function runPemeriksaanAutofill({
    aktifData,
    defData,
    url,
    tgl_pemeriksaan,
}) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const targetTabId = tab.id;

    // 1. Initial redirect
    await chrome.scripting.executeScript({
        target: { tabId: targetTabId },
        args: [url],
        func: (targetUrl) => {
            window.location.href = targetUrl;
        },
    });

    // 2. Wait for page load and execute steps pipeline
    return new Promise((resolve, reject) => {
        function panelMessageListener(request, sender, sendResponse) {
            if (request.type === "ROBOT_STATUS") {
                appendPanelMessage(request.message);
            }
        }
        function listener(tabId, changeInfo, updatedTab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript(
                    {
                        target: { tabId: targetTabId },
                        args: [aktifData, defData, tgl_pemeriksaan],
                        func: async (inData, defData, tgl_pemeriksaan) => {
                            const logStatus = (msg) => {
                                try {
                                    chrome.runtime.sendMessage({
                                        type: "ROBOT_STATUS",
                                        message: msg,
                                    });
                                } catch (err) {
                                    console.error(
                                        "Failed to send status message:",
                                        err,
                                    );
                                }
                            };

                            logStatus("Data diterima, mulai pemeriksaan...");

                            // Define the persistent state that steps can mutate or read from
                            const state = {
                                earlyExit: null,
                            };

                            const steps = [
                                {
                                    name: "Select Search by NIK",
                                    action: async () => {
                                        logStatus("1. Pencarian by NIK...");
                                        const selectSearch =
                                            await waitForElementAsync(
                                                X_PATH.SELECT_SEARCH_PELAYANAN,
                                            );
                                        clickElement(selectSearch);
                                        const selectSearchNik =
                                            await waitForElementAsync(
                                                X_PATH.SELECT_SEARCH_NIK_PELAYANAN,
                                            );
                                        clickElement(selectSearchNik);
                                        await sleep(750);

                                        const inputSearchNik =
                                            await waitForElementAsync(
                                                X_PATH.INPUT_SEARCH_NIK_PELAYANAN,
                                            );
                                        forceInput(
                                            inputSearchNik,
                                            String(inData.nik),
                                        );
                                        await sleep(500);
                                        enterKeyElement(inputSearchNik);
                                        await sleepUntilLoaded();
                                    },
                                },
                                {
                                    name: "Check which tab table",
                                    action: async () => {
                                        logStatus(
                                            "2. Mencari berdasarkan tab table...",
                                        );

                                        async function checkWhichTableExist() {
                                            const belum = document.evaluate(
                                                "//div[contains(text(),'Belum Pemeriksaan')]//span",
                                                document,
                                                null,
                                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                null,
                                            ).singleNodeValue;

                                            const count = belum
                                                ? parseInt(
                                                      belum.textContent.trim(),
                                                  )
                                                : null;
                                            if (count === 0) {
                                                // go to parent tab div
                                                const belumTab =
                                                    belum.closest(
                                                        "div.cursor-pointer",
                                                    );

                                                // next tab = Sedang Pemeriksaan
                                                const sedang =
                                                    belumTab?.nextElementSibling;
                                                if (sedang) {
                                                    clickElement(sedang);
                                                }
                                            }
                                        }
                                        await checkWhichTableExist();
                                    },
                                },
                                {
                                    name: "Start Pemeriksaan",
                                    action: async () => {
                                        logStatus("3. Memulai pemeriksaan...");
                                        const btnMulai =
                                            await waitForElementAsync(
                                                X_PATH.BTN_MULAI_PEMERIKSAAN_TABLE,
                                            );
                                        clickElement(btnMulai);

                                        await sleepUntilLoaded();
                                        try {
                                            const btnSelesaikanExist =
                                                document.evaluate(
                                                    X_PATH.BTN_SELESAIKAN_LAYANAN,
                                                    document,
                                                    null,
                                                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                    null,
                                                ).singleNodeValue;

                                            if (btnSelesaikanExist) {
                                                logStatus(
                                                    "4. Pemeriksaan telah dimulai...",
                                                );
                                            } else {
                                                logStatus(
                                                    "4. Memulai pemeriksaan CKG...",
                                                );
                                                const btnMulaiPemeriksaan =
                                                    await waitForElementAsync(
                                                        X_PATH.BTN_MULAI_PEMERIKSAAN,
                                                    );
                                                clickElement(
                                                    btnMulaiPemeriksaan,
                                                );
                                                const btnMulaiPemeriksaanSimpan =
                                                    await waitForElementAsync(
                                                        X_PATH.BTN_MULAI_PEMERIKSAAN_SIMPAN,
                                                    );
                                                clickElement(
                                                    btnMulaiPemeriksaanSimpan,
                                                );
                                                await waitForElementAsync(
                                                    X_PATH.BTN_SELESAIKAN_LAYANAN,
                                                );
                                            }
                                        } catch (err) {
                                            logStatus(
                                                "4. Timeout: Button Selesaikan Layanan tidak ditemukan!",
                                            );
                                            state.earlyExit = {
                                                success: false,
                                                status: "TIMEOUT",
                                                message:
                                                    "System timeout waiting for Button Selesaikan Layanan response",
                                            };
                                        }
                                    },
                                },
                            ];

                            try {
                                for (const step of steps) {
                                    if (state.earlyExit) break;

                                    // Check if this step is allowed to run based on current conditions
                                    if (step.shouldRun && !step.shouldRun()) {
                                        console.log(
                                            `Skipping step: ${step.name}`,
                                        );
                                        continue;
                                    }

                                    console.log(`Executing step: ${step.name}`);
                                    await step.action();
                                }
                            } catch (err) {
                                return {
                                    success: false,
                                    status: "ERROR",
                                    message: JSON.stringify(err),
                                };
                            }

                            if (state.earlyExit) {
                                return state.earlyExit;
                            }
                            return {
                                success: true,
                                status: "-- ON PROGRESS --",
                                message: "Berhasil Memulai Pemeriksaan",
                            };
                        },
                    },
                    (results) => {
                        console.log("results");
                        console.log(results);
                        chrome.runtime.onMessage.removeListener(
                            panelMessageListener,
                        );
                        if (chrome.runtime.lastError) {
                            console.log("[ERROR]");
                            console.log(chrome.runtime.lastError);
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(results[0].result); // pass result back to caller
                        }
                    },
                );
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
        chrome.runtime.onMessage.addListener(panelMessageListener);
    });
}
