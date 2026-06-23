import { useState, FormEvent, useEffect } from "react";
import { 
  Plus, 
  Star, 
  Compass, 
  Filter, 
  Search, 
  MapPin, 
  Grid, 
  List, 
  CheckCircle, 
  X, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  Calendar,
  Sparkles
} from "lucide-react";
import { Komoditas, Pengguna } from "../types";

interface PageKomoditasProps {
  commodities: Komoditas[];
  currentUser?: Pengguna;
  onAddCommodity: (c: Omit<Komoditas, "id" | "icon">) => void;
  onToggleCommodityUnggulan?: (id: string) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function PageKomoditas({ 
  commodities, 
  currentUser, 
  onAddCommodity, 
  onToggleCommodityUnggulan, 
  showToast 
}: PageKomoditasProps) {
  const isOperator = currentUser?.role === "Operator Desa";
  const operatorDesaName = (isOperator && currentUser?.instansi) ? currentUser.instansi.replace("Desa ", "") : "";

  // UI state
  const [activeSubTab, setActiveSubTab] = useState<"katalog" | "sebaran">("katalog");
  const [viewType, setViewType] = useState<"grid" | "table">("grid");
  const [sebaranTarget, setSebaranTarget] = useState<string>("Padi Sawah");

  // Filters state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [desaFilter, setDesaFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("");

  const [selectedComm, setSelectedComm] = useState<Komoditas | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New commodity entry state
  const [newComm, setNewComm] = useState({
    nama: "",
    kategori: "Pertanian" as any,
    luas: "",
    produksi: "",
    periode: "",
    desa: operatorDesaName || "",
    status: "Reguler" as "Unggulan" | "Reguler",
    keterangan: "",
    foto: "",
  });

  // Categories list for reporting and filtering
  const categoriesList = [
    { name: "Pertanian", icon: "🌾", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Perkebunan", icon: "🌳", bg: "bg-green-50 text-green-700 border-green-200" },
    { name: "Peternakan", icon: "🐓", bg: "bg-orange-50 text-orange-700 border-orange-200" },
    { name: "Perikanan", icon: "🐟", bg: "bg-sky-50 text-sky-700 border-sky-200" },
    { name: "UMKM", icon: "🛍️", bg: "bg-purple-50 text-purple-700 border-purple-200" },
    { name: "Kerajinan", icon: "🧺", bg: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "Industri Rumah Tangga", icon: "🏭", bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { name: "Jasa", icon: "💼", bg: "bg-rose-50 text-rose-700 border-rose-200" }
  ];

  const listVillages = [
    "Sei Selayur",
    "Talang Kelapa",
    "Plaju",
    "Gandus",
    "Kertapati",
    "Sako",
    "Bukit Lama"
  ];

  // Sync state if currentUser changes
  useEffect(() => {
    if (isOperator && operatorDesaName) {
      setNewComm((prev) => ({ ...prev, desa: operatorDesaName }));
    } else {
      setNewComm((prev) => ({ ...prev, desa: "Sei Selayur" }));
    }
  }, [currentUser, isOperator, operatorDesaName]);

  const displayCommodities = isOperator 
    ? commodities.filter((c) => c.desa.toLowerCase().includes(operatorDesaName.toLowerCase())) 
    : commodities;

  // Handle advanced filtering
  const filtered = displayCommodities.filter((c) => {
    const matchSearch = c.nama.toLowerCase().includes(search.toLowerCase()) || 
                        c.keterangan.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || c.kategori === categoryFilter;
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchDesa = !desaFilter || c.desa.toLowerCase().includes(desaFilter.toLowerCase());
    const matchPeriode = !periodeFilter || c.periode.toLowerCase().includes(periodeFilter.toLowerCase());
    return matchSearch && matchCategory && matchStatus && matchDesa && matchPeriode;
  });

  // Calculate some analytics report metrics for top display panels
  const totalCount = commodities.length;
  const unggulanCount = commodities.filter(c => c.status === "Unggulan").length;
  const categorySummaryCount = (cat: string) => commodities.filter(c => c.kategori === cat).length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComm.nama || !newComm.desa) {
      showToast("warn", "Nama komoditas dan desa asal wajib diisi!");
      return;
    }

    const categoryPhotos: Record<string, string> = {
      Pertanian: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
      Perkebunan: "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=600&q=80",
      Perikanan: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80",
      Peternakan: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80",
      UMKM: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
      Kerajinan: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80",
      "Industri Rumah Tangga": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80",
      Jasa: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
    };

    const defaultImg = categoryPhotos[newComm.kategori] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80";

    onAddCommodity({
      ...newComm,
      foto: newComm.foto || defaultImg,
    });

    setNewComm({
      nama: "",
      kategori: "Pertanian",
      luas: "",
      produksi: "",
      periode: "",
      desa: operatorDesaName || "Sei Selayur",
      status: "Reguler",
      keterangan: "",
      foto: "",
    });
    setShowAddModal(false);
  };

  // Get distinct list of active commodity names for Sebaran target
  const activeCommodityNames = Array.from(new Set(commodities.map(c => c.nama)));

  return (
    <div className="space-y-6 animate-fadeIn pb-12" id="komoditas-root">
      
      {/* 1. PAGE HEADER */}
      <div className="page-header py-4 bg-transparent" id="header-komoditas-pilihan">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <span className="text-emerald-800 text-xs font-extrabold tracking-wider uppercase block mb-1">
              Sektor & Potensi Kecamatan
            </span>
            <h2 className="text-2xl font-bold font-serif text-ink mt-1">Data Komoditas & Potensi Wilayah</h2>
            <p className="text-xs text-ink-soft mt-1">
              Manajemen komoditas unggulan sektor pangan, perkebunan, industri, dan penataan distribusi komoditas desa
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            id="btn-tambah-komoditas"
            className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all text-xs cursor-pointer shadow-md select-none relative z-20"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Komoditas Baru</span>
          </button>
        </div>

        {/* Decorative lined pattern (garis-garis) directly underneath */}
        <div className="motif mt-4" />
      </div>

      {/* 2. REGIONAL SECTOR REPORT (KPI) - Grouping based on Category */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="komoditas-report-cards">
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-ink-soft uppercase tracking-wider font-bold">Total Komoditas</div>
            <div className="text-xl font-bold text-ink">{totalCount} Item</div>
            <div className="text-[9px] text-green-primary font-bold">Dari seluruh desa</div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-gold-light text-gold-dark rounded-lg shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-[10px] text-ink-soft uppercase tracking-wider font-bold">Potensi Unggulan</div>
            <div className="text-xl font-bold text-ink">{unggulanCount} Potensi</div>
            <div className="text-[9px] text-gold-dark font-bold">Prioritas utama kecamatan</div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-ink-soft uppercase tracking-wider font-bold">Sektor Utama</div>
            <div className="text-xl font-bold text-ink">Pertanian</div>
            <div className="text-[9px] text-teal-dark font-bold">{commodities.filter(c => c.kategori === 'Pertanian').length} Komoditas Terdaftar</div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-ink-soft uppercase tracking-wider font-bold">Sebaran Desa</div>
            <div className="text-xl font-bold text-ink">7 Wilayah</div>
            <div className="text-[9px] text-indigo-600 font-bold">Kontributor Aktif</div>
          </div>
        </div>
      </div>

      {/* 3. TABS BAR SELECTOR */}
      <div className="tabs border-b border-line flex gap-2 select-none" id="komoditas-main-tabs">
        <button
          onClick={() => setActiveSubTab("katalog")}
          id="tab-katalog"
          className={`px-5 py-3 text-xs font-bold font-serif border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "katalog"
              ? "border-gold text-green-primary bg-white font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:border-line"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Katalog & Daftar Komoditas Sektoral</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab("sebaran");
            // Set first dynamic target name if not already set or not present
            if (activeCommodityNames.length > 0 && !activeCommodityNames.includes(sebaranTarget)) {
              setSebaranTarget(activeCommodityNames[0]);
            }
          }}
          id="tab-sebaran"
          className={`px-5 py-3 text-xs font-bold font-serif border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "sebaran"
              ? "border-gold text-green-primary bg-white font-extrabold"
              : "border-transparent text-ink-soft hover:text-ink hover:border-line"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Analisis Sebaran Sentra Komoditas</span>
        </button>
      </div>

      {activeSubTab === "katalog" ? (
        <>
          {/* CATEGORY SELECT PILLS (Reports and filter quick check) */}
          <div className="space-y-2">
            <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-ink-soft flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark fill-gold" />
              Rincian Terdaftar per Sektor (Klik untuk memfilter otomatis)
            </h5>
            <div className="flex flex-wrap gap-2" id="kategori-komoditas-pills">
              <button
                onClick={() => setCategoryFilter("")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                  categoryFilter === ""
                    ? "bg-green-primary text-white border-green-primary shadow-sm"
                    : "bg-white border-line text-ink-soft hover:border-line-strong hover:text-ink"
                }`}
              >
                <span>📦 Semua</span>
                <span className="py-0.2 px-1.5 bg-paper rounded-full text-[9px] font-mono font-bold text-ink">
                  {totalCount}
                </span>
              </button>
              {categoriesList.map((cat) => {
                const count = categorySummaryCount(cat.name);
                const isActive = categoryFilter === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategoryFilter(isActive ? "" : cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? "bg-green-primary text-white border-green-primary shadow-sm"
                        : "bg-white border-line text-ink-soft hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <span className="py-0.2 px-1.5 bg-paper rounded-full text-[9px] font-mono font-bold text-ink-soft">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ADVANCED FILTER PANEL */}
          <div className="card bg-white border border-line rounded-2xl p-5 shadow-sm space-y-4" id="komoditas-filters">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
              <Filter className="w-4 h-4 text-green-primary" />
              <span>Filter dan Pencarian Komoditas</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Type Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-ink-soft" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari komoditas, keterangan..."
                  className="form-control text-xs w-full border border-line pl-8 pr-2.5 py-2 rounded-lg focus:border-green-primary outline-none text-ink bg-white"
                />
              </div>

              {/* Sektor Kategori Dropdown */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-control text-xs w-full border border-line p-2 rounded-lg focus:border-green-primary outline-none bg-white text-ink font-medium"
                >
                  <option value="">Semua Kategori</option>
                  <option value="Pertanian">🌾 Pertanian</option>
                  <option value="Perkebunan">🌳 Perkebunan</option>
                  <option value="Peternakan">🐓 Peternakan</option>
                  <option value="Perikanan">🐟 Perikanan</option>
                  <option value="UMKM">🛍️ UMKM</option>
                  <option value="Kerajinan">🧺 Kerajinan</option>
                  <option value="Industri Rumah Tangga">🏭 Industri Rumah Tangga</option>
                  <option value="Jasa">💼 Jasa</option>
                </select>
              </div>

              {/* Status Unggulan Dropdown */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-control text-xs w-full border border-line p-2 rounded-lg focus:border-green-primary outline-none bg-white text-ink font-medium"
                >
                  <option value="">Semua Status Potensi</option>
                  <option value="Unggulan">⭐ Unggulan Kecamatan/Desa</option>
                  <option value="Reguler">🌱 Reguler / Distribusi Lokal</option>
                </select>
              </div>

              {/* Desa Asal Dropdown */}
              <div>
                <select
                  value={desaFilter}
                  onChange={(e) => setDesaFilter(e.target.value)}
                  className="form-control text-xs w-full border border-line p-2 rounded-lg focus:border-green-primary outline-none bg-white text-ink font-medium"
                >
                  <option value="">Semua Desa</option>
                  {listVillages.map(v => (
                    <option key={v} value={v}>Desa {v}</option>
                  ))}
                </select>
              </div>

              {/* Periode Produksi / Panen Filter */}
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-ink-soft pointer-events-none" />
                <input
                  type="text"
                  value={periodeFilter}
                  onChange={(e) => setPeriodeFilter(e.target.value)}
                  placeholder="Musim: e.g. Sepanjang, Panen"
                  className="form-control text-xs w-full border border-line pl-8 pr-2.5 py-2 rounded-lg focus:border-green-primary outline-none text-ink bg-white font-medium"
                />
              </div>
            </div>

            {/* Clear Filters Panel */}
            {(search || categoryFilter || statusFilter || desaFilter || periodeFilter) && (
              <div className="flex justify-between items-center bg-paper px-3 py-2 rounded-lg text-xs" id="active-filters-info">
                <div className="text-ink-soft text-[11px] font-medium">
                  Menyaring <strong className="text-ink">{filtered.length}</strong> dari <strong className="text-ink">{displayCommodities.length}</strong> komoditas yang cocok.
                </div>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("");
                    setStatusFilter("");
                    setDesaFilter("");
                    setPeriodeFilter("");
                    showToast("info", "Penyaringan data komoditas direset.");
                  }}
                  className="text-green-primary hover:text-green-dark font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Bersihkan Semua Filter</span>
                </button>
              </div>
            )}
          </div>

          {/* VIEW SWITCHER BAR */}
          <div className="flex justify-between items-center text-xs font-bold text-ink" id="view-type-toggles">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span>Katalog Komoditas Sektoral ({filtered.length} ditemukan)</span>
            </div>
            
            <div className="flex bg-paper p-1 rounded-lg border border-line gap-1">
              <button
                onClick={() => setViewType("grid")}
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewType === "grid" 
                    ? "bg-white text-green-primary shadow-sm" 
                    : "text-ink-soft hover:text-ink"
                }`}
                title="Tampilan Grid Kartu"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid Kartu</span>
              </button>
              
              <button
                onClick={() => setViewType("table")}
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewType === "table" 
                    ? "bg-white text-green-primary shadow-sm" 
                    : "text-ink-soft hover:text-ink"
                }`}
                title="Tampilan Daftar Tabel"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabel Detail</span>
              </button>
            </div>
          </div>

          {/* VIEW TYPE 1: GRID KARTU */}
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn" id="komoditas-grid-list">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedComm(c);
                  }}
                  id={`commodity-card-${c.id}`}
                  className="group card bg-white border border-line rounded-xl overflow-hidden shadow-sm hover:border-gold hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="h-[140px] relative overflow-hidden bg-paper">
                    <img
                      src={c.foto}
                      alt={c.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Status Unggulan Star marker clickable directly on card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleCommodityUnggulan) {
                          onToggleCommodityUnggulan(c.id);
                        } else {
                          showToast("info", "Izin merubah status unggulan ditolak.");
                        }
                      }}
                      className="absolute top-2.5 left-2.5 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg border border-line hover:scale-110 active:scale-90 transition-all"
                      title={c.status === "Unggulan" ? "Ubah ke reguler" : "Tandai sebagai Unggulan"}
                    >
                      <Star className={`w-4 h-4 ${c.status === "Unggulan" ? "fill-gold text-gold" : "text-ink-soft"}`} />
                    </button>

                    <span
                      className={`absolute top-2.5 right-2.5 badge text-[10px] font-mono font-extrabold px-2 py-0.5 rounded shadow ${
                        c.status === "Unggulan" 
                          ? "bg-amber-100 text-amber-800 border border-amber-200" 
                          : "bg-white text-ink-soft border border-line"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-green-primary uppercase tracking-wider">{c.kategori}</span>
                        <span className="text-[10px] font-medium text-ink-soft">{c.periode}</span>
                      </div>
                      <h4 className="font-serif font-bold text-ink text-sm group-hover:text-green-primary transition-colors mt-1">
                        {c.nama}
                      </h4>
                      <p className="text-[11px] text-ink-soft line-clamp-2 mt-1 leading-relaxed">
                        {c.keterangan || "Tidak ada rincian keterangan tambahan yang tersedia..."}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-paper-deep flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-ink-soft font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          Desa Asal:
                        </span>
                        <span className="font-bold text-ink max-w-[140px] truncate">{c.desa}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-ink-soft font-medium">Lahan/Unit:</span>
                        <span className="font-mono font-bold text-ink">{c.luas || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-ink-soft font-medium">E. Produksi:</span>
                        <span className="font-mono font-extrabold text-green-primary">{c.produksi || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full border border-dashed border-line rounded-xl p-12 text-center text-ink-soft bg-white/50">
                  <Compass className="w-8 h-8 opacity-20 mx-auto mb-2" />
                  <span>Tidak ada komoditas dengan kriteria filter tersebut</span>
                </div>
              )}
            </div>
          ) : (
            
            /* VIEW TYPE 2: DAFTAR TABEL DETAIL */
            <div className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm animate-fadeIn" id="komoditas-table-list">
              <div className="table-wrap overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="bg-paper border-b border-line text-ink-soft text-[10.5px] uppercase font-extrabold tracking-wider">
                      <th className="p-3">Nama Komoditas</th>
                      <th className="p-3">Sektor Kategori</th>
                      <th className="p-3">Desa Asal</th>
                      <th className="p-3 text-right">Luas / Jumlah Unit</th>
                      <th className="p-3 text-right">Estimasi Produksi</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-paper-deep">
                    {filtered.map((c) => (
                      <tr 
                        key={c.id} 
                        className="hover:bg-paper/40 transition-all cursor-pointer"
                        onClick={() => setSelectedComm(c)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={c.foto}
                              alt={c.nama}
                              className="w-10 h-10 object-cover rounded-lg border border-line shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-ink hover:text-green-primary transition-colors">{c.nama}</div>
                              <div className="text-[10px] text-ink-soft font-mono">Panen: {c.periode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-paper text-ink">
                            {c.kategori}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 font-bold text-ink-soft">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate max-w-[130px]">{c.desa}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-ink">
                          {c.luas || "N/A"}
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-green-primary">
                          {c.produksi || "N/A"}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                            c.status === "Unggulan" 
                              ? "bg-amber-100 text-amber-800 border border-amber-200" 
                              : "bg-paper text-ink-soft border border-line"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedComm(c)}
                              className="btn btn-secondary text-[10px] px-2 py-1 bg-paper hover:bg-paper-deep text-ink font-bold rounded border border-line transition-all"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => {
                                if (onToggleCommodityUnggulan) {
                                  onToggleCommodityUnggulan(c.id);
                                } else {
                                  showToast("info", "Akses ditolak");
                                }
                              }}
                              className="w-7 h-7 rounded bg-white hover:bg-paper border border-line flex items-center justify-center text-gold transition-all"
                              title="Toggled Unggulan"
                            >
                              <Star className={`w-3.5 h-3.5 ${c.status === "Unggulan" ? "fill-gold text-gold" : "text-line-strong hover:text-gold"}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center p-8 text-ink-soft bg-paper/20 border border-dashed border-line">
                          Tidak ada komoditas dengan kriteria filter tersebut
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        
        /* 5. SEBARAN KOMODITAS (Interactive Regional Mapping & Analysis) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" id="komoditas-sebaran-view">
          
          {/* SEBARAN CONTROL COMPONENT (LEFT PANEL) */}
          <div className="card bg-white border border-line rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-ink text-sm border-b border-paper-deep pb-2 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-green-primary" />
                <span>Pilih Komoditas Target</span>
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed mb-4">
                Pilih atau cari komoditas untuk memisahkan dan memetakan kontribusi hulu ke hilir daerah penghasil di tiap dusun desanya.
              </p>

              {/* Quick Preset Selector as mandated in guidelines with examples (padi, karet, kopi, ikan, pisang) */}
              <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1" id="presets-comms">
                {activeCommodityNames.map((name) => {
                  const items = commodities.filter(c => c.nama.toLowerCase().includes(name.toLowerCase()));
                  const count = items.length;
                  const cat = items[0]?.kategori || "Sektor";
                  const icon = items[0]?.kategori === "Pertanian" ? "🌾" : 
                               items[0]?.kategori === "Perkebunan" ? "🌳" : 
                               items[0]?.kategori === "Perikanan" ? "🐟" : "📦";

                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setSebaranTarget(name);
                        showToast("info", `Memetakan sebaran produksi komoditas: ${name}`);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        sebaranTarget.toLowerCase() === name.toLowerCase()
                          ? "bg-emerald-50 border-emerald-400 shadow-sm font-semibold"
                          : "bg-white border-line hover:bg-paper"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-ink truncate">{name}</div>
                          <div className="text-[10px] text-ink-soft truncate">{cat} · {count} Desa penghasil</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-ink-soft shrink-0 ${sebaranTarget.toLowerCase() === name.toLowerCase() ? "translate-x-0.5 text-green-primary" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-paper-deep text-[10px] text-ink-soft font-mono">
              Siklus koordinasi pengawas pangan kecamatan IT I
            </div>
          </div>

          {/* ANALYSIS ANALYSIS & SIMULATION MAPS (RIGHT PANEL) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dynamic statistics calculation based on sebaranTarget */}
            {(() => {
              const matchingComms = commodities.filter((c) => 
                c.nama.toLowerCase().includes(sebaranTarget.toLowerCase())
              );
              const countDesa = matchingComms.length;
              
              // Extract land areas
              const totalHa = matchingComms.reduce((sum, c) => {
                const numeric = parseFloat(c.luas.replace(/[^0-9.]/g, "") || "0");
                return sum + (isNaN(numeric) ? 0 : numeric);
              }, 0);

              const firstMatched = matchingComms[0];
              const mainCentrum = firstMatched ? firstMatched.desa : "-";

              return (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="sebaran-stats">
                    <div className="bg-white border border-line rounded-xl p-4 shadow-sm">
                      <span className="text-[10px] text-ink-soft font-extrabold uppercase tracking-wider block mb-1">
                        Sentrasi Desa Produsen
                      </span>
                      <div className="text-2xl font-serif font-bold text-ink">
                        {countDesa} Desa / Kel
                      </div>
                      <span className="text-[10px] text-green-primary font-bold">Terdaftar Aktif</span>
                    </div>

                    <div className="bg-white border border-line rounded-xl p-4 shadow-sm">
                      <span className="text-[10px] text-ink-soft font-extrabold uppercase tracking-wider block mb-1">
                        Sentra Maksimum
                      </span>
                      <div className="text-lg font-serif font-bold text-ink truncate mt-0.5">
                        {mainCentrum}
                      </div>
                      <span className="text-[10px] text-teal-dark font-mono font-bold">Kawasan Prioritas</span>
                    </div>

                    <div className="bg-white border border-line rounded-xl p-4 shadow-sm">
                      <span className="text-[10px] text-ink-soft font-extrabold uppercase tracking-wider block mb-1">
                        Estimasi Akumulasi Usaha
                      </span>
                      <div className="text-2xl font-serif font-bold text-ink">
                        {totalHa > 0 ? `${totalHa} Ha/Unit` : "Kualitatif"}
                      </div>
                      <span className="text-[10px] text-gold-dark font-bold">Luas Lahan Terdata</span>
                    </div>
                  </div>

                  {/* Table analysis of villages for sebaranTarget */}
                  <div className="card bg-white border border-line rounded-xl p-5 shadow-sm" id="sebaran-table-analisis">
                    <h4 className="font-serif font-bold text-ink text-sm border-b border-paper-deep pb-2 mb-4 uppercase tracking-wider flex justify-between items-center">
                      <span>Daftar Distribusi Penghasil {sebaranTarget}</span>
                      <span className="text-[10px] text-ink-soft tracking-normal font-sans font-bold normal-case">Statistik Sektoral</span>
                    </h4>
                    
                    <div className="table-wrap overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="bg-paper border-b border-line text-ink-soft text-[10px] uppercase font-bold tracking-wider">
                            <th className="p-3">Desa / Kelurahan</th>
                            <th className="p-3">Kategori</th>
                            <th className="p-3 text-right">Luas / Jumlah Unit</th>
                            <th className="p-3 text-right">Volume Produksi</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-paper-deep">
                          {matchingComms.map((c) => (
                            <tr key={c.id} className="hover:bg-paper/30 transition-all">
                              <td className="p-3 font-bold text-ink flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                <span>Desa {c.desa}</span>
                              </td>
                              <td className="p-3 text-ink-soft">{c.kategori}</td>
                              <td className="p-3 text-right font-mono text-ink">{c.luas}</td>
                              <td className="p-3 text-right font-mono font-bold text-green-primary">{c.produksi || "N/A"}</td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                  c.status === "Unggulan" ? "bg-amber-100 text-amber-800" : "bg-paper text-ink-soft"
                                }`}>
                                  ● {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {matchingComms.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center p-8 text-ink-soft bg-paper/20">
                                Tidak ada data sebaran khusus yang terekam untuk komoditas &quot;{sebaranTarget}&quot;.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MAP RADAR SIMULATOR DIAGRAM */}
                  <div className="card bg-white border border-line rounded-xl p-5 shadow-sm" id="peta-sebaran-radar">
                    <h5 className="font-serif font-bold text-xs text-ink mb-1 flex items-center gap-1">
                      <Compass className="w-4 h-4 text-green-primary animate-spin-slow" />
                      <span>Simulasi Lokasi & Pemetaan Kecamatan</span>
                    </h5>
                    <p className="text-[11px] text-ink-soft mb-4">
                      Tanda lingkaran hijau menyala (<span className="text-green-600 font-bold">● Aktif</span>) mengindikasikan desa tersebut memilik sentra produksi komoditas utama <strong className="text-ink">{sebaranTarget}</strong>.
                    </p>
                    
                    {/* Simulated visual board of villages */}
                    <div className="bg-paper p-5 rounded-xl border border-line grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {listVillages.map((villageName) => {
                        const isProducing = matchingComms.some(c => c.desa.toLowerCase().includes(villageName.toLowerCase()));
                        return (
                          <div
                            key={villageName}
                            className={`p-3 rounded-lg border flex flex-col justify-between items-start transition-all ${
                              isProducing 
                                ? "bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-100" 
                                : "bg-white border-line opacity-60"
                            }`}
                          >
                            <span className="text-[10px] font-extrabold text-ink truncate w-full">
                              Desa {villageName}
                            </span>
                            
                            <div className="mt-3 flex items-center gap-1.5 w-full justify-between">
                              <span className={`w-2 h-2 rounded-full ${isProducing ? "bg-green-primary animate-pulse" : "bg-line-strong"}`}></span>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono text-ink-soft text-right">
                                {isProducing ? "Produsen" : "Kosong"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* 3. DETAIL COMMODITY MODAL */}
      {selectedComm && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" id="modal-detail-komoditas">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line animate-fadeIn">
            
            <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink">{selectedComm.nama}</h3>
                  <p className="text-[10px] uppercase font-bold tracking-wider font-sans text-ink-soft">
                    Sektor {selectedComm.kategori}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedComm(null)}
                className="w-7 h-7 text-xs font-bold border border-line bg-white hover:bg-paper-deep text-ink-soft rounded cursor-pointer flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Cover Photo */}
              <div className="rounded-xl overflow-hidden h-[185px] border border-line relative bg-paper">
                <img
                  src={selectedComm.foto}
                  alt={selectedComm.nama}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 right-3 py-1 px-2.5 bg-ink/85 text-white text-[10px] font-mono rounded font-bold backdrop-blur">
                  Musim Panen: {selectedComm.periode || "Sepanjang Tahun"}
                </span>
              </div>

              {/* Rincian Atribut */}
              <div className="space-y-0.5 divide-y divide-paper-deep text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-ink-soft font-medium">Kategori Sektor</span>
                  <span className="font-bold text-ink">{selectedComm.kategori}</span>
                </div>
                
                <div className="flex justify-between py-2.5">
                  <span className="text-ink-soft font-medium">Desa Asal</span>
                  <span className="font-bold text-green-primary flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Desa {selectedComm.desa}</span>
                  </span>
                </div>

                <div className="flex justify-between py-2.5">
                  <span className="text-ink-soft font-medium">Estimasi Volume Produksi</span>
                  <span className="font-mono font-extrabold text-indigo-700">{selectedComm.produksi || "Data estimasi belum dimasukkan"}</span>
                </div>

                <div className="flex justify-between py-2.5">
                  <span className="text-ink-soft font-medium">Luas Lahan atau Jumlah Unit</span>
                  <span className="font-mono font-bold text-ink">{selectedComm.luas || "Belum direkam"}</span>
                </div>

                <div className="flex justify-between py-2.5 items-center">
                  <span className="text-ink-soft font-medium">Potensi Utama (Status Unggulan)</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${
                      selectedComm.status === "Unggulan" ? "bg-amber-100 text-amber-800" : "bg-paper text-ink-soft"
                    }`}>
                      {selectedComm.status}
                    </span>
                    
                    {/* Direct star toggle inside details */}
                    <button
                      onClick={() => {
                        if (onToggleCommodityUnggulan) {
                          onToggleCommodityUnggulan(selectedComm.id);
                          // Sync local state copy for render
                          setSelectedComm({
                            ...selectedComm,
                            status: selectedComm.status === "Unggulan" ? "Reguler" : "Unggulan"
                          });
                        }
                      }}
                      className="px-2 py-1 text-[10px] font-bold border border-line hover:bg-paper rounded transition-all flex items-center gap-1 cursor-pointer text-ink select-none"
                    >
                      <Star className={`w-3 h-3 ${selectedComm.status === "Unggulan" ? "fill-gold text-gold" : "text-ink-soft"}`} />
                      <span>Tandai</span>
                    </button>
                  </div>
                </div>

                {/* Teks Keterangan Ulasan */}
                <div className="pt-4 pb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-green-primary block mb-1">
                    Teks Keterangan Data Komoditas
                  </span>
                  <div className="p-3.5 bg-paper rounded-xl border border-line text-ink leading-relaxed font-sans font-medium text-xs">
                    {selectedComm.keterangan || "Tidak ada rincian penjelasan ataupun keterangan tambahan yang tercantum untuk komoditas potensi ini."}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-line bg-paper flex justify-end gap-2">
              <button
                onClick={() => setSelectedComm(null)}
                className="btn btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD COMMODITY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" id="modal-tambah-komoditas">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-line">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Form Tambah Komoditas Sektoral</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Komoditas / Hasil Usaha *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Contoh: Padi Sawah Gogo, Kopi Semendo"
                    value={newComm.nama}
                    onChange={(e) => setNewComm({ ...newComm, nama: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Sektor Kategori *</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white focus:border-green-primary outline-none"
                      value={newComm.kategori}
                      onChange={(e) => setNewComm({ ...newComm, kategori: e.target.value as any })}
                    >
                      <option value="Pertanian">Pertanian</option>
                      <option value="Perkebunan">Perkebunan</option>
                      <option value="Peternakan">Peternakan</option>
                      <option value="Perikanan">Perikanan</option>
                      <option value="UMKM">UMKM</option>
                      <option value="Kerajinan">Kerajinan</option>
                      <option value="Industri Rumah Tangga">Industri Rumah Tangga</option>
                      <option value="Jasa">Jasa</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Status Potensi</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white focus:border-green-primary outline-none"
                      value={newComm.status}
                      onChange={(e) => setNewComm({ ...newComm, status: e.target.value as any })}
                    >
                      <option value="Reguler">Reguler</option>
                      <option value="Unggulan">Unggulan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Luas Lahan / Jumlah Unit</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: 15 Ha, 45 Pengrajin"
                      value={newComm.luas}
                      onChange={(e) => setNewComm({ ...newComm, luas: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Estimasi Produksi</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: 85 ton/tahun"
                      value={newComm.produksi}
                      onChange={(e) => setNewComm({ ...newComm, produksi: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Desa Asal *</label>
                    <input
                      type="text"
                      required
                      disabled={isOperator}
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none disabled:bg-paper disabled:text-ink-soft disabled:cursor-not-allowed font-medium"
                      placeholder="Contoh: Sei Selayur, Plaju"
                      value={newComm.desa}
                      onChange={(e) => setNewComm({ ...newComm, desa: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Periode Panen Utama</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: April - Juni"
                      value={newComm.periode}
                      onChange={(e) => setNewComm({ ...newComm, periode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Teks Keterangan Data Komoditas *</label>
                  <textarea
                    rows={4}
                    required
                    maxLength={500}
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Jelaskan kualitas, varietas pupuk, keunikan, metode pengolahan serta target pasar secara rinci..."
                    value={newComm.keterangan}
                    onChange={(e) => setNewComm({ ...newComm, keterangan: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1 font-sans">URL Gambar / Foto Komoditas</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none text-ink bg-white font-mono"
                    placeholder="https://images.unsplash.com/..."
                    value={newComm.foto}
                    onChange={(e) => setNewComm({ ...newComm, foto: e.target.value })}
                  />
                  <p className="text-[10px] text-ink-soft mt-1">Kosongkan untuk menggunakan gambar default yang sesuai sektoral.</p>
                </div>
              </div>

              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
                >
                  Simpan Komoditas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
