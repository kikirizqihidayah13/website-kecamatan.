import { useState, FormEvent, useEffect } from "react";
import { Plus, Newspaper, Calendar, Compass, Grid, Sparkles } from "lucide-react";
import { Berita, Agenda, Galeri, Pengguna } from "../types";

interface PageBeritaProps {
  news: Berita[];
  events: Agenda[];
  gallery: Galeri[];
  currentUser?: Pengguna;
  onAddNews: (b: Omit<Berita, "id">) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function PageBerita({ news, events, gallery, currentUser, onAddNews, showToast }: PageBeritaProps) {
  const isOperator = currentUser?.role === "Operator Desa";
  const operatorDesaName = (isOperator && currentUser?.instansi) ? currentUser.instansi.replace("Desa ", "") : "";

  const [activeTab, setActiveTab] = useState<"rekap" | "terbaru" | "kalender" | "galeri">("rekap");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Section 6.3 Agenda Filter States
  const [agendaDateFilter, setAgendaDateFilter] = useState("");
  const [agendaLokasiFilter, setAgendaLokasiFilter] = useState("");
  const [agendaDesaFilter, setAgendaDesaFilter] = useState(operatorDesaName || "");

  const [selectedNews, setSelectedNews] = useState<Berita | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; title: string; meta: string } | null>(null);

  // Add News Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNews, setNewNews] = useState({
    judul: "",
    kategori: "Pembangunan",
    desa: operatorDesaName || "Sei Selayur",
    waktu: "Baru saja",
    status: "Terbit" as "Terbit" | "Draft",
    deskripsi: "",
    foto: "",
  });

  // Sync state if currentUser changes
  useEffect(() => {
    if (isOperator && operatorDesaName) {
      setAgendaDesaFilter(operatorDesaName);
      setNewNews((prev) => ({ ...prev, desa: operatorDesaName }));
    } else {
      setAgendaDesaFilter("");
      setNewNews((prev) => ({ ...prev, desa: "Sei Selayur" }));
    }
  }, [currentUser, isOperator, operatorDesaName]);

  const displayNews = isOperator 
    ? news.filter((n) => n.desa.toLowerCase() === operatorDesaName.toLowerCase() || n.desa === "Semua Desa") 
    : news;

  const filteredNews = displayNews.filter((b) => {
    const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase()) || b.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || b.kategori === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreateNews = (e: FormEvent) => {
    e.preventDefault();
    if (!newNews.judul || !newNews.deskripsi) {
      showToast("warn", "Judul berita dan isi konten wajib diisi!");
      return;
    }
    const fallbackImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80";
    onAddNews({
      ...newNews,
      foto: newNews.foto || fallbackImage,
    });
    setNewNews({
      judul: "",
      kategori: "Pembangunan",
      desa: "Sei Selayur",
      waktu: "Baru saja",
      status: "Terbit",
      deskripsi: "",
      foto: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="page-header mb-4">
        <div className="page-header-top flex justify-between items-start flex-wrap gap-4 mb-3">
          <div className="page-header-left">
            <h2 className="text-2xl font-bold font-serif text-ink">Publikasi, Berita & Agenda</h2>
            <p className="text-xs text-ink-soft">Akses publikasi kegiatan gotong royong, pembangunan desa, dan kalender koordinasi se-kecamatan</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </button>
        </div>
        <div className="motif"></div>
      </div>

      {/* CORE SUBTABS */}
      <div className="tabs border-b border-line flex gap-1 overflow-x-auto">
        {(["rekap", "terbaru", "kalender", "galeri"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab px-4 py-2.5 text-xs font-bold font-serif capitalize border-b-2 cursor-pointer transition-all ${
              activeTab === tab
                ? "border-b-gold text-green-primary bg-white/20"
                : "border-b-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "rekap" ? "Rekap Publikasi" : tab === "terbaru" ? "Berita Terbaru" : tab === "kalender" ? "Kalender Kegiatan" : "Galeri Kegiatan"}
          </button>
        ))}
      </div>

      {/* TAB PANEL 1: REKAP */}
      {activeTab === "rekap" && (
        <div className="card bg-white border border-line rounded-xl shadow-sm overflow-hidden animate-fadeIn">
          <div className="card-header p-4 border-b border-line bg-white flex justify-between items-center">
            <h4 className="font-bold font-serif text-ink text-sm">Status Publikasi Desa</h4>
            <span className="text-xs text-ink-soft">Diperbarui real-time harian</span>
          </div>
          <div className="table-wrap">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-paper border-b border-line">
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider">Nama Desa</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Total Berita</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Terbit</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Draft</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider">Update Terakhir</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Kekerapan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Sei Selayur</td>
                  <td className="p-3 text-center text-xs font-bold">42</td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-green-light text-green-primary px-2.5 py-0.5 rounded-full font-bold">36</span></td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-gold-light text-gold-dark px-2 py-0.5 rounded font-bold">4</span></td>
                  <td className="p-3 text-xs font-mono text-ink-soft">2 jam lalu</td>
                  <td className="p-3 text-center"><span className="badge bg-green-light text-green-primary text-xs px-2.5 py-0.5 rounded-full font-bold">Sangat Aktif</span></td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Talang Kelapa</td>
                  <td className="p-3 text-center text-xs font-bold">38</td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-green-light text-green-primary px-2.5 py-0.5 rounded-full font-bold">31</span></td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-gold-light text-gold-dark px-2 py-0.5 rounded font-bold">5</span></td>
                  <td className="p-3 text-xs font-mono text-ink-soft">4 jam lalu</td>
                  <td className="p-3 text-center"><span className="badge bg-green-light text-green-primary text-xs px-2.5 py-0.5 rounded-full font-bold">Aktif</span></td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Plaju</td>
                  <td className="p-3 text-center text-xs font-bold">55</td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-green-light text-green-primary px-2.5 py-0.5 rounded-full font-bold">50</span></td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-gold-light text-gold-dark px-2 py-0.5 rounded font-bold">3</span></td>
                  <td className="p-3 text-xs font-mono text-ink-soft">6 jam lalu</td>
                  <td className="p-3 text-center"><span className="badge bg-green-light text-green-primary text-xs px-2.5 py-0.5 rounded-full font-bold">Sangat Aktif</span></td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Gandus</td>
                  <td className="p-3 text-center text-xs font-bold">18</td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-green-light text-green-primary px-2.5 py-0.5 rounded-full font-bold">14</span></td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-gold-light text-gold-dark px-2 py-0.5 rounded font-bold">3</span></td>
                  <td className="p-3 text-xs font-mono text-ink-soft">3 hari lalu</td>
                  <td className="p-3 text-center"><span className="badge bg-gold-light text-gold-dark text-xs px-2.5 py-0.5 rounded font-bold font-mono">Kurang Aktif</span></td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Kertapati</td>
                  <td className="p-3 text-center text-xs font-bold">8</td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-green-light text-green-primary px-2.5 py-0.5 rounded-full font-bold">6</span></td>
                  <td className="p-3 text-center text-xs"><span className="badge bg-gold-light text-gold-dark px-2 py-0.5 rounded font-bold">2</span></td>
                  <td className="p-3 text-xs font-mono text-ink-soft">1 minggu lalu</td>
                  <td className="p-3 text-center"><span className="badge bg-clay-light text-clay text-xs px-2.5 py-0.5 rounded font-bold">Tidak Aktif</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB PANEL 2: TERBARU */}
      {activeTab === "terbaru" && (
        <div className="space-y-6 animate-fadeIn">
          {/* SEARCH FOR新闻 */}
          <div className="card bg-white border border-line p-4 rounded-xl shadow-sm flex flex-wrap gap-3 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau isi berita..."
              className="form-control text-xs w-[240px] border border-line-strong p-2 rounded-lg bg-white"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white"
            >
              <option value="">Semua Kategori</option>
              <option value="Pembangunan">Pembangunan</option>
              <option value="Pertanian">Pertanian</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Kesehatan">Kesehatan</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredNews.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedNews(b)}
                className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm hover:scale-102 hover:border-gold transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="h-[120px] bg-paper relative">
                  <img
                    src={b.foto}
                    alt={b.judul}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-primary tracking-wider">{b.kategori}</span>
                    <h4 className="font-serif font-bold text-ink text-xs line-clamp-2 mt-1 leading-snug">
                      {b.judul}
                    </h4>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-t border-paper-deep pt-2 text-ink-soft">
                    <span>{b.desa} · {b.waktu}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${b.status === "Terbit" ? "bg-green-light text-green-primary" : "bg-gold-light text-gold-dark"}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredNews.length === 0 && (
              <div className="col-span-full border border-dashed border-line rounded-xl p-12 text-center text-ink-soft bg-white/50">
                <Compass className="w-8 h-8 opacity-25 mx-auto mb-2" />
                <span>Tidak ada artikel berita ditemukan</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB PANEL 3: KALENDER */}
      {activeTab === "kalender" && (
        <div className="card bg-white border border-line rounded-xl p-4 shadow-sm animate-fadeIn space-y-6">
          <div className="card-header p-2 border-b border-line bg-white mb-2 flex justify-between items-center flex-wrap gap-2">
            <h4 className="font-bold font-serif text-ink text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-green-primary" />
              <span>Agenda Rapat & Koordinasi Terpadu — Juni 2026</span>
            </h4>
            <span className="text-[10px] bg-green-light px-2 py-0.5 rounded-full text-green-primary font-bold">
              Section 6.3 Agenda Filter Lengkap
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MINI CALENDAR - LEFT PANEL */}
            <div className="md:col-span-1 border border-line rounded-xl p-4 bg-paper/50">
              <h5 className="text-[10px] font-extrabold uppercase text-ink mb-3 text-center tracking-wider">Navigasi Tanggal Cepat</h5>
              <div className="grid grid-cols-7 gap-1 text-center font-sans">
                {["M", "S", "S", "R", "K", "J", "S"].map((day, i) => (
                  <span key={i} className="text-[9px] font-bold text-ink-soft py-1">{day}</span>
                ))}
                {/* June 2026 offset */}
                <span className="p-1.5 text-[10px] text-line-strong">31</span>
                {Array.from({ length: 30 }).map((_, idx) => {
                  const currentDayNum = idx + 1;
                  const isToday = currentDayNum === 23;
                  const dateString = `2026-06-${currentDayNum < 10 ? "0" + currentDayNum : currentDayNum}`;
                  const isFiltered = agendaDateFilter === dateString || agendaDateFilter === currentDayNum.toString();
                  const hasEv = events.some((ev) => ev.day === currentDayNum || ev.tanggal === dateString);
                  
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isFiltered) {
                          setAgendaDateFilter("");
                        } else {
                          setAgendaDateFilter(dateString);
                        }
                        showToast("info", `Memfilter agenda tanggal ${dateString}`);
                      }}
                      className={`p-1 text-[10px] font-bold rounded cursor-pointer transition-all ${
                        isToday
                          ? "bg-green-primary text-white"
                          : isFiltered
                          ? "bg-gold text-white"
                          : "bg-white border border-line hover:bg-green-light text-ink"
                      } relative flex flex-col items-center justify-center`}
                    >
                      <span>{currentDayNum}</span>
                      {hasEv && (
                        <span className={`w-1 h-1 rounded-full absolute bottom-0.5 ${isToday || isFiltered ? "bg-white" : "bg-gold"}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-ink-soft text-center mt-3 leading-tight select-none">
                *Klik tanggal berwarna di atas untuk memfilter langsung agenda pada hari tersebut.
              </p>
            </div>

            {/* INTEGRATED SEARCH FILTERS - RIGHT PANELS */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-4 border border-line rounded-xl bg-white space-y-3 shadow-sm">
                <span className="text-[10.5px] font-extrabold uppercase text-ink-soft tracking-wider block border-b pb-1.5 border-paper-deep">
                  Penyaringan Agenda Sesuai Parameter CMS
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-ink block mb-1">Cari Tanggal (YYYY-MM-DD / Hari)</label>
                    <input
                      type="text"
                      value={agendaDateFilter}
                      onChange={(e) => setAgendaDateFilter(e.target.value)}
                      placeholder="Contoh: 2026-06-02 atau 2"
                      className="form-control text-xs w-full border border-line-strong p-2 rounded-lg bg-white text-ink outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink block mb-1">Cari Lokasi / Keterangan</label>
                    <input
                      type="text"
                      value={agendaLokasiFilter}
                      onChange={(e) => setAgendaLokasiFilter(e.target.value)}
                      placeholder="Nama balai, pendopo, RT..."
                      className="form-control text-xs w-full border border-line-strong p-2 rounded-lg bg-white text-ink outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink block mb-1">Pilih Desa Pengirim</label>
                    <select
                      value={agendaDesaFilter}
                      onChange={(e) => setAgendaDesaFilter(e.target.value)}
                      className="form-control text-xs w-full border border-line-strong p-2 rounded-lg bg-white text-ink outline-none font-bold"
                    >
                      <option value="">Semua Desa</option>
                      <option value="Sei Selayur">Sei Selayur</option>
                      <option value="Talang Kelapa">Talang Kelapa</option>
                      <option value="Plaju">Plaju</option>
                      <option value="Gandus">Gandus</option>
                      <option value="Kertapati">Kertapati</option>
                      <option value="Sako">Sako</option>
                      <option value="Bukit Lama">Bukit Lama</option>
                      <option value="Kecamatan">Wilayah Kecamatan</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  {(agendaDateFilter || agendaLokasiFilter || agendaDesaFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAgendaDateFilter("");
                        setAgendaLokasiFilter("");
                        setAgendaDesaFilter("");
                        showToast("info", "Filter kegiatan dibersihkan");
                      }}
                      className="text-[10px] font-bold text-plum hover:underline cursor-pointer"
                    >
                      Bersihkan Pencarian ×
                    </button>
                  )}
                </div>
              </div>

              {/* LISTS OF EVENT AGENDAS (FILTERED) */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-ink-soft mr-2">
                  <span>Hasil Filter Kegiatan ({
                    events.filter((ev) => {
                      const dateS = ev.tanggal || `2026-06-${ev.day < 10 ? "0" + ev.day : ev.day}`;
                      const matchDate = !agendaDateFilter || dateS.includes(agendaDateFilter) || ev.day.toString() === agendaDateFilter;
                      const matchLokasi = !agendaLokasiFilter || ev.lokasi.toLowerCase().includes(agendaLokasiFilter.toLowerCase()) || ev.title.toLowerCase().includes(agendaLokasiFilter.toLowerCase()) || ev.keterangan.toLowerCase().includes(agendaLokasiFilter.toLowerCase());
                      const matchDesa = !agendaDesaFilter || ev.desa.toLowerCase() === agendaDesaFilter.toLowerCase();
                      return matchDate && matchLokasi && matchDesa;
                    }).length
                  } kegiatan ditemukan)</span>
                  <span className="text-xs text-green-primary">Daftar Terverifikasi</span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {events
                    .filter((ev) => {
                      const dateS = ev.tanggal || `2026-06-${ev.day < 10 ? "0" + ev.day : ev.day}`;
                      const matchDate = !agendaDateFilter || dateS.includes(agendaDateFilter) || ev.day.toString() === agendaDateFilter;
                      const matchLokasi = !agendaLokasiFilter || ev.lokasi.toLowerCase().includes(agendaLokasiFilter.toLowerCase()) || ev.title.toLowerCase().includes(agendaLokasiFilter.toLowerCase()) || ev.keterangan.toLowerCase().includes(agendaLokasiFilter.toLowerCase());
                      const matchDesa = !agendaDesaFilter || ev.desa.toLowerCase() === agendaDesaFilter.toLowerCase();
                      return matchDate && matchLokasi && matchDesa;
                    })
                    .map((ev) => {
                      const dateS = ev.tanggal || `2026-06-${ev.day < 10 ? "0" + ev.day : ev.day}`;
                      return (
                        <div
                          key={ev.id}
                          className="p-4 rounded-xl border border-line bg-white hover:border-gold transition-all duration-200 shadow-sm space-y-2.5"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-green-primary tracking-wider font-mono">
                                {ev.desa}
                              </span>
                              <h4 className="font-serif font-bold text-xs text-ink mt-0.5">
                                {ev.title}
                              </h4>
                            </div>
                            <span className={`badge font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                              ev.status === "Selesai" ? "bg-green-light text-green-primary" : ev.status === "Hari Ini" ? "bg-gold-light text-gold-dark" : "bg-teal-light text-teal-dark"
                            }`}>
                              ● {ev.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-[11px] text-ink-soft border-t border-paper-deep pt-2">
                            <div>
                              <span className="font-bold text-ink block mb-0.5">Tanggal Acara:</span>
                              <span className="font-mono">{dateS}</span>
                            </div>
                            <div>
                              <span className="font-bold text-ink block mb-0.5">Lokasi Real:</span>
                              <span className="truncate block" title={ev.lokasi}>{ev.lokasi}</span>
                            </div>
                          </div>

                          <div className="bg-paper p-2.5 rounded-lg border border-line">
                            <span className="font-bold text-[10px] text-ink block mb-1">Keterangan Kegiatan:</span>
                            <p className="text-[11px] text-ink-soft leading-relaxed italic">
                              "{ev.keterangan || "Tidak ada rincian keterangan tambahan."}"
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  {events.filter((ev) => {
                    const dateS = ev.tanggal || `2026-06-${ev.day < 10 ? "0" + ev.day : ev.day}`;
                    const matchDate = !agendaDateFilter || dateS.includes(agendaDateFilter) || ev.day.toString() === agendaDateFilter;
                    const matchLokasi = !agendaLokasiFilter || ev.lokasi.toLowerCase().includes(agendaLokasiFilter.toLowerCase()) || ev.title.toLowerCase().includes(agendaLokasiFilter.toLowerCase()) || ev.keterangan.toLowerCase().includes(agendaLokasiFilter.toLowerCase());
                    const matchDesa = !agendaDesaFilter || ev.desa.toLowerCase() === agendaDesaFilter.toLowerCase();
                    return matchDate && matchLokasi && matchDesa;
                  }).length === 0 && (
                    <div className="p-8 border border-dashed border-line rounded-xl text-center text-ink-soft bg-paper/30">
                      Tidak ada agenda rapat/kegiatan yang cocok dengan filter pencarian Anda.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 4: GALERI */}
      {activeTab === "galeri" && (
        <div className="card bg-white border border-line rounded-xl p-4 shadow-sm animate-fadeIn">
          <div className="card-header p-2 border-b border-line bg-white mb-4">
            <h4 className="font-bold font-serif text-ink text-sm">Galeri Dokumentasi Lapangan</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div
                key={g.id}
                onClick={() => setLightbox({ src: g.foto, title: g.title, meta: g.meta })}
                className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm cursor-pointer group hover:-translate-y-1 transition-all duration-200"
              >
                <div className="h-[120px] bg-paper overflow-hidden relative">
                  <img
                    src={g.foto}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-ink text-xs line-clamp-1">{g.title}</h4>
                  <p className="text-[10px] text-ink-soft mt-0.5">{g.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED ARTICLE MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-base text-ink line-clamp-1">{selectedNews.judul}</h3>
                <p className="text-[10px] uppercase font-bold text-ink-soft">{selectedNews.kategori} · Desa {selectedNews.desa}</p>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="w-7 h-7 text-xs font-bold border border-line rounded hover:bg-paper cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="rounded-xl overflow-hidden h-[180px]">
                <img
                  src={selectedNews.foto}
                  alt={selectedNews.judul}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="border-b border-paper-deep pb-2 text-xs text-ink-soft font-mono">
                Diterbitkan: {selectedNews.waktu} · Status: <span className="font-bold text-green-primary">{selectedNews.status}</span>
              </div>
              <p className="text-xs text-ink leading-relaxed font-sans font-medium whitespace-pre-wrap">
                {selectedNews.deskripsi}
              </p>
            </div>
            <div className="p-4 border-t border-line bg-paper flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX DISPLAY */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[1200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-4xl text-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white text-3xl font-extrabold cursor-pointer"
            >
              ✕
            </button>
            <div className="overflow-hidden rounded-xl border border-white/25 max-h-[75vh]">
              <img
                src={lightbox.src}
                className="max-w-full max-h-[75vh] object-contain mx-auto"
                alt="Document Capture"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="text-white font-serif font-bold text-base">{lightbox.title}</h4>
              <p className="text-white/60 text-xs mt-0.5">{lightbox.meta}</p>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEWS WRITING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleCreateNews}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Tulis Berita Baru</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Judul Artikel Berita *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Contoh: Panen Raya Sawah Selayur Melimpah"
                    value={newNews.judul}
                    onChange={(e) => setNewNews({ ...newNews, judul: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Kategori Sektor</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                      value={newNews.kategori}
                      onChange={(e) => setNewNews({ ...newNews, kategori: e.target.value })}
                    >
                      <option value="Pembangunan">Pembangunan</option>
                      <option value="Pertanian">Pertanian</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Kesehatan">Kesehatan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Penerbiat Desa</label>
                    <select
                      disabled={isOperator}
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white disabled:bg-paper disabled:text-ink-soft disabled:cursor-not-allowed font-medium"
                      value={newNews.desa}
                      onChange={(e) => setNewNews({ ...newNews, desa: e.target.value })}
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
                    <label className="text-xs font-bold text-ink block mb-1">Status Draft</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                      value={newNews.status}
                      onChange={(e) => setNewNews({ ...newNews, status: e.target.value as any })}
                    >
                      <option value="Terbit">Terbit Publik</option>
                      <option value="Draft">Simpan Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Koran Publikasi (Waktu)</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: Baru saja, Kemarin"
                      value={newNews.waktu}
                      onChange={(e) => setNewNews({ ...newNews, waktu: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1 font-sans">Deskripsi Laporan Konten Berita *</label>
                  <textarea
                    rows={4}
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none text-ink bg-white font-sans"
                    placeholder="Tulis kronologi kegiatan, lokasi dan pelaksana berita..."
                    value={newNews.deskripsi}
                    onChange={(e) => setNewNews({ ...newNews, deskripsi: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">URL Gambar Foto Jurnalistik</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                    placeholder="https://images.unsplash.com/..."
                    value={newNews.foto}
                    onChange={(e) => setNewNews({ ...newNews, foto: e.target.value })}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Publikasikan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
