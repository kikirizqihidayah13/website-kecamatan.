import { useState, useEffect, ReactNode } from "react";
import {
  PieChart,
  Map,
  Users,
  Compass,
  IdCard,
  Newspaper,
  ShoppingBag,
  Building2,
  Lock,
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronRight,
  Download,
  RefreshCw,
  LogOut,
  Sparkles
} from "lucide-react";

import { Desa, Catatan, Komoditas, Perangkat, Berita, Agenda, Galeri, Produk, Pelapak, Aset, Pengguna, LogAktivitas } from "./types";
import {
  INITIAL_DESA,
  INITIAL_CATATAN,
  INITIAL_KOMODITAS,
  INITIAL_PERANGKAT,
  INITIAL_BERITA,
  INITIAL_AGENDA,
  INITIAL_GALERI,
  INITIAL_PRODUK,
  INITIAL_PELAPAK,
  INITIAL_ASET,
  INITIAL_PENGGUNA,
  INITIAL_LOG
} from "./initialData";

// Import modular extracted page components
import MonitoringMap from "./components/MonitoringMap";
import PageDataDesa from "./components/PageDataDesa";
import PageMonografi from "./components/PageMonografi";
import PageKomoditas from "./components/PageKomoditas";
import PagePerangkat from "./components/PagePerangkat";
import PageBerita from "./components/PageBerita";
import PageLapak from "./components/PageLapak";
import PageAset from "./components/PageAset";
import PagePengguna from "./components/PagePengguna";

export default function App() {
  // Navigation active tab page
  const [activePage, setActivePage] = useState<
    "dashboard" | "data-desa" | "monografi" | "komoditas" | "perangkat" | "berita" | "lapak" | "aset" | "pengguna"
  >("dashboard");

  // Mobile sidebar trigger
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global search input state
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  // Dynamic States for data persistence
  const [villages, setVillages] = useState<Desa[]>(INITIAL_DESA);
  const [notices, setNotices] = useState<Catatan[]>(INITIAL_CATATAN);
  const [commodities, setCommodities] = useState<Komoditas[]>(INITIAL_KOMODITAS);
  const [administrators, setAdministrators] = useState<Perangkat[]>(INITIAL_PERANGKAT);
  const [news, setNews] = useState<Berita[]>(INITIAL_BERITA);
  const [events, setEvents] = useState<Agenda[]>(INITIAL_AGENDA);
  const [gallery, setGallery] = useState<Galeri[]>(INITIAL_GALERI);
  const [products, setProducts] = useState<Produk[]>(INITIAL_PRODUK);
  const [merchants, setMerchants] = useState<Pelapak[]>(INITIAL_PELAPAK);

  // Load building images accurately using the generated files
  const [assets, setAssets] = useState<Aset[]>(() =>
    INITIAL_ASET(
      "/src/assets/images/kantor_desa_plaju_1782196849933.jpg",
      "/src/assets/images/balai_desa_gandus_1782196867307.jpg",
      "/src/assets/images/posyandu_mawar_1782196884912.jpg"
    )
  );
  
  const [users, setUsers] = useState<Pengguna[]>(INITIAL_PENGGUNA);
  const [currentUser, setCurrentUser] = useState<Pengguna>(INITIAL_PENGGUNA[0]);
  const [logs, setLogs] = useState<LogAktivitas[]>(INITIAL_LOG);

  // Selected village detail targeting state
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);

  // Toast array trace state
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "info" | "warn" | "error"; msg: string }[]>([]);

  // Topbar dates initialization
  const [currentDateStr, setCurrentDateNum] = useState("");
  useEffect(() => {
    const d = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    setCurrentDateNum(`${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`);
  }, []);

  // Toast trigger handle function
  const triggerToast = (type: "success" | "info" | "warn" | "error", msg: string) => {
    const id = Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Add Log state function
  const addLogTrace = (tag: string, badgeStyle: string, action: string) => {
    const newLog: LogAktivitas = {
      id: Math.random().toString(36).substring(2, 7),
      tag,
      badgeClass: badgeStyle,
      action,
      user: currentUser ? currentUser.nama : "Admin Kecamatan",
      time: "Baru saja"
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Global search indices data
  const SEARCH_INDEX = [
    { name: "Dashboard Kecamatan", page: "dashboard" as const, desc: "Halaman rekap utama", category: "Menu" },
    { name: "Data Desa & Profil", page: "data-desa" as const, desc: "Rincian silsilah kawasan", category: "Menu" },
    { name: "Monografi Kependudukan", page: "monografi" as const, desc: "Analisa demografis", category: "Menu" },
    { name: "Data Sektor Komoditas", page: "komoditas" as const, desc: "Potensi pertanian perikanan", category: "Menu" },
    { name: "Perangkat Pemerintahan", page: "perangkat" as const, desc: "Aparatur kelurahan", category: "Menu" },
    { name: "Berita Publikasi Desa", page: "berita" as const, desc: "Kumpulan artikel kegiatan", category: "Menu" },
    { name: "Lapak Online UMKM", page: "lapak" as const, desc: "Pasar transaksi komoditas warga", category: "Menu" },
    { name: "Aset & Inventaris", page: "aset" as const, desc: "Tanah, gedung, prasaran", category: "Menu" },
    { name: "Akses Pengguna", page: "pengguna" as const, desc: "Log aktivitas & credentials", category: "Menu" },
    ...villages.map((v) => ({ name: `Desa ${v.nama}`, page: "data-desa" as const, desc: `Kepala: ${v.kepalaDesa}`, category: "Desa" })),
    ...commoditiesDetailSearch()
  ];

  function _renderGlobalSearch(q: string) {
    if (!q.trim()) return [];
    return SEARCH_INDEX.filter((item) => item.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  }

  const handleSelectMapVillage = (villageName: string) => {
    const target = villages.find((v) => v.nama.toLowerCase() === villageName.toLowerCase());
    if (target) {
      setSelectedDesa(target);
      setActivePage("data-desa");
      triggerToast("success", `Menavigasi ke Profil Desa ${villageName}`);
    }
  };

  return (
    <div className="min-h-screen flex text-ink bg-paper">
      
      {/* ===== SIDEBAR NAVIGATION ===== */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[268px] bg-green-dark flex flex-col justify-between z-[1000] border-r border-line-strong transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* LOGO BOX */}
          <div className="p-5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold text-green-dark flex items-center justify-center font-bold text-lg shadow-md">
                <span className="font-serif">S</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-white leading-tight">SIMDES</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-sans font-bold">Kec. Ilir Timur I</p>
              </div>
            </div>
          </div>

          <div className="motif mb-3 opacity-30"></div>

          {/* CHANNELS NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-1">
            <div className="text-[10px] uppercase font-bold text-white/35 px-3 py-1 cursor-default font-sans tracking-widest">Utama</div>
            {_renderNavItem("dashboard", "Dashboard Kecamatan", <PieChart className="w-4 h-4" />)}
            {_renderNavItem("data-desa", "Data Desa", <Map className="w-4 h-4" />, villages.length)}
            
            <div className="text-[10px] uppercase font-bold text-white/35 px-3 py-3 cursor-default font-sans tracking-widest select-none">Profil & Data</div>
            {_renderNavItem("monografi", "Profil & Monografi", <Users className="w-4 h-4" />)}
            {_renderNavItem("komoditas", "Data Komoditas", <Compass className="w-4 h-4" />, commodities.length)}
            {_renderNavItem("perangkat", "Perangkat Desa", <IdCard className="w-4 h-4" />, administrators.length)}

            <div className="text-[10px] uppercase font-bold text-white/35 px-3 py-3 cursor-default font-sans tracking-widest select-none">Publikasi</div>
            {_renderNavItem("berita", "Berita & Kegiatan", <Newspaper className="w-4 h-4" />, news.length)}
            {_renderNavItem("lapak", "Lapak Desa", <ShoppingBag className="w-4 h-4" />, products.length)}

            <div className="text-[10px] uppercase font-bold text-white/35 px-3 py-3 cursor-default font-sans tracking-widest select-none">Infrastruktur</div>
            {_renderNavItem("aset", "Aset Desa", <Building2 className="w-4 h-4" />, assets.length)}

            <div className="text-[10px] uppercase font-bold text-white/35 px-3 py-3 cursor-default font-sans tracking-widest select-none">Sistem</div>
            {_renderNavItem("pengguna", "Pengguna & Akses", <Lock className="w-4 h-4" />)}
          </nav>
        </div>

        {/* SIDEBAR FOOTER USER PROFILE */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 flex items-center justify-between bg-black/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gold text-green-dark font-extrabold text-xs flex items-center justify-center uppercase shrink-0">
              {currentUser.username.substring(0, 2)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white font-serif truncate" title={currentUser.nama}>{currentUser.nama}</h4>
              <p className="text-[10px] text-white/40 truncate" title={currentUser.role === "Operator Desa" ? currentUser.instansi : "Admin Wilayah"}>
                {currentUser.role === "Operator Desa" ? currentUser.instansi : "Admin Wilayah"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentUser(INITIAL_PENGGUNA[0]);
              triggerToast("success", "Kembali ke Sesi Utama Admin Kecamatan");
            }}
            className="text-white/40 hover:text-white cursor-pointer ml-1 shrink-0"
            title="Reset Sesi Utama"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR CLOSURE */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[990] lg:hidden"
        ></div>
      )}

      {/* ===== HEADER & WORKSPACE AREA ===== */}
      <div className="flex-1 lg:pl-[268px] flex flex-col min-w-0">
        
        {/* ===== TOPBAR PANEL ===== */}
        <header className="sticky top-0 right-0 h-[68px] bg-white border-b border-line flex items-center justify-between px-6 z-[900]">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-paper cursor-pointer text-ink"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif font-bold text-lg text-ink hidden sm:block">
              {activePage === "dashboard"
                ? "SIMDES Dashboard"
                : activePage === "data-desa"
                ? "Admin Desa"
                : activePage === "monografi"
                ? "Statistik Penduduk"
                : activePage === "komoditas"
                ? "Komoditas Unggulan"
                : activePage === "perangkat"
                ? "Aparatur Desa"
                : activePage === "berita"
                ? "Publikasi Warga"
                : activePage === "lapak"
                ? "Lapak UMKM"
                : activePage === "aset"
                ? "Kekayaan Desa"
                : "Credentials Keamanan"}
            </h2>
          </div>

          {/* DYNAMIC SEARCH DROPDOWN ENGINE */}
          <div className="relative">
            <div className="flex items-center gap-2 border border-line-strong p-2 rounded-lg bg-paper focus-within:border-gold transition-all w-[180px] sm:w-[240px]">
              <Search className="w-4 h-4 text-ink-soft shrink-0" />
              <input
                type="text"
                placeholder="Cari desa, aparatur, komoditas..."
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                className="text-xs text-ink outline-none bg-transparent w-full"
              />
            </div>

            {searchDropdownOpen && globalSearch.trim().length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-line rounded-xl shadow-xl z-[980] overflow-hidden animate-fadeIn">
                {_renderGlobalSearch(globalSearch).map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActivePage(res.page);
                      setGlobalSearch("");
                      setSearchDropdownOpen(false);
                      triggerToast("info", `Membuka halaman ${res.name}`);
                    }}
                    className="w-full text-left p-3 hover:bg-paper border-b border-paper flex justify-between items-center transition-all cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink font-serif">{res.name}</div>
                      <div className="text-[10px] text-ink-soft">{res.desc}</div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-green-light text-green-primary px-1.5 py-0.5 rounded">
                      {res.category}
                    </span>
                  </button>
                ))}
                {_renderGlobalSearch(globalSearch).length === 0 && (
                  <div className="p-4 text-center text-xs text-ink-soft">
                    Hasil pencarian "{globalSearch}" tidak ditemukan.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TOPBAR NOTIFICATION ACTION CONTROLS */}
          <div className="flex items-center gap-3">


            <div className="text-xs text-ink-soft font-bold font-mono hidden xl:block">
              {currentDateStr}
            </div>
            
            <button
              onClick={() => {
                triggerToast("info", "Laporan SIMDES terverifikasi harian aman!");
              }}
              className="relative p-2 rounded-xl hover:bg-paper text-ink-soft"
              title="Notifikasi Masuk"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-clay border border-white"></span>
            </button>
          </div>
        </header>

        {/* ===== CENTRAL MAIN CONTENT AREA ===== */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB ROUTING COMPONENT CONTAINER */}
          {activePage === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* UPPER BANNER */}
              <div className="page-header mb-4">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-ink">Ringkasan Kecamatan</h2>
                    <p className="text-xs text-ink-soft">Konsolidasi monografi desa, potensi perekonomian komoditas, dan kelayakan aset terpadu Ilir Timur I</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerToast("success", "Laporan PDF terunduh!")}
                      className="btn btn-secondary border border-line bg-white p-2 rounded-xl text-xs font-bold font-serif hover:bg-paper cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4 text-ink-soft" />
                      <span>Ekspor Laporan</span>
                    </button>
                    <button
                      onClick={() => {
                        triggerToast("success", "Sinkronisasi se-kecamatan berhasil!");
                        addLogTrace("VALIDASI", "bg-green-light text-green-primary", "<strong>admin.kec</strong> mereload sinkronisasi radar monografi desa");
                      }}
                      className="btn btn-primary bg-green-primary hover:bg-green-dark text-white p-2 rounded-xl text-xs font-bold font-serif cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Perbarui Data</span>
                    </button>
                  </div>
                </div>
                <div className="motif"></div>
              </div>

              {/* HIGH LEVEL STATS BENTO GRID - COMPLIANT WITH ALL 7 STATS DETAILED IN SECTION 1.1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
                {_renderStatCard(villages.length.toString(), "Desa Terdaftar", "bg-green-light text-green-primary", <Map className="w-4 h-4" />, "+0 baru")}
                {_renderStatCard(
                  villages.reduce((sum, v) => sum + parseInt(v.penduduk.replace(/\./g, "") || "0"), 0).toLocaleString("id-ID"),
                  "Total Penduduk (Jiwa)",
                  "bg-teal-light text-teal-dark",
                  <Users className="w-4 h-4" />,
                  "Sensus"
                )}
                {_renderStatCard("13.540", "Kepala Keluarga", "bg-gold-light text-gold-dark", <Building2 className="w-4 h-4" />, "Harian")}
                {_renderStatCard(administrators.length.toString(), "Perangkat Desa", "bg-indigo-light text-indigo-700", <IdCard className="w-4 h-4" />, "Aktif")}
                {_renderStatCard(news.length.toString(), "Berita Publikasi", "bg-plum-light text-plum", <Newspaper className="w-4 h-4" />, "Rilis")}
                {_renderStatCard(products.length.toString(), "Produk Lapak", "bg-amber-light text-amber-800", <ShoppingBag className="w-4 h-4" />, "Warga")}
                {_renderStatCard(assets.length.toString(), "Total Aset Desa", "bg-sky-light text-sky-800", <Building2 className="w-4 h-4" />, "Daerah")}
              </div>

              {/* CORE INTERACTIVE MAP COMPONENT WIREUP */}
              <MonitoringMap
                villages={villages}
                onSelectVillage={handleSelectMapVillage}
                showToast={triggerToast}
              />

              {/* LOWER LOGS AND POTENTIAL WRAPS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* MATRIKS KELENGKAPAN - COMPLIANT WITH SECTION 1.3 DETAILED STATUS MAPPINGS */}
                <div className="card bg-white border border-line rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-ink text-sm border-b border-paper-deep pb-2 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span>Status Kelengkapan & Akurasi Desa</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3.5">
                      {villages.slice(0, 4).map((v) => {
                        // Section 1.3 Exact Mappings
                        let statusText: "Lengkap" | "Perlu Diperbarui" | "Belum Lengkap" = "Lengkap";
                        let statusColor = "bg-green-light text-green-primary";
                        if (v.kelengkapan > 80) {
                          statusText = "Lengkap";
                          statusColor = "bg-green-light text-green-primary";
                        } else if (v.kelengkapan >= 60) {
                          statusText = "Perlu Diperbarui";
                          statusColor = "bg-gold-light text-gold-dark";
                        } else {
                          statusText = "Belum Lengkap";
                          statusColor = "bg-clay-light text-clay";
                        }

                        return (
                          <div
                            key={v.id}
                            onClick={() => {
                              setSelectedDesa(v);
                              setActivePage("data-desa");
                            }}
                            className="bg-paper p-3 rounded-lg border border-line cursor-pointer hover:border-gold hover:-translate-y-0.5 transition-all duration-150"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-ink truncate max-w-[80px]">{v.nama}</span>
                              <span className="text-xs font-mono font-extrabold text-green-primary">{v.kelengkapan}%</span>
                            </div>
                            <div className="bg-paper-deep h-1 rounded-full overflow-hidden">
                              <div className="bg-green-primary h-full" style={{ width: `${v.kelengkapan}%` }}></div>
                            </div>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-3 ${statusColor}`}>
                              {statusText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* REKAP KOMODITAS DESA - COMPLIANT WITH SECTION 1.5 SECTORAL ACCUMULATIONS */}
                <div className="card bg-white border border-line rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-ink text-sm border-b border-paper-deep pb-2 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Rekap Komoditas Desa (Sektoral)</span>
                    </h4>
                    <div className="space-y-2.5">
                      {[
                        { ket: "Pertanian", count: commodities.filter((c) => c.kategori === "Pertanian").length, barBg: "bg-emerald-600" },
                        { ket: "Perkebunan", count: commodities.filter((c) => c.kategori === "Perkebunan").length, barBg: "bg-amber-600" },
                        { ket: "Perikanan", count: commodities.filter((c) => c.kategori === "Perikanan").length, barBg: "bg-cyan-600" },
                        { ket: "Peternakan", count: commodities.filter((c) => c.kategori === "Peternakan").length, barBg: "bg-indigo-600" },
                        { ket: "UMKM / Usaha", count: commodities.filter((c) => c.kategori === "UMKM" || c.kategori === "Industri Rumah Tangga").length, barBg: "bg-violet-600" },
                        { ket: "Kerajinan", count: commodities.filter((c) => c.kategori === "Kerajinan").length, barBg: "bg-rose-600" }
                      ].map((item, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex justify-between items-center mb-0.5 font-bold">
                            <span className="text-ink-soft text-[10.5px]">{item.ket}</span>
                            <span className="text-ink font-mono">{item.count} Komoditas</span>
                          </div>
                          <div className="w-full bg-paper-deep h-1.5 rounded-full overflow-hidden">
                            <div className={`${item.barBg} h-full`} style={{ width: `${Math.min(100, (item.count / Math.max(1, commodities.length)) * 100)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LOG TRACES - COMPLIANT WITH SECTION 1.4 REKAP AKTIVITAS DESA LISTINGS */}
                <div className="card bg-white border border-line rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-ink text-sm border-b border-paper-deep pb-2 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-teal-dark" />
                      <span>Rekap Aktivitas Desa (Terbaru)</span>
                    </h4>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {logs.slice(0, 4).map((lg) => (
                        <div key={lg.id} className="flex justify-between items-start text-xs pb-2.5 border-b border-paper-deep last:border-0 last:pb-0">
                          <div className="flex flex-col gap-1 min-w-0 flex-1 pr-1">
                            <span className="text-[11.5px] text-ink" dangerouslySetInnerHTML={{ __html: lg.action }}></span>
                            <span className="text-[9px] text-ink-soft select-none font-medium">{lg.user} · {lg.time}</span>
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase select-none shrink-0 ${lg.badgeClass}`}>{lg.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activePage === "data-desa" && (
            <PageDataDesa
              villages={villages}
              notices={notices}
              currentUser={currentUser}
              onAddVillage={(v) => {
                const added: Desa = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...v,
                  kelengkapan: 10
                };
                setVillages((prev) => [...prev, added]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Menambahkan profil administrasi baru Desa <strong>${v.nama}</strong>`);
                triggerToast("success", `Desa "${v.nama}" berhasil didaftarkan!`);
              }}
              onAddNotice={(desa, isi, tipe) => {
                const addedNotice: Catatan = {
                  id: Math.random().toString(36).substring(2, 7),
                  desaName: desa,
                  tanggal: "Baru saja",
                  isi,
                  tipe
                };
                setNotices((prev) => [addedNotice, ...prev]);
                triggerToast("success", "Instruksi kecamatan ditambahkan!");
              }}
              selectedDesa={selectedDesa}
              onSetSelectedDesa={setSelectedDesa}
              onSelectPerangkatTab={() => setActivePage("perangkat")}
              showToast={triggerToast}
            />
          )}

          {activePage === "monografi" && (
            <PageMonografi villages={villages} currentUser={currentUser} />
          )}

          {activePage === "komoditas" && (
            <PageKomoditas
              commodities={commodities}
              currentUser={currentUser}
              onAddCommodity={(c) => {
                const added: Komoditas = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...c,
                  icon: "🌱"
                };
                setCommodities((prev) => [...prev, added]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Menambahkan komoditas <strong>${c.nama}</strong>`);
                triggerToast("success", `Komoditas "${c.nama}" berhasil disimpan!`);
              }}
              onToggleCommodityUnggulan={(id) => {
                setCommodities((prev) =>
                  prev.map((c) =>
                    c.id === id ? { ...c, status: c.status === "Unggulan" ? "Reguler" : "Unggulan" } : c
                  )
                );
                const item = commodities.find((c) => c.id === id);
                if (item) {
                  const targetStatus = item.status === "Unggulan" ? "Reguler" : "Unggulan";
                  addLogTrace(
                    "UBAH",
                    "bg-gold-light text-gold-dark",
                    `Mengubah status komoditas <strong>${item.nama}</strong> menjadi <strong>${targetStatus}</strong>`
                  );
                  triggerToast("success", `Status komoditas "${item.nama}" telah diubah menjadi ${targetStatus}`);
                }
              }}
              showToast={triggerToast}
            />
          )}

          {activePage === "perangkat" && (
            <PagePerangkat
              administrators={administrators}
              currentUser={currentUser}
              onAddAdministrator={(p) => {
                const added: Perangkat = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...p
                };
                setAdministrators((prev) => [...prev, added]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Mendaftarkan perangkat baru <strong>${p.nama}</strong> di ${p.desa}`);
                triggerToast("success", `Aparatur "${p.nama}" berhasil disimpan!`);
              }}
              onUpdateAdministrator={(updated) => {
                setAdministrators((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
                addLogTrace("UBAH", "bg-gold-light text-gold-dark", `Memperbarui profil perangkat <strong>${updated.nama}</strong> (${updated.jabatan})`);
                triggerToast("success", `Profil "${updated.nama}" berhasil diperbarui!`);
              }}
              showToast={triggerToast}
            />
          )}

          {activePage === "berita" && (
            <PageBerita
              news={news}
              events={events}
              gallery={gallery}
              currentUser={currentUser}
              onAddNews={(b) => {
                const added: Berita = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...b
                };
                setNews((prev) => [added, ...prev]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Mempublikasikan info rilis Berita Desa <strong>${b.judul}</strong>`);
                triggerToast("success", `Berita "${b.judul}" berhasil dipublikasikan!`);
              }}
              showToast={triggerToast}
            />
          )}

          {activePage === "lapak" && (
            <PageLapak
              products={products}
              merchants={merchants}
              currentUser={currentUser}
              onAddProduct={(p) => {
                const added: Produk = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...p
                };
                setProducts((prev) => [added, ...prev]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Menambahkan produk lapak warga <strong>${p.nama}</strong>`);
                triggerToast("success", `Produk UMKM "${p.nama}" berhasil disimpan!`);
              }}
              showToast={triggerToast}
            />
          )}

          {activePage === "aset" && (
            <PageAset
              assets={assets}
              currentUser={currentUser}
              onAddAsset={(as) => {
                const added: Aset = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...as
                };
                setAssets((prev) => [added, ...prev]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Mendata aset baru kekayaan daerah: <strong>${as.nama}</strong>`);
                triggerToast("success", `Aset "${as.nama}" tersimpan dalam inventaris!`);
              }}
              showToast={triggerToast}
            />
          )}

          {activePage === "pengguna" && (
            <PagePengguna
              users={users}
              logs={logs}
              currentUser={currentUser}
              onSelectCurrentUser={(u) => {
                if (u.status === "Nonaktif") {
                  triggerToast("error", `Gagal beralih: Akun "${u.username}" sedang dinonaktifkan.`);
                  return;
                }
                setCurrentUser(u);
                triggerToast("success", `Berganti sesi ke: ${u.nama} (${u.role})`);
                addLogTrace("LOGIN", "bg-green-light text-green-dark", `<strong>${u.username}</strong> beralih sesi masuk ke sistem sebagai <strong>${u.role}</strong>`);
              }}
              onAddUser={(usr) => {
                const added: Pengguna = {
                  id: Math.random().toString(36).substring(2, 7),
                  ...usr
                };
                setUsers((prev) => [...prev, added]);
                addLogTrace("TAMBAH", "bg-teal-light text-teal-dark", `Mendaftarkan akun operator kredensial baru: <strong>${usr.username}</strong>`);
                triggerToast("success", `Akun Operator "${usr.username}" berhasil terdaftar!`);
              }}
              onUpdateUser={(updated) => {
                setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
                addLogTrace("UBAH", "bg-gold-light text-gold-dark", `Mengubah kredensial detail akun operator <strong>${updated.username}</strong>`);
                if (currentUser.id === updated.id) {
                  setCurrentUser(updated);
                }
                triggerToast("success", `Akun Operator "${updated.username}" berhasil diperbarui!`);
              }}
              onDeleteUser={(id) => {
                const target = users.find((u) => u.id === id);
                if (!target) return;
                setUsers((prev) => prev.filter((u) => u.id !== id));
                addLogTrace("HAPUS", "bg-clay-light text-clay-dark", `Menghapus akun operator <strong>${target.username}</strong> dari pangkalan data`);
                if (currentUser.id === id) {
                  setCurrentUser(INITIAL_PENGGUNA[0]);
                }
                triggerToast("success", `Akun Operator "${target.username}" berhasil dihapus!`);
              }}
              onToggleUserStatus={(id) => {
                setUsers((prev) =>
                  prev.map((u) => {
                    if (u.id === id) {
                      const updatedStatus = u.status === "Aktif" ? "Nonaktif" : "Aktif";
                      addLogTrace("UBAH", "bg-gold-light text-gold-dark", `Mengubah status operator <strong>${u.username}</strong> menjadi ${updatedStatus}`);
                      if (currentUser.id === id && updatedStatus === "Nonaktif") {
                        setTimeout(() => {
                          setCurrentUser(INITIAL_PENGGUNA[0]);
                        }, 50);
                      }
                      return { ...u, status: updatedStatus };
                    }
                    return u;
                  })
                );
              }}
              onAddLog={(tag, badgeStyle, action) => {
                addLogTrace(tag, badgeStyle, action);
              }}
              showToast={triggerToast}
            />
          )}
        </main>
      </div>

      {/* TOAST SYSTEM ALERTS LISTS */}
      <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-ink text-white/95 px-4.5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fadeIn min-w-[280px]"
          >
            <span className="text-base select-none">
              {t.type === "success" ? "✓" : t.type === "warn" ? "⚠" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            <span className="text-xs font-semibold">{t.msg}</span>
          </div>
        ))}
      </div>

    </div>
  );

  // Stat cards renderer helper
  function _renderStatCard(val: string, title: string, bg: string, icon: ReactNode, trend: string) {
    return (
      <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">{title}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-ink font-serif">{val}</span>
            <span className="text-[10px] font-mono font-bold text-green-primary">{trend}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
          {icon}
        </div>
      </div>
    );
  }

  // Nav items renderer helper
  function _renderNavItem(target: typeof activePage, label: string, icon: ReactNode, count?: number) {
    const active = activePage === target;
    return (
      <button
        onClick={() => {
          setActivePage(target);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
          active
            ? "bg-gold text-green-dark"
            : "text-white/60 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {count !== undefined && (
          <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full font-sans ${active ? "bg-green-dark/15 text-green-dark" : "bg-white/10 text-white/80"}`}>
            {count}
          </span>
        )}
      </button>
    );
  }

  function commoditiesDetailSearch() {
    return commodities.map((c) => ({
      name: c.nama,
      page: "komoditas" as const,
      desc: `Sektor: ${c.kategori}`,
      category: "Komoditas"
    }));
  }
}
