import { useState, useEffect } from "react";
import { Users, Home, UserCheck, ShieldAlert, Award, Sparkles, HeartPulse, MapPin, Activity } from "lucide-react";
import { Desa, Pengguna } from "../types";

interface PageMonografiProps {
  villages: Desa[];
  currentUser?: Pengguna;
}

interface MonografiData {
  total: string;
  kk: string;
  lk: string;
  pr: string;
  lkPct: number;
  prPct: number;
  nakesTotal: number;
  nakesList: { kategori: string; jumlah: number }[];
  dusunDist: { nama: string; jiwa: string; persentase: number }[];
}

export default function PageMonografi({ villages, currentUser }: PageMonografiProps) {
  const isOperator = currentUser?.role === "Operator Desa";
  const operatorDesaName = (isOperator && currentUser?.instansi) ? currentUser.instansi.replace("Desa ", "") : "";

  const [selectedVillageName, setSelectedVillageName] = useState(operatorDesaName || "");

  useEffect(() => {
    if (isOperator && operatorDesaName) {
      setSelectedVillageName(operatorDesaName);
    } else if (!isOperator) {
      setSelectedVillageName("");
    }
  }, [currentUser, isOperator, operatorDesaName]);

  const MONOGRAFI_DATA_LOOKUP: Record<string, MonografiData> = {
    "": {
      total: "48.720",
      kk: "13.540",
      lk: "24.380",
      pr: "24.340",
      lkPct: 50.0,
      prPct: 50.0,
      nakesTotal: 144,
      nakesList: [
        { kategori: "Dokter Umum & Spesialis", jumlah: 18 },
        { kategori: "Bidan Desa", jumlah: 36 },
        { kategori: "Perawat Lapangan", jumlah: 44 },
        { kategori: "Apoteker & Tenaga Farmasi", jumlah: 16 },
        { kategori: "Kader Sanitasi & Gizi", jumlah: 30 }
      ],
      dusunDist: [
        { nama: "Dusun I - Sentra Utara", jiwa: "14.250", persentase: 29 },
        { nama: "Dusun II - Wilayah Makmur", jiwa: "12.180", persentase: 25 },
        { nama: "Dusun III - Kampung Baru", jiwa: "11.120", persentase: 23 },
        { nama: "Dusun IV - Karya Hijau", jiwa: "11.170", persentase: 23 }
      ]
    },
    "Sei Selayur": {
      total: "4.280",
      kk: "1.180",
      lk: "2.140",
      pr: "2.140",
      lkPct: 50.0,
      prPct: 50.0,
      nakesTotal: 12,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 2 },
        { kategori: "Bidan Desa", jumlah: 3 },
        { kategori: "Perawat", jumlah: 4 },
        { kategori: "Kader Posyandu", jumlah: 3 }
      ],
      dusunDist: [
        { nama: "Dusun 01 (RT 01-05)", jiwa: "1.280", persentase: 30 },
        { nama: "Dusun 02 (RT 06-10)", jiwa: "1.050", persentase: 25 },
        { nama: "Dusun 03 (RT 11-15)", jiwa: "1.100", persentase: 26 },
        { nama: "Dusun 04 (RT 16-20)", jiwa: "850", persentase: 19 }
      ]
    },
    "Talang Kelapa": {
      total: "5.120",
      kk: "1.420",
      lk: "2.580",
      pr: "2.540",
      lkPct: 50.4,
      prPct: 49.6,
      nakesTotal: 16,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 3 },
        { kategori: "Bidan Desa", jumlah: 4 },
        { kategori: "Perawat", jumlah: 5 },
        { kategori: "Kader Posyandu", jumlah: 4 }
      ],
      dusunDist: [
        { nama: "Dusun Karang Anyar", jiwa: "1.520", persentase: 30 },
        { nama: "Dusun Talang Sari", jiwa: "1.320", persentase: 26 },
        { nama: "Dusun Kelapa Indah", jiwa: "1.280", persentase: 25 },
        { nama: "Dusun Sinar Pagi", jiwa: "1.000", persentase: 19 }
      ]
    },
    "Gandus": {
      total: "3.890",
      kk: "1.050",
      lk: "1.960",
      pr: "1.930",
      lkPct: 50.4,
      prPct: 49.6,
      nakesTotal: 11,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 1 },
        { kategori: "Bidan Desa", jumlah: 3 },
        { kategori: "Perawat", jumlah: 4 },
        { kategori: "Kader Posyandu", jumlah: 3 }
      ],
      dusunDist: [
        { nama: "Dusun I - Pesisir", jiwa: "1.180", persentase: 30 },
        { nama: "Dusun II - Padi Jaya", jiwa: "980", persentase: 25 },
        { nama: "Dusun III - Bukit Makmur", jiwa: "930", persentase: 24 },
        { nama: "Dusun IV - Lestari", jiwa: "800", persentase: 21 }
      ]
    },
    "Kertapati": {
      total: "4.650",
      kk: "1.280",
      lk: "2.320",
      pr: "2.330",
      lkPct: 49.9,
      prPct: 50.1,
      nakesTotal: 14,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 2 },
        { kategori: "Bidan Desa", jumlah: 4 },
        { kategori: "Perawat", jumlah: 5 },
        { kategori: "Kader Posyandu", jumlah: 3 }
      ],
      dusunDist: [
        { nama: "Dusun Seberang", jiwa: "1.450", persentase: 31 },
        { nama: "Dusun Stasiun", jiwa: "1.250", persentase: 27 },
        { nama: "Dusun Liku", jiwa: "1.050", persentase: 23 },
        { nama: "Dusun Jaya", jiwa: "900", persentase: 19 }
      ]
    },
    "Plaju": {
      total: "6.200",
      kk: "1.740",
      lk: "3.100",
      pr: "3.100",
      lkPct: 50.0,
      prPct: 50.0,
      nakesTotal: 20,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 4 },
        { kategori: "Bidan Desa", jumlah: 5 },
        { kategori: "Perawat", jumlah: 6 },
        { kategori: "Kader Posyandu", jumlah: 5 }
      ],
      dusunDist: [
        { nama: "Dusun Kilang", jiwa: "1.850", persentase: 30 },
        { nama: "Dusun Pertamina", jiwa: "1.550", persentase: 25 },
        { nama: "Dusun Komperta", jiwa: "1.500", persentase: 24 },
        { nama: "Dusun Plaju Ulu", jiwa: "1.300", persentase: 21 }
      ]
    },
    "Sako": {
      total: "3.980",
      kk: "1.090",
      lk: "1.990",
      pr: "1.990",
      lkPct: 50.0,
      prPct: 50.0,
      nakesTotal: 13,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 2 },
        { kategori: "Bidan Desa", jumlah: 3 },
        { kategori: "Perawat", jumlah: 5 },
        { kategori: "Kader Posyandu", jumlah: 3 }
      ],
      dusunDist: [
        { nama: "Dusun Perumnas", jiwa: "1.280", persentase: 32 },
        { nama: "Dusun Sako Baru", jiwa: "1.100", persentase: 28 },
        { nama: "Dusun Kenten", jiwa: "900", persentase: 22 },
        { nama: "Dusun Lebak", jiwa: "700", persentase: 18 }
      ]
    },
    "Bukit Lama": {
      total: "2.850",
      kk: "790",
      lk: "1.430",
      pr: "1.420",
      lkPct: 50.2,
      prPct: 49.8,
      nakesTotal: 10,
      nakesList: [
        { kategori: "Dokter Umum", jumlah: 1 },
        { kategori: "Bidan Desa", jumlah: 3 },
        { kategori: "Perawat", jumlah: 3 },
        { kategori: "Kader Posyandu", jumlah: 3 }
      ],
      dusunDist: [
        { nama: "Dusun Padang", jiwa: "950", persentase: 33 },
        { nama: "Dusun Bukit", jiwa: "750", persentase: 26 },
        { nama: "Dusun Ulu", jiwa: "650", persentase: 23 },
        { nama: "Dusun Hilir", jiwa: "500", persentase: 18 }
      ]
    },
  };

  const [activeTab, setActiveTab] = useState<"kependudukan" | "sosial" | "sarana" | "wilayah">("kependudukan");

  const mData = MONOGRAFI_DATA_LOOKUP[selectedVillageName] || MONOGRAFI_DATA_LOOKUP[""];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="page-header mb-4">
        <div className="page-header-top flex justify-between items-start flex-wrap gap-4 mb-3">
          <div className="page-header-left">
            <h2 className="text-2xl font-bold font-serif text-ink">Profil & Monografi Desa</h2>
            <p className="text-xs text-ink-soft">Statistik demografi, sosial ekonomi, sarana prasarana, dan pemetaan luas wilayah kecamatan</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-soft"> Filter Desa:</span>
            {isOperator ? (
              <span className="text-xs font-bold px-3 py-2 border border-green-primary/30 bg-green-light/20 text-green-primary rounded-lg font-serif">
                Desa {selectedVillageName} (Sesi Terkunci)
              </span>
            ) : (
              <select
                aria-label="Filter Desa"
                value={selectedVillageName}
                onChange={(e) => setSelectedVillageName(e.target.value)}
                className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white focus:border-green-primary outline-none"
              >
                <option value="">Semua Desa (Rekap Kecamatan)</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.nama}>
                    Desa {v.nama}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="motif"></div>
      </div>

      {/* CORE TABS */}
      <div className="tabs border-b border-line flex gap-1 overflow-x-auto">
        {(["kependudukan", "sosial", "sarana", "wilayah"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab px-4 py-2.5 text-xs font-bold font-serif capitalize border-b-2 cursor-pointer transition-all ${
              activeTab === tab
                ? "border-b-gold text-green-primary bg-white/20"
                : "border-b-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "wilayah" ? "Luas Wilayah" : tab === "sarana" ? "Sarana Prasarana" : tab === "sosial" ? "Sosial Ekonomi" : "Kependudukan"}
          </button>
        ))}
      </div>

      {/* TAB PANEL 1: KEPENDUDUKAN */}
      {activeTab === "kependudukan" && (
        <div className="space-y-6 animate-fadeIn">
          {/* STATS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-line rounded-xl p-4 flex items-center gap-3 shadow-sm card-shine">
              <div className="w-10 h-10 rounded-lg bg-green-light text-green-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-ink">{mData.total}</div>
                <div className="text-[10px] text-ink-soft tracking-wider uppercase font-bold">Total Penduduk</div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4 flex items-center gap-3 shadow-sm card-shine">
              <div className="w-10 h-10 rounded-lg bg-teal-light text-teal-dark flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-ink">{mData.kk}</div>
                <div className="text-[10px] text-ink-soft tracking-wider uppercase font-bold">Kepala Keluarga</div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4 flex items-center gap-3 shadow-sm card-shine">
              <div className="w-10 h-10 rounded-lg bg-gold-light text-gold-dark flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-ink">{mData.lk}</div>
                <div className="text-[10px] text-ink-soft tracking-wider uppercase font-bold">Laki-Laki</div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4 flex items-center gap-3 shadow-sm card-shine">
              <div className="w-10 h-10 rounded-lg bg-plum-light text-plum flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-ink">{mData.pr}</div>
                <div className="text-[10px] text-ink-soft tracking-wider uppercase font-bold">Perempuan</div>
              </div>
            </div>
          </div>

          {/* DISTRIBUTION GRAPHS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GENDER PROGRESS MAP */}
            <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
              <h4 className="font-bold font-serif text-ink text-xs mb-4 uppercase tracking-wider">Distribusi Jenis Kelamin</h4>
              <div className="flex items-center justify-around py-4 border-b border-paper-deep">
                <div className="text-center">
                  <div className="text-2xl font-serif font-bold text-green-primary">{mData.lkPct}%</div>
                  <p className="text-xs text-ink-soft font-bold">Laki-Laki</p>
                </div>
                <div className="w-[1px] h-10 bg-line"></div>
                <div className="text-center">
                  <div className="text-2xl font-serif font-bold text-plum">{mData.prPct}%</div>
                  <p className="text-xs text-ink-soft font-bold">Perempuan</p>
                </div>
              </div>

              {/* BAR VISUALIZER */}
              <div className="mt-5 h-3 rounded-full overflow-hidden flex">
                <div style={{ width: `${mData.lkPct}%` }} className="bg-green-primary h-full"></div>
                <div style={{ width: `${mData.prPct}%` }} className="bg-plum h-full"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-ink-soft mt-2 uppercase font-bold">
                <span>{mData.lkPct}% Laki-laki</span>
                <span>{mData.prPct}% Perempuan</span>
              </div>
            </div>

            {/* AGE STATISTICS */}
            <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
              <h4 className="font-bold font-serif text-ink text-xs mb-4 uppercase tracking-wider">Distribusi Berdasarkan Usia</h4>
              <div className="space-y-3">
                {_renderBarRow("0 - 14 tahun", 32, "bg-teal-primary")}
                {_renderBarRow("15 - 30 tahun", 28, "bg-green-primary")}
                {_renderBarRow("31 - 50 tahun", 25, "bg-gold-dark")}
                {_renderBarRow("> 50 tahun", 15, "bg-plum")}
              </div>
            </div>

            {/* RELIGION STATISTICS */}
            <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
              <h4 className="font-bold font-serif text-ink text-xs mb-4 uppercase tracking-wider">Distribusi Berdasarkan Agama</h4>
              <div className="space-y-3">
                {_renderBarRow("Islam", 88, "bg-green-primary")}
                {_renderBarRow("Kristen", 7, "bg-teal-primary")}
                {_renderBarRow("Budha", 3, "bg-gold-dark")}
                {_renderBarRow("Lainnya", 2, "bg-ink-soft")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 2: SOSIAL EKONOMI */}
      {activeTab === "sosial" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn pb-6">
          {/* WORK SECTOR LIST */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
            <h4 className="font-bold font-serif text-ink text-xs mb-4 uppercase tracking-wider">Distribusi Berdasarkan Pekerjaan</h4>
            <div className="space-y-4">
              {_renderBarRow("Petani / Sawah", 42, "bg-green-primary")}
              {_renderBarRow("Wiraswasta / Dagang", 22, "bg-teal-primary")}
              {_renderBarRow("PNS / TNI / POLRI", 14, "bg-plum")}
              {_renderBarRow("Karyawan Swasta", 18, "bg-gold-dark")}
              {_renderBarRow("Lain-Lain", 4, "bg-ink-soft")}
            </div>
          </div>

          {/* EDUCATION LEVELS */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
            <h4 className="font-bold font-serif text-ink text-xs mb-4 uppercase tracking-wider">Distribusi Pendidikan Terakhir</h4>
            <div className="space-y-4">
              {_renderBarRow("SD / Sederajat", 28, "bg-gold-dark")}
              {_renderBarRow("SMP / Sederajat", 22, "bg-teal-primary")}
              {_renderBarRow("SMA / SMK / MA", 35, "bg-green-primary")}
              {_renderBarRow("Sarjana (D3, S1, S2, S3)", 15, "bg-plum")}
            </div>
          </div>

          {/* POPULATION PER DUSUN DISTRIBUTION */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-green-light text-green-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 animate-bounce" />
              </div>
              <h4 className="font-bold font-serif text-ink text-xs uppercase tracking-wider">Distribusi Penduduk Per Dusun</h4>
            </div>
            <div className="space-y-4">
              {mData.dusunDist.map((dist, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-ink">
                    <span className="text-ink-soft font-normal">{dist.nama}</span>
                    <span className="text-ink font-mono text-xs">{dist.jiwa} Jiwa ({dist.persentase}%)</span>
                  </div>
                  <div className="bg-paper-deep h-4 rounded overflow-hidden relative">
                    <div style={{ width: `${dist.persentase}%` }} className="h-full bg-green-primary rounded"></div>
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white font-mono">
                      {dist.persentase}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL HEALTH WORKERS */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-red-100 text-red-600 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h4 className="font-bold font-serif text-ink text-xs uppercase tracking-wider">Jumlah Tenaga Kesehatan</h4>
            </div>

            <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-full text-red-600 shadow-sm flex items-center justify-center">
                  <Activity className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-red-600">Total Tenaga Medis</p>
                  <h5 className="text-lg font-bold font-serif text-ink">{mData.nakesTotal} Orang</h5>
                </div>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-1 rounded">Siaga Aktif</span>
            </div>

            <div className="space-y-3">
              {mData.nakesList.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-paper last:border-0 text-xs font-bold text-ink">
                  <span className="text-ink-soft font-normal">{item.kategori}</span>
                  <span className="bg-paper px-2.5 py-1 rounded-md border border-line-strong font-mono text-ink-soft text-xs">{item.jumlah} Orang</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 3: SARANA PRASARANA */}
      {activeTab === "sarana" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* EDUCATION FACILITY */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm card-shine">
            <h4 className="font-bold font-serif text-ink text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              🏫 Sarana Pendidikan
            </h4>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">PAUD / TK</span>
                <span>18 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">SD / MI</span>
                <span>24 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">SMP / MTs</span>
                <span>12 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">SMA / SMK / MA</span>
                <span>8 Unit</span>
              </div>
            </div>
          </div>

          {/* HEALTH FACILITY */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm card-shine">
            <h4 className="font-bold font-serif text-ink text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              🏥 Prasarana Kesehatan
            </h4>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Puskesmas Pembantu</span>
                <span>4 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Polindes / PKD</span>
                <span>8 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Posyandu Balita & Lansia</span>
                <span>36 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Tenaga Kesehatan Aktif</span>
                <span>48 Orang</span>
              </div>
            </div>
          </div>

          {/* GENERAL SANITATION */}
          <div className="card bg-white border border-line rounded-xl p-4 shadow-sm card-shine">
            <h4 className="font-bold font-serif text-ink text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              🏛️ Kantor & Gedung Umum
            </h4>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Kantor Kepala Desa</span>
                <span>12 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Balai Kemasyarakatan</span>
                <span>10 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-paper-deep text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Masjid / Musholla / Gereja</span>
                <span>87 Unit</span>
              </div>
              <div className="flex justify-between items-center py-1.5 text-xs font-bold text-ink">
                <span className="text-ink-soft font-normal">Total Luas Kelola</span>
                <span>148 km²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 4: LUAS WILAYAH */}
      {activeTab === "wilayah" && (
        <div className="space-y-6 animate-fadeIn">
          {/* AREA HIGHLIGHT STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-green-light text-green-primary flex items-center justify-center font-bold">148</span>
              <div>
                <h5 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Total Luas Wilayah</h5>
                <p className="text-sm font-bold text-ink">148 km² (14.800 Ha)</p>
              </div>
            </div>
            <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-teal-light text-teal-dark flex items-center justify-center font-bold">Ha</span>
              <div>
                <h5 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Lahan Pertanian Beririgasi</h5>
                <p className="text-sm font-bold text-ink">9.850 Ha (66,5% Area)</p>
              </div>
            </div>
            <div className="bg-white border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gold-light text-gold-dark flex items-center justify-center font-bold">Perm</span>
              <div>
                <h5 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Lahan Permukiman & Kantor</h5>
                <p className="text-sm font-bold text-ink">3.250 Ha (21,9% Area)</p>
              </div>
            </div>
          </div>

          {/* DETAIL LANDS TABLE */}
          <div className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm">
            <div className="card-header p-4 border-b border-line bg-white">
              <h4 className="font-bold font-serif text-ink text-sm">Rincian Luas Area per Desa</h4>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-paper border-b border-line">
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider">Nama Desa</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider text-right">Luas Wilayah (Km²)</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider text-right">Luas Wilayah (Hektar)</th>
                  <th className="p-3 text-xs font-bold text-ink-soft uppercase tracking-wider">Batas Wilayah Utama</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Sei Selayur</td>
                  <td className="p-3 text-right text-xs font-mono">12,4</td>
                  <td className="p-3 text-right text-xs font-mono">1.240</td>
                  <td className="p-3 text-xs text-ink-soft">Utara: Sungai Musi | Selatan: Plaju</td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Talang Kelapa</td>
                  <td className="p-3 text-right text-xs font-mono">9,8</td>
                  <td className="p-3 text-right text-xs font-mono">980</td>
                  <td className="p-3 text-xs text-ink-soft">Utara: Desa Sako | Selatan: Sei Selayur</td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Gandus</td>
                  <td className="p-3 text-right text-xs font-mono">18,2</td>
                  <td className="p-3 text-right text-xs font-mono">1.820</td>
                  <td className="p-3 text-xs text-ink-soft">Barat: Sawah Musi Raya | Utara: Musi River</td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Kertapati</td>
                  <td className="p-3 text-right text-xs font-mono">15,5</td>
                  <td className="p-3 text-right text-xs font-mono">1.550</td>
                  <td className="p-3 text-xs text-ink-soft">Selatan: Plaju Jembatan | Utara: Musi</td>
                </tr>
                <tr className="border-b border-paper-deep">
                  <td className="p-3 font-bold text-ink">Plaju</td>
                  <td className="p-3 text-right text-xs font-mono">15,1</td>
                  <td className="p-3 text-right text-xs font-mono">1.510</td>
                  <td className="p-3 text-xs text-ink-soft">Utara: Sungai Musi | Selatan: Gandus Raya</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  function _renderBarRow(label: string, percentage: number, colorClass: string) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold text-ink">
          <span className="text-ink-soft font-normal">{label}</span>
          <span>{percentage}%</span>
        </div>
        <div className="bg-paper-deep h-4 rounded overflow-hidden relative">
          <div style={{ width: `${percentage}%` }} className={`h-full ${colorClass} rounded`}></div>
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white font-mono">
            {percentage}%
          </span>
        </div>
      </div>
    );
  }
}
