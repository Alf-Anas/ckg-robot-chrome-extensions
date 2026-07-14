let rawExcelData = [];
let excelHeaders = [];

document.addEventListener("DOMContentLoaded", () => {
    initTableHeaders();
    loadActiveDataFromStorage();
    populateDefaultOptions();
    initDefaultInputs();
    initDefaultInputsPemeriksaan();

    document
        .getElementById("excelFileInput")
        .addEventListener("change", handleExcelUpload);
    document
        .getElementById("processAndSaveBtn")
        .addEventListener("click", processMappingAndSave);
    document
        .getElementById("btnSaveDefault")
        .addEventListener("click", saveDataDefault);
    document
        .getElementById("btnDownloadExcel")
        .addEventListener("click", downloadExcelAktifData);
    document
        .getElementById("btnClearAktifData")
        .addEventListener("click", clearAktifData);
    document
        .getElementById("toggleDefaultData")
        .addEventListener("change", refreshTableDisplay);
});

function initTableHeaders() {
    const headerRow = document.getElementById("tableHeaderRow");
    let html = `<th class="text-center" style="min-width: 90px;">Validitas</th>`;
    html += dataSchema.map((field) => `<th>${field.label}</th>`).join("");
    headerRow.innerHTML = html;
}

function handleExcelUpload(e) {
    try {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                defval: "",
            });
            if (jsonData.length === 0) {
                alert("File excel kosong!");
                return;
            }

            rawExcelData = jsonData;
            excelHeaders = Object.keys(jsonData[0]);

            generateMappingUI();
        };
        reader.readAsArrayBuffer(file);
    } catch (err) {
        showErrorSwal(errorLogs);
    }
}

function handleSelectColor(selectElement) {
    if (!selectElement) return;
    if (selectElement.value === "") {
        selectElement.style.color = "#dc3545"; // Merah
        selectElement.style.fontWeight = "bold";
    } else {
        selectElement.style.color = "#212529"; // Normal
        selectElement.style.fontWeight = "normal";
    }
}

function generateMappingUI() {
    const container = document.getElementById("mappingDropdownsContainer");
    container.innerHTML = "";

    const normalizedOptions = excelHeaders.map((h) => ({
        original: h,
        normalized: normalizeHeaderString(h),
    }));

    dataSchema.forEach((field) => {
        let autoMatch = "";
        const found = normalizedOptions.find((opt) =>
            field.keys.includes(opt.normalized),
        );
        if (found) autoMatch = found.original;

        const colDiv = document.createElement("div");
        colDiv.className = "flex-shrink-0 me-2";

        let selectOptionsHtml = `<option value="" style="color: #dc3545; font-weight: bold;">-- Lewati Kolom --</option>`;
        excelHeaders.forEach((header) => {
            const isSelected = header === autoMatch ? "selected" : "";
            selectOptionsHtml += `<option value="${header}" ${isSelected}>${header}</option>`;
        });

        colDiv.innerHTML = `
            <div class="form-group p-1 border rounded bg-light">
                <label class="form-label small text-truncate fw-bold mb-1 d-block">${field.label}</label>
                <select class="form-select form-select-sm mapping-select" data-main-key="${field.mainKey}">
                    ${selectOptionsHtml}
                </select>
            </div>
        `;
        container.appendChild(colDiv);
    });

    document.getElementById("mappingSection").classList.remove("d-none");
    document.querySelectorAll(".mapping-select").forEach((select) => {
        handleSelectColor(select);
    });

    container.addEventListener("change", function (event) {
        if (event.target && event.target.classList.contains("mapping-select")) {
            handleSelectColor(event.target);
        }
    });
}

function processAndValidateAge(row) {
    if (!row.tgl_lahir) {
        row.status_usia = "";
        return row;
    }

    const birthDate = parseDDMMYYYY(row.tgl_lahir);
    const today = new Date();

    let ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Koreksi jika belum berulang tahun di tahun ini
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        ageInYears--;
    }

    if (ageInYears < 6) {
        row.status_usia = "BALITA";
    } else if (ageInYears >= 6 && ageInYears < 18) {
        row.status_usia = "SEKOLAH";
    } else if (ageInYears >= 60) {
        row.status_usia = "LANSIA";
    } else {
        row.status_usia = "";
    }

    if (row.status_usia !== "BALITA") {
        row.nik_wali = "-";
        row.nama_wali = "-";
        row.tgl_lahir_wali = "-";
        row.jenis_kelamin_wali = "-";
        row.no_hp_wali = "-";
    }
    return row;
}

function processMappingAndSave() {
    const selects = document.querySelectorAll(".mapping-select");
    const userMap = {};

    selects.forEach((select) => {
        const mainKey = select.getAttribute("data-main-key");
        const excelTargetKey = select.value;
        if (excelTargetKey) {
            userMap[mainKey] = excelTargetKey;
        }
    });

    // Proses data excel mentah ditransformasi ke standarisasi mainKey aplikasi
    const finalizedData = rawExcelData.map((row) => {
        let cleanRow = {};
        let rowErrors = [];

        dataSchema.forEach((field) => {
            const targetExcelField = userMap[field.mainKey];
            let rawValue = targetExcelField ? row[targetExcelField] : "";

            // Terpapkan Aturan Validasi Khusus
            if (field.validation.type === "number") {
                rawValue = cleanNumberOnly(rawValue);
            } else if (field.validation.type === "date") {
                rawValue = toDDMMYYYY(rawValue);
            } else if (field.validation.type === "phone") {
                rawValue = cleanPhoneNumber(rawValue);
            } else if (field.validation.type === "enum") {
                if (rawValue) {
                    let cleanVal = rawValue
                        .toString()
                        .trim()
                        .toLowerCase()
                        .replace(/[\s-]/g, "_");

                    if (
                        field.validation.mapTo &&
                        field.validation.mapTo[cleanVal]
                    ) {
                        rawValue = field.validation.mapTo[cleanVal];
                    } else if (field.validation.options) {
                        const matchedOption = field.validation.options.find(
                            (opt) => {
                                return (
                                    opt
                                        .toString()
                                        .trim()
                                        .toLowerCase()
                                        .replace(/[\s-]/g, "_") === cleanVal
                                );
                            },
                        );
                        if (matchedOption) {
                            rawValue = matchedOption;
                        } else {
                            rawValue = rawValue.toString().trim();
                        }
                    } else {
                        rawValue = rawValue.toString().trim();
                    }
                }
            } else if (
                field.validation.type === "text" &&
                field.validation.maxLength
            ) {
                rawValue = rawValue
                    ? rawValue
                          .toString()
                          .substring(0, field.validation.maxLength)
                    : "";
            }

            cleanRow[field.mainKey] =
                rawValue !== null && rawValue !== undefined ? rawValue : "";

            // 1. Cek apakah data kosong dan apakah field tersebut required
            const isFieldEmpty =
                cleanRow[field.mainKey] === "" ||
                cleanRow[field.mainKey] === null ||
                cleanRow[field.mainKey] === undefined;

            if (field.validation.required && isFieldEmpty) {
                rowErrors.push(`[${field.label}] wajib diisi`);
            } else if (!isFieldEmpty) {
                if (field.validation.type === "enum") {
                    // Kumpulkan semua opsi valid yang diperbolehkan
                    let validOptions = field.validation.options || [];
                    if (field.validation.mapTo) {
                        validOptions = [
                            ...validOptions,
                            ...Object.values(field.validation.mapTo),
                        ];
                    }
                    if (!validOptions.includes(cleanRow[field.mainKey])) {
                        rowErrors.push(
                            `[${field.label}] nilai "${cleanRow[field.mainKey]}" tidak sesuai opsi`,
                        );
                    }
                }
                // B. Validasi Custom Validator (Menggunakan registry)
                if (field.validation.customValidator) {
                    const validatorName = field.validation.customValidator;
                    const validateFn = validatorRegistry[validatorName];
                    if (validateFn) {
                        const validationResult = validateFn(
                            cleanRow[field.mainKey],
                        );
                        if (!validationResult.success) {
                            rowErrors.push(validationResult.message);
                        }
                    }
                }
            }
        });

        let processedRow = processAndValidateAge(cleanRow);
        processedRow["is_valid"] = rowErrors.length === 0;
        if (rowErrors.length > 0) {
            processedRow["keterangan"] = rowErrors.join(", ");
        }
        return processedRow;
    });
    saveAktifData(finalizedData);
    showSuccess(
        `Berhasil memproses ${finalizedData.length} baris data kedalam database aplikasi.`,
    );

    const totalInvalid = finalizedData.filter((d) => !d.is_valid).length;
    if (totalInvalid > 0) {
        Swal.fire({
            title: "Data Disimpan dengan Catatan",
            text: `Berhasil memproses ${finalizedData.length} data. Namun, ada ${totalInvalid} baris data yang TIDAK VALID. Mohon periksa tabel.`,
            icon: "warning",
            confirmButtonText: "Periksa Tabel",
        });
    } else {
        showSuccess(
            `Semua data (${finalizedData.length} baris) valid dan siap digunakan.`,
        );
    }
    renderTableData(finalizedData);
}

function renderTableData(dataList) {
    const tbody = document.getElementById("dataBody");
    const totalColumns = dataSchema.length + 1;

    if (!dataList || dataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${totalColumns}" class="text-center text-muted">Belum ada data aktif.</td></tr>`;
        return;
    }

    // Ambil status apakah checkbox tampilkan data default sedang aktif
    const showDefault = document.getElementById("toggleDefaultData")?.checked;
    const defaultData = showDefault ? getDefaultData() : null;

    let html = "";
    dataList.forEach((row) => {
        const rowClass = row.is_valid ? "" : "table-danger";
        html += `<tr class="${rowClass}">`;
        if (row.is_valid) {
            html += `<td class="text-center"><span class="badge bg-success">Valid ✓</span></td>`;
        } else {
            html += `<td class="text-center"><span class="badge bg-danger" title="${row.keterangan}">⚠️ Invalid</span></td>`;
        }
        dataSchema.forEach((field) => {
            let cellValue = row[field.mainKey];

            if (field.mainKey === "keterangan") {
                const textClass = row.is_valid ? "" : "text-danger fw-bold";
                html += `<td class="${textClass}">${row.keterangan || "-"}</td>`;
            } else {
                const isCellValueEmpty =
                    cellValue === undefined ||
                    cellValue === null ||
                    cellValue.toString().trim() === "";

                if (isCellValueEmpty && showDefault && defaultData) {
                    let fallbackValue = defaultData[field.mainKey];
                    if (fallbackValue) {
                        html += `<td class="text-primary fw-semibold">${fallbackValue}</td>`;
                    } else {
                        html += `<td></td>`;
                    }
                } else {
                    html += `<td>${cellValue ?? ""}</td>`;
                }
            }
        });
        html += `</tr>`;
    });
    tbody.innerHTML = html;
}

function refreshTableDisplay() {
    const stored = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    const currentData = stored ? JSON.parse(stored) : [];
    renderTableData(currentData);
}

function loadActiveDataFromStorage() {
    const stored = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    if (stored) {
        const data = JSON.parse(stored);
        renderTableData(data);
    }
}

function populateDefaultOptions() {
    const selectPekerjaan = document.getElementById("pekerjaan");
    if (selectPekerjaan) {
        const fragment = document.createDocumentFragment();
        PekerjaanOptions.forEach((pekerjaan) => {
            const option = document.createElement("option");
            option.value = pekerjaan;
            option.textContent = pekerjaan;
            fragment.appendChild(option);
        });
        selectPekerjaan.appendChild(fragment);
    }
    const selectStatusPerkawinan = document.getElementById("status_perkawinan");
    if (selectStatusPerkawinan) {
        const fragment = document.createDocumentFragment();
        PerkawinanOptions.forEach((status) => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            fragment.appendChild(option);
        });
        selectStatusPerkawinan.appendChild(fragment);
    }
}

function initDefaultInputs() {
    const defData = getDefaultData();
    if (!defData) return;
    Object.keys(defData).forEach((key) => {
        const inputElement = document.getElementById(key);
        if (inputElement) {
            inputElement.value = defData[key] || "";
        }
    });
}

function saveDataDefault() {
    const defData = getDefaultData();
    if (!defData) return;
    Object.keys(defData).forEach((key) => {
        const inputElement = document.getElementById(key);
        if (inputElement) {
            defData[key] = (inputElement.value ?? "").trim();
        }
    });
    localStorage.setItem(LOCAL_STORAGE.DEFAULT_DATA, JSON.stringify(defData));
    showSuccess("Berhasil menyimpan data default!");
}

function clearAktifData() {
    Swal.fire({
        title: "Hapus Semua Aktif Data?",
        text: "Data aktif dan pengaturan mapping akan direset!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        customClass: {
            popup: "small-swal",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem(LOCAL_STORAGE.AKTIF_DATA);
            renderTableData([]);
            document.getElementById("excelFileInput").value = "";
            document.getElementById("mappingSection").classList.add("d-none");
            Swal.fire({
                title: "Berhasil!",
                text: "Data aktif telah dibersihkan.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    });
}

function downloadExcelAktifData() {
    const stored = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    if (!stored) {
        Swal.fire({
            title: "Gagal!",
            text: "Tidak ada data aktif yang bisa diunduh.",
            icon: "error",
        });
        return;
    }
    const aktifData = JSON.parse(stored);
    if (aktifData.length === 0) {
        Swal.fire({
            title: "Info",
            text: "Data aktif kosong.",
            icon: "info",
        });
        return;
    }
    const excelRows = aktifData.map((row) => {
        const newRow = {};
        dataSchema.forEach((field) => {
            let cellValue = row[field.mainKey];
            if (
                cellValue === undefined ||
                cellValue === null ||
                cellValue.toString().trim() === ""
            ) {
                cellValue = "";
            }
            newRow[field.label] = cellValue ?? "";
        });
        return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Aktif");

    const timestamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `CKG-ROBOT_Data-Aktif-Export_${timestamp}.xlsx`);
    Swal.fire({
        title: "Berhasil!",
        text: "File Excel berhasil diunduh.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
    });
}

function initDefaultInputsPemeriksaan() {
    const container = document.getElementById(
        "defaultValuesPemeriksaanContainer",
    );
    const currentSettings = getDefaultPemeriksaanData();

    // Loop data schema untuk dijadikan elemen form select HTML
    Object.keys(pemeriksaanDataSchema).forEach((catKey) => {
        const category = pemeriksaanDataSchema[catKey];

        category.input.forEach((inputItem) => {
            const uniqueId = `${catKey}_${inputItem.key}`;
            const savedValue =
                currentSettings[uniqueId] !== undefined
                    ? currentSettings[uniqueId]
                    : inputItem.default;

            const itemWrapper = document.createElement("div");
            itemWrapper.className = "flex-shrink-0 me-2";
            itemWrapper.style.width = "220px";

            let controlHTML = "";

            if (inputItem.type === "text" || inputItem.type === "number") {
                const inputType =
                    inputItem.type === "number" ? "number" : "text";
                const stepAttribute =
                    inputType === "number" ? 'step="any"' : "";
                controlHTML = `
                    <input type="${inputType}" 
                        id="${uniqueId}" 
                        ${stepAttribute}
                        class="form-control form-control-sm data-default-input" 
                        value="${savedValue !== null ? savedValue : ""}">
                `;
            } else {
                let optionsArray = [];
                if (Array.isArray(inputItem.options)) {
                    optionsArray = inputItem.options;
                }
                const optionsHTML = optionsArray
                    .map((opt) => {
                        const isSelected = opt === savedValue ? "selected" : "";
                        return `<option value="${opt}" ${isSelected}>${opt}</option>`;
                    })
                    .join("");
                controlHTML = `
                    <select id="${uniqueId}" class="form-select form-select-sm data-default-input">
                        ${optionsHTML}
                    </select>
                `;
            }

            itemWrapper.innerHTML = `
                    <div class="form-group p-1 border rounded bg-light h-100 d-flex flex-column justify-content-between">
                        <label for="${uniqueId}" 
                            class="form-label small text-truncate fw-bold mb-1 d-block" 
                            title="${category.label} - ${inputItem.label}">
                            ${category.label}<br><span class="text-muted fw-normal">${inputItem.label}</span>
                        </label>
                        ${controlHTML}
                    </div>
                `;
            container.appendChild(itemWrapper);
        });
    });

    document
        .getElementById("btnSaveDefaultPemeriksaan")
        .addEventListener("click", () => {
            const payload = {};
            const inputs = document.querySelectorAll(".data-default-input");

            inputs.forEach((selectElement) => {
                payload[selectElement.id] = selectElement.value;
            });

            saveDefaultPemeriksaanData(payload);
            showSuccess("Berhasil menyimpan data default pemeriksaan!");
        });
}
