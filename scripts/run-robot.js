document.getElementById("openDashboard").addEventListener("click", async () => {
    const url = chrome.runtime.getURL("dashboard.html");
    chrome.tabs.create({ url });
});

document.getElementById("minimize").addEventListener("click", async () => {
    document.body.classList.toggle("minimized");
});

async function runRobot(aktifData) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const targetTabId = tab.id;
    const defaultData = getDefaultData();

    await chrome.scripting.executeScript({
        target: { tabId: targetTabId },
        func: () => {
            window.location.href =
                "https://sehatindonesiaku.kemkes.go.id/ckg-pendaftaran-individu";
        },
    });

    return new Promise((resolve, reject) => {
        function listener(tabId, changeInfo, updatedTab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript(
                    {
                        target: { tabId: targetTabId },
                        args: [aktifData, defaultData],
                        func: async (inData, defData) => {
                            console.log("III", inData, defData);

                            // CLICK DAFTAR BARU
                            const btnDaftar = await waitForElementAsync(
                                X_PATH.BTN_DAFTAR_BARU
                            );
                            clickElement(btnDaftar);

                            if (inData.nik) {
                                const inputNIK = await waitForElementAsync(
                                    X_PATH.INPUT_NIK
                                );
                                inputElementValue(inputNIK, inData.nik);
                            } else {
                                // const inputNoNIK = await waitForElementAsync(
                                //     X_PATH.CHECKBOX_NO_NIK
                                // );
                                // clickElement(inputNoNIK);
                                console.log("Message found: Tidak Ada NIK");

                                return {
                                    success: false,
                                    message: "Tidak Ada NIK",
                                    noNik: true,
                                };
                            }

                            const inputNamaLengkap = await waitForElementAsync(
                                X_PATH.INPUT_NAMA_LENGKAP
                            );
                            inputElementValue(inputNamaLengkap, inData.nama);

                            async function selectBirthYear(dateStr) {
                                const tglLahir = parseDateString(dateStr);
                                if (!tglLahir) return;

                                const tglInput = await waitForElementAsync(
                                    X_PATH.INPUT_TGL_LAHIR
                                );
                                clickElement(tglInput);

                                const yearBtn = await waitForElementAsync(
                                    X_PATH.INPUT_TGL_LAHIR_YEAR
                                );
                                clickElement(yearBtn);

                                // Find and click day
                                async function findDay() {
                                    const dayTable = await waitForElementAsync(
                                        X_PATH.INPUT_TGL_LAHIR_DAY_TABLE
                                    );
                                    const xpath = `.//td[@title="${tglLahir.date}"]`;
                                    const dayEl = document.evaluate(
                                        xpath,
                                        dayTable,
                                        null,
                                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                                        null
                                    ).singleNodeValue;
                                    if (dayEl) clickElement(dayEl);
                                }

                                // Find and click month
                                async function findMonth() {
                                    const monthTable =
                                        await waitForElementAsync(
                                            X_PATH.INPUT_TGL_LAHIR_MONTH_TABLE
                                        );
                                    const xpath = `.//td[@data-month="${
                                        tglLahir.month - 1
                                    }"]`;
                                    const monthEl = document.evaluate(
                                        xpath,
                                        monthTable,
                                        null,
                                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                                        null
                                    ).singleNodeValue;
                                    if (monthEl) {
                                        clickElement(monthEl);
                                        await sleep(350); // wait for day table to render
                                        await findDay();
                                    }
                                }

                                // Find and click year (recursive if not found)
                                async function findYear() {
                                    const yearTable = await waitForElementAsync(
                                        X_PATH.INPUT_TGL_LAHIR_YEAR_TABLE
                                    );
                                    const xpath = `.//td[@data-year="${tglLahir.year}"]`;
                                    const yearEl = document.evaluate(
                                        xpath,
                                        yearTable,
                                        null,
                                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                                        null
                                    ).singleNodeValue;

                                    if (yearEl) {
                                        clickElement(yearEl);
                                        await sleep(350); // wait for month table to render
                                        await findMonth();
                                    } else {
                                        const prevBtn =
                                            await waitForElementAsync(
                                                X_PATH.INPUT_TGL_LAHIR_YEAR_BEFORE
                                            );
                                        clickElement(prevBtn);
                                        await sleep(350); // small delay before retry
                                        await findYear();
                                    }
                                }

                                await findYear();
                            }
                            await selectBirthYear(inData.tgl_lahir);

                            const inputJK = await waitForElementAsync(
                                X_PATH.INPUT_JENIS_KELAMIN
                            );
                            clickElement(inputJK);

                            const isPerempuan =
                                String(inData.jenis_kelamin).toLowerCase() ===
                                "perempuan";
                            if (isPerempuan) {
                                const selPR = await waitForElementAsync(
                                    X_PATH.SELECT_JK_PR
                                );
                                clickElement(selPR);
                            } else {
                                const selLK = await waitForElementAsync(
                                    X_PATH.SELECT_JK_LK
                                );
                                clickElement(selLK);
                            }

                            const inputWA = await waitForElementAsync(
                                X_PATH.INPUT_WA
                            );
                            inputElementValue(
                                inputWA,
                                cleanPhoneNumber(inData.no_hp, defData.no_wa)
                            );

                            // Wait for ALAMAT input, fill it
                            const inputAlamat = await waitForElementAsync(
                                X_PATH.INPUT_ALAMAT
                            );
                            inputElementValue(
                                inputAlamat,
                                inData.alamat || defData.alamat
                            );

                            async function selectPekerjaan() {
                                const inputPekerjaan =
                                    await waitForElementAsync(
                                        X_PATH.INPUT_PEKERJAAN
                                    );
                                clickElement(inputPekerjaan);
                                const inputPekerjaanParent =
                                    await waitForElementAsync(
                                        X_PATH.INPUT_PEKERJAAN_PARENT
                                    );
                                const xpath = `.//button[.//div[contains(normalize-space(text()), '${getPekerjaanLabel(
                                    inData.pekerjaan
                                )}')]]`;
                                const pekerjaanEl = document.evaluate(
                                    xpath,
                                    inputPekerjaanParent,
                                    null,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                                    null
                                ).singleNodeValue;
                                if (pekerjaanEl) {
                                    clickElement(pekerjaanEl);
                                }
                            }

                            await selectPekerjaan();

                            async function selectAlamatDomisili() {
                                const inputDomisili = await waitForElementAsync(
                                    X_PATH.INPUT_ALAMAT_DOMISILI
                                );
                                clickElement(inputDomisili);

                                async function getKelDesa() {
                                    const success = await selectWithRetry(
                                        X_PATH.INPUT_ALAMAT_DOMISILI_KEL_DESA_PARENT,
                                        defData.keldesa
                                    );
                                }

                                async function getKecamatan() {
                                    const success = await selectWithRetry(
                                        X_PATH.INPUT_ALAMAT_DOMISILI_KECAMATAN_PARENT,
                                        defData.kecamatan
                                    );

                                    if (success) {
                                        await getKelDesa();
                                    }
                                }
                                async function getKabKota() {
                                    const success = await selectWithRetry(
                                        X_PATH.INPUT_ALAMAT_DOMISILI_KAB_KOTA_PARENT,
                                        defData.kabkota
                                    );

                                    if (success) {
                                        await getKecamatan();
                                    }
                                }
                                async function getProvinsi() {
                                    const success = await selectWithRetry(
                                        X_PATH.INPUT_ALAMAT_DOMISILI_PROVINSI_PARENT,
                                        defData.provinsi
                                    );

                                    if (success) {
                                        await getKabKota();
                                    }
                                }

                                await getProvinsi();
                            }

                            await selectAlamatDomisili();

                            async function selectTanggalPemeriksaan() {
                                const tglParent = await waitForElementAsync(
                                    X_PATH.INPUT_TGL_PEMERIKSAAN_PARENT
                                );
                                const xpath = `.//button[not(contains(@class,'cursor-not-allowed'))]/span[text()='${defData.tanggal_pemeriksaan}']/..`;

                                const tglEl = document.evaluate(
                                    xpath,
                                    tglParent,
                                    null,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                                    null
                                ).singleNodeValue;
                                if (tglEl) {
                                    clickElement(tglEl);
                                }
                            }

                            await selectTanggalPemeriksaan();

                            // CLICK SELANJUTNYA
                            const btnSelanjutnya = await waitForElementAsync(
                                X_PATH.BTN_SELANJUTNYA
                            );
                            clickElement(btnSelanjutnya);

                            // CLICK LANJUT
                            const btnLanjutKuotaHabis =
                                await waitForElementAsync(
                                    X_PATH.BTN_LANJUT_KUOTA_HABIS
                                );
                            clickElement(btnLanjutKuotaHabis);

                            try {
                                const msgPopup = await waitForElementAsync(
                                    X_PATH.MSG_POPUP
                                );
                                if (msgPopup) {
                                    console.log("MSGPOPUP found", msgPopup);
                                    const text = msgPopup.textContent.trim();
                                    if (
                                        text.includes(
                                            "Pembatasan Umur Pemeriksaan"
                                        )
                                    ) {
                                        console.log(
                                            "Message found: Pembatasan Umur Pemeriksaan"
                                        );

                                        return {
                                            success: false,
                                            message:
                                                "Pembatasan Umur Pemeriksaan",
                                            pembatasanUmurPemeriksaan: true,
                                        };
                                    } else {
                                        return {
                                            success: false,
                                            message: text,
                                            lainnya: true,
                                        };
                                    }
                                }
                            } catch (err) {}

                            if (inData.nik) {
                                // CLICK PILIH
                                const btnPilihPeserta =
                                    await waitForElementAsync(
                                        X_PATH.BTN_PILIH_PESERTA
                                    );
                                clickElement(btnPilihPeserta);

                                // CLICK DAFTAR DENGAN NIK
                                const btnDaftarNIK = await waitForElementAsync(
                                    X_PATH.BTN_DAFTAR_DENGAN_NIK
                                );
                                clickElement(btnDaftarNIK);
                            } else {
                                // CLICK DAFTAR TANPA NIK
                                const btnDaftarNoNIK =
                                    await waitForElementAsync(
                                        X_PATH.BTN_DAFTAR_TANPA_NIK
                                    );
                                clickElement(btnDaftarNoNIK);
                            }

                            // CLICK CEK POPUP
                            try {
                                const msgPopup = await waitForElementAsync(
                                    X_PATH.MSG_POPUP
                                );
                                if (msgPopup) {
                                    console.log("MSGPOPUP found", msgPopup);
                                    const text = msgPopup.textContent.trim();
                                    if (
                                        text.includes("Data belum sesuai KTP")
                                    ) {
                                        console.log(
                                            "Message found: Data belum sesuai KTP"
                                        );

                                        return {
                                            success: false,
                                            message: "Data belum sesuai KTP",
                                            belumSesuaiKTP: true,
                                        };
                                    } else if (
                                        text.includes("Kuota Pemeriksaan Habis")
                                    ) {
                                        console.log(
                                            "Message found: Kuota Pemeriksaan Habis"
                                        );

                                        return {
                                            success: false,
                                            message: "Kuota Pemeriksaan Habis",
                                            kuotaHabis: true,
                                        };
                                    } else if (
                                        text.includes(
                                            "Peserta Menerima Pemeriksaan"
                                        )
                                    ) {
                                        console.log(
                                            "Message found: Peserta Menerima Pemeriksaan"
                                        );

                                        return {
                                            success: false,
                                            message:
                                                "Peserta Menerima Pemeriksaan",
                                            sudahDidaftarkan: true,
                                        };
                                    } else if (
                                        text.includes(
                                            "Pembatasan Umur Pemeriksaan"
                                        )
                                    ) {
                                        console.log(
                                            "Message found: Pembatasan Umur Pemeriksaan"
                                        );

                                        return {
                                            success: false,
                                            message:
                                                "Pembatasan Umur Pemeriksaan",
                                            pembatasanUmurPemeriksaan: true,
                                        };
                                    } else {
                                        console.log("Message found: ", text);

                                        return {
                                            success: false,
                                            message: text,
                                            lainnya: true,
                                        };
                                    }
                                }
                            } catch (err) {
                                console.log("Berhasil daftar!");
                            }

                            const msgPopupSuccess = await waitForElementAsync(
                                X_PATH.MSG_POPUP_SUCCESS
                            );

                            if (!msgPopupSuccess) {
                                return {
                                    success: false,
                                    message: "Gagal Daftar!",
                                    lainnya: true,
                                };
                            }

                            const textSuccessDaftar =
                                msgPopupSuccess.textContent.trim();
                            if (
                                !textSuccessDaftar.includes("Berhasil Daftar")
                            ) {
                                return {
                                    success: false,
                                    message: "Gagal Daftar!",
                                    lainnya: true,
                                };
                            }

                            const btnTutupSuccess = await waitForElementAsync(
                                X_PATH.BTN_TUTUP_SUCCESS_DAFTAR
                            );
                            clickElement(btnTutupSuccess);
                            await sleep(500);
                            const selectSearch = await waitForElementAsync(
                                X_PATH.SELECT_SEARCH
                            );
                            clickElement(selectSearch);
                            const selectSearchNama = await waitForElementAsync(
                                X_PATH.SELECT_SEARCH_NAMA
                            );
                            clickElement(selectSearchNama);
                            await sleep(750);

                            const inputSearchNama = await waitForElementAsync(
                                X_PATH.INPUT_SEARCH
                            );
                            inputElementValue(inputSearchNama, inData.nama);
                            enterKeyElement(inputSearchNama);
                            await sleep(750);
                            const btnKonfirmHadir = await waitForElementAsync(
                                X_PATH.BTN_KONFIMASI_HADIR
                            );
                            clickElement(btnKonfirmHadir);

                            const checkboxBersediaCKG =
                                await waitForElementAsync(
                                    X_PATH.CHECKBOX_BERSEDIA_CKG
                                );
                            clickElement(checkboxBersediaCKG);
                            await sleep(500);
                            const btnHadirOK = await waitForElementAsync(
                                X_PATH.BTN_HADIR_CKG
                            );
                            clickElement(btnHadirOK);

                            await sleep(750);
                            const msgPopupSuccessHadir =
                                await waitForElementAsync(
                                    X_PATH.MSG_POPUP_BERHASIL_HADIR
                                );

                            if (msgPopupSuccessHadir) {
                                const textSuccessHadir =
                                    msgPopupSuccessHadir.textContent.trim();
                                if (
                                    textSuccessHadir.includes("Berhasil Hadir")
                                ) {
                                    return {
                                        success: true,
                                        message: "Berhasil Hadir",
                                        hadir: true,
                                        daftar: true,
                                    };
                                }
                            }

                            return {
                                success: true,
                                message: "Gagal Hadir",
                                daftar: true,
                                hadir: false,
                            };
                        },
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(results[0].result); // pass result back to caller
                        }
                    }
                );
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    });
}

document.getElementById("runBtn").addEventListener("click", async () => {
    showMessage(`Persiapan pengisian data!`);
    const defData = getDefaultData();
    const listData = getAktifData();
    showLoading();
    for (let i = 0; i < listData.length; i++) {
        const iData = listData[i];
        showMessage(
            `Pengisian Data untuk ${iData.no}-${iData.nik}-${iData.nama}`
        );
        console.log("Robot Runnnn...", i);
        const result = await runRobot(iData);
        console.log("One robot finished:", result);

        if (result?.kuotaHabis) break;

        const logsData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
        );

        const find = logsData.find((it) => it.no === iData.no);
        let eStatus = result?.belumSesuaiKTP
            ? "Nama dan NIK Beda"
            : result?.sudahDidaftarkan
            ? "Double Data"
            : result?.noNik
            ? "Lainnya"
            : result?.pembatasanUmurPemeriksaan
            ? "Lainnya"
            : result?.lainnya
            ? "Lainnya"
            : result?.success
            ? "--On Progress--"
            : "";
        let eKeterangan = result?.message;
        if (!eStatus) continue;
        if (eStatus === "--On Progress--") {
            if (isUnder10Years(iData.tgl_lahir)) {
                eStatus = "Berhasil Input";
                eKeterangan = "BAYI";
            } else if (isOver60Years(iData.tgl_lahir)) {
                eStatus = "Berhasil Input";
                eKeterangan = "LANSIA";
            }
        }
        if (find) {
            find.status = eStatus;
            find.keterangan = eKeterangan;
            find.daftar = result?.daftar ? "Berhasil" : "Gagal";
            find.hadir = result?.hadir ? "Ya" : "Tidak";
        } else {
            logsData.push({
                ...defData,
                no: iData.no,
                nik: iData.nik,
                nama: iData.nama,
                tgl_lahir: iData.tgl_lahir,
                jenis_kelamin: iData.jenis_kelamin,
                alamat: iData.alamat || defData.alamat,
                no_wa: iData.no_hp || defData.no_wa,
                status: eStatus,
                keterangan: eKeterangan,
                daftar: result?.daftar ? "Berhasil" : "Gagal",
                hadir: result?.hadir ? "Ya" : "Tidak",
            });
        }
        localStorage.setItem(LOCAL_STORAGE.LOGS, JSON.stringify(logsData));
        loadDataTable();

        await new Promise((r) => setTimeout(r, 1500));
    }
    hideLoading();
    showMessage(`Pengisian Data Selesai!`);
    console.log("All robots finished");
});

let PemeriksaanStatus = {
    finished: false,
    data: {},
    pemeriksaan: "Belum",
    rapor: "Belum",
};

async function runRobotPemeriksaan(aktifData) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const targetTabId = tab.id;
    const defaultData = getDefaultData();

    await chrome.scripting.executeScript({
        target: { tabId: targetTabId },
        func: () => {
            window.location.href =
                "https://sehatindonesiaku.kemkes.go.id/ckg-pelayanan";
        },
    });

    return new Promise((resolve, reject) => {
        function listener(tabId, changeInfo, updatedTab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript(
                    {
                        target: { tabId: targetTabId },
                        args: [aktifData, defaultData],
                        func: async (inData, defData) => {
                            console.log("III", inData, defData);

                            const selectSearch = await waitForElementAsync(
                                X_PATH.SELECT_SEARCH_PELAYANAN
                            );
                            clickElement(selectSearch);
                            const selectSearchNik = await waitForElementAsync(
                                X_PATH.SELECT_SEARCH_NIK_PELAYANAN
                            );
                            clickElement(selectSearchNik);
                            await sleep(750);

                            const inputSearchNik = await waitForElementAsync(
                                X_PATH.INPUT_SEARCH_NIK_PELAYANAN
                            );
                            inputElementValue(inputSearchNik, inData.nik);
                            enterKeyElement(inputSearchNik);

                            await sleep(750);
                            const btnMulai = await waitForElementAsync(
                                X_PATH.BTN_MULAI_PELAYANAN
                            );
                            clickElement(btnMulai);

                            await sleep(500);
                            try {
                                const btnMulaiPemeriksaan =
                                    await waitForElementAsync(
                                        X_PATH.BTN_MULAI_PEMERIKSAAN
                                    );
                                clickElement(btnMulaiPemeriksaan);
                            } catch (err) {
                                console.log(err);
                            }

                            await sleep(750);
                            const btnInputGizi = await waitForElementAsync(
                                X_PATH.BTN_INPUT_GIZI
                            );
                            chrome.runtime.sendMessage({
                                inputGiziPage: true,
                                inData,
                                defData,
                            });
                            clickElement(btnInputGizi);
                        },
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(results[0].result); // pass result back to caller
                        }
                    }
                );
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    });
}

async function runInputGiziPageScript(inData, defData) {
    (async () => {
        console.log("INPUT GIZI", inData, defData);
        const inputBB = await waitForElementAsync(X_PATH.INPUT_GIZI_BB);
        inputElementValue(inputBB, inData.berat_badan || defData.berat_badan);
        const inputTB = await waitForElementAsync(X_PATH.INPUT_GIZI_TB);
        inputElementValue(inputTB, inData.tinggi_badan || defData.tinggi_badan);
        const inputLP = await waitForElementAsync(X_PATH.INPUT_GIZI_LP);
        inputElementValue(
            inputLP,
            inData.lingkar_perut || defData.lingkar_perut
        );
        const btnInputGiziKirim = await waitForElementAsync(
            X_PATH.BTN_INPUT_DATA_KIRIM
        );
        chrome.runtime.sendMessage({
            inputDarah: true,
            inData,
            defData,
        });
        clickElement(btnInputGiziKirim);
    })();
}

async function runInputDarahScript(inData, defData) {
    (async () => {
        console.log("INPUT DARAH", inData, defData);
        const btnInputDarah = await waitForElementAsync(
            X_PATH.BTN_INPUT_TEKANAN_DARAH
        );
        chrome.runtime.sendMessage({
            inputDarahPage: true,
            inData,
            defData,
        });
        clickElement(btnInputDarah);
    })();
}

async function runInputDarahPageScript(inData, defData) {
    (async () => {
        console.log("INPUT DARAH PAGE", inData, defData);
        const inputSistolik = await waitForElementAsync(
            X_PATH.INPUT_DARAH_SISTOLIK
        );
        inputElementValue(inputSistolik, inData.td_sistol || defData.td_sistol);
        const inputDiastolik = await waitForElementAsync(
            X_PATH.INPUT_DARAH_DIASTOLIK
        );
        inputElementValue(
            inputDiastolik,
            inData.td_diastol || defData.td_diastol
        );
        const btnInputDataKirim = await waitForElementAsync(
            X_PATH.BTN_INPUT_DATA_KIRIM
        );
        chrome.runtime.sendMessage({
            inputGula: true,
            inData,
            defData,
        });
        clickElement(btnInputDataKirim);
    })();
}

async function runInputGulaScript(inData, defData) {
    (async () => {
        console.log("INPUT GULA", inData, defData);
        const btnInputGula = await waitForElementAsync(
            X_PATH.BTN_INPUT_GULA_DARAH
        );
        chrome.runtime.sendMessage({
            inputGulaPage: true,
            inData,
            defData,
        });
        clickElement(btnInputGula);
    })();
}

async function runInputGulaPageScript(inData, defData) {
    (async () => {
        console.log("INPUT GULA PAGE", inData, defData);
        const inputGDS = await waitForElementAsync(X_PATH.INPUT_GDS);
        inputElementValue(
            inputGDS,
            inData.pemeriksaan_gula || defData.pemeriksaan_gula
        );
        const btnInputDataKirim = await waitForElementAsync(
            X_PATH.BTN_INPUT_DATA_KIRIM
        );
        chrome.runtime.sendMessage({
            inputKirimRapor: true,
            inData,
            defData,
        });
        clickElement(btnInputDataKirim);
    })();
}

async function runInputKirimRaporScript(inData, defData) {
    (async () => {
        try {
            console.log("KIRIM RAPOR", inData, defData);
            const btnKirimRaport = await waitForElementAsync(
                X_PATH.BTN_KIRIM_RAPOR
            );

            clickElement(btnKirimRaport);

            await sleep(750);
            const btnKirimRaportOK = await waitForElementAsync(
                X_PATH.BTN_KIRIM_RAPOR_OK
            );
            clickElement(btnKirimRaportOK);
            console.log("btnKirimRaportOK", btnKirimRaportOK);

            chrome.runtime.sendMessage({
                finished: true,
                inData,
                defData,
            });
        } catch (err) {
            chrome.runtime.sendMessage({
                kirimFailed: true,
                inData,
                defData,
            });
        }
    })();
}

chrome.runtime.onMessage.addListener(async (msg, sender) => {
    const targetTabId = sender.tab.id;
    console.log("MESSAGE RUNTIME", msg);
    if (msg.inputGiziPage) {
        console.log("Run Input Gizi");
        function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                if (tab.url.includes("form.kemkes.go.id/survey-form")) {
                    chrome.tabs.onUpdated.removeListener(listener);

                    chrome.scripting.executeScript({
                        target: { tabId: targetTabId },
                        args: [msg.inData, msg.defData],
                        func: runInputGiziPageScript,
                    });
                }
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    } else if (msg.inputDarah) {
        console.log("Run Input Darah");
        function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                if (
                    tab.url.includes(
                        "sehatindonesiaku.kemkes.go.id/ckg-pelayanan/detail-pemeriksaan"
                    )
                ) {
                    chrome.tabs.onUpdated.removeListener(listener);

                    chrome.scripting.executeScript({
                        target: { tabId: targetTabId },
                        args: [msg.inData, msg.defData],
                        func: runInputDarahScript,
                    });
                }
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    } else if (msg.inputDarahPage) {
        console.log("Run Input Darah Page");
        function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                if (tab.url.includes("form.kemkes.go.id/survey-form")) {
                    chrome.tabs.onUpdated.removeListener(listener);

                    chrome.scripting.executeScript({
                        target: { tabId: targetTabId },
                        args: [msg.inData, msg.defData],
                        func: runInputDarahPageScript,
                    });
                }
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    } else if (msg.inputGula) {
        console.log("Run Input Gula");
        function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                if (
                    tab.url.includes(
                        "sehatindonesiaku.kemkes.go.id/ckg-pelayanan/detail-pemeriksaan"
                    )
                ) {
                    chrome.tabs.onUpdated.removeListener(listener);

                    chrome.scripting.executeScript({
                        target: { tabId: targetTabId },
                        args: [msg.inData, msg.defData],
                        func: runInputGulaScript,
                    });
                }
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    } else if (msg.inputGulaPage) {
        console.log("Run Input Gula Page");
        function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                if (tab.url.includes("form.kemkes.go.id/survey-form")) {
                    chrome.tabs.onUpdated.removeListener(listener);

                    chrome.scripting.executeScript({
                        target: { tabId: targetTabId },
                        args: [msg.inData, msg.defData],
                        func: runInputGulaPageScript,
                    });
                }
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    } else if (msg.inputKirimRapor) {
        PemeriksaanStatus.pemeriksaan = "Sudah";
        console.log("Run Raport");
        function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                if (
                    tab.url.includes(
                        "sehatindonesiaku.kemkes.go.id/ckg-pelayanan/detail-pemeriksaan"
                    )
                ) {
                    chrome.tabs.onUpdated.removeListener(listener);

                    chrome.scripting.executeScript({
                        target: { tabId: targetTabId },
                        args: [msg.inData, msg.defData],
                        func: runInputKirimRaporScript,
                    });
                }
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    } else if (msg.finished) {
        console.log("FINISHED!");
        PemeriksaanStatus.finished = true;
        PemeriksaanStatus.rapor = "Sudah";
    } else if (msg.kirimFailed) {
        console.log("KIRIM FAILED!");
        PemeriksaanStatus.rapor = "Gagal";
    }
});

document.getElementById("runPelayanan").addEventListener("click", async () => {
    showMessage(`Persiapan pengisian data!`);
    const listData = getPemeriksaanData();
    showLoading();
    for (let i = 0; i < listData.length; i++) {
        const iData = listData[i];
        PemeriksaanStatus = {
            finished: false,
            data: iData,
            pemeriksaan: "Belum",
            rapor: "Belum",
        };
        showMessage(`Pemeriksaan untuk ${iData.no}-${iData.nik}-${iData.nama}`);
        console.log("Robot Pemeriksaan Runn...", i);
        await runRobotPemeriksaan(iData);
        await waitForCondition(
            () => {
                console.log("PemeriksaanStatus", PemeriksaanStatus);
                return (
                    PemeriksaanStatus.finished &&
                    PemeriksaanStatus.data.no === iData.no
                );
            },
            3000,
            300000
        );
        if (
            PemeriksaanStatus.finished &&
            PemeriksaanStatus.data.no === iData.no
        ) {
            const logsData = JSON.parse(
                localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
            );

            const find = logsData.find((it) => it.no === iData.no);
            const eStatus =
                PemeriksaanStatus.pemeriksaan === "Sudah" &&
                PemeriksaanStatus.rapor === "Sudah"
                    ? "Berhasil Input"
                    : "";
            const eKeterangan =
                PemeriksaanStatus.rapor === "Sudah"
                    ? "Berhasil Kirim Rapor"
                    : PemeriksaanStatus.pemeriksaan === "Sudah"
                    ? "Selesai Pemeriksaan"
                    : "";

            if (find) {
                find.status = eStatus || find.status;
                find.keterangan = eKeterangan || find.keterangan;
                find.pemeriksaan = PemeriksaanStatus.pemeriksaan;
                find.rapor = PemeriksaanStatus.rapor;
                localStorage.setItem(
                    LOCAL_STORAGE.LOGS,
                    JSON.stringify(logsData)
                );
                loadDataTable();
            }
        }
        console.log("One robot pemeriksaan finished:", PemeriksaanStatus);
        await new Promise((r) => setTimeout(r, 1500));
    }
    hideLoading();
    showMessage(`Pemeriksaan Selesai!`);
    console.log("All robots pemeriksaan finished");
});
