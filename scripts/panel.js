document
    .getElementById("openDataPreparation")
    .addEventListener("click", async () => {
        const url = chrome.runtime.getURL("data-preparation.html");
        chrome.tabs.create({ url });
    });

document.addEventListener("DOMContentLoaded", () => {
    initTanggalPemeriksaan();
    loadDataTable();
    initRunSetting();

    document
        .getElementById("btnRefresh")
        .addEventListener("click", loadDataTable);
    document
        .getElementById("runProcessBtn")
        .addEventListener("click", runProcess);
    document
        .getElementById("btnRefreshSummary")
        .addEventListener("click", renderSummary);
});

function initTanggalPemeriksaan() {
    const selectEl = document.getElementById("tanggal_pemeriksaan");
    if (!selectEl) return;

    let optionsHtml = "";
    for (let i = 1; i <= 31; i++) {
        optionsHtml += `<option value="${i}">${i}</option>`;
    }
    selectEl.innerHTML = optionsHtml;

    const savedTanggal = localStorage.getItem(LOCAL_STORAGE.TGL_PEMERIKSAAN);
    if (savedTanggal) {
        selectEl.value = savedTanggal;
    } else {
        selectEl.value = "10";
        localStorage.setItem(LOCAL_STORAGE.TGL_PEMERIKSAAN, "10");
    }

    selectEl.addEventListener("change", function () {
        localStorage.setItem(LOCAL_STORAGE.TGL_PEMERIKSAAN, this.value);
    });
}

function summarizeColumn(colName) {
    const aktifData = getAktifData();

    const counts = {};
    aktifData.forEach((row) => {
        let val = row[colName] || "(Kosong)";
        counts[val] = (counts[val] || 0) + 1;
    });
    const total = aktifData.length;
    return Object.entries(counts).map(([val, count]) => ({
        value: val,
        count,
        percent: ((count / total) * 100).toFixed(2) + "%",
    }));
}

function renderSummary() {
    const container = document.getElementById("summary");
    container.innerHTML = "";
    const cols = [
        "status_input",
        "status_usia",
        "keterangan",
        "pendaftaran",
        "kehadiran",
        "pemeriksaan",
        "pemeriksaan_mandiri",
        "rapor",
    ];

    cols.forEach((col) => {
        const summary = summarizeColumn(col);
        let table = `
        <b class="mt-2 text-capitalize">${col}</b>
        <table class="table table-bordered table-sm">
            <thead class="table-light">
            <tr>
                <th>Kategori</th>
                <th>Jumlah</th>
                <th>Persen</th>
            </tr>
            </thead>
            <tbody>
            ${summary
                .map(
                    (s) => `
                <tr>
                <td>${s.value}</td>
                <td>${s.count}</td>
                <td>${s.percent}</td>
                </tr>
            `,
                )
                .join("")}
            </tbody>
        </table>
        `;
        container.innerHTML += table;
    });
}

function loadDataTable() {
    const theData = getAktifData();
    const tbody = document.getElementById("tBodyAktifData");
    tbody.innerHTML = "";
    theData.forEach((item) => {
        const btnId = `dropdownMenuButton-${item.no}`;
        const tr = document.createElement("tr");
        tr.dataset.id = item.no;

        let cellValid = `<td class="text-center"><span class="badge bg-success">Valid ✓</span></td>`;
        if (!item.is_valid) {
            tr.className = "table-danger";
            cellValid = `<td class="text-center"><span class="badge bg-danger">⚠️ Invalid</span></td>`;
        }
        tr.innerHTML = `
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-warning dropdown-toggle py-0 px-2" type="button"
                                    id="${btnId}" data-bs-toggle="dropdown" aria-expanded="false">
                                Aksi
                            </button>
                            <ul class="dropdown-menu shadow compact-menu" aria-labelledby="${btnId}">
                                 <li class="px-3 pt-1 pb-1 dropdown-header">
                                    <small class="text-muted d-block text-center">${item.nama}</small>
                                    <small class="text-muted d-block text-center" style="font-size: smaller;">${item.nik}</small>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger action-trigger py-1" data-action="invalid" href="#">⚠️ Tandai Tidak Valid</a></li>
                                <li><a class="dropdown-item text-success action-trigger py-1" data-action="clear-status" href="#">🔄 Bersihkan Status</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="run" data-field="pendaftaran" href="#">⚡ Run Pendaftaran</a></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="run" data-field="kehadiran" href="#">⚡ Run Kehadiran</a></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="run" data-field="pemeriksaan" href="#">⚡ Run Pemeriksaan</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="status" data-field="pendaftaran" data-val="OK" href="#">✓ Pendaftaran OK</a></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="status" data-field="kehadiran" data-val="OK" href="#">✓ Kehadiran OK</a></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="status" data-field="pemeriksaan" data-val="OK" href="#">✓ Pemeriksaan OK</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="status" data-field="pendaftaran" data-val="MANUAL" href="#">✎ Pendaftaran Manual</a></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="status" data-field="kehadiran" data-val="MANUAL" href="#">✎ Kehadiran Manual</a></li>
                                <li><a class="dropdown-item action-trigger py-1" data-action="status" data-field="pemeriksaan" data-val="MANUAL" href="#">✎ Pemeriksaan Manual</a></li>
                            </ul>
                        </div>
                    </td>
                    ${cellValid}
                    <td>${item.no}</td>
                    <td>${item.nik}</td>
                    <td>${item.nama}</td>
                    <td>${item.tgl_lahir}</td>
                    <td>${item.jenis_kelamin}</td>
                    <td>${item.status_usia}</td> 
                    <td>${item.status_input}</td> 
                    <td>${item.pendaftaran}</td>  
                    <td>${item.kehadiran}</td>  
                    <td>${item.pemeriksaan}</td>  
                    <td>${item.pemeriksaan_mandiri}</td>  
                    <td>${item.rapor}</td>   
                    <td>${item.keterangan}</td>  
                `;
        tbody.appendChild(tr);

        tr.addEventListener("click", (e) => {
            const trigger = e.target.closest(".action-trigger");
            if (!trigger) return;

            e.preventDefault();
            const action = trigger.dataset.action;

            if (action === "invalid") {
                tandaiTidakValid(item.no);
            } else if (action === "run") {
                const field = trigger.dataset.field;
                runOneByOne(item.no, field);
            } else if (action === "status") {
                const field = trigger.dataset.field;
                const val = trigger.dataset.val;
                tandaiStatus(item.no, field, val);
            } else if (action === "clear-status") {
                clearStatus(item.no);
            }
        });
    });
}

function tandaiTidakValid(no) {
    const aktifData = getAktifData();
    const find = aktifData.find((it) => it.no == no);
    if (find) {
        find.is_valid = false;
        find.keterangan = "Ditandai Tidak Valid";

        saveAktifData(aktifData);
        loadDataTable();
    } else {
        showErrorSwal(`Nomor ${no} tidak ditemukan!`);
    }
}

function clearStatus(no) {
    const aktifData = getAktifData();
    const find = aktifData.find((it) => it.no == no);
    if (find) {
        find.is_valid = true;
        find.pendaftaran = "";
        find.kehadiran = "";
        find.pemeriksaan = "";
        find.pemeriksaan_mandiri = "";
        find.keterangan = "";

        saveAktifData(aktifData);
        loadDataTable();
    } else {
        showErrorSwal(`Nomor ${no} tidak ditemukan!`);
    }
}

function tandaiStatus(no, key, status) {
    const aktifData = getAktifData();
    const find = aktifData.find((it) => it.no == no);
    if (find) {
        find[key] = status;

        saveAktifData(aktifData);
        loadDataTable();
    } else {
        showErrorSwal(`Nomor ${no} tidak ditemukan!`);
    }
}

function initRunSetting() {
    const currentData = getRunSettingData();
    document.querySelectorAll(".main-chk").forEach((input) => {
        const field = input.getAttribute("data-field");
        input.checked = !!currentData[field];
    });
    document.querySelectorAll(".sub-chk").forEach((input) => {
        const subField = input.getAttribute("data-subfield");
        input.checked = !!currentData.pemeriksaan[subField];
    });

    // const pemeriksaanContainer = document.getElementById(
    //     "checkboxPemeriksaanContainer",
    // );
    // if (pemeriksaanContainer) {
    //     Object.keys(pemeriksaanDataSchema).forEach((catKey) => {
    //         const category = pemeriksaanDataSchema[catKey];

    //         const wrapper = document.createElement("div");
    //         wrapper.className = "form-check form-switch";
    //         const checkboxId = `chk_${catKey}`;
    //         wrapper.innerHTML = `
    //             <input class="form-check-input sub-chk"
    //                    type="checkbox"
    //                    id="${checkboxId}"
    //                    data-subfield="${catKey}" />
    //             <label class="form-check-label small" for="${checkboxId}">
    //                 ${category.label}
    //             </label>
    //         `;
    //         pemeriksaanContainer.appendChild(wrapper);
    //     });
    // }

    function updatePemeriksaanParentStatus() {
        const parentInput = document.getElementById("chkPemeriksaan");
        const subGroup = document.getElementById("subPemeriksaanGroup");

        const hasActiveChild = Object.values(currentData.pemeriksaan).some(
            (value) => value === true,
        );
        parentInput.checked = hasActiveChild;
        if (hasActiveChild) {
            subGroup.style.display = "block";
        } else {
            subGroup.style.display = "none";
        }
    }
    updatePemeriksaanParentStatus();

    document.querySelectorAll(".main-chk").forEach((input) => {
        input.addEventListener("change", function () {
            const field = this.getAttribute("data-field");
            currentData[field] = this.checked;
            saveRunSettingData(currentData);
        });
    });
    const parentInput = document.getElementById("chkPemeriksaan");
    parentInput.addEventListener("change", function () {
        const isChecked = this.checked;
        Object.keys(currentData.pemeriksaan).forEach((key) => {
            currentData.pemeriksaan[key] = isChecked;
        });
        document.querySelectorAll(".sub-chk").forEach((input) => {
            input.checked = isChecked;
        });
        updatePemeriksaanParentStatus();
        saveRunSettingData(currentData);
    });
    document.querySelectorAll(".sub-chk").forEach((input) => {
        input.addEventListener("change", function () {
            const subField = this.getAttribute("data-subfield");
            currentData.pemeriksaan[subField] = this.checked;

            updatePemeriksaanParentStatus();
            saveRunSettingData(currentData);
        });
    });
}

async function runOneByOne(no, key) {
    const aktifData = getAktifData();
    const index = aktifData.findIndex((it) => it.no == no);
    if (index !== -1) {
        const defData = getDefaultData();

        let iData = { ...aktifData[index] };
        if (key == "pendaftaran") {
            iData = await runPendaftaran(iData, defData);
        } else if (key == "kehadiran") {
            iData = await runKehadiran(iData, defData);
        } else if (key == "pemeriksaan") {
            const config = getRunSettingData();
            const defDataPemeriksaan = getDefaultPemeriksaanData();
            iData = await runCheckPemeriksaan(
                config,
                iData,
                defData,
                defDataPemeriksaan,
                true,
            );
        }

        aktifData[index] = iData;
        saveAktifData(aktifData);
        loadDataTable();
    } else {
        showErrorSwal(`Nomor ${no} tidak ditemukan!`);
    }
}

function runProcess() {
    const runSetData = getRunSettingData();

    if (
        !runSetData.pendaftaran &&
        !runSetData.kehadiran &&
        !runSetData.pemeriksaan &&
        !runSetData.rapor
    ) {
        Swal.fire({
            title: "Info",
            text: "Silakan pilih minimal satu modul untuk dijalankan.",
            icon: "info",
        });
        return;
    }
    executeOtomasiProses(runSetData);
}
async function runCheckPemeriksaan(
    config,
    iData,
    defData,
    defDataPemeriksaan,
    ignoreStatus = false,
) {
    let eData = iData;
    const shouldRun = (status) => ignoreStatus || !skipStatus(status);
    const needRunPemeriksaan = Object.values(config.pemeriksaan ?? {}).some(
        Boolean,
    );
    if (needRunPemeriksaan) {
        eData = await runPemeriksaan(eData, defData);
    }
    if (
        config.pemeriksaan?.mandiri &&
        allowNextProcess(eData.pemeriksaan) &&
        shouldRun(eData.pemeriksaan_mandiri)
    ) {
        eData = await runPemeriksaanMandiri(
            eData,
            defDataPemeriksaan,
            pemeriksaanDataSchema,
        );
    }
    return eData;
}

async function executeOtomasiProses(config) {
    showPanelMessage(`Persiapan pengisian data!`);
    showLoading();

    const defData = getDefaultData();
    const defDataPemeriksaan = getDefaultPemeriksaanData();
    const listData = getAktifData();

    for (let i = 0; i < listData.length; i++) {
        let iData = { ...listData[i] };
        if (!iData.is_valid) continue;
        const tr = document.querySelector(`tr[data-id="${iData.no}"]`);
        if (tr) {
            tr.classList.add("table-primary");
        }
        if (config.pendaftaran) {
            if (!skipStatus(iData.pendaftaran)) {
                iData = await runPendaftaran(iData, defData);
            }
        }
        if (config.kehadiran) {
            if (
                allowNextProcess(iData.pendaftaran) &&
                !skipStatus(iData.kehadiran)
            ) {
                iData = await runKehadiran(iData, defData);
            }
        }
        if (config.pemeriksaan) {
            if (
                allowNextProcess(iData.pendaftaran) &&
                allowNextProcess(iData.kehadiran)
            ) {
                iData = await runCheckPemeriksaan(
                    config,
                    iData,
                    defData,
                    defDataPemeriksaan,
                );
            }
        }
        listData[i] = iData;
        saveAktifData(listData);
        loadDataTable();
    }

    hideLoading();
    showPanelMessage(`Pengisian Data Selesai!`);
    showPanelMessage("");
}
