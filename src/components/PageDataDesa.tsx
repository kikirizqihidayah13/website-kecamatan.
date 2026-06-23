import { useState, FormEvent } from "react";
import { Plus, BookOpen, MessageSquare, PlusCircle, Compass } from "lucide-react";
import { Desa, Catatan, Pengguna } from "../types";

interface PageDataDesaProps {
  villages: Desa[];
  notices: Catatan[];
  currentUser?: Pengguna;
  onAddVillage: (v: Omit<Desa, "id" | "kelengkapan">) => void;
  onAddNotice: (desa: string, isi: string, tipe: "info" | "warn" | "success") => void;
  selectedDesa: Desa | null;
  onSetSelectedDesa: (v: Desa | null) => void;
  onSelectPerangkatTab: () => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function PageDataDesa({
  villages,
  notices,
  currentUser,
  onAddVillage,
  onAddNotice,
  selectedDesa,
  onSetSelectedDesa,
  onSelectPerangkatTab,
  showToast,
}: PageDataDesaProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Add Village Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVillage, setNewVillage] = useState({
    nama: "",
    kode: "",
    kepalaDesa: "",
    penduduk: "",
    statusWeb: "Aktif" as "Aktif" | "Draft" | "Belum Aktif" | "Perlu Diperbarui",
    alamat: "",
    luas: "",
    batas: "",
    visi: "",
  });

  // Add Note Form State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    desaName: "",
    isi: "",
    tipe: "info" as "info" | "warn" | "success",
  });

  const filtered = villages.filter((v) => {
    const matchSearch = v.nama.toLowerCase().includes(search.toLowerCase()) ||
                        v.kepalaDesa.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || v.statusWeb === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateVillage = (e: FormEvent) => {
    e.preventDefault();
    if (!newVillage.nama || !newVillage.kode || !newVillage.kepalaDesa || !newVillage.penduduk) {
      showToast("warn", "Lengkapi seluruh input wajib!");
      return;
    }
    onAddVillage({
      ...newVillage,
      catatan: newVillage.statusWeb === "Aktif" ? "Baik" : "Perlu Update",
    });
    setNewVillage({
      nama: "",
      kode: "",
      kepalaDesa: "",
      penduduk: "",
      statusWeb: "Aktif",
      alamat: "",
      luas: "",
      batas: "",
      visi: "",
    });
    setShowAddModal(false);
  };

  const handleCreateNotice = (e: FormEvent) => {
    e.preventDefault();
    if (!noteForm.desaName || !noteForm.isi) {
      showToast("warn", "Nama desa dan isi catatan wajib ditulis!");
      return;
    }
    onAddNotice(noteForm.desaName, noteForm.isi, noteForm.tipe);
    setNoteForm({ desaName: "", isi: "", tipe: "info" });
    setShowNoteModal(false);
  };

  const currentDesa = selectedDesa || filtered[0] || villages[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="page-header mb-4">
        <div className="page-header-top flex justify-between items-start flex-wrap gap-4 mb-3">
          <div className="page-header-left">
            <h2 className="text-2xl font-bold font-serif text-ink">Data Profil Desa</h2>
            <p className="text-xs text-ink-soft">Daftar administratif dan monitoring kelengkapan portal tiap desa</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Desa Baru</span>
          </button>
        </div>
        <div className="motif"></div>
      </div>

      {/* FILTER & TABLE BLOCK */}
      <div className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm">
        <div className="card-header p-4 border-b border-line bg-white flex justify-between items-center flex-wrap gap-3">
          <h4 className="font-bold font-serif text-ink text-sm">Daftar Desa Terdaftar</h4>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control text-xs border border-line-strong p-2 rounded-lg focus:border-green-primary outline-none bg-white text-ink"
            >
              <option value="">Semua Status Web</option>
              <option value="Aktif">Aktif</option>
              <option value="Draft">Draft</option>
              <option value="Belum Aktif">Belum Aktif</option>
              <option value="Perlu Diperbarui">Perlu Diperbarui</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari desa atau kepala..."
              className="form-control text-xs border border-line-strong p-2 rounded-lg focus:border-green-primary outline-none bg-white text-ink"
            />
          </div>
        </div>

        <div className="table-wrap overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper border-b border-line">
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Nama Desa</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Kode Desa</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Kepala Desa</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Penduduk (Jiwa)</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Status Web</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Kelengkapan</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Catatan</th>
                <th className="p-3 text-xs font-bold text-ink-soft tracking-wider uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-paper-deep hover:bg-paper transition-all">
                  <td className="p-3">
                    <div className="font-bold text-ink">{v.nama}</div>
                    <div className="text-[11px] text-ink-soft max-w-[160px] truncate">{v.alamat}</div>
                  </td>
                  <td className="p-3 text-xs font-mono text-ink-soft">{v.kode}</td>
                  <td className="p-3 text-xs text-ink">{v.kepalaDesa}</td>
                  <td className="p-3 text-xs font-bold text-ink">{v.penduduk}</td>
                  <td className="p-3">
                    <span
                      className={`badge text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.statusWeb === "Aktif"
                          ? "bg-green-light text-green-primary"
                          : v.statusWeb === "Perlu Diperbarui"
                          ? "bg-teal-light text-teal-dark"
                          : v.statusWeb === "Draft"
                          ? "bg-gold-light text-gold-dark"
                          : "bg-clay-light text-clay"
                      }`}
                    >
                      ● {v.statusWeb}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-paper-deep h-1.5 w-16 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            v.kelengkapan > 80
                              ? "bg-green-primary"
                              : v.kelengkapan > 50
                              ? "bg-teal-primary"
                              : "bg-clay"
                          }`}
                          style={{ width: `${v.kelengkapan}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-ink">{v.kelengkapan}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`badge text-[11px] font-bold px-2 py-1 rounded ${
                        v.catatan === "Baik"
                          ? "bg-green-light text-green-primary"
                          : v.catatan === "Sedang"
                          ? "bg-teal-light text-teal-dark"
                          : "bg-gold-light text-gold-dark"
                      }`}
                    >
                      {v.catatan}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        const allowedDesa = (currentUser?.instansi || "").replace("Desa ", "");
                        if (currentUser?.role === "Operator Desa" && v.nama !== allowedDesa) {
                          showToast("error", `Akses Ditolak: Hak Akses dibatasi. Operator Desa hanya diijinkan mengakses data dari ${currentUser.instansi}.`);
                          return;
                        }
                        onSetSelectedDesa(v);
                        showToast("info", `Membuka detail profil Desa ${v.nama}`);
                      }}
                      className="btn btn-secondary bg-white border border-line text-xs font-bold hover:bg-paper px-2.5 py-1 rounded cursor-pointer transition-all"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-ink-soft">
                    <Compass className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span>Tidak ada desa yang cocok dengan pencarian</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VIEW & REGIONAL NOTES BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PROFILE DETAIL DISPLAY */}
        {currentDesa && (
          <div className="card bg-white border border-line rounded-xl shadow-sm overflow-hidden">
            <div className="card-header p-4 border-b border-line bg-paper flex justify-between items-center">
              <h4 className="font-bold font-serif text-ink text-sm">Detail Administrasi Desa</h4>
              <span
                className={`badge text-xs font-bold px-2.5 py-1 rounded ${
                  currentDesa.statusWeb === "Aktif"
                    ? "bg-green-light text-green-primary"
                    : currentDesa.statusWeb === "Perlu Diperbarui"
                    ? "bg-teal-light text-teal-dark"
                    : currentDesa.statusWeb === "Draft"
                    ? "bg-gold-light text-gold-dark"
                    : "bg-clay-light text-clay"
                }`}
              >
                Website {currentDesa.statusWeb}
              </span>
            </div>
            <div className="card-body p-4 space-y-1">
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Nama Desa</span>
                <span className="text-xs font-bold text-ink">{currentDesa.nama}</span>
              </div>
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Kode Pos / Desa</span>
                <span className="text-xs font-mono font-bold text-ink">{currentDesa.kode}</span>
              </div>
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Alamat Kantor</span>
                <span className="text-xs text-ink font-bold">{currentDesa.alamat}</span>
              </div>
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Kepala Desa</span>
                <span className="text-xs text-ink font-bold">{currentDesa.kepalaDesa}</span>
              </div>
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Luas Wilayah</span>
                <span className="text-xs text-ink font-bold">{currentDesa.luas}</span>
              </div>
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Batas Wilayah</span>
                <span className="text-xs text-ink font-bold">{currentDesa.batas}</span>
              </div>
              <div className="flex border-b border-paper-deep py-2.5 gap-4">
                <span className="text-xs text-ink-soft w-32 shrink-0">Visi Desa</span>
                <span className="text-xs text-green-primary font-bold italic">"{currentDesa.visi}"</span>
              </div>
              <div className="pt-4 flex gap-2">
                <button
                  onClick={onSelectPerangkatTab}
                  className="btn btn-secondary text-xs flex items-center gap-1.5 p-2 bg-paper rounded border border-line hover:bg-paper-deep cursor-pointer font-bold text-ink"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Struktur Organisasi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REGIONAL CATATAN CONTAINER */}
        <div className="card bg-white border border-line rounded-xl shadow-sm overflow-hidden" id="catatan-sarana">
          <div className="card-header p-4 border-b border-line bg-paper flex justify-between items-center">
            <h4 className="font-bold font-serif text-ink text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-gold-dark" />
              <span>Instruksi & Catatan Kecamatan</span>
            </h4>
          </div>
          <div className="card-body p-4 space-y-3">
            <div className="max-h-[220px] overflow-y-auto space-y-3 pr-1">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-lg border-l-4 border shadow-sm ${
                    n.tipe === "warn"
                      ? "bg-clay-light border-l-clay border-line"
                      : n.tipe === "success"
                      ? "bg-green-light border-l-green-primary border-line"
                      : "bg-gold-light border-l-gold-dark border-line"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-extrabold text-ink">{n.desaName}</span>
                    <span className="text-[10px] text-ink-soft font-mono font-bold">{n.tanggal}</span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">{n.isi}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNoteModal(true)}
              className="btn btn-primary w-full bg-green-primary hover:bg-green-dark text-white font-bold p-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Catatan Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADD VILLAGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleCreateVillage}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Tambah Desa Baru</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 text-ink-soft rounded hover:bg-paper-deep text-xs font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Nama Desa *</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: Suka Maju"
                      required
                      value={newVillage.nama}
                      onChange={(e) => setNewVillage({ ...newVillage, nama: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Kode Desa *</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="167100xx"
                      required
                      value={newVillage.kode}
                      onChange={(e) => setNewVillage({ ...newVillage, kode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Kepala Desa *</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    required
                    value={newVillage.kepalaDesa}
                    onChange={(e) => setNewVillage({ ...newVillage, kepalaDesa: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Jumlah Penduduk (Jiwa) *</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: 3.200"
                      required
                      value={newVillage.penduduk}
                      onChange={(e) => setNewVillage({ ...newVillage, penduduk: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Status Web</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                      value={newVillage.statusWeb}
                      onChange={(e) => setNewVillage({ ...newVillage, statusWeb: e.target.value as any })}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Draft">Draft</option>
                      <option value="Belum Aktif">Belum Aktif</option>
                      <option value="Perlu Diperbarui">Perlu Diperbarui</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Alamat Kantor</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Jl. Raya Desa No. xx, Kel. ..."
                    value={newVillage.alamat}
                    onChange={(e) => setNewVillage({ ...newVillage, alamat: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Luas Wilayah</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: 11,2 km²"
                      value={newVillage.luas}
                      onChange={(e) => setNewVillage({ ...newVillage, luas: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Batas Wilayah</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="U: Musi | S: Gandus"
                      value={newVillage.batas}
                      onChange={(e) => setNewVillage({ ...newVillage, batas: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Visi Desa</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Visi pembangunan..."
                    value={newVillage.visi}
                    onChange={(e) => setNewVillage({ ...newVillage, visi: e.target.value })}
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
                  Simpan Desa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleCreateNotice}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Catatan Kecamatan Baru</h3>
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="w-7 h-7 text-ink-soft rounded hover:bg-paper-deep text-xs font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Desa Target *</label>
                  <select
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                    required
                    value={noteForm.desaName}
                    onChange={(e) => setNoteForm({ ...noteForm, desaName: e.target.value })}
                  >
                    <option value="">Pilih Desa Target</option>
                    {villages.map((v) => (
                      <option key={v.id} value={v.nama}>
                        Desa {v.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Tipe Prioritas</label>
                  <select
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                    value={noteForm.tipe}
                    onChange={(e) => setNoteForm({ ...noteForm, tipe: e.target.value as any })}
                  >
                    <option value="info">Info Umum (Kuning)</option>
                    <option value="warn">Peringatan Keras (Merah)</option>
                    <option value="success">Verifikasi Berhasil (Hijau)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Isi Instruksi / Catatan *</label>
                  <textarea
                    rows={3}
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Tulis instruksi disini..."
                    required
                    value={noteForm.isi}
                    onChange={(e) => setNoteForm({ ...noteForm, isi: e.target.value })}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
