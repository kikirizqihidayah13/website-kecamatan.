import { Desa, Catatan, Komoditas, Perangkat, Berita, Agenda, Galeri, Produk, Pelapak, Aset, Pengguna, LogAktivitas } from "./types";

export const INITIAL_DESA: Desa[] = [
  {
    id: "1",
    nama: "Sei Selayur",
    kode: "16710001",
    kepalaDesa: "H. Amir Hamzah",
    penduduk: "4.280",
    statusWeb: "Aktif",
    kelengkapan: 95,
    catatan: "Baik",
    alamat: "Jl. Sei Selayur No. 1, RT 02",
    luas: "12,4 km²",
    batas: "U: Sungai Musi | S: Ds. Plaju",
    visi: "Desa yang Mandiri, Maju, dan Sejahtera"
  },
  {
    id: "2",
    nama: "Talang Kelapa",
    kode: "16710002",
    kepalaDesa: "Siti Rahayu, S.Pd",
    penduduk: "5.120",
    statusWeb: "Aktif",
    kelengkapan: 78,
    catatan: "Sedang",
    alamat: "Jl. Talang Kelapa No. 8",
    luas: "9,8 km²",
    batas: "U: Ds. Sako | S: Ds. Sei Selayur",
    visi: "Mewujudkan Desa yang Maju dengan Kerjasama Gotong Royong"
  },
  {
    id: "3",
    nama: "Gandus",
    kode: "16710003",
    kepalaDesa: "Budi Santoso",
    penduduk: "3.890",
    statusWeb: "Draft",
    kelengkapan: 55,
    catatan: "Perlu Update",
    alamat: "Jl. Gandus Indah No. 15",
    luas: "18,2 km²",
    batas: "Barat: Sungai Musi",
    visi: "Desa Sejahtera Melalui Peningkatan Kinerja Sektor Perikanan"
  },
  {
    id: "4",
    nama: "Kertapati",
    kode: "16710004",
    kepalaDesa: "Ahmad Fauzi",
    penduduk: "4.650",
    statusWeb: "Belum Aktif",
    kelengkapan: 40,
    catatan: "Belum Lengkap",
    alamat: "Jl. Kertapati Baru No. 4",
    luas: "15,5 km²",
    batas: "Selatan: Plaju",
    visi: "Terwujudnya Kertapati yang Aman, Berdaya Saing, dan Bermoral"
  },
  {
    id: "5",
    nama: "Plaju",
    kode: "16710005",
    kepalaDesa: "Dra. Hj. Murni",
    penduduk: "6.200",
    statusWeb: "Aktif",
    kelengkapan: 88,
    catatan: "Baik",
    alamat: "Jl. Plaju Raya No. 22",
    luas: "15,1 km²",
    batas: "U: Sungai Musi | S: Ds. Gandus",
    visi: "Meningkatkan Kualitas Hidup Masyarakat Secara Adil dan Berkemajuan"
  },
  {
    id: "6",
    nama: "Sako",
    kode: "16710006",
    kepalaDesa: "Ir. Hendarman",
    penduduk: "3.420",
    statusWeb: "Aktif",
    kelengkapan: 62,
    catatan: "Sedang",
    alamat: "Jl. Sako Baru Raya No. 14",
    luas: "11,2 km²",
    batas: "U: Sako Hilir | S: Ds. Gandus",
    visi: "Kemandirian Wirausaha Mandiri Menuju Sako Hebat"
  },
  {
    id: "7",
    nama: "Bukit Lama",
    kode: "16710007",
    kepalaDesa: "Hj. Fatimah",
    penduduk: "2.980",
    statusWeb: "Aktif",
    kelengkapan: 70,
    catatan: "Sedang",
    alamat: "Jl. Bukit Lama Pasir No. 5",
    luas: "10,1 km²",
    batas: "U: Bukit Baru | S: Plaju",
    visi: "Menjaga Warisan Luhur Melalui Pembangunan Terpadu"
  },
  {
    id: "8",
    nama: "Kalidoni",
    kode: "16710008",
    kepalaDesa: "Rudi Hartono",
    penduduk: "3.760",
    statusWeb: "Draft",
    kelengkapan: 66,
    catatan: "Perlu Update",
    alamat: "Jl. Kalidoni Jaya No. 7",
    luas: "12,1 km²",
    batas: "U: Sungai Musi | S: Sako",
    visi: "Penyempurnaan Kelengkapan Data Menuju Satu Kalidoni"
  }
];

export const INITIAL_CATATAN: Catatan[] = [
  {
    id: "c1",
    desaName: "Gandus",
    tanggal: "10 Jan 2025",
    isi: "Data monografi penduduk belum diperbarui. Mohon segera mengisi data distribusi usia dan pekerjaan untuk kelengkapan profil desa.",
    tipe: "warn"
  },
  {
    id: "c2",
    desaName: "Kertapati",
    tanggal: "08 Jan 2025",
    isi: "Data perangkat desa masih kosong. Foto kepala desa dan sekretaris desa juga belum diupload.",
    tipe: "info"
  }
];

export const INITIAL_KOMODITAS: Komoditas[] = [
  {
    id: "k1",
    nama: "Padi Sawah",
    kategori: "Pertanian",
    luas: "450 Ha",
    produksi: "1.200 ton/tahun",
    periode: "Januari - Maret",
    desa: "Sei Selayur, Talang Kelapa, Plaju, Sako, Gandus",
    status: "Unggulan",
    keterangan: "Komoditas pangan utama kecamatan Ilir Timur I dengan kualitas beras premium yang pulen dan dipasok langsung ke pasar Kota Palembang.",
    foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    icon: "🌾"
  },
  {
    id: "k2",
    nama: "Budidaya Ikan Patin",
    kategori: "Perikanan",
    luas: "120 Kolam",
    produksi: "85 ton/tahun",
    periode: "April - Juni",
    desa: "Gandus, Plaju",
    status: "Unggulan",
    keterangan: "Sentra budidaya ikan air tawar unggulan di sepanjang daerah rawa dan kolam darat, menyuplai kebutuhan warung makan pindang khas Palembang.",
    foto: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80",
    icon: "🐟"
  },
  {
    id: "k3",
    nama: "Kelapa Sawit",
    kategori: "Perkebunan",
    luas: "280 Ha",
    produksi: "340 ton/tahun",
    periode: "Oktober - Desember",
    desa: "Kertapati, Sako",
    status: "Unggulan",
    keterangan: "Komoditas perkebunan utama penghasil buah segar kelapa sawit yang diolah oleh koperasi produsen pangan setempat.",
    foto: "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=600&q=80",
    icon: "🌴"
  },
  {
    id: "k4",
    nama: "Kerajinan Anyaman",
    kategori: "Kerajinan",
    luas: "45 Pengrajin",
    produksi: "1.200 produk/bulan",
    periode: "Sepanjang Tahun",
    desa: "Bukit Lama",
    status: "Reguler",
    keterangan: "Produk kerajinan anyaman kearifan lokal berbahan bambu dan rotan buatan kelompok ibu-ibu kreatif, dipasarkan sebagai cenderamata premium.",
    foto: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80",
    icon: "🎋"
  }
];

export const INITIAL_PERANGKAT: Perangkat[] = [
  { id: "p1", nama: "H. Amir Hamzah", jabatan: "Kepala Desa", desa: "Sei Selayur", hp: "0812-7000-0001", status: "Aktif", periode: "2021–2027" },
  { id: "p2", nama: "Dra. Rohani", jabatan: "Sekretaris Desa", desa: "Sei Selayur", hp: "0812-7000-0002", status: "Aktif", periode: "2019–sekarang" },
  { id: "p3", nama: "Supriyadi", jabatan: "Kasi Pemerintahan", desa: "Sei Selayur", hp: "0812-7000-0003", status: "Aktif", periode: "2020–sekarang" },
  { id: "p4", nama: "Hendra, S.T.", jabatan: "Kasi Pembangunan", desa: "Sei Selayur", hp: "0812-7000-0004", status: "Aktif", periode: "2020–sekarang" },
  { id: "p5", nama: "Siti Aisyah", jabatan: "Kasi Kemasyarakatan", desa: "Sei Selayur", hp: "0812-7000-0005", status: "Aktif", periode: "2018–sekarang" },
  { id: "p6", nama: "Rini Wulandari", jabatan: "Kaur Keuangan", desa: "Sei Selayur", hp: "0812-7000-0006", status: "Aktif", periode: "2021–sekarang" },
  { id: "p7", nama: "Ahmad Yani", jabatan: "Kepala Dusun I", desa: "Sei Selayur", hp: "0812-7000-0007", status: "Aktif", periode: "2022–sekarang" },
  { id: "p8", nama: "Bambang Eko", jabatan: "Kepala Dusun II", desa: "Sei Selayur", hp: "0812-7000-0008", status: "Aktif", periode: "2022–sekarang" },
  { id: "p9", nama: "Mulyadi", jabatan: "Kepala Dusun III", desa: "Sei Selayur", hp: "0812-7000-0009", status: "Aktif", periode: "2022–sekarang" },
  { id: "p10", nama: "Budi Kurniawan, S.E.", jabatan: "Kepala Desa", desa: "Talang Kelapa", hp: "0812-7001-0001", status: "Aktif", periode: "2020–2026" },
  { id: "p11", nama: "Sri Wahyuni", jabatan: "Sekretaris Desa", desa: "Talang Kelapa", hp: "0812-7001-0002", status: "Aktif", periode: "2020–sekarang" },
  { id: "p12", nama: "Dra. Hj. Murni", jabatan: "Kepala Desa", desa: "Plaju", hp: "0812-7002-0001", status: "Aktif", periode: "2021–2027" },
  { id: "p13", nama: "Budi Santoso", jabatan: "Kepala Desa", desa: "Gandus", hp: "0812-7003-0001", status: "Aktif", periode: "2019–2025" },
  { id: "p14", nama: "Lina Rohimah, S.Sos.", jabatan: "Sekretaris Desa", desa: "Kertapati", hp: "0812-7004-0002", status: "Aktif", periode: "2021–sekarang" }
];

export const INITIAL_BERITA: Berita[] = [
  {
    id: "b1",
    judul: "Perbaikan Jalan Dusun II Sei Selayur Rampung",
    kategori: "Pembangunan",
    desa: "Sei Selayur",
    waktu: "2 jam lalu",
    status: "Terbit",
    deskripsi: "Proyek infrastruktur pengaspalan dan cor beton jalan di Dusun II Sei Selayur sepanjang 1,2 km telah rampung dikerjakan. Kini akses warga menuju perkebunan dan permukiman sekitar menjadi lebih nyaman, memperlancar pasokan hasil bumi warga desa.",
    foto: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
  },
  {
    id: "b2",
    judul: "Panen Padi Perdana Musim Hujan 2024",
    kategori: "Pertanian",
    desa: "Talang Kelapa",
    waktu: "4 jam lalu",
    status: "Terbit",
    deskripsi: "Kelompok tani Makmur Utama melaksanakan aksi panen perdana padi varitas unggul IR64. Walau diterpa cuaca hujan ekstrim, produktivitas padi sawah meningkat sekitar 8% per hektar melalui penerapan pupuk organik binaan Balai Penyuluhan Pertanian kecamatan.",
    foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"
  },
  {
    id: "b3",
    judul: "Peringatan HUT Kemerdekaan Tingkat Desa Plaju",
    kategori: "Kegiatan",
    desa: "Plaju",
    waktu: "6 jam lalu",
    status: "Terbit",
    deskripsi: "Warga Desa Plaju antusias mengikuti kegiatan perlombaan khas kemerdekaan RI seperti lomba memasak tradisional, panjat pinang, dan jalan santai. Ajang tahunan ini difasilitasi oleh karang taruna desa untuk mempererat kerukunan antar dusun.",
    foto: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80"
  },
  {
    id: "b4",
    judul: "Posyandu Balita Rutin Bulan Januari",
    kategori: "Kesehatan",
    desa: "Sako",
    waktu: "Kemarin",
    status: "Draft",
    deskripsi: "Kegiatan pemantauan tumbuh kembang balita, imunisasi polio terpadu, dan pemberian makanan tambahan tinggi gizi dilakukan oleh kader posyandu Sako. Upaya ini merupakan komitmen berkelanjutan dalam menekan angka stunting di tingkat kecamatan.",
    foto: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80"
  }
];

export const INITIAL_AGENDA: Agenda[] = [
  { id: "a1", day: 2, tanggal: "2026-06-02", title: "Musyawarah Pembagian Dana Desa", lokasi: "Balai Pertemuan Warga RW 02", desa: "Sei Selayur", status: "Direncanakan", keterangan: "Rapat musyawarah penentuan prioritas alokasi BLT dana desa tahap II." },
  { id: "a2", day: 6, tanggal: "2026-06-06", title: "Gotong Royong Bersih Desa Plaju", lokasi: "Lingkungan RT 04 s/d RT 10", desa: "Plaju", status: "Selesai", keterangan: "Kegiatan gotong royong warga membersihkan drainase utama guna antisipasi musim hujan." },
  { id: "a3", day: 9, tanggal: "2026-06-09", title: "Posyandu Balita & Lansia Desa Sako", lokasi: "Gedung Poskesdes Sako Mandiri", desa: "Sako", status: "Selesai", keterangan: "Imunisasi rutinitas, penimbangan tumbuh kembang balita, dan cek tensi gratis lansia." },
  { id: "a4", day: 12, tanggal: "2026-06-12", title: "Pelatihan UMKM Kerajinan Bambu", lokasi: "Pendopo Kreatif Bukit Lama", desa: "Bukit Lama", status: "Selesai", keterangan: "Pembinaan klaster industri rumah tangga anyaman bambu untuk pangsa ekspor lokal." },
  { id: "a5", day: 14, tanggal: "2026-06-14", title: "Rakor Koordinasi Kepala Desa Se-Kecamatan", lokasi: "Ruang Rapat Utama Kecamatan", desa: "Kecamatan", status: "Hari Ini", keterangan: "Koordinasi terpadu membahas penataan batas wilayah administrasi dan persiapan evaluasi LPPD." },
  { id: "a6", day: 19, tanggal: "2026-06-19", title: "Penyuluhan Kelompok Tani Pupuk Hayati", lokasi: "Sawah Binaan Poktan Mulyo", desa: "Talang Kelapa", status: "Mendatang", keterangan: "Edukasi mandiri penggunaan pupuk organik cair buatan kelompok tani lokal." },
  { id: "a7", day: 27, tanggal: "2026-06-27", title: "Lomba Desa Bersih Go Green", lokasi: "Seluruh Wilayah Desa Plaju", desa: "Plaju", status: "Mendatang", keterangan: "Penilaian ekologis kebersihan pekarangan, tingkat keterlibatan pemilahan sampah anorganik." }
];

export const INITIAL_GALERI: Galeri[] = [
  { id: "g1", title: "Cor Jalan Dusun II", meta: "Sei Selayur · 14 Jan 2025", foto: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
  { id: "g2", title: "Panen Padi Makmur", meta: "Talang Kelapa · 12 Jan 2025", foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
  { id: "g3", title: "Lomba Masak Gotong Royong", meta: "Plaju · 6 Jan 2025", foto: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80" },
  { id: "g4", title: "Imunisasi Posyandu Sako", meta: "Sako · 9 Jan 2025", foto: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80" }
];

export const INITIAL_PRODUK: Produk[] = [
  {
    id: "pr1",
    nama: "Beras Ramos Premium Pak Slamet",
    harga: "14.000",
    satuan: "kg",
    pelapak: "Pak Slamet",
    desa: "Sei Selayur",
    ketersediaan: "Tersedia",
    kategori: "pertanian",
    foto: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    deskripsi: "Beras sawah varietas ramos asli hasil produksi kelompok tani Desa Sei Selayur. Bersih, putih alami tanpa pemutih sintetis ataupun pewangi buatan. Karakter nasi pulen, legit, cocok untuk konsumsi harian keluarga.",
    whatsapp: "6281234567890"
  },
  {
    id: "pr2",
    nama: "Anyaman Rotan Keranjang Tradisional",
    harga: "85.000",
    satuan: "pcs",
    pelapak: "Bu Kartini",
    desa: "Bukit Lama",
    ketersediaan: "Tersedia",
    kategori: "kerajinan",
    foto: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80",
    deskripsi: "Keranjang hias serbaguna dari rotan premium, dikerjakan secara hand-made presisi tinggi oleh pengrajin professional Bukit Lama. Tahan gores, kokoh, estetis untuk tempat pakaian kering ataupun dekorasi rumah.",
    whatsapp: "6281322345678"
  },
  {
    id: "pr3",
    nama: "Ikan Patin Segar Kolam Darat",
    harga: "32.000",
    satuan: "kg",
    pelapak: "Pak Darto",
    desa: "Gandus",
    ketersediaan: "Terbatas",
    kategori: "perikanan",
    foto: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80",
    deskripsi: "Ikan patin hidup dipanen segar dari kolam tanah Gandus. Diberi pakan berkualitas, daging tebal lembut bebas aroma lumpur menyengat. Cocok dimasak bumbu kuning maupun pindang selera tradisional.",
    whatsapp: "6281912345678"
  },
  {
    id: "pr4",
    nama: "Pempek Palembang Asli Bu Ros",
    harga: "5.000",
    satuan: "pcs",
    pelapak: "Bu Ros",
    desa: "Talang Kelapa",
    ketersediaan: "Tersedia",
    kategori: "makanan",
    foto: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    deskripsi: "Pempek homemade menggunakan campuran ikan tenggiri segar pilihan dan tepung berkualitas. Disajikan lengkap bersama kuah cuko kental pedas manis gurih tanpa pemanis kimiawi.",
    whatsapp: "6282187654321"
  }
];

export const INITIAL_PELAPAK: Pelapak[] = [
  { id: "pl1", nama: "Pak Slamet", usaha: "UD Beras Slamet", whatsapp: "6281234567890", desa: "Sei Selayur", jumlahProduk: "5 produk", status: "Aktif" },
  { id: "pl2", nama: "Bu Kartini", usaha: "Kerajinan Rotan Asri", whatsapp: "6281322345678", desa: "Bukit Lama", jumlahProduk: "12 produk", status: "Aktif" },
  { id: "pl3", nama: "Bu Ros", usaha: "Pempek Ros Original", whatsapp: "6282187654321", desa: "Talang Kelapa", jumlahProduk: "8 produk", status: "Aktif" },
  { id: "pl4", nama: "Pak Darto", usaha: "Tambak Patin Jaya", whatsapp: "6281912345678", desa: "Gandus", jumlahProduk: "3 produk", status: "Terbatas" }
];

export const INITIAL_ASET = (kantorImg: string, balaiImg: string, posyanduImg: string): Aset[] => [
  {
    id: "as1",
    nama: "Tanah Kas Desa Sei Selayur",
    tipe: "tanah",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Luas: 2,4 Ha · Sawah produktif irigasi teratur",
    koordinat: "-2.9804, 104.7431",
    dokumenPendukung: "Sertifikat Hak Pakai No. 12/SS/2012"
  },
  {
    id: "as2",
    nama: "Tanah Pemakaman Umum TPU",
    tipe: "tanah",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Luas: 0,8 Ha · Lahan pemakaman umum Talang Kelapa",
    koordinat: "-2.9615, 104.7725",
    dokumenPendukung: "Akte Ikrar Wakaf No. 421/TPU/TK"
  },
  {
    id: "as3",
    nama: "Lapangan Olahraga Desa Plaju",
    tipe: "tanah",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Luas: 1,1 Ha · Lapangan sepakbola & voli serbaguna",
    koordinat: "-3.0112, 104.7904",
    dokumenPendukung: "Sertifikat Hak Pakai No. 88/Plaju/2018"
  },
  {
    id: "as4",
    nama: "Kantor Desa Plaju",
    tipe: "bangunan",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Luas Bangunan: 420 m² · 2 Lantai · Bahan Beton Permanen",
    foto: kantorImg,
    dokumenPendukung: "Sertifikat Hak Milik Daerah No. 412"
  },
  {
    id: "as5",
    nama: "Balai Desa Gandus",
    tipe: "bangunan",
    kondisi: "Rusak Ringan",
    spesifikasi: "Luas: 280 m² · Atap genteng bocor tipis · 1 Lantai kayu jati",
    foto: balaiImg,
    dokumenPendukung: "Akte Hibah No. 177/Gds/1994"
  },
  {
    id: "as6",
    nama: "Posyandu Mawar Sei Selayur",
    tipe: "bangunan",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Luas: 60 m² · Fasilitas pemeriksaan balita dasar",
    foto: posyanduImg,
    dokumenPendukung: "Sertifikat Hak Pakai No. 54"
  },
  {
    id: "as7",
    nama: "Komputer Desktop Dell Optiplex",
    tipe: "inventaris",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Qty: 4 Unit · Admin kantor Desa Sei Selayur",
    dokumenPendukung: "Dokumen Pembelian APBDesa TA 2023"
  },
  {
    id: "as8",
    nama: "Motor Dinas Honda Vario 125",
    tipe: "inventaris",
    kondisi: "Perlu Pembaruan",
    spesifikasi: "Qty: 2 Unit · No.Pol BG-5432-XY & BG-5124-ZZ",
    dokumenPendukung: "BPKB & STNK Dinas Milik Pemkab"
  },
  {
    id: "as9",
    nama: "Kursi & Meja Lipat Aula",
    tipe: "inventaris",
    kondisi: "Aktif Digunakan",
    spesifikasi: "Qty: 60 Set Kursi kuliah besi stainless · Balai Desa Plaju",
    dokumenPendukung: "Inventarisasi Aset Desa Register B/2021"
  }
];

export const INITIAL_PENGGUNA: Pengguna[] = [
  { id: "u1", nama: "Admin Kecamatan", username: "admin.kec", role: "Super Admin", instansi: "Kecamatan Ilir Timur I", status: "Aktif", loginTerakhir: "Baru saja", password: "password123" },
  { id: "u2", nama: "Op. Sei Selayur", username: "op.seiselayur", role: "Operator Desa", instansi: "Desa Sei Selayur", status: "Aktif", loginTerakhir: "2 jam lalu", password: "selayur2026" },
  { id: "u3", nama: "Op. Talang Kelapa", username: "op.talangkelapa", role: "Operator Desa", instansi: "Desa Talang Kelapa", status: "Aktif", loginTerakhir: "1 hari lalu", password: "kelapa2026" },
  { id: "u4", nama: "Op. Gandus", username: "op.gandus", role: "Operator Desa", instansi: "Desa Gandus", status: "Nonaktif", loginTerakhir: "14 hari lalu", password: "gandus2026" }
];

export const INITIAL_LOG: LogAktivitas[] = [
  { id: "l1", tag: "LOGIN", badgeClass: "bg-green-light text-green-dark", action: "<strong>admin.kec</strong> masuk ke sistem dan memperbarui instansi", user: "Admin Kecamatan", time: "Baru saja" },
  { id: "l2", tag: "TAMBAH", badgeClass: "bg-teal-light text-teal-dark", action: "<strong>op.seiselayur</strong> menambahkan produk baru 'Beras Ramos'", user: "Op. Sei Selayur", time: "2 jam lalu" },
  { id: "l3", tag: "UBAH", badgeClass: "bg-gold-light text-gold-dark", action: "<strong>op.talangkelapa</strong> memperbarui data monografi kependudukan", user: "Op. Talang Kelapa", time: "4 jam lalu" },
  { id: "l4", tag: "VALIDASI", badgeClass: "bg-plum-light text-plum", action: "<strong>admin.kec</strong> memvalidasi status web aktif Desa Plaju", user: "Admin Kecamatan", time: "6 jam lalu" },
  { id: "l5", tag: "HAPUS", badgeClass: "bg-clay-light text-clay-dark", action: "<strong>admin.kec</strong> menghapus log lama operator dinonaktifkan", user: "Admin Kecamatan", time: "Kemarin" }
];
