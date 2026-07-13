let currentPipeline = {
    queue: [],
    currentIndex: 0,
    inData: {},
    defData: {},
    schema: {},
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const targetTabId = sender.tab ? sender.tab.id : null;
    // Menangkap inisiasi awal dari Popup
    if (msg.type === "START_PIPELINE_FLOW") {
        currentPipeline.queue = msg.queue;
        currentPipeline.currentIndex = 0;
        currentPipeline.inData = msg.inData;
        currentPipeline.defData = msg.defData;
        currentPipeline.schema = msg.schema;

        // Beri log status ke panel popup
        chrome.runtime.sendMessage({
            type: "ROBOT_STATUS",
            message: `Terdeteksi ${msg.queue.length} pemeriksaan. Memulai pengisian...`,
        });
        executeNextForm(targetTabId);
    }

    // Menangkap sinyal ketika satu form berhasil disimpan
    if (msg.type === "FORM_SUBMIT_SUCCESS") {
        currentPipeline.currentIndex++;

        // Jika masih ada form berikutnya di dalam list antrean
        if (currentPipeline.currentIndex < currentPipeline.queue.length) {
            function returnListener(tabId, changeInfo, tab) {
                if (tabId === targetTabId && changeInfo.status === "complete") {
                    // Tunggu sampai halaman kembali ke detail utama
                    if (tab.url.includes("pelayanan/detail")) {
                        chrome.tabs.onUpdated.removeListener(returnListener);
                        executeNextForm(targetTabId);
                    }
                }
            }
            chrome.tabs.onUpdated.addListener(returnListener);
        } else {
            // JIKA SEMUA ANTREAN HABIS, beri tahu popup
            chrome.runtime.sendMessage({ type: "PIPELINE_COMPLETE" });
        }
    }
});

async function executeNextForm(tabId) {
    const currentItem = currentPipeline.queue[currentPipeline.currentIndex];

    chrome.runtime.sendMessage({
        type: "ROBOT_STATUS",
        message: `Membuka form: ${currentItem.nama}`,
    });

    // 1. PASANG LISTENER TERLEBIH DAHULU agar tidak kehilangan event transisi halaman
    function formLoadListener(tId, changeInfo, tab) {
        if (tId === tabId && changeInfo.status === "complete") {
            if (tab.url && tab.url.includes("skrining-form")) {
                chrome.tabs.onUpdated.removeListener(formLoadListener);

                // Beri jeda kecil (200ms) memastikan DOM dan ekstensi siap terkoneksi kembali
                setTimeout(() => {
                    chrome.scripting
                        .executeScript({
                            target: { tabId: tabId },
                            args: [
                                currentItem.key,
                                currentPipeline.inData,
                                currentPipeline.defData,
                                currentPipeline.schema,
                            ],
                            func: runDynamicAutofillForm,
                        })
                        .catch((err) =>
                            console.error(
                                "[Robot] Gagal injeksi autofill:",
                                err,
                            ),
                        );
                }, 200);
            }
        }
    }
    chrome.tabs.onUpdated.addListener(formLoadListener);

    // 2. KLIK TOMBOL INPUT DATA
    chrome.scripting
        .executeScript({
            target: { tabId: tabId },
            args: [currentItem.elementId],
            func: (containerId) => {
                return new Promise((resolve) => {
                    let asasa = 0;
                    let attempts = 0;
                    const maxAttempts = 10;

                    const tryClick = async () => {
                        const container = document.getElementById(containerId);
                        if (container) {
                            const button = container.querySelector("button");
                            if (button) {
                                button.click();
                                resolve(true);
                                return;
                            }
                        }

                        attempts++;
                        if (attempts < maxAttempts) {
                            setTimeout(tryClick, 1500);
                        } else {
                            console.error(
                                `[Content Script] Gagal menemukan tombol di container ${containerId} setelah beberapa percobaan.`,
                            );
                            resolve(false);
                        }
                    };

                    tryClick();
                });
            },
        })
        .catch((err) =>
            console.error(
                "[Robot] Gagal mengeksekusi perintah klik tombol input:",
                err,
            ),
        );
}

async function runDynamicAutofillForm(
    schemaKey,
    inData,
    defData,
    globalSchema,
) {
    const sectionSchema = globalSchema[schemaKey];
    if (!sectionSchema || !sectionSchema.input) {
        console.error("Skema tidak ditemukan untuk kunci:", schemaKey);
        return;
    }

    console.log(
        `[Robot] Memulai autofill untuk bagian: ${sectionSchema.label}`,
    );
    await new Promise((r) => setTimeout(r, 1500));

    async function fillQuestion() {
        // 2. Iterasi setiap field input yang ada di dalam skema
        sectionSchema.input.forEach((field) => {
            const valueToFill = field.default;

            if (valueToFill === undefined || valueToFill === null) return;

            // 3. Cari kontainer pertanyaan (sd-question) berdasarkan teks Label-nya
            const questions = document.querySelectorAll(".sd-question");
            let targetQuestionEl = null;

            for (const q of questions) {
                const titleEl = q.querySelector(
                    ".sd-question__title .sv-string-viewer",
                );

                if (titleEl) {
                    // NORMALISASI SPASI PADA DOM DAN SCHEMA
                    // Ini akan mengubah \u00a0 (&nbsp;) dan spasi berlebih menjadi spasi tunggal biasa " "
                    const normalizedDOMTitle = titleEl.textContent
                        .replace(/\s+/g, " ")
                        .trim();
                    const normalizedSchemaLabel = field.label
                        .replace(/\s+/g, " ")
                        .trim();

                    if (normalizedDOMTitle.includes(normalizedSchemaLabel)) {
                        targetQuestionEl = q;
                        break;
                    }
                }
            }

            // 4. Jika kontainer pertanyaan ditemukan, eksekusi berdasarkan field.type dari skema
            if (targetQuestionEl) {
                let optionFound = false;

                if (field.type === "enum-select") {
                    // --- LOGIKA UNTUK DROPDOWN (SELECT) ---
                    const selectEl = targetQuestionEl.querySelector("select");

                    if (selectEl) {
                        const normalizedSchemaText = valueToFill
                            .replace(/\s+/g, " ")
                            .trim();

                        // Cari <option> yang teks atau value-nya cocok
                        const options = selectEl.querySelectorAll("option");
                        for (const opt of options) {
                            const normalizedOptionText = opt.textContent
                                .replace(/\s+/g, " ")
                                .trim();
                            const normalizedOptionValue = opt.value
                                .replace(/\s+/g, " ")
                                .trim();

                            if (
                                normalizedOptionText === normalizedSchemaText ||
                                normalizedOptionValue === normalizedSchemaText
                            ) {
                                selectEl.value = opt.value; // Set value pada elemen select asli

                                // Trigger event agar framework UI (seperti SurveyJS) menangkap perubahannya
                                selectEl.dispatchEvent(
                                    new Event("change", { bubbles: true }),
                                );

                                console.log(
                                    `[Robot] Berhasil memilih select "${valueToFill}" untuk "${field.label}"`,
                                );
                                optionFound = true;
                                break;
                            }
                        }
                    } else {
                        console.warn(
                            `[Robot] Elemen <select> tidak ditemukan pada komponen "${field.label}" padahal bertipe enum-select.`,
                        );
                    }
                } else {
                    // --- LOGIKA UNTUK RADIO BUTTON (Default / Non enum-select) ---
                    const radioItems =
                        targetQuestionEl.querySelectorAll(".sd-item");

                    for (const item of radioItems) {
                        const labelTextEl = item.querySelector(
                            ".sd-item__control-label .sv-string-viewer",
                        );

                        if (labelTextEl) {
                            const normalizedDOMText = labelTextEl.textContent
                                .replace(/\s+/g, " ")
                                .trim();
                            const normalizedSchemaText = valueToFill
                                .replace(/\s+/g, " ")
                                .trim();

                            if (normalizedDOMText === normalizedSchemaText) {
                                const radioInput = item.querySelector(
                                    "input[type='radio']",
                                );
                                if (radioInput) {
                                    radioInput.click();
                                    radioInput.dispatchEvent(
                                        new Event("change", { bubbles: true }),
                                    );
                                    console.log(
                                        `[Robot] Berhasil memilih radio "${valueToFill}" untuk "${field.label}"`,
                                    );
                                    optionFound = true;
                                }
                                break;
                            }
                        }
                    }
                }

                if (!optionFound) {
                    console.warn(
                        `[Robot] Opsi "${valueToFill}" tidak ditemukan pada pertanyaan "${field.label}"`,
                    );
                }
            } else {
                console.warn(
                    `[Robot] Elemen pertanyaan dengan label "${field.label}" tidak ditemukan di halaman.`,
                );
            }
        });
    }

    console.log("[Robot] Menjalankan pengisian pertama...");
    await fillQuestion();

    // Jalankan pengisian kedua setelah jeda 2 detik (2000ms)
    setTimeout(() => {
        console.log("[Robot] Menjalankan pengisian kedua...");
        await fillQuestion();
    }, 1500);

    // 5. Beri jeda singkat sebelum klik simpan agar sistem web sempat memproses state data
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 6. Cari tombol Simpan / Selesai (SurveyJS biasanya menggunakan selector .sd-navigation__complete-btn atau teks "Simpan")
    const buttons = document.querySelectorAll("button, input[type='button']");
    let submitButton = null;

    for (const btn of buttons) {
        const btnText = (btn.textContent || btn.value || "").trim();
        if (
            btnText.includes("Simpan") ||
            btnText.includes("Selesai") ||
            btn.classList.contains("sd-navigation__complete-btn")
        ) {
            submitButton = btn;
            break;
        }
    }

    if (submitButton) {
        console.log("[Robot] Menekan tombol simpan form...");

        // Kirim info sukses SEBELUM klik agar koneksi tidak terputus karena redirect
        try {
            chrome.runtime.sendMessage({ type: "FORM_SUBMIT_SUCCESS" });
        } catch (e) {
            console.warn(
                "[Robot] Gagal mengirim pesan sukses (konteks berubah):",
                e,
            );
        }
        submitButton.click();
    } else {
        console.error("[Robot] Gagal menemukan tombol Simpan/Selesai.");
    }
}
