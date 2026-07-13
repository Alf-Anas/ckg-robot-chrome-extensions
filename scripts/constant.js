const LOCAL_STORAGE = {
    AKTIF_DATA: "aktif-data",
    RUN_SETTING: "run-setting",
    DEFAULT_DATA: "default-data",
    DEFAULT_DATA_PEMERIKSAAN: "default-data-pemeriksaan",
    TGL_PEMERIKSAAN: "tgl-pemeriksaan",
};
const FrekuensiDuaMingguOptions = ["Tidak sama sekali", "Kurang dari 1 minggu", "Lebih dari 1 minggu", "Hampir setiap hari"]
const YaTidakOptions = ["Ya", "Tidak"];
const DisabilitasOptions = ["Non disabilitas", "Penyandang disabilitas"];
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
        keys: ["kab_kota", "kabupaten_kota", "kabupaten", "kota", "kab_atau_kota", "city"],
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
        keys: ["kel_desa", "kelurahan_desa", "kelurahan", "desa"],
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
        keys: ["td_sistol", "tekanan_darah_sistol", "sistol", "sistole", "tensi_sistol"],
        validation: { type: "number", min: 50, max: 250 },
    },
    {
        mainKey: "td_diastol",
        label: "Tekanan Darah Diastol",
        keys: ["td_diastol", "tekanan_darah_diastol", "diastol", "diastole", "tensi_diastol"],
        validation: { type: "number", min: 30, max: 150 },
    },
    {
        mainKey: "tinggi_badan",
        label: "Tinggi Badan (cm)",
        keys: ["tinggi_badan", "tinggi_badan_cm", "tinggi", "tb", "height"],
        validation: { type: "number", min: 30, max: 250 },
    },
    {
        mainKey: "berat_badan",
        label: "Berat Badan (kg)",
        keys: ["berat_badan", "berat_badan_kg", "berat", "bb", "weight"],
        validation: { type: "number", min: 1, max: 300 },
    },
    {
        mainKey: "lingkar_perut",
        label: "Lingkar Perut (cm)",
        keys: ["lingkar_perut", "lingkar_perut_cm", "lp", "waist_circumference"],
        validation: { type: "number", min: 30, max: 200 },
    },
    {
        mainKey: "pemeriksaan_gula",
        label: "Pemeriksaan Gula Darah",
        keys: ["pemeriksaan_gula", "pemeriksaan_gula_darah", "gula_darah", "gds", "gdp", "gula"],
        validation: { type: "number", min: 10, max: 600 },
    },
    {
        mainKey: "darah_tinggi",
        label: "Riwayat Darah Tinggi",
        keys: ["darah_tinggi", "riwayat_darah_tinggi", "hipertensi", "riwayat_hipertensi"],
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
        keys: ["nama_wali", "nama_lengkap_wali"],
        validation: { type: "text" },
    },
    {
        mainKey: "tgl_lahir_wali",
        label: "Tanggal Lahir Wali",
        keys: ["tgl_lahir_wali", "tanggal_lahir_wali"],
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
            options: ["L", "P", "Laki-laki", "Perempuan", "male", "female", "-"],
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
        if (str.endsWith("000")) {
            return {
                success: false,
                message:
                    "[NIK] Terbaca pembulatan Excel (ujungnya 000). Ubah format kolom Excel menjadi 'Text' sebelum di-import!",
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


const defaultRunSettingData = {
    pendaftaran: true,
    kehadiran: true,
    rapor: false,
    pemeriksaan: {
        demoDewasa: false,
        faktorTb: false,
        hati: false,
        kesJiwa: false,
        rokok: false,
        aktivitasFisik: false
    }
};

function getRunSettingData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.RUN_SETTING);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error("Gagal parse localStorage:", e);
        }
    }
    return defaultRunSettingData;
}

function saveRunSettingData(runSetting) {
    localStorage.setItem(LOCAL_STORAGE.RUN_SETTING, JSON.stringify(runSetting));
}

const MAIN_URL = {
    PENDAFTARAN:
        "https://sehatindonesiaku.kemkes.go.id/ckg-pendaftaran-individu",
    PELAYANAN: "https://sehatindonesiaku.kemkes.go.id/ckg-pelayanan",
};

const pemeriksaanDataSchema = {
    "demografiAnak": {
        "key": "demografiAnak",
        "label": "Demografi Anak",
        "input": [
            {
                key: "status_disabilitas",
                label: "Apakah Anda penyandang disabilitas",
                type: "enum",
                required: true,
                default: "Non disabilitas",
                options: DisabilitasOptions
            }
        ],
    },
    "demografiDewasaLakiLaki": {
        "key": "demografiDewasaLakiLaki",
        "label": "Demografi Dewasa Laki-Laki",
        "input": [
            {
                "key": "status_perkawinan",
                "label": "Status Perkawinan",
                "type": "enum",
                "required": true,
                "default": "Belum Menikah",
                "options": PerkawinanOptions
            },
            {
                "key": "status_disabilitas",
                "label": "Apakah Anda penyandang disabilitas?",
                "type": "enum",
                "required": true,
                "default": "Non disabilitas",
                "options": DisabilitasOptions
            }
        ]
    },
    "demografiDewasaPerempuan": {
        "key": "demografiDewasaPerempuan",
        "label": "Demografi Dewasa Perempuan",
        "input": [
            {
                "key": "status_perkawinan",
                "label": "Status Perkawinan",
                "type": "enum",
                "required": true,
                "default": "Belum Menikah",
                "options": PerkawinanOptions
            },
            {
                "key": "status_hamil",
                "label": "Apakah Anda sedang hamil?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "status_disabilitas",
                "label": "Apakah Anda penyandang disabilitas?",
                "type": "enum",
                "required": true,
                "default": "Non disabilitas",
                "options": DisabilitasOptions
            }
        ]
    },
    "demografiLansia": {
        "key": "demografiLansia",
        "label": "Demografi Lansia",
        "input": [
            {
                key: "status_perkawinan",
                label: "Status Perkawinan",
                type: "enum",
                required: true,
                default: "Belum Menikah",
                options: PerkawinanOptions
            },
            {
                key: "status_disabilitas",
                label: "Apakah Anda penyandang disabilitas",
                type: "enum",
                required: true,
                default: "Non disabilitas",
                options: DisabilitasOptions
            }
        ],
    },
    "faktorRisikoKankerUsus": {
        "key": "faktorRisikoKankerUsus",
        "label": "Faktor Risiko Kanker Usus",
        "input": [
            {
                key: "kanker_usus",
                label: "Apakah ada anggota keluarga Anda, yang pernah dinyatakan menderita kanker kolorektal atau kanker usus?",
                type: "enum",
                required: true,
                default: "Tidak",
                options: YaTidakOptions
            },
            {
                key: "status_merokok",
                label: "Apakah Anda merokok",
                type: "enum",
                required: true,
                default: "Tidak",
                options: YaTidakOptions
            }
        ],
    },
    "faktorRisikoTbDewasaLansia": {
        "key": "faktorRisikoTbDewasaLansia",
        "label": "Faktor Risiko TB - Dewasa & Lansia",
        "input": [
            {
                key: "status_batuk",
                label: "Apakah Anda pernah atau sedang mengalami batuk yang tidak sembuh-sembuh?",
                type: "enum",
                required: true,
                default: "Tidak batuk",
                options: ["Ya, lebih dari 2 minggu", "Ya, kurang dari 2 minggu", "Tidak batuk"]
            },
        ],
    },
    "hati": {
        "key": "hati",
        "label": "Hati",
        "input": [
            {
                "key": "tes_hepatitis_b_positif",
                "label": "Apakah Anda pernah menjalani tes untuk Hepatitis B dan mendapatkan hasil positif?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "riwayat_keluarga_hepatitis_b",
                "label": "Apakah Anda memiliki ibu kandung/saudara sekandung yang menderita Hepatitis B?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "seks_berisiko",
                "label": "Apakah anda pernah berhubungan seksual berisiko/tanpa pengaman dengan bukan pasangan suami/istri?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "transfusi_darah",
                "label": "Apakah Anda pernah menerima transfusi darah sebelumnya?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "cuci_darah_hemodialisis",
                "label": "Apakah Anda pernah menjalani cuci darah atau hemodialisis?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "narkoba_suntik",
                "label": "Apakah Anda pernah menggunakan narkoba, obat terlarang, atau bahan adiktif lainnya dengan cara disuntik?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "status_odhiv",
                "label": "Apakah Anda adalah orang dengan HIV (ODHIV)?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "pengobatan_hepc_gagal",
                "label": "Apakah Anda pernah mendapatkan pengobatan Hepatitis C dan tidak sembuh?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "diagnosa_kolesterol_tinggi",
                "label": "Apakah Anda pernah didiagnosa atau mendapatkan hasil pemeriksaan kolesterol (lemak darah) tinggi?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    },
    "kesehatanJiwa": {
        "key": "kesehatanJiwa",
        "label": "Kesehatan Jiwa",
        "input": [
            {
                "key": "kurang_bersemangat",
                "label": "Dalam 2 minggu terakhir, seberapa sering anda kurang/ tidak bersemangat dalam melakukan kegiatan sehari-hari?",
                "type": "enum",
                "required": true,
                "default": "Tidak sama sekali",
                "options": FrekuensiDuaMingguOptions
            },
            {
                "key": "merasa_murung",
                "label": "Dalam 2 minggu terakhir, seberapa sering anda merasa murung, tertekan, atau putus asa?",
                "type": "enum",
                "required": true,
                "default": "Tidak sama sekali",
                "options": FrekuensiDuaMingguOptions
            },
            {
                "key": "merasa_cemas",
                "label": "Dalam 2 minggu terakhir, seberapa sering anda merasa gugup, cemas, atau gelisah?",
                "type": "enum",
                "required": true,
                "default": "Tidak sama sekali",
                "options": FrekuensiDuaMingguOptions
            },
            {
                "key": "tidak_kendali_khawatir",
                "label": "Dalam 2 minggu terakhir, seberapa sering anda tidak mampu mengendalikan rasa khawatir?",
                "type": "enum",
                "required": true,
                "default": "Tidak sama sekali",
                "options": FrekuensiDuaMingguOptions
            }
        ]
    },
    "penapisanRisikoKankerParu": {
        "key": "penapisanRisikoKankerParu",
        "label": "Penapisan Risiko Kanker Paru",
        "input": [
            {
                "key": "merokok_setahun_terakhir",
                "label": "Apakah Anda merokok dalam setahun terakhir ini?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "terpapar_asap_rokok_pasif",
                "label": "Apakah Anda terpapar atau menghirup asap rokok dari orang lain di rumah, lingkungan atau tempat kerja dalam 1 bulan terakhir?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "riwayat_keluarga_kanker_paru",
                "label": "Apakah memiliki riwayat kanker paru pada keluarga (ayah/ibu/saudara kandung)?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "gejala_kanker_paru_kronis",
                "label": "Apakah Anda sedang mengalami salah satu atau lebih gejala berikut dan telah diobati tetapi tidak sembuh-sembuh : batuk dalam jangka waktu yang lama / batuk berdarah/ sesak napas/ nyeri dada/ leher bengkak/ terdapat benjolan pada leher?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "riwayat_tbc_ppok",
                "label": "Apakah Anda pernah memiliki riwayat penyakit TBC atau PPOK?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    },
    "perilakuMerokok": {
        "key": "perilakuMerokok",
        "label": "Perilaku Merokok",
        "input": [
            {
                "key": "merokok_setahun_terakhir",
                "label": "Apakah Anda merokok dalam setahun terakhir ini?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "terpapar_asap_rokok_pasif",
                "label": "Apakah Anda terpapar asap rokok atau menghirup asap rokok dari orang lain dalam sebulan terakhir?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    },
    "tingkatAktivitasFisik": {
        "key": "tingkatAktivitasFisik",
        "label": "Tingkat Aktivitas Fisik (sedang dan berat)",
        "input": [
            {
                "key": "aktivitas_sedang_domestik",
                "label": "Apakah Anda melakukan aktivitas fisik sedang pada kegiatan rumah tangga/domestik seperti membersihkan rumah/lingkungan (menyapu, menata perabotan), mencuci baju manual, memasak, mengasuh anak, atau mengangkat beban dengan berat < 20 kg?",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "aktivitas_sedang_kerja",
                "label": "Apakah Anda melakukan aktivitas fisik sedang pada tempat kerja seperti pekerjaan dengan mengangkat beban, memberi makan ternak, berkebun dan membersihkan kendaraan (motor/mobil/perahu)?",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "aktivitas_sedang_perjalanan",
                "label": "Apakah Anda melakukan aktivitas fisik sedang dalam perjalanan seperti berjalan kaki atau bersepeda ke ladang, sawah, pasar dan tempat kerja?",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "olahraga_sedang",
                "label": "Apakah Anda melakukan olahraga intensitas sedang seperti latihan beban < 20 kg, senam aerobic, yoga, bermain bola, bersepeda dan berenang (santai)?",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "aktivitas_berat_kerja",
                "label": "Apakah Anda melakukan aktivitas fisik intensitas berat di tempat kerja seperti mengangkat/memikul beban berat ≥20 kg, mencangkul, menggali, memanen, memanjat pohon, menebang pohon, mengayuh becak, menarik jaring, mendorong atau menarik (mesin pemotong rumput/gerobak/perahu/kendaraan)?",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            },
            {
                "key": "olahraga_berat",
                "label": "Apakah Anda melakukan olahraga intensitas berat seperti bersepeda cepat (>16 km/jam), jalan cepat (>7 km/jam), lari, sepak bola, futsal, bulutangkis, tenis, basket dan lompat tali?",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    },
    "faktorRisikoGulaDarahAnak": {
        "key": "faktorRisikoGulaDarahAnak",
        "label": "Faktor Risiko Gula Darah Anak",
        "input": [
            {
                "key": "riwayat_diabetes_anak",
                "label": "Apakah Anak Anda pernah dinyatakan diabetes atau kencing manis oleh Dokter?",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    },
    "riwayatImunisasiRutinBalita": {
        "key": "riwayatImunisasiRutinBalita",
        "label": "Riwayat Imunisasi Rutin Balita",
        "input": [
            {
                "key": "status_imunisasi",
                "label": "Apakah anak pernah memperoleh imunisasi saat usia 0 sd 24 bulan",
                "type": "enum-select",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    },
    "riwayatImunisasiTetanusCatin": {
        "key": "riwayatImunisasiTetanusCatin",
        "label": "Riwayat Imunisasi Tetanus(Status T) - Hanya untuk Catin",
        "input": [
            {
                "key": "riwayat_imunisasi_tetanus",
                "label": "Apakah anda pernah mendapatkan imunisasi tetanus minimal 2 kali? (imunisasi tetanus biasanya didapatkan pada vaksin DPT saat bayi, vaksin TT/Td saat usia sekolah dasar)",
                "type": "enum-select",
                "default": "Tidak tahu atau tidak ingat",
                "options": [
                    "Pernah imunisasi tetanus minimal dua kali",
                    "Pernah imunisasi tetanus satu kali",
                    "Pernah imunisasi tetanus tetapi tidak ingat berapa kali",
                    "Tidak tahu atau tidak ingat"
                ]
            }
        ]
    },
    "kankerLeherRahim": {
        "key": "kankerLeherRahim",
        "label": "Kanker Leher Rahim",
        "input": [
            {
                "key": "pernah_hubungan_seksual",
                "label": "Apakah pernah melakukan hubungan intim/seksual? *",
                "type": "enum",
                "required": true,
                "default": "Tidak",
                "options": YaTidakOptions
            }
        ]
    }
}

function generateInitialDefaultValuesPemeriksaan(schema) {
    const defaults = {};
    Object.keys(schema).forEach(catKey => {
        schema[catKey].input.forEach(inputItem => {
            // Menyimpan dengan format susunan unik: kategori_inputKey
            const uniqueKey = `${catKey}_${inputItem.key}`;
            defaults[uniqueKey] = inputItem.default || "";
        });
    });
    return defaults;
}

const defaultPemeriksaanData = generateInitialDefaultValuesPemeriksaan(pemeriksaanDataSchema);
 
function getDefaultPemeriksaanData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE.DEFAULT_DATA_PEMERIKSAAN);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error("Gagal parse localStorage:", e);
        }
    }
    return defaultPemeriksaanData;
}

function saveDefaultPemeriksaanData(defVal) {
    localStorage.setItem(LOCAL_STORAGE.DEFAULT_DATA_PEMERIKSAAN, JSON.stringify(defVal));
}