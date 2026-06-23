import { useState, FormEvent } from "react";
import { Plus, Compass, Landmark } from "lucide-react";
import { Aset, Pengguna } from "../types";

interface PageAsetProps {
  assets: Aset[];
  currentUser?: Pengguna;
  onAddAsset: (p: Omit<Aset, "id font">) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function PageAset({ assets, currentUser, onAddAsset, showToast }: PageAsetProps) {
  const [activeTab, setActiveTab] = useState<"tanah" | "bangunan" | "inventaris" | "ringkasan">("tanah");
  const [selectedAsset, setSelectedAsset] = useState<Aset | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Add Asset Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    nama: "",
    tipe: "tanah" as "tanah" | "bangunan" | "inventaris",
    kondisi: "Kondisi Baik" as any,
    spesifikasi: "",
    koordinat: "",
    foto: "",
  });

  const filtered = assets.filter((as) => as.tipe === activeTab);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAsset.nama || !newAsset.spesifikasi) {
      showToast("warn", "Nama aset dan spesifikasi detail wajib diisi!");
      return;
    }
    const defaultPic = newAsset.tipe === "bangunan"
      ? "/src/assets/images/kantor_desa_plaju_1782196849933.jpg"
      : "";

    onAddAsset({
      ...newAsset,
      foto: newAsset.foto || defaultPic,
    });
    setNewAsset({
      nama: "",
      tipe: "tanah",
      kondisi: "Kondisi Baik",
      spesifikasi: "",
      koordinat: "",
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
            <h2 className="text-2xl font-bold font-serif text-ink">Infrastruktur & Aset Desa</h2>
            <p className="text-xs text-ink-soft">Daftar inventaris kekayaan daerah, bidang tanah kas desa, prasarana gedung dan fasilitas sosial se-kecamatan</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Aset Daerah</span>
          </button>
        </div>
        <div className="motif"></div>
      </div>

      {/* CORE SUBTABS */}
      <div className="tabs border-b border-line flex gap-1 overflow-x-auto">
        {(["tanah", "bangunan", "inventaris", "ringkasan"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab px-4 py-2.5 text-xs font-bold font-serif capitalize border-b-2 cursor-pointer transition-all ${
              activeTab === tab
                ? "border-b-gold text-green-primary bg-white/20"
                : "border-b-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "tanah" ? "Bidang Tanah" : tab === "bangunan" ? "Prasarana Bangunan" : tab === "inventaris" ? "Barang Inventaris" : "Ringkasan Kondisi"}
          </button>
        ))}
      </div>

      {/* SUMMARY TOTALS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <span className="w-9 h-9 rounded bg-green-light text-green-primary flex items-center justify-center font-bold text-xs">🏞️</span>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Tanah Kas Desa</h5>
            <p className="text-sm font-bold text-ink">68 Bidang Lahan</p>
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <span className="w-9 h-9 rounded bg-teal-light text-teal-dark flex items-center justify-center font-bold text-xs">🏛️</span>
          <div>
            <h4 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Unit Bangunan Publik</h4>
            <p className="text-sm font-bold text-ink">124 Unit Gedung</p>
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <span className="w-9 h-9 rounded bg-gold-light text-gold-dark flex items-center justify-center font-bold text-xs">💻</span>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Barang Inventaris</h5>
            <p className="text-sm font-bold text-ink">150 Unit Sarana</p>
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <span className="w-9 h-9 rounded bg-clay-light text-clay flex items-center justify-center font-bold text-xs">🛠️</span>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Perlu Perbaikan</h5>
            <p className="text-sm font-bold text-ink">14 Aset Masalah</p>
          </div>
        </div>
      </div>

      {/* RENDER DYNAMIC LIST */}
      {activeTab !== "ringkasan" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
          {filtered.map((as) => (
            <div
              key={as.id}
              onClick={() => setSelectedAsset(as)}
              className="card bg-white border border-line rounded-xl p-4 shadow-sm hover:border-gold hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start text-xs font-mono font-bold text-ink-soft capitalize mb-2 tracking-wider">
                  <span>{as.tipe === "tanah" ? "🏞️ Bidang Lahan" : as.tipe === "bangunan" ? "🏛️ Gedung Konstruksi" : "💻 Inventaris Aktif"}</span>
                </div>

                {/* USER FIRST TURN SPECIFIED REQUIREMENT:
                    "dibagian menu aset desa dibagian bangunan tambahkan gambar bangunannya"
                    We display high quality architectural pictures generated inside the layout. */}
                {as.tipe === "bangunan" && as.foto && (
                  <div
                    className="rounded-lg overflow-hidden h-[120px] border border-line bg-paper mb-3 relative group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImg(as.foto!);
                    }}
                  >
                    <img
                      src={as.foto}
                      alt={as.nama}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-sans font-bold transition-opacity">
                      Perbesar Foto
                    </div>
                  </div>
                )}

                <h4 className="font-serif font-bold text-ink text-sm leading-snug">{as.nama}</h4>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">{as.spesifikasi}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-paper-deep flex flex-wrap gap-2 items-center justify-between">
                <span
                  className={`badge text-[10px] font-bold px-2 py-0.5 rounded ${
                    as.kondisi.includes("Baik") || as.kondisi.includes("Aktif")
                      ? "bg-green-light text-green-primary"
                      : as.kondisi.includes("Rusak Berat")
                      ? "bg-clay-light text-clay"
                      : "bg-gold-light text-gold-dark"
                  }`}
                >
                  {as.kondisi}
                </span>

                {as.koordinat && (
                  <span className="text-[10px] font-mono font-bold text-teal-dark bg-teal-light px-2 py-0.5 rounded-full">
                    GPS: {as.koordinat}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full border border-dashed border-line rounded-xl p-8 text-center text-ink-soft bg-white/50">
              <Compass className="w-8 h-8 opacity-20 mx-auto mb-2" />
              <span>Belum ada aset terdata di kategori ini</span>
            </div>
          )}
        </div>
      ) : (
        /* STATUS RECAPS */
        <div className="card bg-white border border-line rounded-xl p-4 shadow-sm animate-fadeIn">
          <h4 className="font-bold font-serif text-ink text-xs mb-4 uppercase tracking-wider">Rekapitulasi Kondisi Keseluruhan Aset</h4>
          <div className="space-y-4">
            {_renderBarOption("Aktif & Kondisi Sangat Baik", 68, "bg-green-primary")}
            {_renderBarOption("Rusak Ringan (Perlu Penanganan)", 12, "bg-teal-primary")}
            {_renderBarOption("Rusak Berat / Dalam Perbaikan", 4, "bg-clay")}
            {_renderBarOption("Disewakan / Dipinjamkan Sementara", 8, "bg-gold-dark")}
            {_renderBarOption("Lain-Lain / Menganggur", 8, "bg-ink-soft")}
          </div>
        </div>
      )}

      {/* DETAIL MODAL TARGET */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <div className="p-4 border-b border-line bg-paper flex justify-between items-center text-base font-serif font-bold text-ink">
              <span>Detail Aset: {selectedAsset.nama}</span>
              <button
                onClick={() => setSelectedAsset(null)}
                className="w-7 h-7 text-xs border border-line bg-white rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selectedAsset.tipe === "bangunan" && selectedAsset.foto && (
                <div className="rounded-xl overflow-hidden h-[160px] border border-line bg-paper">
                  <img
                    src={selectedAsset.foto}
                    alt={selectedAsset.nama}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="space-y-1.5 text-xs text-ink leading-relaxed">
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Kelompok Aset</span>
                  <span className="font-bold text-ink select-all">{selectedAsset.tipe}</span>
                </div>
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Kondisi Saat Ini</span>
                  <span className="font-bold text-ink">{selectedAsset.kondisi}</span>
                </div>
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Spesifikasi</span>
                  <span className="font-bold text-ink-soft">{selectedAsset.spesifikasi}</span>
                </div>
                {selectedAsset.koordinat && (
                  <div className="flex border-b border-paper-deep py-2">
                    <span className="text-ink-soft w-32 shrink-0">G-Maps Koordinat</span>
                    <span className="font-bold text-teal-dark font-mono bg-teal-light px-2.5 py-0.5 rounded-full">{selectedAsset.koordinat}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-line bg-paper flex justify-end gap-2">
              <button
                onClick={() => setSelectedAsset(null)}
                className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper"
              >
                Tutup Deskripsi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSIZE LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="max-w-3xl text-center space-y-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 text-white hover:text-gold text-2xl font-bold font-mono cursor-pointer"
            >
              ✕
            </button>
            <div className="rounded-2xl border border-white/20 overflow-hidden max-h-[75vh] shadow-2xl">
              <img
                src={lightboxImg}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
                alt="Detailed High Res capture"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/60 text-xs font-sans tracking-wide">Citra Prasarana Gedung Asli Kabupaten IT-I</p>
          </div>
        </div>
      )}

      {/* ADD ASSETS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Tambah Aset Daerah</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Kekayaan Daerah *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Contoh: Gedung Karang Taruna Plaju"
                    value={newAsset.nama}
                    onChange={(e) => setNewAsset({ ...newAsset, nama: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Kategori Aset</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                      value={newAsset.tipe}
                      onChange={(e) => setNewAsset({ ...newAsset, tipe: e.target.value as any })}
                    >
                      <option value="tanah">Tanah Desa</option>
                      <option value="bangunan">Bangunan Gedung</option>
                      <option value="inventaris">Barang Inventaris</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Kondisi Aktif</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white font-bold"
                      value={newAsset.kondisi}
                      onChange={(e) => setNewAsset({ ...newAsset, kondisi: e.target.value as any })}
                    >
                      <option value="Kondisi Baik">Kondisi Baik</option>
                      <option value="Aktif Digunakan">Aktif Digunakan</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                      <option value="Perlu Servis">Perlu Servis</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Spesifikasi Detail Aset *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Contoh: Luas 420m2, 2 Lantai, Besi Optiplex"
                    value={newAsset.spesifikasi}
                    onChange={(e) => setNewAsset({ ...newAsset, spesifikasi: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">GPS Koordinat Sesuai Peta (Opsional)</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                    placeholder="Contoh: -2.9804, 104.7431"
                    value={newAsset.koordinat}
                    onChange={(e) => setNewAsset({ ...newAsset, koordinat: e.target.value })}
                  />
                </div>

                {newAsset.tipe === "bangunan" && (
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">URL Foto Bangunan (Opsional)</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                      placeholder="https://images.unsplash.com/..."
                      value={newAsset.foto}
                      onChange={(e) => setNewAsset({ ...newAsset, foto: e.target.value })}
                    />
                  </div>
                )}
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
                  Simpan Aset Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function _renderBarOption(label: string, percentage: number, color: string) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold text-ink">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
        <div className="bg-paper p-0.5 rounded overflow-hidden">
          <div style={{ width: `${percentage}%` }} className={`h-4 rounded ${color}`}></div>
        </div>
      </div>
    );
  }
}
