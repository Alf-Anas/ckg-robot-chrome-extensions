const fieldSchemas = [
    {
        label: "No",
        key: "no",
        keys: ["no", "nomor", "nomor_urut"],
        type: "number",
        required: true,
        min: 1,
    },
    {
        label: "Petugas Input",
        key: "petugas_input",
        keys: [
            "petugas_input",
            "petugas",
            "nama_petugas",
            "input_by",
            "operator",
        ],
        type: "text",
        required: true,
        maxLength: 100,
    },
    {
        label: "Status Input",
        key: "status_input",
        keys: ["status_input", "status", "status_data"],
        type: "enum",
        required: true,
        enum: ["baru", "update", "selesai"],
    },
    {
        label: "Tanggal Pemeriksaan",
        key: "tgl_pemeriksaan",
        keys: ["tgl_pemeriksaan", "tanggal_pemeriksaan", "tanggal", "tgl"],
        type: "date",
        required: true,
    },
    {
        label: "NIK",
        key: "nik",
        keys: ["nik", "no_ktp", "nomor_ktp", "ktp"],
        type: "text",
        required: true,
        length: 16,
        pattern: /^[0-9]{16}$/,
    },
    {
        label: "Nama",
        key: "nama",
        keys: ["nama", "nama_lengkap", "fullname"],
        type: "text",
        required: true,
        maxLength: 200,
    },
    {
        label: "Tanggal Lahir",
        key: "tgl_lahir",
        keys: ["tgl_lahir", "tanggal_lahir", "lahir"],
        type: "date",
        required: true,
    },
    {
        label: "Jenis Kelamin",
        key: "jenis_kelamin",
        keys: ["jenis_kelamin", "jk", "gender", "kelamin"],
        type: "enum",
        required: true,
        enum: ["L", "P", "Laki-laki", "Perempuan", "Male", "Female"],
    },
    {
        label: "Provinsi",
        key: "provinsi",
        keys: ["provinsi", "prov"],
        type: "text",
        required: true,
        maxLength: 100,
    },
    {
        label: "Kabupaten/Kota",
        key: "kab_kota",
        keys: ["kab_kota", "kabupaten", "kota", "kabupaten_kota"],
        type: "text",
        required: true,
        maxLength: 100,
    },
    {
        label: "Alamat",
        key: "alamat",
        keys: ["alamat", "alamat_lengkap"],
        type: "text",
        required: true,
        maxLength: 500,
    },
    {
        label: "No HP",
        key: "no_hp",
        keys: [
            "no_hp",
            "nohp",
            "hp",
            "telepon",
            "telp",
            "no_telp",
            "nomor_hp",
            "nomor_handphone",
            "handphone",
            "phone",
        ],
        type: "text",
        required: true,
        pattern: /^[0-9+]{8,20}$/,
    },
    {
        label: "Status Pendidikan",
        key: "status_pendidikan",
        keys: ["status_pendidikan", "pendidikan", "education"],
        type: "text",
        maxLength: 100,
    },
    {
        label: "Pekerjaan",
        key: "pekerjaan",
        keys: ["pekerjaan", "job", "occupation"],
        type: "text",
        maxLength: 100,
    },
    {
        label: "Status Perkawinan",
        key: "status_perkawinan",
        keys: [
            "status_perkawinan",
            "perkawinan",
            "status_nikah",
            "marital_status",
        ],
        type: "enum",
        enum: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"],
    },
    {
        label: "Golongan Darah",
        key: "golongan_darah",
        keys: ["golongan_darah", "goldar"],
        type: "enum",
        enum: ["A", "B", "AB", "O", "Tidak Tahu"],
    },
    {
        label: "Tekanan Darah Sistol",
        key: "td_sistol",
        keys: ["td_sistol", "sistol", "sistol"],
        type: "number",
        min: 50,
        max: 300,
    },
    {
        label: "Tekanan Darah Diastol",
        key: "td_diastol",
        keys: ["td_diastol", "diastol", "diastolik"],
        type: "number",
        min: 30,
        max: 200,
    },
    {
        label: "Tinggi Badan",
        key: "tinggi_badan",
        keys: ["tinggi_badan", "tb", "tinggi"],
        type: "number",
        min: 30,
        max: 250,
    },
    {
        label: "Berat Badan",
        key: "berat_badan",
        keys: ["berat_badan", "bb", "berat"],
        type: "number",
        min: 1,
        max: 300,
    },
    {
        label: "Lingkar Perut",
        key: "lingkar_perut",
        keys: ["lingkar_perut", "lp"],
        type: "number",
        min: 20,
        max: 300,
    },
    {
        label: "Pemeriksaan Gula",
        key: "pemeriksaan_gula",
        keys: ["pemeriksaan_gula", "gula", "gds", "gdp"],
        type: "number",
        min: 20,
        max: 1000,
    },
    {
        label: "Riwayat Darah Tinggi",
        key: "darah_tinggi",
        keys: ["darah_tinggi", "hipertensi", "riwayat_hipertensi"],
        type: "boolean",
        trueValues: ["ya", "y", "1", "true"],
        falseValues: ["tidak", "t", "0", "false"],
    },
    {
        label: "Riwayat Diabetes",
        key: "diabetes",
        keys: ["diabetes", "dm", "riwayat_diabetes"],
        type: "boolean",
        trueValues: ["ya", "y", "1", "true"],
        falseValues: ["tidak", "t", "0", "false"],
    },
];

const requiredKeys = [
    "no",
    "petugas_input",
    "status_input",
    "tgl_pemeriksaan",
    "nik",
    "nama",
    "tgl_lahir",
    "jenis_kelamin",
    "provinsi",
    "kab_kota",
    "alamat",
    "no_hp",
    "status_pendidikan",
    "pekerjaan",
    "status_perkawinan",
    "golongan_darah",
    // "penyakit_tmk_1",
    // "penyakit_tmk_2",
    // "penyakit_tmk_3",
    // "penyakit_tmd_1",
    // "penyakit_tmd_2",
    // "penyakit_tmd_3",
    // "fr_merokok",
    // "fr_kurang_aktif_fisik",
    // "fr_gula",
    // "fr_garam",
    // "fr_lemak",
    // "fr_buah_sayur",
    // "fr_alkohol",
    "td_sistol",
    "td_diastol",
    "tinggi_badan",
    "berat_badan",
    "lingkar_perut",
    "pemeriksaan_gula",
    // "rujuk_rs",
    // "diagnosis_1",
    // "diagnosis_2",
    // "diagnosis_3",
    // "terapi_farmakologi",
    // "konseling",
    // "gi_katarak_kanan",
    // "gi_katarak_kiri",
    // "gi_katarak_rujuk_rs",
    // "gi_refraksi_kanan",
    // "gi_refraksi_kiri",
    // "gi_refraksi_rujuk_rs",
    // "gi_tuli_kanan",
    // "gi_tuli_kiri",
    // "gi_tuli_rujuk_rs",
    // "gi_congek_kanan",
    // "gi_congek_kiri",
    // "gi_congek_rujuk_rs",
    // "gi_serumen_kanan",
    // "gi_serumen_kiri",
    // "gi_serumen_rujuk_rs",
    // "iva_hasil",
    // "iva_tindak_lanjut",
    // "sadanis_hasil",
    // "sadanis_tindak_lanjut",
    // "ubm_konseling",
    // "ubm_car",
    // "ubm_rujuk",
    // "ubm_kondisi",
    // "skor_puma",
    // "bulan",
    // "posbindu",
    // "kelurahan",
    // "kecamatan",
    // "wilayah",
    // "umur",
    // "kelompok_umur",
    // "imt",
    // "obesitas_imt",
    // "obesitas_sentral",
    // "ht_pengukuran",
    // "hasil_pengukuran_gula",
    // "kel_umur_dd_mm",
    // "jumlah_pasien_skrining_penglihatan",
    // "jumlah_pasien_skrining_pendengaran",
    // "jumlah_pasien_skrining_indera",
    // "rujukan_pasien_penglihatan",
    // "rujukan_pasien_pendengaran",
    // "gangguan_penglihatan",
    // "gangguan_pendengaran",
    // "pengukuran_tb_bb_lp",
    // "pengukuran_tekanan_darah",
    // "pemeriksaan_gula_darah",
    // "spm",
    // "obesitas_total",
];

const LOCAL_STORAGE = {
    AKTIF_DATA: "aktif-data",
    LOGS: "logs",
    DEFAULT_DATA: "default-data",
};

function validateJSONData(data) {
    if (!Array.isArray(data)) {
        return {
            valid: false,
            message: "Data harus berupa array!",
        };
    }

    let invalidCount = 0;
    let emptyNikCount = 0;

    data.forEach((item) => {
        const missingKeys = requiredKeys.filter((key) => !(key in item));
        if (missingKeys.length > 0) {
            invalidCount++;
        }
        if (!item.nik || item.nik.toString().trim() === "") emptyNikCount++;
    });

    const totalData = data.length;
    const firstNo = data[0]?.no ?? "-";
    const lastNo = data[totalData - 1]?.no ?? "-";

    return {
        valid: invalidCount === 0,
        data: {
            total_data: totalData,
            dari_no: firstNo,
            hingga_no: lastNo,
            nik_kosong: emptyNikCount,
        },
        message: `Jumlah data tidak valid: ${invalidCount}`,
    };
}

function showLoading() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) {
        spinner.style.display = "block";
    }
}

function hideLoading() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) {
        spinner.style.display = "none";
    }
}

function showMessage(message) {
    const parent = document.getElementById("parent-text-message");
    const textDiv = document.getElementById("text-message");

    if (!parent || !textDiv) return;

    if (message && message.trim() !== "") {
        textDiv.textContent = message;
        parent.classList.remove("d-none"); // show
    } else {
        textDiv.textContent = "";
        parent.classList.add("d-none"); // hide
    }
}

function toDDMMYYYY(dateStr) {
    if (!dateStr) return null;

    // Detect Excel serial date (number or numeric string)
    if (!isNaN(dateStr) && Number(dateStr) > 20000) {
        const serial = Number(dateStr);
        // Excel epoch
        const excelEpoch = Date.UTC(1899, 11, 30);

        const date = new Date(excelEpoch + serial * 86400000);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    // Normalize separator
    let parts = dateStr.split(/[-/]/);

    let day, month, year;

    if (parts[0].length === 4) {
        // Format: YYYY-MM-DD
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
    } else {
        // Format: D-M-YYYY or DD-MM-YYYY
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
    }

    // Ensure 2 digits for day and month
    day = day.toString().padStart(2, "0");
    month = month.toString().padStart(2, "0");

    return `${day}-${month}-${year}`;
}

function isValidNIK(nik) {
    // Check length = 16 and only digits
    return /^\d{16}$/.test(nik);
}
