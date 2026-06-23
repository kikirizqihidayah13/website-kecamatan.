import { useState, FormEvent, useEffect } from "react";
import { Plus, Store, Compass, Share2 } from "lucide-react";
import { Produk, Pelapak, Pengguna } from "../types";

interface PageLapakProps {
  products: Produk[];
  merchants: Pelapak[];
  currentUser?: Pengguna;
  onAddProduct: (p: Omit<Produk, "id">) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function PageLapak({ products, merchants, currentUser, onAddProduct, showToast }: PageLapakProps) {
  const isOperator = currentUser?.role === "Operator Desa";
  const operatorDesaName = (isOperator && currentUser?.instansi) ? currentUser.instansi.replace("Desa ", "") : "";

  const [search, setSearch] = useState("");
  const [desaFilter, setDesaFilter] = useState(operatorDesaName || "");
  const [stokFilter, setStokFilter] = useState("");
  const [catFilter, setCatFilter] = useState(""); // Category filter via pills

  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);

  // Add Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    nama: "",
    harga: "",
    satuan: "kg",
    pelapak: "",
    desa: operatorDesaName || "Sei Selayur",
    ketersediaan: "Tersedia" as "Tersedia" | "Terbatas" | "Kosong",
    kategori: "pertanian" as any,
    foto: "",
    deskripsi: "",
    whatsapp: "",
  });

  // Sync state if currentUser changes
  useEffect(() => {
    if (isOperator && operatorDesaName) {
      setDesaFilter(operatorDesaName);
      setNewProd((prev) => ({ ...prev, desa: operatorDesaName }));
    } else {
      setDesaFilter("");
      setNewProd((prev) => ({ ...prev, desa: "Sei Selayur" }));
    }
  }, [currentUser, isOperator, operatorDesaName]);

  const displayProducts = isOperator 
    ? products.filter((p) => p.desa.toLowerCase() === operatorDesaName.toLowerCase()) 
    : products;

  const filtered = displayProducts.filter((p) => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || p.pelapak.toLowerCase().includes(search.toLowerCase());
    const matchDesa = !desaFilter || p.desa === desaFilter;
    const matchStok = !stokFilter || p.ketersediaan === stokFilter;
    const matchCat = !catFilter || p.kategori === catFilter;
    return matchSearch && matchDesa && matchStok && matchCat;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newProd.nama || !newProd.harga || !newProd.pelapak) {
      showToast("warn", "Nama produk, harga, dan pelapak wajib diisi!");
      return;
    }
    const defaultPic = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";
    onAddProduct({
      ...newProd,
      foto: newProd.foto || defaultPic,
    });
    setNewProd({
      nama: "",
      harga: "",
      satuan: "kg",
      pelapak: "",
      desa: "Sei Selayur",
      ketersediaan: "Tersedia",
      kategori: "pertanian",
      foto: "",
      deskripsi: "",
      whatsapp: "",
    });
    setShowAddModal(false);
  };

  const handleShare = (nama: string) => {
    showToast("success", `Tautan produk "${nama}" berhasil disalin ke clipboard!`);
  };

  const categories = [
    { key: "", label: "Semua" },
    { key: "pertanian", label: "🌾 Pertanian" },
    { key: "makanan", label: "🍛 Makanan" },
    { key: "minuman", label: "🥤 Minuman" },
    { key: "kerajinan", label: "🎋 Kerajinan" },
    { key: "perikanan", label: "🐟 Perikanan" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="page-header mb-4">
        <div className="page-header-top flex justify-between items-start flex-wrap gap-4 mb-3">
          <div className="page-header-left">
            <h2 className="text-2xl font-bold font-serif text-ink">Lapak UMKM & Produk Unggulan</h2>
            <p className="text-xs text-ink-soft">Etalase digital komoditas olahan lokal, cinderamata, dan hasil kerajinan buatan warga desa</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Lapak</span>
          </button>
        </div>
        <div className="motif"></div>
      </div>

      {/* REKAP PANEL CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-light text-green-primary flex items-center justify-center font-serif font-bold text-sm">Prd</div>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Total Produk Etalase</h5>
            <p className="text-lg font-bold text-ink">156 Unit</p>
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-light text-teal-dark flex items-center justify-center font-serif font-bold text-sm">Plk</div>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Pelapak Aktif</h5>
            <p className="text-lg font-bold text-ink">48 UMKM</p>
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-light text-gold-dark flex items-center justify-center font-serif font-bold text-sm">Ugl</div>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Produk Unggulan</h5>
            <p className="text-lg font-bold text-ink">12 Produk</p>
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-clay-light text-clay flex items-center justify-center font-serif font-bold text-sm">Stk</div>
          <div>
            <h5 className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Stok Kosong</h5>
            <p className="text-lg font-bold text-ink">8 Produk</p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="card bg-white border border-line rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-2.5 items-center justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk rujukan..."
            className="form-control text-xs w-[240px] border border-line-strong p-2 rounded-lg bg-white"
          />
          <div className="flex items-center gap-2">
            <select
              value={desaFilter}
              onChange={(e) => setDesaFilter(e.target.value)}
              className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white text-ink"
            >
              <option value="">Semua Kecamatan Desa</option>
              <option value="Sei Selayur">Sei Selayur</option>
              <option value="Talang Kelapa">Talang Kelapa</option>
              <option value="Plaju">Plaju</option>
              <option value="Gandus">Gandus</option>
              <option value="Bukit Lama">Bukit Lama</option>
            </select>
            <select
              value={stokFilter}
              onChange={(e) => setStokFilter(e.target.value)}
              className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white text-ink"
            >
              <option value="">Semua Ketersediaan</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Terbatas">Terbatas</option>
              <option value="Kosong">Kosong</option>
            </select>
          </div>
        </div>

        {/* PILL CATEGORIES */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-paper-deep">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCatFilter(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                catFilter === cat.key
                  ? "bg-green-primary border-green-primary text-white shadow-sm"
                  : "bg-white border-line text-ink-soft hover:border-gold hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS DIRECTORY GRID */}
      <h3 className="text-xs font-bold font-serif text-ink uppercase tracking-wider">Katalog Produk Desa</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProduct(p)}
            className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:scale-102 hover:border-gold transition-all duration-200 cursor-pointer"
          >
            <div className="h-[132px] bg-paper relative">
              <img
                src={p.foto}
                alt={p.nama}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute top-2.5 right-2.5 badge text-[9px] font-bold px-2 py-0.5 rounded shadow ${
                  p.ketersediaan === "Tersedia"
                    ? "bg-green-primary text-white"
                    : p.ketersediaan === "Terbatas"
                    ? "bg-gold text-white"
                    : "bg-clay text-white"
                }`}
              >
                {p.ketersediaan}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-serif font-bold text-ink text-xs line-clamp-1">{p.nama}</h4>
                <div className="text-sm font-extrabold text-green-primary font-serif mt-1">
                  Rp {p.harga}
                  <span className="text-[10px] text-ink-soft font-normal"> /{p.satuan}</span>
                </div>
                <p className="text-[10px] text-ink-soft mt-1">
                  Pelapak: {p.pelapak} · Desa {p.desa}
                </p>
              </div>

              {/* ACTION ROW */}
              <div className="pt-2 border-t border-paper-deep flex gap-2" onClick={(e) => e.stopPropagation()}>
                <a
                  href={`https://wa.me/${p.whatsapp}?text=Halo%20${encodeURIComponent(
                    p.pelapak
                  )}%2C%20saya%20tertarik%20dengan%20produk%20Lapak%20SIMDES%20"${encodeURIComponent(p.nama)}"`}
                  target="_blank"
                  className="btn btn-success flex-1 bg-green-primary hover:bg-green-dark text-white font-bold p-2 text-center rounded-lg text-[11.5px] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Pesan Sekarang</span>
                </a>
                <button
                  onClick={() => handleShare(p.nama)}
                  className="btn btn-secondary border border-line bg-white hover:bg-paper p-2 rounded-lg text-ink cursor-pointer"
                  title="Bagikan Tautan Produk"
                >
                  <Share2 className="w-3.5 h-3.5 text-ink-soft" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full border border-dashed border-line rounded-xl p-12 text-center text-ink-soft bg-white/50">
            <Compass className="w-8 h-8 opacity-25 mx-auto mb-2" />
            <span>Tidak ada produk yang saat ini tersedia untuk filter tersebut</span>
          </div>
        )}
      </div>

      {/* DETAIL MODAL DESCRIPTIONS */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-base text-ink line-clamp-1">{selectedProduct.nama}</h3>
                <p className="text-[10px] uppercase font-bold text-ink-soft font-sans">Sektor {selectedProduct.kategori}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-7 h-7 text-xs font-bold border border-line rounded hover:bg-paper cursor-pointer animate-pulse"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="h-[160px] rounded-xl overflow-hidden border border-line mb-3">
                <img
                  src={selectedProduct.foto}
                  alt={selectedProduct.nama}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Banderol Harga</span>
                  <span className="font-bold text-green-primary text-sm font-serif">
                    Rp {selectedProduct.harga}
                    <span className="text-xs text-ink-soft font-normal">/{selectedProduct.satuan}</span>
                  </span>
                </div>
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Nama Penjual (Pelapak)</span>
                  <span className="font-bold text-ink font-serif text-xs">{selectedProduct.pelapak}</span>
                </div>
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Desa Domisili</span>
                  <span className="font-bold text-ink text-xs">Desa {selectedProduct.desa}</span>
                </div>
                <div className="flex border-b border-paper-deep py-2">
                  <span className="text-ink-soft w-32 shrink-0">Status Persediaan</span>
                  <span
                    className={`badge text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedProduct.ketersediaan === "Tersedia" ? "bg-green-light text-green-primary" : "bg-gold-light text-gold-dark"
                    }`}
                  >
                    {selectedProduct.ketersediaan}
                  </span>
                </div>

                <div className="pt-3">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-green-primary block mb-1">Deksripsi Produk :</span>
                  <p className="text-xs text-ink leading-relaxed font-sans font-medium">{selectedProduct.deskripsi}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-line bg-paper flex justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
              >
                Tutup Katalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT FORM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-ink">Tambah Produk Lapak Baru</h3>
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
                  <label className="text-xs font-bold text-ink block mb-1">Nama Barang *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                    placeholder="Contoh: Kripik Pisang Manis Selayur"
                    value={newProd.nama}
                    onChange={(e) => setNewProd({ ...newProd, nama: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Banderol Harga (Rp) *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: 15.000"
                      value={newProd.harga}
                      onChange={(e) => setNewProd({ ...newProd, harga: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Satuan Taksir</label>
                    <input
                      type="text"
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      value={newProd.satuan}
                      onChange={(e) => setNewProd({ ...newProd, satuan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Nama Produsen UMKM *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none"
                      placeholder="Contoh: Ibu Rohayati"
                      value={newProd.pelapak}
                      onChange={(e) => setNewProd({ ...newProd, pelapak: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">WhatsApp Hubungi *</label>
                    <input
                      type="text"
                      required
                      className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary outline-none font-mono"
                      placeholder="628xxxxxxxxxx"
                      value={newProd.whatsapp}
                      onChange={(e) => setNewProd({ ...newProd, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Asal Desa Domisili</label>
                    <select
                      disabled={isOperator}
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white disabled:bg-paper disabled:text-ink-soft disabled:cursor-not-allowed font-medium"
                      value={newProd.desa}
                      onChange={(e) => setNewProd({ ...newProd, desa: e.target.value })}
                    >
                      <option value="Sei Selayur">Sei Selayur</option>
                      <option value="Talang Kelapa">Talang Kelapa</option>
                      <option value="Plaju">Plaju</option>
                      <option value="Gandus">Gandus</option>
                      <option value="Bukit Lama">Bukit Lama</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Kategori Lapak</label>
                    <select
                      className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white font-bold"
                      value={newProd.kategori}
                      onChange={(e) => setNewProd({ ...newProd, kategori: e.target.value as any })}
                    >
                      <option value="pertanian">Pertanian</option>
                      <option value="makanan">Makanan</option>
                      <option value="minuman">Minuman</option>
                      <option value="kerajinan">Kerajinan</option>
                      <option value="perikanan">Perikanan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Status Ketersediaan</label>
                  <select
                    className="form-control text-xs w-full p-2 border border-line rounded-lg bg-white"
                    value={newProd.ketersediaan}
                    onChange={(e) => setNewProd({ ...newProd, ketersediaan: e.target.value as any })}
                  >
                    <option value="Tersedia">Tersedia Melimpah</option>
                    <option value="Terbatas">Terbatas / PO</option>
                    <option value="Kosong">Habis Sementara</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Deskripsi Detail Produk</label>
                  <textarea
                    rows={3}
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary"
                    placeholder="Bahan dasar baku, berat bersih, varian rasa, dsb."
                    value={newProd.deskripsi}
                    onChange={(e) => setNewProd({ ...newProd, deskripsi: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1 font-sans">URL Gambar Foto Pajangan</label>
                  <input
                    type="text"
                    className="form-control text-xs w-full p-2 border border-line rounded-lg focus:border-green-primary font-mono"
                    placeholder="https://images.unsplash.com/..."
                    value={newProd.foto}
                    onChange={(e) => setNewProd({ ...newProd, foto: e.target.value })}
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
                  Simpan Produk Lapak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
