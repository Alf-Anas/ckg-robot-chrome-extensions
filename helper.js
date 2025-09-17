function waitForElement(xpath, callback, parentEl, maxTries = 10) {
    let attempt = 0;

    function tryFind() {
        attempt++;
        const element = document.evaluate(
            xpath,
            parentEl || document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            setTimeout(() => {
                callback(element);
            }, 500);
        } else if (attempt < maxTries) {
            // Gradually increase delay: e.g., 200ms, 400ms, 600ms...
            const delay = 500 * attempt;
            setTimeout(tryFind, delay);
        } else {
            console.warn("Element not found after", maxTries, "attempts");
        }
    }

    tryFind();
}

function clickElement(el) {
    if (el) {
        el.dispatchEvent(
            new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            })
        );
    }
}
function inputElementValue(el, val) {
    if (el) {
        el.value = val;
        el.dispatchEvent(new Event("input", { bubbles: true }));
    }
}
function enterKeyElement(el) {
    if (el) {
        el.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13, // for older browsers
                which: 13, // for older browsers
                bubbles: true,
                cancelable: true,
            })
        );
        el.dispatchEvent(
            new KeyboardEvent("keyup", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
            })
        );
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: wait for element returns Promise
function waitForElementAsync(xpathOrSelector, parentEl, timeout = 5000) {
    return new Promise((resolve, reject) => {
        waitForElement(
            xpathOrSelector,
            (el) => {
                if (el) resolve(el);
                else reject(`Element not found: ${xpathOrSelector}`);
            },
            parentEl
        );
        setTimeout(
            () => reject(`Timeout waiting for: ${xpathOrSelector}`),
            timeout
        );
    });
}

function cleanPhoneNumber(phone, defPhone = "8000000") {
    if (!phone) return defPhone;

    // Remove all non-digit characters
    phone = phone.replace(/\D/g, "");

    // Remove leading 0 or 62
    if (phone.startsWith("0")) {
        phone = phone.slice(1);
    } else if (phone.startsWith("62")) {
        phone = phone.slice(2);
    }

    // Ensure first digit is 8
    if (!phone.startsWith("8")) {
        phone = "8" + phone;
    }

    // Ensure length between 7 and 13
    if (phone.length < 7 || phone.length > 13) {
        return defPhone;
    }

    return phone;
}

function parseDateString(dateStr) {
    // Check format using regex
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dateStr);
    if (!match) {
        console.warn("Invalid date format. Expected DD-MM-YYYY");
        return null;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10); // 1-12
    const year = parseInt(match[3], 10);

    const dayStr = String(day).padStart(2, "0");
    const monthStr = String(month).padStart(2, "0");

    return { day, month, year, date: `${year}-${monthStr}-${dayStr}` };
}

function getPekerjaanLabel(pekerjaan) {
    const listPekerjaan = [
        {
            label: "Belum/Tidak Bekerja",
            value: "belum-tidak-bekerja",
        },
        {
            label: "Pelajar",
            value: "pelajar",
        },
        {
            label: "Mahasiswa",
            value: "mahasiswa",
        },
        {
            label: "Ibu Rumah Tangga",
            value: "ibu-rumah-tangga",
        },
        {
            label: "TNI",
            value: "tni",
        },
        {
            label: "POLRI",
            value: "polri",
        },
        {
            label: "ASN (Kantor Pemerintah)",
            value: "asn-kantor-pemerintah",
        },
        {
            label: "Pegawai Swasta",
            value: "pegawai-swasta",
        },
        {
            label: "Wirausaha/Pekerja Mandiri",
            value: "wirausaha-pekerja-mandiri",
        },
        {
            label: "Pensiunan",
            value: "pensiunan",
        },
        {
            label: "Pejabat Negara / Pejabat Daerah",
            value: "pejabat-negara-pejabat-daerah",
        },
        {
            label: "Pengusaha",
            value: "pengusaha",
        },
        {
            label: "Dokter",
            value: "dokter",
        },
        {
            label: "Bidan",
            value: "bidan",
        },
        {
            label: "Perawat",
            value: "perawat",
        },
        {
            label: "Apoteker",
            value: "apoteker",
        },
        {
            label: "Psikolog",
            value: "psikolog",
        },
        {
            label: "Tenaga Kesehatan Lainnya",
            value: "tenaga-kesehatan-lainnya",
        },
        {
            label: "Dosen",
            value: "dosen",
        },
        {
            label: "Guru",
            value: "guru",
        },
        {
            label: "Peneliti",
            value: "peneliti",
        },
        {
            label: "Pengacara",
            value: "pengacara",
        },
        {
            label: "Notaris",
            value: "notaris",
        },
        {
            label: "Hakim/Jaksa/Tenaga Peradilan Lainnya",
            value: "hakim-jaksa-tenaga-peradilan-lainnya",
        },
        {
            label: "Akuntan",
            value: "akuntan",
        },
        {
            label: "Insinyur",
            value: "insinyur",
        },
        {
            label: "Arsitek",
            value: "arsitek",
        },
        {
            label: "Konsultan",
            value: "konsultan",
        },
        {
            label: "Wartawan",
            value: "wartawan",
        },
        {
            label: "Pedagang",
            value: "pedagang",
        },
        {
            label: "Petani / Pekebun",
            value: "petani-pekebun",
        },
        {
            label: "Nelayan / Perikanan",
            value: "nelayan-perikanan",
        },
        {
            label: "Peternak",
            value: "peternak",
        },
        {
            label: "Tokoh Agama",
            value: "tokoh-agama",
        },
        {
            label: "Juru Masak",
            value: "juru-masak",
        },
        {
            label: "Pelaut",
            value: "pelaut",
        },
        {
            label: "Sopir",
            value: "sopir",
        },
        {
            label: "Pilot",
            value: "pilot",
        },
        {
            label: "Masinis",
            value: "masinis",
        },
        {
            label: "Atlet",
            value: "atlet",
        },
        {
            label: "Pekerja Seni",
            value: "pekerja-seni",
        },
        {
            label: "Penjahit / Perancang Busana",
            value: "penjahit-perancang-busana",
        },
        {
            label: "Karyawan kantor / Pegawai Administratif",
            value: "karyawan-kantor-pegawai-administratif",
        },
        {
            label: "Teknisi / Mekanik",
            value: "teknisi-mekanik",
        },
        {
            label: "Pekerja Pabrik / Buruh",
            value: "pekerja-pabrik-buruh",
        },
        {
            label: "Pekerja Konstruksi",
            value: "pekerja-konstruksi",
        },
        {
            label: "Pekerja Pertukangan",
            value: "pekerja-pertukangan",
        },
        {
            label: "Pekerja Migran",
            value: "pekerja-migran",
        },
        {
            label: "Lainnya",
            value: "lainnya",
        },
    ];
    const occupationMap = {
        "belum bekerja": "belum-tidak-bekerja",
        "belum/tidak bekerja": "belum-tidak-bekerja",
        pelajar: "pelajar",
        mahasiswa: "mahasiswa",
        "ibu rumah tangga": "ibu-rumah-tangga",
        "mengurus rumah tangga": "ibu-rumah-tangga",
        "karyawan / pegawai": "karyawan-kantor-pegawai-administratif",
        karyawan: "karyawan-kantor-pegawai-administratif",
        "karyawan swasta": "pegawai-swasta",
        "pedagang / wirausaha": "wirausaha-pekerja-mandiri",
        pedagang: "pedagang",
        wirausaha: "wirausaha-pekerja-mandiri",
        pns: "asn-kantor-pemerintah",
        "tni/polri": "tni",
        tni: "tni",
        polri: "polri",
        "dokter/bidan": "dokter",
        dokter: "dokter",
        bidan: "bidan",
        "dosen/guru": "dosen",
        dosen: "dosen",
        guru: "guru",
        pensiunan: "pensiunan",
        buruh: "pekerja-pabrik-buruh",
        lainnya: "lainnya",
        "-": "lainnya",
    };

    const key = pekerjaan.toLowerCase().trim();
    const value = occupationMap[key];
    const findPekerjaan = listPekerjaan.find((it) => it.value === value);
    if (findPekerjaan) {
        return findPekerjaan.label;
    }
    return "Lainnya";
}

function toSnakeCase(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, "_") // spaces -> underscore
        .replace(/__+/g, "_") // collapse multiple underscores
        .replace(/^_+|_+$/g, ""); // trim underscores
}

function getAdminList(parentEl) {
    // Select all the button divs
    const buttons = parentEl.querySelectorAll("button div");
    // Extract text and clean it
    return Array.from(buttons)
        .map((div) => div.textContent.trim())
        .filter((text) => text.length > 0); // remove empty ones
}

function getAdminText(parentEl, text) {
    const listAdmin = getAdminList(parentEl);
    const find = listAdmin.find((it) => toSnakeCase(it) === toSnakeCase(text));
    return find;
}

async function selectWithRetry(
    parentXPath,
    childText,
    maxRetries = 5,
    delay = 500
) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await sleep(delay * attempt);
            // wait for parent
            const parentEl = await waitForElementAsync(parentXPath);

            if (!parentEl) {
                console.warn(
                    `Parent not found (attempt ${attempt}/${maxRetries})`
                );
                continue;
            }

            // build child xpath relative to parent
            const childXPath = `.//button[.//div[contains(normalize-space(.), '${childText}')]]`;
            const childEl = await waitForElementAsync(childXPath, parentEl);

            if (childEl) {
                clickElement(childEl);
                return true; // ✅ success
            } else {
                console.warn(
                    `Child not found (attempt ${attempt}/${maxRetries})`
                );
            }
        } catch (err) {
            console.error(`Error on attempt ${attempt}:`, err);
        }
    }

    console.error(`Failed to find ${childText} after ${maxRetries} retries`);
    return false;
}

function waitForPageLoad(timeout = 20000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            if (document.readyState === "complete") {
                resolve();
            } else if (Date.now() - start > timeout) {
                reject(new Error("Timeout waiting for page load"));
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    });
}

async function waitForCondition(
    conditionFn,
    interval = 5000,
    timeout = 300000
) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
        const check = async () => {
            try {
                if (conditionFn()) {
                    resolve(true);
                } else if (Date.now() - start > timeout) {
                    reject(new Error("waitForCondition: timeout"));
                } else {
                    setTimeout(check, interval);
                }
            } catch (err) {
                reject(err);
            }
        };
        check();
    });
}

const X_PATH = {
    BTN_DAFTAR_BARU:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[2]/div[2]/div[2]/div/button",
    INPUT_NIK:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[2]/div[1]/label/input",
    CHECKBOX_NO_NIK:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[2]/div[2]/div/div/div[1]/div",
    INPUT_NAMA_LENGKAP:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[3]/div[1]/label/input",
    INPUT_JENIS_KELAMIN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[5]/div/div[2]/div[2]",
    SELECT_JK_LK:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[5]/div/div[2]/div[3]/div/div[1]",
    SELECT_JK_PR:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[5]/div/div[2]/div[3]/div/div[2]",
    INPUT_WA:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[6]/div[1]/label/div[2]/input",
    INPUT_ALAMAT:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[9]/div/label/textarea",
    INPUT_TGL_LAHIR:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[4]/div/div[2]/div/div",
    INPUT_TGL_LAHIR_YEAR: "/html/body/div[3]/div/div/div[1]/span/button[2]",
    INPUT_TGL_LAHIR_YEAR_TABLE: "/html/body/div[3]/div/div/div[2]/table",
    INPUT_TGL_LAHIR_YEAR_BEFORE: "/html/body/div[3]/div/div/div[1]/button[1]",
    INPUT_TGL_LAHIR_MONTH_TABLE: "/html/body/div[3]/div/div/div[2]/table",
    INPUT_TGL_LAHIR_DAY_TABLE: "/html/body/div[3]/div/div/div[2]/table",
    INPUT_PEKERJAAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[7]/div/div/div[2]/div[2]",
    INPUT_PEKERJAAN_PARENT: "/html/body/div[3]/div[2]/div[2]/div",
    INPUT_ALAMAT_DOMISILI:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[1]/div[8]/div/div[2]/div",
    INPUT_ALAMAT_DOMISILI_PROVINSI_PARENT:
        "/html/body/div[3]/div[2]/div[4]/div",
    INPUT_ALAMAT_DOMISILI_KAB_KOTA_PARENT:
        "/html/body/div[3]/div[2]/div[4]/div",
    INPUT_ALAMAT_DOMISILI_KECAMATAN_PARENT:
        "/html/body/div[3]/div[2]/div[4]/div",
    INPUT_ALAMAT_DOMISILI_KEL_DESA_PARENT:
        "/html/body/div[3]/div[2]/div[4]/div",
    INPUT_TGL_PEMERIKSAAN_PARENT:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[1]/div[2]/div[2]/div/div[2]/div[2]",
    BTN_SELANJUTNYA:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div/form/div[2]/div/button",
    BTN_LANJUT_KUOTA_HABIS:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[4]/div[2]/div[2]/div/div[3]/div[2]/button",
    BTN_PILIH_PESERTA:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[3]/div[3]/div/table/tbody/tr/td[5]/div/button",
    BTN_DAFTAR_TANPA_NIK:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[3]/div[5]/div[2]/div[2]/button",
    BTN_DAFTAR_DENGAN_NIK:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div/div[3]/div[5]/div[2]/div[1]/button",
    MSG_POPUP:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[6]/div[2]/div/div[1]/div",
    MSG_POPUP_SUCCESS:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div[1]/div[1]",
    MSG_DATA_BELUM_SESUAI_KTP:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[6]/div[2]/div/div[1]/div",
    MSG_KUOTA_HABIS:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[6]/div[2]/div/div[1]/div",
    BTN_TUTUP_SUCCESS_DAFTAR:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[5]/div[2]/div/div[3]/div[2]/button",
    SELECT_SEARCH:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[1]/div[2]/div[1]/div/div[2]",
    SELECT_SEARCH_NAMA:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[1]/div[2]/div[1]/div/div[3]/div/div[3]",
    INPUT_SEARCH:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[1]/div[2]/div[2]/label/div/input",
    BTN_KONFIMASI_HADIR:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[3]/div/div/table/tbody/tr/td[6]/div/div[1]/div/button",
    CHECKBOX_BERSEDIA_CKG:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[4]/div[2]/div/div[4]/div[3]/div[1]/div/div[1]/div",
    BTN_HADIR_CKG:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[4]/div[2]/div/div[5]/div[2]/button",
    MSG_POPUP_BERHASIL_HADIR:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[3]/div[4]/div[2]/div/div[1]/div[1]",

    // PEMERIKSAAN

    SELECT_SEARCH_PELAYANAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[4]/div[2]/div[2]/div[1]/div/div[2]",
    SELECT_SEARCH_NAMA_PELAYANAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[4]/div[2]/div[2]/div[1]/div/div[3]/div/div[3]",
    SELECT_SEARCH_NIK_PELAYANAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[4]/div[2]/div[2]/div[1]/div/div[3]/div/div[2]",
    INPUT_SEARCH_PELAYANAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[4]/div[2]/div[2]/div[2]/label/div/input",
    INPUT_SEARCH_NIK_PELAYANAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[4]/div[2]/div[2]/div[2]/label/label/input",
    BTN_MULAI_PELAYANAN:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[4]/div[3]/div/table/tbody/tr/td[8]/div/div/button",
    BTN_MULAI_PEMERIKSAAN: ".//button[normalize-space(.)='Mulai Pemeriksaan']",

    BTN_INPUT_GIZI:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[5]/div[2]/div[2]/div[2]/div/div/div/div[1]/div[4]/div/button",
    INPUT_GIZI_BB: "//input[@id='sq_100i']",
    INPUT_GIZI_TB: "//input[@id='sq_101i']",
    INPUT_GIZI_LP: "//input[@id='sq_102i']",
    BTN_INPUT_DATA_KIRIM: "//input[@type='button' and @value='Kirim']",

    BTN_INPUT_TEKANAN_DARAH: `/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[5]/div[2]/div[2]/div[2]/div/div/div/div[2]/div[4]/div/button`,
    INPUT_DARAH_SISTOLIK: "//input[@id='sq_100i']",
    INPUT_DARAH_DIASTOLIK: "//input[@id='sq_101i']",

    BTN_INPUT_GULA_DARAH:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[5]/div[2]/div[2]/div[2]/div/div/div/div[3]/div[4]/div/button",
    INPUT_GDS: "//input[@id='sq_100i']",
    INPUT_GDP: "//input[@id='sq_101i']",
    BTN_KIRIM_RAPOR: `/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div/div[5]/div[1]/div[2]/div[1]/div`,
    BTN_KIRIM_RAPOR_OK:
        "/html/body/div[1]/main/div/div[1]/section[2]/div/div/div/div[2]/div[2]/div[2]/div/div[4]/div[2]/button",
};
