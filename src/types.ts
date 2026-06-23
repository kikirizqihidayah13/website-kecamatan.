export interface Desa {
  id: string;
  nama: string;
  kode: string;
  kepalaDesa: string;
  penduduk: string;
  statusWeb: "Aktif" | "Draft" | "Belum Aktif" | "Perlu Diperbarui";
  kelengkapan: number;
  catatan: string;
  alamat: string;
  luas: string;
  batas: string;
  visi: string;
}

export interface Catatan {
  id: string;
  desaName: string;
  tanggal: string;
  isi: string;
  tipe: "info" | "warn" | "success";
}

export interface Komoditas {
  id: string;
  nama: string;
  kategori: "Pertanian" | "Perkebunan" | "Peternakan" | "Perikanan" | "UMKM" | "Kerajinan" | "Industri Rumah Tangga" | "Jasa";
  luas: string;
  produksi: string;
  periode: string;
  desa: string;
  status: "Unggulan" | "Reguler";
  keterangan: string;
  foto: string;
  icon: string;
}

export interface Perangkat {
  id: string;
  nama: string;
  jabatan: string;
  desa: string;
  hp: string;
  status: "Aktif" | "Nonaktif" | "Pindah" | "Meninggal" | "Habis Masa Jabatan" | "Diganti";
  periode: string;
  foto?: string;
  alamat?: string;
}

export interface Berita {
  id: string;
  judul: string;
  kategori: string;
  desa: string;
  waktu: string;
  status: "Terbit" | "Draft" | "Arsip" | "Perlu Diperbarui";
  deskripsi: string;
  foto: string;
}

export interface Agenda {
  id: string;
  day: number;
  tanggal: string;
  title: string;
  lokasi: string;
  desa: string;
  status: "Selesai" | "Hari Ini" | "Direncanakan" | "Mendatang";
  keterangan: string;
}

export interface Galeri {
  id: string;
  foto: string;
  title: string;
  meta: string;
}

export interface Produk {
  id: string;
  nama: string;
  harga: string;
  satuan: string;
  pelapak: string;
  desa: string;
  ketersediaan: "Tersedia" | "Terbatas" | "Kosong" | "Tidak Aktif";
  kategori: "pertanian" | "makanan" | "kerajinan" | "perikanan" | "peternakan" | "minuman";
  foto: string;
  deskripsi: string;
  whatsapp: string;
}

export interface Pelapak {
  id: string;
  nama: string;
  usaha: string;
  whatsapp: string;
  desa: string;
  jumlahProduk: string;
  status: "Aktif" | "Terbatas" | "Nonaktif";
}

export interface Aset {
  id: string;
  nama: string;
  tipe: "tanah" | "bangunan" | "inventaris";
  kondisi: "Aktif Digunakan" | "Rusak Ringan" | "Rusak Berat" | "Tidak Digunakan" | "Dipinjamkan" | "Disewakan" | "Perlu Pembaruan";
  spesifikasi: string;
  koordinat?: string;
  foto?: string;
  dokumenPendukung?: string; 
}

export interface Pengguna {
  id: string;
  nama: string;
  username: string;
  role: "Super Admin" | "Admin Kecamatan" | "Operator Desa";
  instansi: string;
  status: "Aktif" | "Nonaktif";
  loginTerakhir: string;
  password?: string;
}

export interface LogAktivitas {
  id: string;
  tag: string;
  badgeClass: string;
  action: string;
  user: string;
  time: string;
}
