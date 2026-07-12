document
    .getElementById("openDataPreparation")
    .addEventListener("click", async () => {
        const url = chrome.runtime.getURL("data-preparation.html");
        chrome.tabs.create({ url });
    });

document.addEventListener("DOMContentLoaded", () => {
    initTanggalPemeriksaan();
    loadDataTable();

    document
        .getElementById("btnRefresh")
        .addEventListener("click", loadDataTable);
    document
        .getElementById("runProcessBtn")
        .addEventListener("click", runProcess);
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

function loadDataTable() {
    const theData = getAktifData();
    const tbody = document.getElementById("tBodyAktifData");
    tbody.innerHTML = "";
    theData.forEach((item) => {
        const btnId = `dropdownMenuButton-${item.no}`;
        const tr = document.createElement("tr");

        let cellValid = `<td class="text-center"><span class="badge bg-success">Valid ✓</span></td>`;
        if (!item.is_valid) {
            tr.className = "table-danger";
            cellValid = `<td class="text-center"><span class="badge bg-danger">⚠️ Invalid</span></td>`;
        }
        tr.innerHTML = `
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-warning dropdown-toggle" type="button"
                                    id="${btnId}" data-bs-toggle="dropdown" aria-expanded="false">
                                Aksi
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="${btnId}">
                                <li><a class="dropdown-item text-danger action-trigger" data-action="invalid" href="#">⚠️ Tandai Tidak Valid</a></li>
                                <li><a class="dropdown-item text-success action-trigger" data-action="clear-status" href="#">🔄 Bersihkan Status</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item action-trigger" data-action="status" data-field="pendaftaran" data-val="OK" href="#">✓ Pendaftaran OK</a></li>
                                <li><a class="dropdown-item action-trigger" data-action="status" data-field="kehadiran" data-val="OK" href="#">✓ Kehadiran OK</a></li>
                                <li><a class="dropdown-item action-trigger" data-action="status" data-field="pemeriksaan" data-val="OK" href="#">✓ Pemeriksaan OK</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item action-trigger" data-action="status" data-field="pendaftaran" data-val="MANUAL" href="#">✎ Pendaftaran Manual</a></li>
                                <li><a class="dropdown-item action-trigger" data-action="status" data-field="kehadiran" data-val="MANUAL" href="#">✎ Kehadiran Manual</a></li>
                                <li><a class="dropdown-item action-trigger" data-action="status" data-field="pemeriksaan" data-val="MANUAL" href="#">✎ Pemeriksaan Manual</a></li>
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

function runProcess() {
    const runPendaftaran = document.getElementById("chkPendaftaran").checked;
    const runKehadiran = document.getElementById("chkKehadiran").checked;
    const runPemeriksaan = document.getElementById("chkPemeriksaan").checked;
    const runRapor = document.getElementById("chkRapor").checked;

    if (!runPendaftaran && !runKehadiran && !runPemeriksaan && !runRapor) {
        Swal.fire({
            title: "Info",
            text: "Silakan pilih minimal satu modul untuk dijalankan.",
            icon: "info",
        });
        return;
    }
    executeOtomasiProses({
        pendaftaran: runPendaftaran,
        kehadiran: runKehadiran,
        pemeriksaan: runPemeriksaan,
        rapor: runRapor,
    });
}

async function executeOtomasiProses(config) {
    showPanelMessage(`Persiapan pengisian data!`);
    showLoading();

    const defData = getDefaultData();
    const listData = getAktifData();

    for (let i = 0; i < listData.length; i++) {
        let iData = { ...listData[i] };
        if (!iData.is_valid) continue;
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
                await runKehadiran(iData, defData);
            }
        }
        if (config.pemeriksaan) {
            if (
                allowNextProcess(iData.pendaftaran) &&
                allowNextProcess(iData.kehadiran) &&
                !skipStatus(iData.pemeriksaan)
            ) {
                await runPemeriksaan(iData, defData);
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
