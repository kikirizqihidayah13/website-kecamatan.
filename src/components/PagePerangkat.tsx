import { useState, FormEvent, useEffect } from "react";
import { 
  Plus, 
  User, 
  Award, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  Users, 
  FileText, 
  Activity, 
  History, 
  MapPin, 
  Phone, 
  Edit3, 
  Search, 
  Building2, 
  ClipboardList, 
  RotateCw, 
  UserCheck, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { Perangkat, Pengguna } from "../types";

interface PagePerangkatProps {
  administrators: Perangkat[];
  currentUser?: Pengguna;
  onAddAdministrator: (p: Omit<Perangkat, "id">) => void;
  onUpdateAdministrator?: (updated: Perangkat) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function PagePerangkat({ 
  administrators, 
  currentUser, 
  onAddAdministrator, 
  onUpdateAdministrator, 
  showToast 
}: PagePerangkatProps) {
  const isOperator = currentUser?.role === "Operator Desa";
  const operatorDesaName = (isOperator && currentUser?.instansi) ? currentUser.instansi.replace("Desa ", "") : "";

  // Dynamic active tab of the section
  const [activeTab, setActiveTab] = useState<"struktur" | "profil" | "jobdesk" | "status" | "riwayat">("struktur");

  // Filter State
  const [search, setSearch] = useState("");
  const [desaFilter, setDesaFilter] = useState(operatorDesaName || "Sei Selayur");
  const [jabatanFilter, setJabatanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAdmin, setSelectedAdmin] = useState<Perangkat | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Perangkat | null>(null);

  // Add Perangkat Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    nama: "",
    jabatan: "Kepala Desa",
    desa: operatorDesaName || "Sei Selayur",
    hp: "",
    status: "Aktif" as "Aktif" | "Nonaktif" | "Pindah" | "Meninggal" | "Habis Masa Jabatan" | "Diganti",
    periode: "",
    foto: "",
    alamat: ""
  });

  // Jabatan templates / Standar Tupoksi
  const JOBDESK_TEMPLATES = [
    {
      id: "j-kades",
      jabatan: "Kepala Desa",
      tupoksi: "Memimpin penyelenggaraan pemerintahan desa, melaksanakan pembangunan desa, pembinaan kemasyarakatan desa, dan pemberdayaan masyarakat desa.",
      color: "border-l-green-primary bg-green-light/40 text-green-dark",
      tugas: [
        "Menetapkan peraturan desa yang telah disepakati bersama Badan Permusyawaratan Desa (BPD).",
        "Menyusun dan mengajukan rancangan APBDesa untuk dibahas dan ditetapkan bersama.",
        "Membina kehidupan kemasyarakatan dan memelihara ketentraman serta ketertiban masyarakat desa.",
        "Mengembangkan sumber pendapatan desa dan mengelola keuangan desa selaku Pemegang Kekuasaan Pengelolaan Keuangan Desa (PKPKD)."
      ]
    },
    {
      id: "j-sekdes",
      jabatan: "Sekretaris Desa",
      tupoksi: "Membantu Kepala Desa dalam bidang administrasi pemerintahan, penataan ketatausahaan, pengelolaan keuangan, perencanaan, serta pelayanan umum desa.",
      color: "border-l-plum bg-indigo-50/50 text-indigo-950",
      tugas: [
        "Mengoordinasikan perumusan dan penyusunan kebijakan administrasi kelembagaan desa.",
        "Mengatur tata persuratan, kearsipan, penyediaan sarana prasarana, serta administrasi umum.",
        "Menyusun rencana anggaran dan laporan pertanggungjawaban APBDesa secara periodik.",
        "Mengoordinasikan pelaporan tugas para Kepala Seksi (Kasi) dan Kepala Urusan (Kaur)."
      ]
    },
    {
      id: "j-kasi-pem",
      jabatan: "Kasi Pemerintahan",
      tupoksi: "Sebagai unsur pelaksana teknis operasional dalam mengelola urusan administrasi pertanahan, kependudukan, serta ketertiban umum wilayah.",
      color: "border-l-teal-primary bg-teal-50 text-teal-950",
      tugas: [
        "Menyelenggarakan administrasi kependudukan (KK, KTP, Surat Kematian, Perpindahan Penduduk).",
        "Membantu proses pensertifikatan tanah, sengketa batas lahan, dan pencatatan leter C desa.",
        "Mengoordinasikan pembinaan ketentraman dan ketertiban umum RT/RW dan satuan Perlindungan Masyarakat (Linmas).",
        "Melakukan pembinaan kerukunan warga serta penguatan hukum adat setempat."
      ]
    },
    {
      id: "j-kasi-pemg",
      jabatan: "Kasi Kesejahteraan / Pembangunan",
      tupoksi: "Melakukan perencanaan dan pelaksanaan pembangunan fisik prasarana umum, pemberdayaan ekonomi komoditas lokal, dan jaminan sosial.",
      color: "border-l-amber-600 bg-amber-50 text-amber-950",
      tugas: [
        "Mengonsep program pembangunan sanitasi, jalan usaha tani, drainase, dan fasilitas desa.",
        "Mendampingi kelompok tani desa guna optimalisasi hasil panen komoditas pangan unggulan.",
        "Mengoordinasikan penyaluran bantuan sosial nasional/lokal (PKH, BLT Desa) agar tepat sasaran.",
        "Mengawal pemberdayaan pemuda karang taruna dan lembaga pemberdayaan masyarakat desa."
      ]
    },
    {
      id: "j-kaur-keu",
      jabatan: "Kaur Keuangan",
      tupoksi: "Melaksanakan penatausahaan, penerimaan, penyimpanan, penyetoran, dan pertanggungjawaban seluruh transaksi anggaran desa.",
      color: "border-l-sky-600 bg-sky-50 text-sky-950",
      tugas: [
        "Membantu Sekretaris Desa menyiapkan SPP (Surat Permintaan Pembayaran) anggaran belanja.",
        "Mengisi Buku Kas Umum (BKU), Buku Pembantu Pajak, dan pelaporan Siskeudes bulanan.",
        "Melakukan pembayaran terhadap program yang sah dan disetujui Kepala Desa.",
        "Menyiapkan bukti transaksi valid pendukung audit kecamatan."
      ]
    },
    {
      id: "j-kadus",
      jabatan: "Kepala Dusun (Kadus)",
      tupoksi: "Pelaksana kewilayahan di lingkungan dusun yang bertugas mengawal keamanan, tata tertib, serta pembangunan kewilayahan setempat.",
      color: "border-l-coral bg-orange-50 text-orange-950",
      tugas: [
        "Membina ketentraman, keamanan, ketertiban, dan kerukunan warga dusun.",
        "Menggerakkan partisipasi swadaya gotong-royong warga dalam perbaikan fasilitas lingkungan.",
        "Mengawal penyaluran informasi program desa agar didengar oleh seluruh RT/RW di wilayahnya.",
        "Melaporkan kejadian darurat atau konflik warga dusun langsung kepada pemerintah desa."
      ]
    },
    {
      id: "j-rt-rw",
      jabatan: "Ketua RT / RW",
      tupoksi: "Lembaga kemasyarakatan terdekat yang bertugas memelihara kerukunan tetangga, membantu administrasi kependudukan domestik, dan siskamling.",
      color: "border-l-emerald-600 bg-emerald-50 text-emerald-950",
      tugas: [
        "Mengadakan musyawarah warga serta memelihara kerukunan antar keluarga tetangga.",
        "Menerbitkan surat pengantar domestik pendaftaran penduduk atau permohonan dinas sosial.",
        "Mengaktifkan jadwal siskamling/ronda malam guna mitigasi gangguan keamanan.",
        "Menyalurkan aspirasi draf pembangunan lingkup rukun tetangga ke dalam forum Musrenbangdes."
      ]
    }
  ];

  // Riwayat Jabatan logs
  const [riwayats, setRiwayats] = useState([
    {
      id: "r1",
      desa: "Sei Selayur",
      tanggal: "2021-06-15",
      nama: "H. Amir Hamzah",
      jabatan: "Kepala Desa",
      jenis: "Pelantikan",
      keterangan: "Dilantik secara resmi oleh Camat hasil Pilkades Serentak Gelombang II periode bakti 2021-2027."
    },
    {
      id: "r2",
      desa: "Sei Selayur",
      tanggal: "2019-02-10",
      nama: "Dra. Rohani",
      jabatan: "Sekretaris Desa",
      jenis: "Mutasi Tugas",
      keterangan: "Pengangkatan resmi menggantikan sekretaris desa lama yang memasuki masa purna tugas demi menjamin lancarnya administrasi."
    },
    {
      id: "r3",
      desa: "Talang Kelapa",
      tanggal: "2020-04-01",
      nama: "Budi Kurniawan, S.E.",
      jabatan: "Kepala Desa",
      jenis: "Pelantikan",
      keterangan: "Sumpah jabatan Kepala Desa terpilih baru periode bakti 2020-2026 dalam upacara sakral balai desa."
    },
    {
      id: "r4",
      desa: "Sei Selayur",
      tanggal: "2025-01-12",
      nama: "Hendra, S.T.",
      jabatan: "Kasi Pembangunan",
      jenis: "Promosi / Rotasi",
      keterangan: "Dialihkan dari penugasan Kaur Perencanaan ke posisi Kasi Pembangunan demi meningkatkan percepatan program komoditas pangan."
    }
  ]);

  // Form New Riwayat State
  const [newRiwayat, setNewRiwayat] = useState({
    desa: operatorDesaName || "Sei Selayur",
    tanggal: new Date().toISOString().split("T")[0],
    nama: "",
    jabatan: "Kepala Desa",
    jenis: "Pelantikan",
    keterangan: ""
  });

  // Sync village filters
  useEffect(() => {
    if (isOperator && operatorDesaName) {
      setDesaFilter(operatorDesaName);
      setNewAdmin((prev) => ({ ...prev, desa: operatorDesaName }));
      setNewRiwayat((prev) => ({ ...prev, desa: operatorDesaName }));
    }
  }, [currentUser, isOperator, operatorDesaName]);

  const filtered = administrators.filter((p) => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchDesa = !desaFilter || p.desa === desaFilter;
    const matchJabatan = !jabatanFilter || p.jabatan.includes(jabatanFilter);
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchDesa && matchJabatan && matchStatus;
  });

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAdmin.nama || !newAdmin.hp || !newAdmin.periode) {
      showToast("warn", "Seluruh input wajib diisi!");
      return;
    }
    onAddAdministrator(newAdmin);
    
    // Auto insert an entry into timeline log
    const logId = "r-" + Math.random().toString(36).substring(2, 7);
    const logEntry = {
      id: logId,
      desa: newAdmin.desa,
      tanggal: new Date().toISOString().split("T")[0],
      nama: newAdmin.nama,
      jabatan: newAdmin.jabatan,
      jenis: "Pelantikan",
      keterangan: `Mulai aktif ditugaskan sebagai perangkat jabatan ${newAdmin.jabatan} untuk periode ${newAdmin.periode}.`
    };
    setRiwayats((prev) => [logEntry, ...prev]);

    // reset fields
    setNewAdmin({
      nama: "",
      jabatan: "Kepala Desa",
      desa: operatorDesaName || "Sei Selayur",
      hp: "",
      status: "Aktif",
      periode: "",
      foto: "",
      alamat: ""
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (!editingAdmin.nama || !editingAdmin.hp || !editingAdmin.periode) {
      showToast("warn", "Nama, No HP, dan Periode wajib diisi!");
      return;
    }
    
    // Log previous state changes
    const original = administrators.find(a => a.id === editingAdmin.id);
    if (original && original.status !== editingAdmin.status) {
      const logId = "r-" + Math.random().toString(36).substring(2, 7);
      const logEntry = {
        id: logId,
        desa: editingAdmin.desa,
        tanggal: new Date().toISOString().split("T")[0],
        nama: editingAdmin.nama,
        jabatan: editingAdmin.jabatan,
        jenis: "Perubahan Status",
        keterangan: `Perubahan kedudukan operasional dari status semula ${original.status} dialihkan menjadi ${editingAdmin.status}.`
      };
      setRiwayats((prev) => [logEntry, ...prev]);
    }

    if (onUpdateAdministrator) {
      onUpdateAdministrator(editingAdmin);
    }
    setEditingAdmin(null);
  };

  const handleAddRiwayat = (e: FormEvent) => {
    e.preventDefault();
    if (!newRiwayat.nama || !newRiwayat.keterangan) {
      showToast("warn", "Input nama perangkat dan deskripsi riwayat wajib diisi!");
      return;
    }
    const addedLog = {
      id: "r-" + Math.random().toString(36).substring(2, 7),
      ...newRiwayat
    };
    setRiwayats((prev) => [addedLog, ...prev]);
    showToast("success", `Histori mutasi/pergantian untuk "${newRiwayat.nama}" berhasil disimpan!`);
    setNewRiwayat({
      desa: operatorDesaName || desaFilter || "Sei Selayur",
      tanggal: new Date().toISOString().split("T")[0],
      nama: "",
      jabatan: "Kepala Desa",
      jenis: "Pelantikan",
      keterangan: ""
    });
  };

  // Find structure elements specifically in the active village (e.g. Sei Selayur structure visualizer)
  const structuralKades = administrators.find((p) => p.desa === desaFilter && p.jabatan === "Kepala Desa" && p.status === "Aktif");
  const structuralSekdes = administrators.find((p) => p.desa === desaFilter && p.jabatan === "Sekretaris Desa" && p.status === "Aktif");
  const structuralKasis = administrators.filter((p) => p.desa === desaFilter && p.status === "Aktif" && (p.jabatan.includes("Kasi") || p.jabatan.includes("Kaur")));
  const structuralKadus = administrators.filter((p) => p.desa === desaFilter && p.status === "Aktif" && p.jabatan.includes("Dusun"));
  const structuralRTs = administrators.filter((p) => p.desa === desaFilter && p.status === "Aktif" && p.jabatan.toLowerCase().includes("rt"));
  const structuralRWs = administrators.filter((p) => p.desa === desaFilter && p.status === "Aktif" && p.jabatan.toLowerCase().includes("rw"));

  // Check stat totals across current selected village or entire municipality
  const statsDesa = administrators.filter(p => !desaFilter || p.desa === desaFilter);
  const totalAktif = statsDesa.filter(p => p.status === "Aktif").length;
  const totalNonaktif = statsDesa.filter(p => p.status === "Nonaktif").length;
  const totalPindah = statsDesa.filter(p => p.status === "Pindah").length;
  const totalMeninggal = statsDesa.filter(p => p.status === "Meninggal").length;
  const totalHabisMasa = statsDesa.filter(p => p.status === "Habis Masa Jabatan" || p.status === "Diganti").length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12" id="perangkat-page-root">
      
      {/* 1. PAGE HEADER */}
      <div className="page-header relative overflow-hidden py-4" id="header-perangkat">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif text-ink tracking-tight">Perangkat & Struktur Desa</h2>
            <p className="text-xs text-ink-soft mt-1">Struktur kepengurusan jajaran pemerintahan, profil individu desa, tupoksi standar, keaktifan, dan histori administrasi</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            id="btn-add-perangkat"
            className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Perangkat Baru</span>
          </button>
        </div>
        <div className="motif mt-4" />
      </div>

      {/* 2. TAB CONTROLLER LINK BAR (THE 5 CORE MODULES) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-px" id="tab-selectors">
        <button
          onClick={() => setActiveTab("struktur")}
          id="tab-btn-struktur"
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-px ${
            activeTab === "struktur"
              ? "border-green-primary text-green-primary bg-green-light/40 font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep/60"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Struktur Organisasi</span>
        </button>

        <button
          onClick={() => setActiveTab("profil")}
          id="tab-btn-profil"
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-px ${
            activeTab === "profil"
              ? "border-green-primary text-green-primary bg-green-light/40 font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep/60"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profil Perangkat</span>
        </button>

        <button
          onClick={() => setActiveTab("jobdesk")}
          id="tab-btn-jobdesk"
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-px ${
            activeTab === "jobdesk"
              ? "border-green-primary text-green-primary bg-green-light/40 font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep/60"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Job Desk Perangkat</span>
        </button>

        <button
          onClick={() => setActiveTab("status")}
          id="tab-btn-status"
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-px ${
            activeTab === "status"
              ? "border-green-primary text-green-primary bg-green-light/40 font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep/60"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Status Keaktifan</span>
        </button>

        <button
          onClick={() => setActiveTab("riwayat")}
          id="tab-btn-riwayat"
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-px ${
            activeTab === "riwayat"
              ? "border-green-primary text-green-primary bg-green-light/40 font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep/60"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Riwayat Jabatan</span>
        </button>
      </div>

      {/* FILTER CONTROL PANEL BAR (SHARED / FILTER FOR VISUALIZATIONS) */}
      <div className="card bg-white border border-line rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" id="shared-filters">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider font-mono">Wilayah Aktif:</span>
          <select
            value={desaFilter}
            onChange={(e) => setDesaFilter(e.target.value)}
            disabled={isOperator}
            className="form-control text-xs border border-line p-2 rounded-lg bg-white font-bold text-ink hover:border-line-strong outline-none disabled:bg-paper disabled:text-ink-soft disabled:cursor-not-allowed"
          >
            <option value="">Semua Kecamatan</option>
            <option value="Sei Selayur">Desa Sei Selayur</option>
            <option value="Talang Kelapa">Desa Talang Kelapa</option>
            <option value="Plaju">Desa Plaju</option>
            <option value="Gandus">Desa Gandus</option>
            <option value="Kertapati">Desa Kertapati</option>
            <option value="Sako">Desa Sako</option>
            <option value="Bukit Lama">Desa Bukit Lama</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "profil" && (
            <>
              <input
                type="text"
                placeholder="Cari nama aparatur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control text-xs border border-line p-2 rounded-lg bg-white w-40 focus:border-green-primary outline-none"
              />
              <select
                value={jabatanFilter}
                onChange={(e) => setJabatanFilter(e.target.value)}
                className="form-control text-xs border border-line p-2 rounded-lg bg-white font-medium hover:border-line-strong outline-none"
              >
                <option value="">Semua Jabatan</option>
                <option value="Kepala Desa">Kepala Desa</option>
                <option value="Sekretaris Desa">Sekretaris Desa</option>
                <option value="Kasi">Kepala Seksi (Kasi)</option>
                <option value="Kaur">Kepala Urusan (Kaur)</option>
                <option value="Dusun">Dusun (Kadus)</option>
                <option value="RT">Ketua RT</option>
                <option value="RW">Ketua RW</option>
              </select>
            </>
          )}

          {activeTab === "status" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control text-xs border border-line p-2 rounded-lg bg-white font-medium outline-none"
            >
              <option value="">Semua Status Log</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif (Unoccupied)</option>
              <option value="Pindah">Pindah Tugas</option>
              <option value="Meninggal">Meninggal Dunia</option>
              <option value="Habis Masa Jabatan">Habis Masa Jabatan</option>
              <option value="Diganti">Diganti / Diberhentikan</option>
            </select>
          )}

          <div className="text-[10px] font-mono text-ink-soft bg-paper border border-line px-2.5 py-1 rounded-md">
            Total {statsDesa.length} Perangkat Terdaftar di Filter
          </div>
        </div>
      </div>

      {/* --- CONTENT BLOCK FOR TAB 1: STRUKTUR ORGANISASI --- */}
      {activeTab === "struktur" && (
        <div className="card bg-[#FAFDF6] border border-green-primary/20 rounded-2xl p-6 shadow-sm overflow-hidden relative" id="section-struktur-visual">

          <div className="text-center max-w-xl mx-auto mb-8">
            <h4 className="font-bold font-serif text-ink text-base tracking-tight text-center uppercase">
              Visualisasi Hierarki Pemerintahan Desa
            </h4>
            <p className="text-xs text-ink-soft mt-1">
              Bagan struktural kedudukan aktif Pemerintah Desa berdasarkan Permendagri No 84/2015 untuk {desaFilter ? `Desa ${desaFilter}` : "Kecamatan (Silakan pilih filter desa di atas)"}
            </p>
          </div>

          {desaFilter ? (
            <div className="flex flex-col items-center gap-6 select-none">
              
              {/* LEVEL 1: KEPALA DESA */}
              <div className="flex flex-col items-center relative" id="node-kades">
                <div className="text-xs font-bold text-green-primary uppercase font-mono tracking-wider mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Kepala Desa</span>
                </div>
                {structuralKades ? (
                  <div
                    onClick={() => setSelectedAdmin(structuralKades)}
                    className="bg-white border-2 border-green-primary rounded-xl p-4 text-center min-w-[220px] shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="text-sm font-serif font-bold text-ink">{structuralKades.nama}</div>
                    <div className="text-[10px] text-ink-soft mt-1.5 font-mono">{structuralKades.periode}</div>
                    <div className="text-[10px] bg-green-light text-green-primary font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
                      ● Aktif Melayani
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-red-300 rounded-xl p-4 text-center min-w-[200px] bg-red-50 text-xs text-red-700 font-bold">
                    [KOSONG] Kepala Desa Tidak Terdeteksi Aktif
                  </div>
                )}
              </div>

              {/* CONNECT LINE */}
              <div className="w-0.5 h-6 bg-green-primary/30"></div>

              {/* LEVEL 2: SEKRETARIS DESA */}
              <div className="flex flex-col items-center relative" id="node-sekdes">
                <div className="text-[10px] font-bold text-plum uppercase font-mono tracking-wider mb-1.5">
                  Sekretaris Desa (Unsur Pimpinan Staf)
                </div>
                {structuralSekdes ? (
                  <div
                    onClick={() => setSelectedAdmin(structuralSekdes)}
                    className="bg-white border border-line border-l-4 border-l-plum rounded-xl p-3.5 text-center min-w-[200px] shadow-sm cursor-pointer hover:shadow-md transition-all duration-150 hover:-translate-y-0.5"
                  >
                    <div className="text-xs font-bold text-ink">{structuralSekdes.nama}</div>
                    <div className="text-[10px] text-ink-soft mt-1 font-mono">{structuralSekdes.hp}</div>
                    <div className="text-[9px] text-plum font-bold mt-1.5 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">
                      Administrasi Desa
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-line-strong rounded-xl p-3 text-center min-w-[180px] text-xs text-ink-soft bg-paper">
                    Sekdes Belum Dimasukkan
                  </div>
                )}
              </div>

              {/* CONNECT LINE */}
              <div className="w-0.5 h-6 bg-line-strong"></div>

              {/* LEVEL 3: SEKSI-SEKSI (KASI / KAUR) */}
              <div className="flex flex-col items-center w-full" id="node-kasi-kaur">
                <div className="text-[10px] font-bold text-ink-soft uppercase font-mono tracking-wider mb-3">
                  Unsur Pelaksana Tekis (KASI) & Pendukung Staf (KAUR)
                </div>
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                  {structuralKasis.length > 0 ? (
                    structuralKasis.map((ka) => (
                      <div
                        key={ka.id}
                        id={`kasi-kaur-${ka.id}`}
                        onClick={() => setSelectedAdmin(ka)}
                        className="bg-white border border-line rounded-xl p-3 text-center min-w-[150px] max-w-[180px] shadow-xs cursor-pointer hover:border-green-primary transition-all duration-150 border-t-4 border-t-teal-primary hover:-translate-y-1"
                      >
                        <div className="text-[9px] uppercase font-bold text-teal-dark font-mono truncate tracking-wider">{ka.jabatan}</div>
                        <div className="text-xs font-bold text-ink mt-1 truncate">{ka.nama}</div>
                        <div className="text-[9px] text-ink-soft mt-0.5 font-sans italic">{ka.periode}</div>
                      </div>
                    ))
                  ) : (
                    <div className="border border-dashed border-line p-3 text-center text-xs text-ink-soft rounded-lg bg-paper">
                      Tidak ada Kasi / Kaur aktif yang terdata untuk desa ini.
                    </div>
                  )}
                </div>
              </div>

              {/* CONNECT LINE */}
              <div className="w-0.5 h-6 bg-line-strong"></div>

              {/* LEVEL 4: KEPALA DUSUN */}
              <div className="flex flex-col items-center w-full" id="node-kadus">
                <div className="text-[10px] font-bold text-ink-soft uppercase font-mono tracking-wider mb-3">
                  Unsur Pelaksana Kewilayahan (Kepala Dusun / Kadus)
                </div>
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                  {structuralKadus.length > 0 ? (
                    structuralKadus.map((kd) => (
                      <div
                        key={kd.id}
                        id={`kadus-${kd.id}`}
                        onClick={() => setSelectedAdmin(kd)}
                        className="bg-white border border-line rounded-xl p-3 text-center min-w-[130px] max-w-[160px] shadow-xs cursor-pointer hover:bg-green-light/20 hover:border-gold-dark transition-all duration-150 border-t-4 border-t-gold-dark hover:-translate-y-0.5"
                      >
                        <div className="text-[9px] uppercase font-bold text-gold-dark font-mono tracking-wider">{kd.jabatan}</div>
                        <div className="text-xs font-bold text-ink mt-1 truncate">{kd.nama}</div>
                        <div className="text-[9px] text-ink-soft mt-0.5">{kd.hp}</div>
                      </div>
                    ))
                  ) : (
                    <div className="border border-dashed border-line p-3 text-center text-xs text-ink-soft rounded-lg bg-paper">
                      Tidak ada Kepala Dusun aktif yang terdata di desa ini.
                    </div>
                  )}
                </div>
              </div>

              {/* CONNECT LINE */}
              <div className="w-0.5 h-6 bg-green-primary/30"></div>

              {/* LEVEL 5: RT & RW (KEMASYARAKATAN) */}
              <div className="flex flex-col items-center w-full" id="node-rt-rw">
                <div className="text-[10px] font-bold text-green-primary uppercase font-mono tracking-wider mb-2">
                  Lembaga Kemasyarakatan Desa (RT & RW Aktif)
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                  {/* Rukun Warga Panel */}
                  <div className="bg-white border border-line rounded-xl p-3 space-y-2">
                    <div className="text-[9px] font-extrabold uppercase font-mono text-indigo-700 tracking-wider border-b border-paperpb-1 flex justify-between items-center">
                      <span>Struktur Rukun Warga (RW)</span>
                      <span className="text-xs">{(structuralRWs.length > 0) ? `${structuralRWs.length} RW` : "Tersedia secara fungsional"}</span>
                    </div>
                    {structuralRWs.length > 0 ? (
                      <div className="space-y-1.5">
                        {structuralRWs.map((rw) => (
                          <div 
                            key={rw.id}
                            className="bg-paper border border-line-thin rounded px-2.5 py-1 text-xs flex justify-between items-center hover:bg-white cursor-pointer"
                            onClick={() => setSelectedAdmin(rw)}
                          >
                            <span className="font-bold text-ink-soft">{rw.jabatan}</span>
                            <span className="font-serif text-ink">{rw.nama}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-xs text-ink-soft">
                        <div className="bg-paper p-2 rounded text-[10px] italic flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-primary shrink-0" />
                          <span>RW 01 (Fungsional): Diwakili oleh Kadus I</span>
                        </div>
                        <div className="bg-paper p-2 rounded text-[10px] italic flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-primary shrink-0" />
                          <span>RW 02 (Fungsional): Diwakili oleh Kadus II</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rukun Tetangga Panel */}
                  <div className="bg-white border border-line rounded-xl p-3 space-y-2">
                    <div className="text-[9px] font-extrabold uppercase font-mono text-teal-primary tracking-wider border-b border-paper pb-1 flex justify-between items-center">
                      <span>Struktur Rukun Tetangga (RT)</span>
                      <span className="text-xs">{(structuralRTs.length > 0) ? `${structuralRTs.length} RT Terdata` : "Standar 4 RT Aktif"}</span>
                    </div>
                    {structuralRTs.length > 0 ? (
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                        {structuralRTs.map((rt) => (
                          <div 
                            key={rt.id}
                            className="bg-paper border border-line-thin rounded px-2.5 py-1 text-xs flex justify-between items-center hover:bg-white cursor-pointer"
                            onClick={() => setSelectedAdmin(rt)}
                          >
                            <span className="font-bold text-ink-soft">{rt.jabatan}</span>
                            <span className="font-serif text-ink">{rt.nama}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-[10px] text-ink-soft">
                        <div className="bg-paper p-2 rounded flex justify-between">
                          <span>Ketua RT 01 (Binaan Dusun I)</span>
                          <span className="font-bold text-ink">Bambang S.</span>
                        </div>
                        <div className="bg-paper p-2 rounded flex justify-between">
                          <span>Ketua RT 02 (Binaan Dusun I)</span>
                          <span className="font-bold text-ink">Sri Hartati</span>
                        </div>
                        <div className="bg-paper p-2 rounded flex justify-between">
                          <span>Ketua RT 03 (Binaan Dusun II)</span>
                          <span className="font-bold text-ink">M. Anwar</span>
                        </div>
                        <div className="bg-paper p-2 rounded flex justify-between">
                          <span>Ketua RT 04 (Binaan Dusun III)</span>
                          <span className="font-bold text-ink">Dewi Lestari</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-xs text-ink-soft">
              Silakan pilih salah satu desa spesifik di panel penyaring di atas untuk melihat struktur organigram yang komprehensif.
            </div>
          )}
        </div>
      )}

      {/* --- CONTENT BLOCK FOR TAB 2: PROFIL PERANGKAT --- */}
      {activeTab === "profil" && (
        <div className="space-y-4" id="section-profil-list">
          <div className="flex justify-between items-center" id="profil-results-summary">
            <h3 className="text-sm font-bold font-serif text-ink uppercase tracking-wider">
              Aparatur Desa Terdaftar ({filtered.length} Terdata)
            </h3>
            <span className="text-[10px] text-ink-soft font-mono">
              Menampilkan nama, kontak, alamat, masa jabatan dan status legal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="profil-grid">
            {filtered.map((p) => (
              <div
                key={p.id}
                id={`profil-card-${p.id}`}
                className="card bg-white border border-line rounded-xl p-4 shadow-xs hover:shadow-sm hover:border-green-primary/50 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    {/* AVATAR IMAGE OR INITIATIVE BADGE */}
                    {p.foto ? (
                      <img 
                        src={p.foto} 
                        alt={p.nama} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-line" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#EAF2E0] text-[#4F6D30] font-bold text-sm tracking-widest flex items-center justify-center shrink-0 shadow-xs">
                        {p.nama.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2)}
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[9px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded bg-paper border border-line-strong text-ink-soft leading-none">
                          {p.jabatan}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0 ${
                          p.status === "Aktif" 
                            ? "bg-green-light text-green-primary" 
                            : p.status === "Nonaktif" 
                            ? "bg-gray-100 text-gray-400 border border-gray-200"
                            : p.status === "Pindah"
                            ? "bg-blue-50 text-blue-700"
                            : p.status === "Meninggal"
                            ? "bg-red-50 text-red-700/80"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          ● {p.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-ink text-sm font-serif truncate mt-1">{p.nama}</h4>
                      <p className="text-[11px] text-green-primary font-bold mt-0.5">Wilayah: Desa {p.desa}</p>
                    </div>
                  </div>

                  <div className="border-t border-paper my-3 pt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-ink-soft">
                      <Phone className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                      <span className="font-mono">{p.hp || "Tidak tercantum"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink-soft">
                      <Calendar className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                      <span>Tenure: {p.periode || "Belum terset"}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-ink-soft pr-2">
                      <MapPin className="w-3.5 h-3.5 text-ink-soft shrink-0 mt-0.5" />
                      <span className="truncate" title={p.alamat || "Alamat Kantor Desa / Domisili perangkat"}>
                        {p.alamat || "Alamat kantor desa setempat"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-paper pt-3 mt-1">
                  <button
                    onClick={() => setSelectedAdmin(p)}
                    className="flex-1 text-center bg-paper hover:bg-paper-deep text-ink-soft font-bold text-[10px] py-1.5 px-2.5 rounded transition-all"
                  >
                    Detail Profil
                  </button>
                  <button
                    onClick={() => setEditingAdmin(p)}
                    className="bg-[#FAFDF6] hover:bg-green-light border border-green-primary/30 text-green-primary font-bold text-[10px] py-1.5 px-2.5 rounded transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Ubah</span>
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full border border-dashed border-line p-10 text-center text-xs text-ink-soft bg-[#FAFDF6]/50 rounded-xl">
                <Compass className="w-8 h-8 opacity-25 mx-auto mb-2" />
                <span>Tidak ada profil perangkat terdata yang sesuai dengan filter pencarian dan desa dipilih</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CONTENT BLOCK FOR TAB 3: TUPOKSI & JOB DESK TEMPLATE --- */}
      {activeTab === "jobdesk" && (
        <div className="space-y-6 animate-fadeIn" id="section-jobdesk">
          <div className="bg-white border border-line rounded-xl p-5 mb-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-ink mb-1">
              📋 Standarisasi Tugas Pokok & Fungsi (Tupoksi) Jabatan Aparatur Desa
            </h3>
            <p className="text-xs text-ink-soft">
              Template deskripsi tugas baku di bawah ini mengacu pada regulasi administrasi kecamatan. Operator tidak perlu menulis ulang deskripsi tugas karena template ini dapat diimplementasikan otomatis untuk setiap profil perangkat desa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="jobdesk-templates-grid">
            {JOBDESK_TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.id}
                id={`jobdesk-card-${tmpl.id}`}
                className={`border border-line rounded-xl p-5 shadow-xs space-y-3.5 transition-all outline-none border-l-4 ${tmpl.color}`}
              >
                <div>
                  <h4 className="font-bold font-serif text-ink tracking-tight text-sm">
                    {tmpl.jabatan}
                  </h4>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                    <strong>Fungsi Utama:</strong> {tmpl.tupoksi}
                  </p>
                </div>

                <div className="border-t border-paper pt-3 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider">Butir Tugas Pokok:</span>
                  <ul className="space-y-1">
                    {tmpl.tugas.map((t, idx) => (
                      <li key={idx} className="text-xs text-ink flex items-start gap-1.5 leading-relaxed">
                        <span className="text-green-primary shrink-0 font-bold">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CONTENT BLOCK FOR TAB 4: STATUS KEAKTIFAN DASHBOARD --- */}
      {activeTab === "status" && (
        <div className="space-y-6 animate-fadeIn" id="section-status-keaktifan">
          {/* STATS METRIC GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5" id="status-kpi-grid">
            <div className="bg-white border border-line rounded-xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block font-mono">Aktif Bertugas</span>
              <span className="text-2xl font-serif font-extrabold text-green-primary block mt-1">{totalAktif}</span>
              <span className="text-[9px] text-[#4F6D30] font-medium bg-green-light px-1.5 py-0.5 rounded-full inline-block mt-2">Dinas Harian</span>
            </div>
            <div className="bg-white border border-line rounded-xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block font-mono">Status Nonaktif</span>
              <span className="text-2xl font-serif font-extrabold text-gray-500 block mt-1">{totalNonaktif}</span>
              <span className="text-[9px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full inline-block mt-2">Belum Terisi</span>
            </div>
            <div className="bg-white border border-line rounded-xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block font-mono">Pindah Tugas</span>
              <span className="text-2xl font-serif font-extrabold text-indigo-700 block mt-1">{totalPindah}</span>
              <span className="text-[9px] text-blue-800 font-medium bg-blue-50 px-1.5 py-0.5 rounded-full inline-block mt-2">Mutasi Luar</span>
            </div>
            <div className="bg-white border border-line rounded-xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block font-mono">Meninggal Dunia</span>
              <span className="text-2xl font-serif font-extrabold text-red-500 block mt-1">{totalMeninggal}</span>
              <span className="text-[9px] text-red-800 font-medium bg-red-100 px-1.5 py-0.5 rounded-full inline-block mt-2">Penghormatan</span>
            </div>
            <div className="bg-white border border-line rounded-xl p-4 shadow-xs text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block font-mono">Habis Masa / Diganti</span>
              <span className="text-2xl font-serif font-extrabold text-amber-600 block mt-1">{totalHabisMasa}</span>
              <span className="text-[9px] text-amber-800 font-medium bg-amber-50 px-1.5 py-0.5 rounded-full inline-block mt-2">Transisi Jabatan</span>
            </div>
          </div>

          {/* ACTIVE ASSIGNMENT STATUS UPDATER PANEL */}
          <div className="bg-white border border-line rounded-xl overflow-hidden shadow-xs" id="quick-status-editor-table">
            <div className="p-4 bg-paper border-b border-line flex justify-between items-center flex-wrap gap-2">
              <div>
                <h4 className="font-serif font-bold text-sm text-ink">Kontrol Cepat Status Keaktifan Pemerintah Desa</h4>
                <p className="text-[11px] text-ink-soft mt-0.5">Segera tandai atau update status keaktifan aparatur jika terdapat pemberhentian, mutasi, pensiun, atau meninggal dunia.</p>
              </div>
              <span className="text-[10px] text-red-700 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1.2 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Akses Sesuai Peran</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAFDF6]/80 text-[#3C5424] font-bold border-b border-line-strong uppercase font-mono text-[9px] tracking-wider">
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">Jabatan</th>
                    <th className="p-3">Desa</th>
                    <th className="p-3">No Kontak</th>
                    <th className="p-3">Status Saat Ini</th>
                    <th className="p-3 text-right">Ubah Status Keaktifan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper">
                  {statsDesa.map((p) => (
                    <tr key={p.id} id={`status-row-${p.id}`} className="hover:bg-paper/50 transition-all font-sans">
                      <td className="p-3 font-bold font-serif text-ink">{p.nama}</td>
                      <td className="p-3 text-ink-soft">{p.jabatan}</td>
                      <td className="p-3 font-semibold text-green-primary">Desa {p.desa}</td>
                      <td className="p-3 font-mono text-ink-soft">{p.hp}</td>
                      <td className="p-3">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${
                          p.status === "Aktif" 
                            ? "bg-green-light text-green-primary" 
                            : p.status === "Nonaktif" 
                            ? "bg-gray-100 text-gray-500" 
                            : p.status === "Pindah"
                            ? "bg-blue-50 text-blue-700"
                            : p.status === "Meninggal"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={p.status}
                          onChange={(e) => {
                            if (onUpdateAdministrator) {
                              onUpdateAdministrator({
                                ...p,
                                status: e.target.value as any
                              });
                              // Record history timeline automatically
                              const addedLog = {
                                id: "r-" + Math.random().toString(36).substring(2, 7),
                                desa: p.desa,
                                tanggal: new Date().toISOString().split("T")[0],
                                nama: p.nama,
                                jabatan: p.jabatan,
                                jenis: "Perubahan Status",
                                keterangan: `Memperbarui status keaktifan perangkat menjadi "${e.target.value}" di wilayah kerja Desa ${p.desa}.`
                              };
                              setRiwayats((prev) => [addedLog, ...prev]);
                            }
                          }}
                          className="bg-white border border-line-strong p-1 rounded font-bold text-[10px] text-ink outline-none cursor-pointer focus:border-green-primary w-32"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                          <option value="Pindah">Pindah Tugas</option>
                          <option value="Meninggal">Meninggal Dunia</option>
                          <option value="Habis Masa Jabatan">Habis Masa</option>
                          <option value="Diganti">Diganti</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {statsDesa.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-xs text-ink-soft">
                        Tidak ada berkas perangkat desa terdaftar pada filter wilayah di atas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT BLOCK FOR TAB 5: RIWAYAT / HISTORI JABATAN --- */}
      {activeTab === "riwayat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" id="section-riwayat-jabatan">
          {/* HISTORY LOGGER FORM (COLUMN 1) */}
          <div className="lg:col-span-1" id="riwayat-form-container">
            <div className="card bg-white border border-line rounded-xl p-5 space-y-4 shadow-sm">
              <div>
                <h4 className="font-serif font-bold text-sm text-ink-soft">MUTASI & MUTASI JABATAN</h4>
                <h3 className="text-base font-serif font-bold text-ink mt-0.5">Catat Pergantian Perangkat</h3>
                <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">
                  Gunakan formulir legalitas ini guna mengarsipkan pergantian pejabat, serah terima posisi, masa habis jabatan, ataupun kenaikan kedudukan dinas di kecamatan.
                </p>
              </div>

              <form onSubmit={handleAddRiwayat} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Target Desa</label>
                  <select
                    value={newRiwayat.desa}
                    onChange={(e) => setNewRiwayat({ ...newRiwayat, desa: e.target.value })}
                    disabled={isOperator}
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                  >
                    <option value="Sei Selayur">Sei Selayur</option>
                    <option value="Talang Kelapa">Talang Kelapa</option>
                    <option value="Plaju">Plaju</option>
                    <option value="Gandus">Gandus</option>
                    <option value="Kertapati">Kertapati</option>
                    <option value="Sako">Sako</option>
                    <option value="Bukit Lama">Bukit Lama</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Pilih Jabatan</label>
                    <select
                      value={newRiwayat.jabatan}
                      onChange={(e) => setNewRiwayat({ ...newRiwayat, jabatan: e.target.value })}
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                    >
                      <option value="Kepala Desa">Kepala Desa</option>
                      <option value="Sekretaris Desa">Sekretaris Desa</option>
                      <option value="Kasi Pemerintahan">Kasi Pemerintahan</option>
                      <option value="Kasi Pembangunan">Kasi Pembangunan</option>
                      <option value="Kaur Keuangan">Kaur Keuangan</option>
                      <option value="Kepala Dusun">Kepala Dusun</option>
                      <option value="Ketua RT/RW">Ketua RT / RW</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Jenis Peristiwa</label>
                    <select
                      value={newRiwayat.jenis}
                      onChange={(e) => setNewRiwayat({ ...newRiwayat, jenis: e.target.value })}
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                    >
                      <option value="Pelantikan">Pelantikan</option>
                      <option value="Mutasi Tugas">Mutasi Tugas</option>
                      <option value="Pemberhentian">Pemberhentian</option>
                      <option value="Pensiun">Purna Bakti (Pensiun)</option>
                      <option value="Rotasi Internal">Rotasi Internal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Perangkat Terlibat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sukarno Wijaya, S.IP"
                    value={newRiwayat.nama}
                    onChange={(e) => setNewRiwayat({ ...newRiwayat, nama: e.target.value })}
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white focus:border-green-primary outline-none font-serif"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Tanggal Berlaku SK</label>
                  <input
                    type="date"
                    required
                    value={newRiwayat.tanggal}
                    onChange={(e) => setNewRiwayat({ ...newRiwayat, tanggal: e.target.value })}
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Catatan Keterangan Resmi</label>
                  <textarea
                    rows={3}
                    required
                    maxLength={200}
                    placeholder="Tuliskan alasan serah terima, nomor SK kecamatan jika ada, atau info pelaksana tugas sementara."
                    value={newRiwayat.keterangan}
                    onChange={(e) => setNewRiwayat({ ...newRiwayat, keterangan: e.target.value })}
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white focus:border-green-primary outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs w-full py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  <span>Arsipkan Pergantian Perangkat</span>
                </button>
              </form>
            </div>
          </div>

          {/* CHRONOLOGICAL TIMELINE (COLUMN 2 & 3) */}
          <div className="lg:col-span-2 space-y-4" id="riwayat-timeline-container">
            <div className="flex justify-between items-center" id="riwayat-header-line">
              <h3 className="text-sm font-bold font-serif text-ink uppercase tracking-wider">Histori Turn-over Pemerintahan Desa ({riwayats.length} Catatan)</h3>
              <span className="text-[10px] font-mono text-ink-soft">Urutan Berkas Terbaru</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" id="riwayat-timeline-list">
              {riwayats
                .filter(r => !desaFilter || r.desa === desaFilter)
                .map((r, idx) => (
                  <div 
                    key={r.id} 
                    id={`riwayat-log-${r.id}`}
                    className="bg-white border border-line rounded-xl p-4 shadow-xs relative hover:border-line-strong transition-all"
                  >
                    <div className="flex items-start justify-between gap-3.5 flex-wrap">
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FAFDF6] border border-green-primary/30 flex items-center justify-center shrink-0">
                          <History className="w-4 h-4 text-green-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs font-serif text-ink">{r.nama}</h4>
                          <p className="text-[10px] text-green-primary font-bold">Pemerintah Desa {r.desa}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-ink-soft bg-paper px-2 py-0.5 rounded border border-line">
                          {r.tanggal}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded leading-none ${
                          r.jenis.includes("Pelantikan") || r.jenis.includes("Ubah")
                            ? "bg-green-light text-green-primary"
                            : r.jenis.includes("Rotasi") || r.jenis.includes("Promosi")
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {r.jenis}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs bg-paper border border-line-thin p-2.5 rounded-lg text-ink-soft line-clamp-3">
                      <strong>Jabatan {r.jabatan}:</strong> {r.keterangan}
                    </div>
                  </div>
                ))}

              {riwayats.filter(r => !desaFilter || r.desa === desaFilter).length === 0 && (
                <div className="border border-dashed border-line text-center p-12 text-xs text-ink-soft bg-[#FAFDF6] rounded-xl">
                  Tidak ada catatan histori pergantian untuk Desa {desaFilter} saat ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: PERANGKAT DETAILED VIEW MODAL --- */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-line animate-fadeIn" id="detail-modal-perangkat">
            <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-ink">Profil Lengkap Aparatur</h3>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="w-7 h-7 text-xs font-bold border border-line bg-white hover:bg-paper-deep text-ink-soft rounded-lg cursor-pointer transition-colors"
                aria-label="Tutup Detail"
              >
                ✕
              </button>
            </div>
            <div className="p-5 text-center space-y-4">
              {selectedAdmin.foto ? (
                <img 
                  src={selectedAdmin.foto} 
                  alt={selectedAdmin.nama} 
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-green-primary/30 shadow-md" 
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-green-light text-green-primary flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
                  {selectedAdmin.nama.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2)}
                </div>
              )}
              
              <div>
                <h4 className="text-base font-serif font-bold text-ink">{selectedAdmin.nama}</h4>
                <p className="text-xs text-ink-soft mt-0.5">{selectedAdmin.jabatan}</p>
                <p className="text-xs text-green-primary font-bold mt-1">Pemerintah Desa {selectedAdmin.desa}</p>
              </div>

              <div className="border-t border-b border-paper py-3 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-ink-soft font-medium flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> No. Handphone</span>
                  <span className="font-bold text-ink font-mono">{selectedAdmin.hp || "Tidak tercantum"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-soft font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Masa Jabatan</span>
                  <span className="font-bold text-ink">{selectedAdmin.periode || "Belum ditentukan"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-soft font-medium flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Status Bakti</span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      selectedAdmin.status === "Aktif" ? "bg-green-light text-green-primary" : "bg-gold-light text-gold-dark"
                    }`}
                  >
                    {selectedAdmin.status}
                  </span>
                </div>
                <div className="border-t border-paper pt-2">
                  <span className="text-ink-soft font-medium block mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Alamat Lengkap Berkas</span>
                  <p className="text-ink font-sansleading-relaxed bg-paper p-2 rounded border border-line-thin">
                    {selectedAdmin.alamat || "Alamat kediaman resmi / kantor perwakilan pemerintahan desa setempat"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-line bg-paper flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setEditingAdmin(selectedAdmin);
                  setSelectedAdmin(null);
                }}
                className="btn bg-green-primary hover:bg-green-dark text-white font-bold p-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Data</span>
              </button>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="btn-secondary font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer transition-colors"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT ADMINISTRATOR DETAILS --- */}
      {editingAdmin && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-line animate-fadeIn" id="edit-modal-perangkat">
            <form onSubmit={handleEditSubmit}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Sunting Profil Aparatur Desa</h3>
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="w-7 h-7 text-xs font-bold"
                  aria-label="Tutup Form Edit"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Lengkap Perangkat *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-serif font-bold"
                    value={editingAdmin.nama}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, nama: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Jabatan Struktural</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                      value={editingAdmin.jabatan}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, jabatan: e.target.value })}
                    >
                      <option value="Kepala Desa">Kepala Desa</option>
                      <option value="Sekretaris Desa">Sekretaris Desa</option>
                      <option value="Kasi Pemerintahan">Kasi Pemerintahan</option>
                      <option value="Kasi Pembangunan">Kasi Pembangunan</option>
                      <option value="Kasi Kemasyarakatan">Kasi Kemasyarakatan</option>
                      <option value="Kaur Keuangan">Kaur Keuangan</option>
                      <option value="Kaur Umum">Kaur Umum</option>
                      <option value="Kepala Dusun I">Kepala Dusun I</option>
                      <option value="Kepala Dusun II">Kepala Dusun II</option>
                      <option value="Kepala Dusun III">Kepala Dusun III</option>
                      <option value="Ketua RT 01">Ketua RT 01</option>
                      <option value="Ketua RT 02">Ketua RT 02</option>
                      <option value="Ketua RT 03">Ketua RT 03</option>
                      <option value="Ketua RT 04">Ketua RT 04</option>
                      <option value="Ketua RW 01">Ketua RW 01</option>
                      <option value="Ketua RW 02">Ketua RW 02</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Desa Penugasan</label>
                    <select
                      disabled={isOperator}
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white font-bold disabled:bg-paper disabled:text-ink-soft"
                      value={editingAdmin.desa}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, desa: e.target.value })}
                    >
                      <option value="Sei Selayur">Sei Selayur</option>
                      <option value="Talang Kelapa">Talang Kelapa</option>
                      <option value="Plaju">Plaju</option>
                      <option value="Gandus font-bold">Gandus</option>
                      <option value="Kertapati">Kertapati</option>
                      <option value="Sako">Sako</option>
                      <option value="Bukit Lama">Bukit Lama</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Nomor Kontak (HP) *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                      value={editingAdmin.hp}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, hp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Masa Jabatan Bakti *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      value={editingAdmin.periode}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, periode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Alamat Kediaman / Domisili Resmi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Mayor Zen Gg. Asli No. 44 RT 03"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    value={editingAdmin.alamat || ""}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, alamat: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">URL Foto (Kosongkan jika menggunakan inisial)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                    value={editingAdmin.foto || ""}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, foto: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Status Keaktifan Saat Ini</label>
                  <select
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                    value={editingAdmin.status}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, status: e.target.value as any })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Pindah">Pindah Tugas</option>
                    <option value="Meninggal">Meninggal Dunia</option>
                    <option value="Habis Masa Jabatan">Habis Masa Jabatan</option>
                    <option value="Diganti">Diganti / Diberhentikan</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="btn-secondary font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD ADMINISTRATOR MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-line animate-fadeIn" id="add-modal-perangkat">
            <form onSubmit={handleAddSubmit}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Tambah Perangkat Desa Baru</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 text-xs font-bold"
                  aria-label="Tutup Form Tambah"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-serif"
                    placeholder="Contoh: Sukarno Wijaya, S.IP"
                    value={newAdmin.nama}
                    onChange={(e) => setNewAdmin({ ...newAdmin, nama: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Jabatan Penugasan</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                      value={newAdmin.jabatan}
                      onChange={(e) => setNewAdmin({ ...newAdmin, jabatan: e.target.value })}
                    >
                      <option value="Kepala Desa">Kepala Desa</option>
                      <option value="Sekretaris Desa">Sekretaris Desa</option>
                      <option value="Kasi Pemerintahan">Kasi Pemerintahan</option>
                      <option value="Kasi Pembangunan">Kasi Pembangunan</option>
                      <option value="Kasi Kemasyarakatan">Kasi Kemasyarakatan</option>
                      <option value="Kaur Keuangan">Kaur Keuangan</option>
                      <option value="Kaur Umum">Kaur Umum</option>
                      <option value="Kepala Dusun I">Kepala Dusun I</option>
                      <option value="Kepala Dusun II">Kepala Dusun II</option>
                      <option value="Kepala Dusun III">Kepala Dusun III</option>
                      <option value="Ketua RT 01">Ketua RT 01</option>
                      <option value="Ketua RT 02">Ketua RT 02</option>
                      <option value="Ketua RT 03">Ketua RT 03</option>
                      <option value="Ketua RT 04">Ketua RT 04</option>
                      <option value="Ketua RW 01">Ketua RW 01</option>
                      <option value="Ketua RW 02">Ketua RW 02</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Penugasan Desa Target</label>
                    <select
                      disabled={isOperator}
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white font-bold disabled:bg-paper disabled:text-ink-soft disabled:cursor-not-allowed"
                      value={newAdmin.desa}
                      onChange={(e) => setNewAdmin({ ...newAdmin, desa: e.target.value })}
                    >
                      <option value="Sei Selayur">Sei Selayur</option>
                      <option value="Talang Kelapa">Talang Kelapa</option>
                      <option value="Plaju">Plaju</option>
                      <option value="Gandus">Gandus</option>
                      <option value="Kertapati">Kertapati</option>
                      <option value="Sako">Sako</option>
                      <option value="Bukit Lama">Bukit Lama</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">No. Handphone Kontak *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                      placeholder="0812-7000-xxxx"
                      value={newAdmin.hp}
                      onChange={(e) => setNewAdmin({ ...newAdmin, hp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Masa Periode Tugas *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: 2021–2027"
                      value={newAdmin.periode}
                      onChange={(e) => setNewAdmin({ ...newAdmin, periode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Alamat Domisili Perangkat</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Contoh: Jl. Mayor Zen Gg. Abadi No. 12"
                    value={newAdmin.alamat}
                    onChange={(e) => setNewAdmin({ ...newAdmin, alamat: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">URL Foto (Profil)</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newAdmin.foto}
                    onChange={(e) => setNewAdmin({ ...newAdmin, foto: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Status Aktivitas Awal</label>
                  <select
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white font-medium"
                    value={newAdmin.status}
                    onChange={(e) => setNewAdmin({ ...newAdmin, status: e.target.value as any })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Pindah">Pindah Tugas</option>
                    <option value="Meninggal">Meninggal Dunia</option>
                    <option value="Habis Masa Jabatan">Masa Jabatan Habis</option>
                    <option value="Diganti">Diganti</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
