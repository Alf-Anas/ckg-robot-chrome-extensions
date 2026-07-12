const LOCAL_STORAGE = {
    AKTIF_DATA: "aktif-data",
    LOGS: "logs",
    DEFAULT_DATA: "default-data",
    TGL_PEMERIKSAAN: "tgl-pemeriksaan",
};
const PerkawinanOptions = [
    "Menikah",
    "Belum Menikah",
    "Cerai Hidup",
    "Cerai Mati",
];
const StatusOptions = ["OK", "MANUAL", "GAGAL", "LEWATI"];
const PekerjaanOptions = [
    "Belum/Tidak Bekerja",
    "Pelajar",
    "Mahasiswa",
    "Ibu Rumah Tangga",
    "TNI",
    "POLRI",
    "ASN (Kantor Pemerintah)",
    "Pegawai Swasta",
    "Wirausaha/Pekerja Mandiri",
    "Pensiunan",
    "Pejabat Negara / Pejabat Daerah",
    "Pengusaha",
    "Dokter",
    "Bidan",
    "Perawat",
    "Apoteker",
    "Psikolog",
    "Tenaga Kesehatan Lainnya",
    "Dosen",
    "Guru",
    "Peneliti",
    "Pengacara",
    "Notaris",
    "Hakim/Jaksa/Tenaga Peradilan Lainnya",
    "Akuntan",
    "Insinyur",
    "Arsitek",
    "Konsultan",
    "Wartawan",
    "Pedagang",
    "Petani / Pekebun",
    "Nelayan / Perikanan",
    "Peternak",
    "Tokoh Agama",
    "Juru Masak",
    "Pelaut",
    "Sopir",
    "Pilot",
    "Masinis",
    "Atlet",
    "Pekerja Seni",
    "Penjahit / Perancang Busana",
    "Karyawan kantor / Pegawai Administratif",
    "Teknisi / Mekanik",
    "Pekerja Pabrik / Buruh",
    "Pekerja Konstruksi",
    "Pekerja Pertukangan",
    "Pekerja Migran",
    "Lainnya",
];

const mapToPekerjaan = {
    mengurus_rumah_tangga: "Ibu Rumah Tangga",
    karyawan_swasta: "Pegawai Swasta",
    karyawan_bumn: "Pegawai Swasta",
    wiraswasta: "Wirausaha/Pekerja Mandiri",
    "pegawai_negeri_sipil_(pns)": "ASN (Kantor Pemerintah)",
    pegawai_negeri_sipil_pns: "ASN (Kantor Pemerintah)",
    pegawai_negeri_sipil: "ASN (Kantor Pemerintah)",
    pns: "ASN (Kantor Pemerintah)",
    "pelajar/mahasiswa": "Pelajar",
    "petani/perkebunan": "Petani / Pekebun",
    buruh_harian_lepas: "Lainnya",
    karyawan_honorer: "Lainnya",
    pekerjaan_lainnya: "Lainnya",

    pengangguran: "Belum/Tidak Bekerja",
    mahasiswi: "Mahasiswa",
    irt: "Ibu Rumah Tangga",
    karyawan: "Karyawan kantor / Pegawai Administratif",
    swasta: "Pegawai Swasta",
    asn: "ASN (Kantor Pemerintah)",
    tentara: "TNI",
    abri: "TNI",
    polisi: "POLRI",
    pengajar: "Guru",
    chef: "Juru Masak",
    tukang: "Pekerja Pertukangan",
    driver: "Sopir",
    tki: "Pekerja Migran",
    artis: "Pekerja Seni",
    pensiun: "Pensiunan",
};

const dataSchema = [
    {
        mainKey: "no",
        label: "No",
        keys: ["no", "nomor", "no_urut"],
        validation: { type: "number", required: true },
    },
    {
        mainKey: "petugas_input",
        label: "Petugas Input",
        keys: ["petugas_input", "nama_petugas", "validator", "petugas"],
        validation: { type: "text", maxLength: 100 },
    },
    {
        mainKey: "status_input",
        label: "Status Input",
        keys: ["status_input", "status", "state"],
        validation: { type: "text" },
    },
    {
        mainKey: "tgl_pemeriksaan",
        label: "Tanggal Pemeriksaan",
        keys: [
            "tgl_pemeriksaan",
            "tanggal_pemeriksaan",
            "tgl_periksa",
            "date_checked",
        ],
        validation: { type: "date" },
    },
    {
        mainKey: "nik",
        label: "NIK",
        keys: ["nik", "no_ktp", "nomor_induk_kependudukan", "identity_number"],
        validation: {
            type: "text",
            required: true,
            customValidator: "NIK_VALIDATOR",
        },
    },
    {
        mainKey: "nama",
        label: "Nama Lengkap",
        keys: ["nama", "nama_lengkap", "nama_pasien", "name"],
        validation: { type: "text", required: true, maxLength: 150 },
    },
    {
        mainKey: "tgl_lahir",
        label: "Tanggal Lahir",
        keys: [
            "tgl_lahir",
            "tanggal_lahir",
            "tgl_lahir_pasien",
            "dob",
            "birth_date",
        ],
        validation: {
            type: "date",
            required: true,
            customValidator: "DATE_VALIDATOR",
        },
    },
    {
        mainKey: "jenis_kelamin",
        label: "Jenis Kelamin",
        keys: ["jenis_kelamin", "jk", "gender", "sex", "kelamin"],
        validation: {
            type: "enum",
            required: true,
            options: ["L", "P", "Laki-laki", "Perempuan", "male", "female"],
            mapTo: {
                l: "L",
                "laki-laki": "L",
                laki_laki: "L",
                male: "L",
                p: "P",
                perempuan: "P",
                female: "P",
            },
        },
    },
    {
        mainKey: "provinsi",
        label: "Provinsi",
        keys: ["provinsi", "prov", "province"],
        validation: { type: "text", maxLength: 100 },
    },
    {
        mainKey: "kab_kota",
        label: "Kabupaten / Kota",
        keys: ["kab_kota", "kabupaten", "kota", "kab_atau_kota", "city"],
        validation: { type: "text", maxLength: 100 },
    },
    {
        mainKey: "kecamatan",
        label: "Kecamatan",
        keys: ["kecamatan", "kec"],
        validation: { type: "text", maxLength: 100 },
    },
    {
        mainKey: "kel_desa",
        label: "Kelurahan / Desa",
        keys: ["kel_desa", "kelurahan", "desa"],
        validation: { type: "text", maxLength: 100 },
    },
    {
        mainKey: "alamat",
        label: "Alamat",
        keys: ["alamat", "alamat_lengkap", "address"],
        validation: { type: "text", maxLength: 255 },
    },
    {
        mainKey: "no_hp",
        label: "No HP",
        keys: [
            "no_hp",
            "nohp",
            "no_telpon",
            "no_telp",
            "whatsapp",
            "phone_number",
        ],
        validation: {
            type: "phone",
        },
    },
    {
        mainKey: "status_pendidikan",
        label: "Status Pendidikan",
        keys: ["status_pendidikan", "pendidikan", "pendidikan_terakhir"],
        validation: {
            type: "enum",
            options: [
                "SD",
                "SMP",
                "SMA",
                "D3",
                "S1",
                "S2",
                "S3",
                "Tidak Sekolah",
            ],
        },
    },
    {
        mainKey: "pekerjaan",
        label: "Pekerjaan",
        keys: ["pekerjaan", "profesi", "occupation"],
        validation: {
            type: "enum",
            options: PekerjaanOptions,
            mapTo: mapToPekerjaan,
        },
    },
    {
        mainKey: "status_perkawinan",
        label: "Status Perkawinan",
        keys: [
            "status_perkawinan",
            "status_nikah",
            "status_kawin",
            "marital_status",
        ],
        validation: {
            type: "enum",
            options: PerkawinanOptions,
        },
    },
    {
        mainKey: "status_disabilitas",
        label: "Status Disabilitas",
        keys: ["status_disabilitas", "disabilitas"],
        validation: {
            type: "enum",
            options: ["YA", "TIDAK"],
        },
    },
    {
        mainKey: "golongan_darah",
        label: "Golongan Darah",
        keys: ["golongan_darah", "gol_darah", "goldar", "blood_type"],
        validation: {
            type: "enum",
            options: [
                "A",
                "B",
                "AB",
                "O",
                "A+",
                "B+",
                "O+",
                "A-",
                "B-",
                "AB+",
                "AB-",
            ],
        },
    },
    {
        mainKey: "td_sistol",
        label: "Tekanan Darah Sistol",
        keys: ["td_sistol", "sistol", "sistole", "tensi_sistol"],
        validation: { type: "number", min: 50, max: 250 },
    },
    {
        mainKey: "td_diastol",
        label: "Tekanan Darah Diastol",
        keys: ["td_diastol", "diastol", "diastole", "tensi_diastol"],
        validation: { type: "number", min: 30, max: 150 },
    },
    {
        mainKey: "tinggi_badan",
        label: "Tinggi Badan (cm)",
        keys: ["tinggi_badan", "tinggi", "tb", "height"],
        validation: { type: "number", min: 30, max: 250 },
    },
    {
        mainKey: "berat_badan",
        label: "Berat Badan (kg)",
        keys: ["berat_badan", "berat", "bb", "weight"],
        validation: { type: "number", min: 1, max: 300 },
    },
    {
        mainKey: "lingkar_perut",
        label: "Lingkar Perut (cm)",
        keys: ["lingkar_perut", "lp", "waist_circumference"],
        validation: { type: "number", min: 30, max: 200 },
    },
    {
        mainKey: "pemeriksaan_gula",
        label: "Pemeriksaan Gula Darah",
        keys: ["pemeriksaan_gula", "gula_darah", "gds", "gdp", "gula"],
        validation: { type: "number", min: 10, max: 600 },
    },
    {
        mainKey: "darah_tinggi",
        label: "Riwayat Darah Tinggi",
        keys: ["darah_tinggi", "hipertensi", "riwayat_hipertensi"],
        validation: {
            type: "enum",
            options: ["Ya", "Tidak", "Ya/Ada", "Tidak/Tidak Ada"],
        },
    },
    {
        mainKey: "diabetes",
        label: "Riwayat Diabetes",
        keys: ["diabetes", "kencing_manis", "riwayat_diabetes"],
        validation: {
            type: "enum",
            options: ["Ya", "Tidak", "Ya/Ada", "Tidak/Tidak Ada"],
        },
    },
    {
        mainKey: "status_usia",
        label: "Status Usia",
        keys: ["status_usia", "jenis_ckg"],
        validation: {
            type: "system_calculated",
            options: ["LANSIA", "BALITA", "SEKOLAH"],
        },
    },
    {
        mainKey: "nik_wali",
        label: "NIK Wali",
        keys: ["nik_wali"],
        validation: {
            type: "text",
        },
    },
    {
        mainKey: "nama_wali",
        label: "Nama Lengkap Wali",
        keys: ["nama_wali"],
        validation: { type: "text" },
    },
    {
        mainKey: "tgl_lahir_wali",
        label: "Tanggal Lahir Wali",
        keys: ["tgl_lahir_wali"],
        validation: {
            type: "date",
        },
    },
    {
        mainKey: "jenis_kelamin_wali",
        label: "Jenis Kelamin Wali",
        keys: ["jenis_kelamin_wali"],
        validation: {
            type: "enum",
            options: ["L", "P", "Laki-laki", "Perempuan", "male", "female"],
            mapTo: {
                l: "L",
                "laki-laki": "L",
                laki_laki: "L",
                male: "L",
                p: "P",
                perempuan: "P",
                female: "P",
            },
        },
    },
    {
        mainKey: "no_hp_wali",
        label: "No HP Wali",
        keys: ["no_hp_wali"],
        validation: {
            type: "phone",
        },
    },
    {
        mainKey: "keterangan",
        label: "Keterangan",
        keys: ["keterangan", "catatan", "ket"],
        validation: { type: "text", maxLength: 255 },
    },
    {
        mainKey: "pendaftaran",
        label: "Pendaftaran",
        keys: ["daftar", "pendaftaran"],
        validation: {
            type: "enum",
            options: StatusOptions,
        },
    },
    {
        mainKey: "kehadiran",
        label: "Kehadiran",
        keys: ["hadir", "kehadiran"],
        validation: {
            type: "enum",
            options: StatusOptions,
        },
    },
    {
        mainKey: "pemeriksaan",
        label: "Pemeriksaan",
        keys: ["periksa", "pemeriksaan"],
        validation: {
            type: "enum",
            options: StatusOptions,
        },
    },
    {
        mainKey: "rapor",
        label: "Rapor",
        keys: ["rapor", "raport"],
        validation: {
            type: "enum",
            options: StatusOptions,
        },
    },
];

const validatorRegistry = {
    NIK_VALIDATOR: (val) => {
        const str = val ? val.toString().trim() : "";
        if (!/^\d{16}$/.test(str)) {
            return {
                success: false,
                message: "[NIK] harus tepat 16 digit angka murni",
            };
        }
        if (str.endsWith("0")) {
            return {
                success: false,
                message:
                    "[NIK] Terbaca pembulatan Excel (ujungnya 0). Ubah format kolom Excel menjadi 'Text' sebelum di-import!",
            };
        }
        return { success: true };
    },
    NO_HP_VALIDATOR: (val) => {
        const str = val ? val.toString().trim() : "";
        if (str.length < 10 || str.length > 15) {
            return {
                success: false,
                message: "[No HP] panjang harus antara 10 hingga 15 digit",
            };
        }
        return { success: true };
    },
    DATE_VALIDATOR: (val) => {
        const str = val ? val.toString().trim() : "";
        if (!/^\d{2}-\d{2}-\d{4}$/.test(str)) {
            return {
                success: false,
                message: "Format tanggal tidak valid (harus DD-MM-YYYY)",
            };
        }
        const parts = str.split("-");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const checkDate = new Date(year, month - 1, day);
        const isValidCalendar =
            checkDate.getFullYear() === year &&
            checkDate.getMonth() + 1 === month &&
            checkDate.getDate() === day;
        if (!isValidCalendar || isNaN(checkDate.getTime())) {
            return {
                success: false,
                message: `Tanggal "${str}" tidak logis/tidak ada di kalender`,
            };
        }
        return { success: true };
    },
};

const defaultData = {
    no_hp: "800000000",
    alamat: "Jl. Pal Meriam No. 6A",
    provinsi: "DKI Jakarta",
    kab_kota: "Kota Adm. Jakarta Timur",
    kecamatan: "Matraman",
    kel_desa: "Palmeriam",

    pekerjaan: "Pegawai Swasta",
    status_perkawinan: "Belum Menikah",
    status_disabilitas: "TIDAK",

    td_diastol: "80",
    td_sistol: "120",
    pemeriksaan_gula: "112",
    lingkar_perut: "80",
    berat_badan: "60",
    tinggi_badan: "160",

    nik_wali: "",
    nama_wali: "",
    tgl_lahir_wali: "",
    jenis_kelamin_wali: "",
    no_hp_wali: "",
};

function getDefaultData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.DEFAULT_DATA);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return defaultData;
}

function getAktifData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.AKTIF_DATA);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return [];
}

function saveAktifData(aktifData) {
    if (Array.isArray(aktifData)) {
        localStorage.setItem(
            LOCAL_STORAGE.AKTIF_DATA,
            JSON.stringify(aktifData),
        );
    }
}

function skipStatus(val = "") {
    switch (val) {
        case "OK":
        case "LEWATI":
        case "MANUAL":
        case "GAGAL":
            return true;
        default:
            return false;
    }
}
function allowNextProcess(val = "") {
    switch (val) {
        case "OK":
        case "MANUAL":
            return true;
        default:
            return false;
    }
}

const MAIN_URL = {
    PENDAFTARAN:
        "https://sehatindonesiaku.kemkes.go.id/ckg-pendaftaran-individu",
    PELAYANAN: "https://sehatindonesiaku.kemkes.go.id/ckg-pelayanan",
};
