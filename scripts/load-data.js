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
            localStorage.setItem(
                LOCAL_STORAGE.AKTIF_DATA,
                JSON.stringify(json)
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
                const tr = document.createElement("tr");
                tr.innerHTML = `
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
