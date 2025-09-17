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

function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // JS months = 0-11
}

function isUnder10Years(dateStr) {
    const birthDate = parseDDMMYYYY(dateStr);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--; // adjust if birthday hasn’t passed yet this year
    }

    return age < 10;
}

function isOver60Years(dateStr) {
    const birthDate = parseDDMMYYYY(dateStr);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 60;
}
