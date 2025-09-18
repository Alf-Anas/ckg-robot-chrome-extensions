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
                const log = logsData.find((it) => it.no === item.no);
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
    renderSummary();
}

function summarizeColumn(colName) {
    const aktifData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA) || "[]"
    );
    const logsData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
    );

    const theData = aktifData.map((item) => {
        const find = logsData.find((it) => it.no === item.no);
        if (find) {
            return { ...item, ...find };
        }
        return item;
    });

    const counts = {};
    theData.forEach((row) => {
        let val = row[colName] || "(Kosong)";
        counts[val] = (counts[val] || 0) + 1;
    });
    const total = theData.length;
    return Object.entries(counts).map(([val, count]) => ({
        value: val,
        count,
        percent: ((count / total) * 100).toFixed(2) + "%",
    }));
}

function renderSummary() {
    const container = document.getElementById("summary");
    const cols = [
        "status",
        "keterangan",
        "daftar",
        "hadir",
        "pemeriksaan",
        "rapor",
    ];

    let rowStart = `<div class="row">`;
    let content = "";

    cols.forEach((col) => {
        const summary = summarizeColumn(col);
        let table = `
      <div class="col-md-4 mb-4">
        <b class="mt-2 text-capitalize d-block">${col}</b>
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
            `
                )
                .join("")}
          </tbody>
        </table>
      </div>
    `;
        content += table;
    });

    let rowEnd = `</div>`;
    container.innerHTML = rowStart + content + rowEnd;
}

loadDataTable();

function loadDataTableLogs() {
    const logsData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
    );

    const tbody = document.getElementById("dataBodyLogs");
    tbody.innerHTML = "";
    logsData.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${item.no}</td>
                    <td>${item.nik}</td>
                    <td>${item.nama}</td>
                    <td>${item.tgl_lahir}</td>
                    <td>${item.jenis_kelamin}</td>
                    <td>${item.no_wa}</td>
                    <td>${item.tanggal_pemeriksaan}</td> 
                    <td>${item.status || "-"}</td>
                    <td>${item.keterangan || "-"}</td>
                    <td>${item.daftar || "-"}</td>
                    <td>${item.hadir || "-"}</td>
                    <td>${item.pemeriksaan || "-"}</td>
                    <td>${item.rapor || "-"}</td>
                    `;
        tbody.appendChild(tr);
    });
}

loadDataTableLogs();

document
    .getElementById("downloadExcelLogBtn")
    .addEventListener("click", async () => {
        const logsData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
        );
        const columns = [
            "no",
            "status",
            "keterangan",
            "daftar",
            "hadir",
            "pemeriksaan",
            "rapor",
            "tanggal_pemeriksaan",
            "nik",
            "nama",
            "tgl_lahir",
            "jenis_kelamin",
            "no_wa",
            "alamat",
            "provinsi",
            "kabkota",
            "kecamatan",
            "keldesa",
        ];

        // Reorder each object based on columns
        const reorderedData = logsData.map((item) => {
            let obj = {};
            columns.forEach((col) => {
                obj[col] = item[col] || "";
            });
            return obj;
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(reorderedData, { header: columns });

        // Create workbook and append sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Histories");

        // Download Excel
        XLSX.writeFile(wb, `CKG-ROBOT-HISTORY.xlsx`);
    });

document
    .getElementById("downloadExcelBtn")
    .addEventListener("click", async () => {
        const aktifData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA) || "[]"
        );
        const logsData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE.LOGS) || "[]"
        );
        const columns = [
            "no",
            "status",
            "keterangan",
            "daftar",
            "hadir",
            "pemeriksaan",
            "rapor",
            "tanggal_pemeriksaan",
            "nik",
            "nama",
            "tgl_lahir",
            "jenis_kelamin",
            "no_wa",
            "alamat",
            "provinsi",
            "kabkota",
            "kecamatan",
            "keldesa",
        ];

        const theData = aktifData.map((item) => {
            const iLog = logsData.find((it) => it.no == item.no) || {};
            return {
                no: item.no,
                nik: item.nik,
                nama: item.nama,
                tgl_lahir: item.tgl_lahir,
                jenis_kelamin: item.jenis_kelamin,
                ...iLog,
            };
        });

        // Reorder each object based on columns
        const reorderedData = theData.map((item) => {
            let obj = {};
            columns.forEach((col) => {
                obj[col] = item[col] || "";
            });
            return obj;
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(reorderedData, { header: columns });

        // Create workbook and append sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Logs");

        // Download Excel
        XLSX.writeFile(wb, `CKG-ROBOT-LOGS.xlsx`);
    });

document.getElementById("clearDataBtn").addEventListener("click", async () => {
    localStorage.removeItem(LOCAL_STORAGE.LOGS);
    localStorage.removeItem(LOCAL_STORAGE.AKTIF_DATA);

    setTimeout(() => {
        window.location.reload();
    }, 1500);
});
