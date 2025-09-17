function disableRunBtn(isValid) {
    const runBtn = document.getElementById("runBtn");
    const runPelayanan = document.getElementById("runPelayanan");
    if (runBtn) {
        runBtn.disabled = !isValid;
    }
    if (runPelayanan) {
        runPelayanan.disabled = !isValid;
    }
}

function loadExistingAktifData() {
    const output = document.getElementById("output");
    const storedData = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    if (storedData) {
        const theData = JSON.parse(storedData);
        const result = validateJSONData(theData);
        output.textContent = JSON.stringify(result, null, 2);
        disableRunBtn(result.valid);
    }
}

loadExistingAktifData();

function checkNikValidity(cleanJson = []) {
    const logsData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
    );
    const defData = getDefaultData();

    cleanJson.forEach((iData) => {
        let iMessage = "";
        if (!iData.nik) {
            iMessage = "Tidak Ada NIK";
        } else if (!isValidNIK(iData.nik)) {
            iMessage = "NIK Tidak Valid";
        }

        if (iMessage) {
            const find = logsData.find((it) => it.no === iData.no);
            if (find) {
                find.status = "Lainnya";
                find.keterangan = iMessage;
                find.daftar = "Gagal";
                find.hadir = "Tidak";
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
                    status: "Lainnya",
                    keterangan: iMessage,
                    daftar: "Gagal",
                    hadir: "Tidak",
                });
            }
        }
    });

    localStorage.setItem(LOCAL_STORAGE.LOGS, JSON.stringify(logsData));
}

document.getElementById("convertBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("excelFile");
    const output = document.getElementById("output");
    localStorage.removeItem(LOCAL_STORAGE.AKTIF_DATA);
    output.textContent = "";

    if (!fileInput.files.length) {
        output.textContent = "⚠️ Please select an Excel file.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Read first sheet
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const result = validateJSONData(json);
        output.textContent = JSON.stringify(result, null, 2);
        disableRunBtn(result.valid);

        if (result.valid) {
            const cleanJson = json.map((it) => {
                return {
                    ...it,
                    tgl_lahir: toDDMMYYYY(it.tgl_lahir),
                };
            });
            checkNikValidity(cleanJson);

            localStorage.setItem(
                LOCAL_STORAGE.AKTIF_DATA,
                JSON.stringify(cleanJson)
            );

            loadDataTable();
        }
    };

    reader.readAsArrayBuffer(file);
});

const defaultData = {
    tanggal_pemeriksaan: "1",
    no_wa: "80000000",
    alamat: "Jl. Pal Meriam No. 6A",
    provinsi: "DKI Jakarta",
    kabkota: "Kota Adm. Jakarta Timur",
    kecamatan: "Matraman",
    keldesa: "Palmeriam",

    td_diastol: "80",
    td_sistol: "120",
    pemeriksaan_gula: "112",
    lingkar_perut: "80",
    berat_badan: "60",
    tinggi_badan: "160",
};

function getDefaultData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.DEFAULT_DATA);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return defaultData;
}

function loadDefaultData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.DEFAULT_DATA);
    let theData = defaultData;
    if (storedData) {
        theData = JSON.parse(storedData);
    }
    document.getElementById("tanggal_pemeriksaan").value =
        theData.tanggal_pemeriksaan;
    document.getElementById("no_wa").value = theData.no_wa;
    document.getElementById("alamat").value = theData.alamat;
    document.getElementById("provinsi").value = theData.provinsi;
    document.getElementById("kabkota").value = theData.kabkota;
    document.getElementById("kecamatan").value = theData.kecamatan;
    document.getElementById("keldesa").value = theData.keldesa;

    document.getElementById("td_diastol").value = theData.td_diastol;
    document.getElementById("td_sistol").value = theData.td_sistol;
    document.getElementById("pemeriksaan_gula").value =
        theData.pemeriksaan_gula;
    document.getElementById("lingkar_perut").value = theData.lingkar_perut;
    document.getElementById("berat_badan").value = theData.berat_badan;
    document.getElementById("tinggi_badan").value = theData.tinggi_badan;
}

loadDefaultData();

document.getElementById("btnSaveDefault").addEventListener("click", () => {
    const inData = {
        tanggal_pemeriksaan: document.getElementById("tanggal_pemeriksaan")
            .value,
        no_wa: document.getElementById("no_wa").value,
        alamat: document.getElementById("alamat").value,
        provinsi: document.getElementById("provinsi").value,
        kabkota: document.getElementById("kabkota").value,
        kecamatan: document.getElementById("kecamatan").value,
        keldesa: document.getElementById("keldesa").value,

        td_diastol: document.getElementById("td_diastol").value,
        td_sistol: document.getElementById("td_sistol").value,
        pemeriksaan_gula: document.getElementById("pemeriksaan_gula").value,
        lingkar_perut: document.getElementById("lingkar_perut").value,
        berat_badan: document.getElementById("berat_badan").value,
        tinggi_badan: document.getElementById("tinggi_badan").value,
    };

    localStorage.setItem(LOCAL_STORAGE.DEFAULT_DATA, JSON.stringify(inData));
    alert("Data berhasil disimpan!");
});

function tandaiLainnya(no) {
    console.log("Tandai lainnya:", no);

    const logsData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
    );
    const defData = getDefaultData();

    const find = logsData.find((it) => it.no === no);
    if (find) {
        find.status = "Lainnya";
        find.keterangan = "Ditandai Lainnya";
    } else {
        logsData.push({
            ...defData,
            no: no,
            status: "Lainnya",
            keterangan: "Ditandai Lainnya",
        });
    }
    localStorage.setItem(LOCAL_STORAGE.LOGS, JSON.stringify(logsData));
    loadDataTable();
}

function tandaiPemeriksaanManual(no) {
    console.log("Tandai pemeriksaan manual:", no);

    const logsData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
    );
    const defData = getDefaultData();

    const find = logsData.find((it) => it.no === no);
    if (find) {
        find.status = "Berhasil Input";
        find.keterangan = "PEMERIKSAAN MANUAL";
    } else {
        logsData.push({
            ...defData,
            no: no,
            status: "Berhasil Input",
            keterangan: "PEMERIKSAAN MANUAL",
        });
    }
    localStorage.setItem(LOCAL_STORAGE.LOGS, JSON.stringify(logsData));
    loadDataTable();
}

function loadDataTable() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    const logsStringData = localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]";
    if (storedData) {
        const logsData = JSON.parse(logsStringData);
        const theData = JSON.parse(storedData);
        const result = validateJSONData(theData);
        if (result.valid) {
            const tbody = document.getElementById("dataBody");
            tbody.innerHTML = "";
            theData.forEach((item) => {
                const log = logsData.find((it) => it.no == item.no);
                const btnId = `dropdownMenuButton-${item.no}`;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-warning dropdown-toggle" type="button"
                                    id="${btnId}" data-bs-toggle="dropdown" aria-expanded="false">
                                Aksi
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="${btnId}">
                                <li><a class="dropdown-item tandai-lainnya" href="#">Tandai Lainnya</a></li>
                                <li><a class="dropdown-item tandai-pemeriksaan" href="#">Tandai Pemeriksaan Manual</a></li>
                            </ul>
                        </div>
                    </td>
                    <td>${item.no}</td>
                    <td>${item.nik}</td>
                    <td>${item.nama}</td>
                    <td>${item.tgl_lahir}</td>
                    <td>${item.jenis_kelamin}</td>
                    <td>${log?.status || "-"}</td>
                    <td>${log?.keterangan || "-"}</td>
                    <td>${log?.daftar || "-"}</td>
                    <td>${log?.hadir || "-"}</td>
                    <td>${log?.pemeriksaan || "-"}</td>
                    <td>${log?.rapor || "-"}</td>
                    `;
                tbody.appendChild(tr);

                tr.querySelector(".tandai-lainnya").addEventListener(
                    "click",
                    () => tandaiLainnya(item.no)
                );
                tr.querySelector(".tandai-pemeriksaan").addEventListener(
                    "click",
                    () => tandaiPemeriksaanManual(item.no)
                );
            });
        }
    }
}

loadDataTable();

function getAktifData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    const logsStringData = localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]";
    const aktifData = [];
    if (storedData) {
        const logsData = JSON.parse(logsStringData);
        const theData = JSON.parse(storedData);
        const result = validateJSONData(theData);
        if (result.valid) {
            theData.forEach((item) => {
                const find = logsData.find((it) => it.no == item.no);
                if (!find) {
                    aktifData.push(item);
                }
            });
        }
    }
    return aktifData;
}

function getPemeriksaanData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    const logsStringData = localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]";
    const listData = [];
    if (storedData) {
        const logsData = JSON.parse(logsStringData);
        const theData = JSON.parse(storedData);
        const result = validateJSONData(theData);
        if (result.valid) {
            theData.forEach((item) => {
                const find = logsData.find((it) => it.no == item.no);
                if (find) {
                    if (
                        find?.status === "--On Progress--" &&
                        find?.daftar === "Berhasil" &&
                        find?.hadir === "Ya"
                    ) {
                        listData.push(item);
                    }
                }
            });
        }
    }
    return listData;
}
