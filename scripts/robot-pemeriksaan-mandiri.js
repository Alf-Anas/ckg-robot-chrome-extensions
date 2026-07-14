async function runPemeriksaanMandiri(iData, defData, schema) {
    showPanelMessage(
        `Mulai Pemeriksaan Mandiri untuk ${iData.no}-${iData.nik}-${iData.nama}`,
    );
    const tgl_pemeriksaan = localStorage.getItem(LOCAL_STORAGE.TGL_PEMERIKSAAN);
    const result = await runPemeriksaanMandiriAutofill({
        aktifData: iData,
        defData,
        schema,
        url: MAIN_URL.PELAYANAN_DETAIL_PEMERIKSAAN,
        tgl_pemeriksaan,
    });
    appendPanelMessage(
        `Konfirmasi Mulai Pemeriksaan Mandiri. Status: ${result.status} - ${result.message}`,
    );
    if (result.success) {
        iData.pemeriksaan_mandiri = "OK";
        iData.status_input = result.status;
        iData.keterangan = result.message;
    } else {
        if (result.status == "ERROR") {
            iData.keterangan = result.message;
        } else if (result.status == "TIMEOUT") {
            iData.keterangan = result.message;
        } else {
            iData.pemeriksaan_mandiri = "GAGAL";
            iData.status_input = result.status;
            iData.keterangan = result.message;
        }
    }
    await new Promise((r) => setTimeout(r, 1500));
    return iData;
}

async function runPemeriksaanMandiriAutofill({
    aktifData,
    defData,
    schema,
    url,
    tgl_pemeriksaan,
}) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const targetTabId = tab.id;

    const scriptResult = await chrome.scripting.executeScript({
        target: { tabId: targetTabId },
        args: [url],
        func: (targetUrl) => {
            const currentUrl = window.location.href;
            return currentUrl.includes(targetUrl) || currentUrl === targetUrl;
        },
    });
    const isPageMatch = scriptResult[0]?.result;
    if (!isPageMatch) {
        return {
            success: false,
            status: "ERROR",
            message:
                "Gagal: Halaman browser aktif tidak berada di URL pemeriksaan yang sesuai.",
        };
    }

    function createLabelToKeyMapping(schema) {
        const mapping = {};
        Object.values(schema).forEach((item) => {
            if (item.label && item.key) {
                mapping[item.label.trim()] = item.key;
            }
        });
        return mapping;
    }
    const LAYANAN_TO_SCHEMA_MAP = createLabelToKeyMapping(
        pemeriksaanDataSchema,
    );

    return new Promise((resolve) => {
        function backgroundMessageListener(request, sender, sendResponse) {
            if (request.type === "ROBOT_STATUS") {
                appendPanelMessage(request.message);
            }

            if (request.type === "PIPELINE_COMPLETE") {
                chrome.runtime.onMessage.removeListener(
                    backgroundMessageListener,
                );
                resolve({
                    success: true,
                    status: "OK",
                    message:
                        "Semua formulir mandiri yang tersedia berhasil di-autofill secara otomatis.",
                });
            }
        }
        chrome.runtime.onMessage.addListener(backgroundMessageListener);

        // 3. Suntikkan script untuk SCANNING TABEL di halaman aktif saat ini
        chrome.scripting.executeScript({
            target: { tabId: targetTabId },
            args: [aktifData, defData, schema, LAYANAN_TO_SCHEMA_MAP],
            func: async (inData, defaultData, globalSchema, mapping) => {
                const rows = document.querySelectorAll(
                    ".table-pemeriksaan-mandiri table tbody tr",
                );
                const queue = [];

                rows.forEach((row) => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length < 3) return;
 
                    const statusImg = cells[1].querySelector("img");
                    if (statusImg) {
                        const imgSrc = statusImg.getAttribute("src") || ""; 
                        if (imgSrc.includes("icon-success.svg") && !imgSrc.includes("icon-success-gray.svg")) {
                            return;
                        }
                    }

                    const namaLayananHTML = cells[0].textContent.trim();
                    const btnInput = cells[2].querySelector("button");
                    const schemaKey = mapping[namaLayananHTML];

                    // Hanya masukkan antrean jika tombolnya bertuliskan "Input Data" (belum diisi)
                    if (
                        btnInput &&
                        btnInput.textContent.includes("Input Data") &&
                        schemaKey
                    ) {
                        const parentContainer =
                            btnInput.closest("div[id]") ||
                            btnInput.closest("tr");

                        if (!parentContainer.id) {
                            parentContainer.id =
                                "robot_row_" +
                                Math.random().toString(36).substr(2, 9);
                        }

                        queue.push({
                            nama: namaLayananHTML,
                            key: schemaKey,
                            elementId: parentContainer.id,
                        });
                    }
                });

                if (queue.length === 0) {
                    // Jika tidak ada antrean, langsung beri tahu popup untuk selesai
                    return chrome.runtime.sendMessage({
                        type: "PIPELINE_COMPLETE",
                    });
                }

                // KIRIM DATA ANTREAN KE BACKGROUND SCRIPT UNTUK DIEKSEKUSI Berpindah-pindah Halaman
                chrome.runtime.sendMessage({
                    type: "START_PIPELINE_FLOW",
                    queue: queue,
                    inData,
                    defData: defaultData,
                    schema: globalSchema,
                });
            },
        });
    });
}
