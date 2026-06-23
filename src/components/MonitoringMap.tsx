import { useState } from "react";
import { MapPin, RefreshCw, Maximize, Play, Info, Check } from "lucide-react";
import { Desa } from "../types";

interface MonitoringMapProps {
  villages: Desa[];
  onSelectVillage: (nama: string) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

export default function MonitoringMap({ villages, onSelectVillage, showToast }: MonitoringMapProps) {
  const [mapType, setMapType] = useState<"satelit" | "jalan">("satelit");
  const [isReloading, setIsReloading] = useState(false);
  const [showLargeMap, setShowLargeMap] = useState(false);

  // Hardcoded positions matching the exact screen coordinates of the prototype map coordinates
  const pinPositions: Record<string, { top: string; left: string }> = {
    "Sei Selayur": { top: "28%", left: "35%" },
    "Talang Kelapa": { top: "42%", left: "52%" },
    "Gandus": { top: "55%", left: "28%" },
    "Kertapati": { top: "38%", left: "68%" },
    "Plaju": { top: "62%", left: "60%" },
    "Sako": { top: "20%", left: "58%" },
    "Bukit Lama": { top: "70%", left: "42%" },
    "Kalidoni": { top: "48%", left: "78%" },
  };

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
      showToast("success", "Satelit radar diperbarui secara Real-Time!");
    }, 1000);
  };

  return (
    <div className="card mb-6" id="monitoring-peta">
      {/* HEADER CARD */}
      <div className="card-header flex justify-between items-center bg-white border-b border-line p-4 rounded-t-xl flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-primary animate-ping"></span>
            <h3 className="card-title text-base font-bold font-serif text-ink">
              Monitoring Peta Desa Real-Time
            </h3>
          </div>
          <p className="card-subtitle text-xs text-ink-soft">
            Kecamatan Ilir Timur I, Palembang, Sumatera Selatan (Citra Geografis Asli Aktif)
          </p>
        </div>

        {/* TOP RIGHT CONTROLS */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg border border-line bg-paper p-0.5">
            <button
              onClick={() => {
                setMapType("jalan");
                showToast("info", "Beralih ke tampilan Peta Jalan");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                mapType === "jalan"
                  ? "bg-green-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Peta Jalan
            </button>
            <button
              onClick={() => {
                setMapType("satelit");
                showToast("info", "Beralih ke tampilan Peta Satelit Asli");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                mapType === "satelit"
                  ? "bg-green-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Peta Asli (Satelit)
            </button>
          </div>

          <button
            onClick={handleReload}
            disabled={isReloading}
            className="btn btn-secondary btn-sm flex items-center gap-1 bg-white border border-line p-2 rounded-lg text-ink hover:bg-paper cursor-pointer"
            title="Muat Ulang Geografis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? "animate-spin" : ""}`} />
            <span className="text-xs font-bold">Reload Map</span>
          </button>

          <button
            onClick={() => setShowLargeMap(true)}
            className="btn btn-secondary btn-sm flex items-center gap-1 bg-white border border-line p-2 rounded-lg text-ink hover:bg-paper cursor-pointer"
          >
            <Maximize className="w-3.5 h-3.5 text-ink-soft" />
            <span className="text-xs font-bold">Buka Peta Besar</span>
          </button>
        </div>
      </div>

      <div className="card-body p-4">
        {/* MAP STAGE CONTAINER */}
        <div className="relative rounded-lg h-[340px] w-full border border-line overflow-hidden select-none bg-paper-deep">
          {_renderMapContent()}

          {/* FLOATING SYSTEM NAVIGATION BOX (G-MAPS) */}
          <div className="absolute top-4 left-4 z-10 max-w-[280px] bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-line animate-fadeIn">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-green-light flex items-center justify-center text-green-primary">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-serif text-ink">Sistem Navigasi G-Maps</h4>
                <p className="text-[10px] text-ink-soft">Palembang Satellite Feed</p>
              </div>
            </div>
            <p className="text-xs text-ink/90 leading-relaxed mb-3">
              Modul Peta Asli Palembang menyajikan citra satelit resolusi tinggi Kecamatan IT-I.
            </p>
            <div className="flex items-center gap-2 text-xs bg-green-light text-green-primary font-bold px-3 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-primary"></span>
              </span>
              <span>Live Radar : Satelit Asli Aktif</span>
            </div>
          </div>

          {/* LOWER RIGHT LEGEND */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-bold border border-line text-ink-soft flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-green-primary inline-block"></span>
            <span>{villages.length} Desa Terpetakan</span>
          </div>
        </div>
      </div>

      {/* EXPANDED LARGE MAP MODAL */}
      {showLargeMap && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <div className="p-4 border-b border-line flex justify-between items-center bg-paper">
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">Sistem Navigasi Satelit Interaktif IT-I</h3>
                <p className="text-xs text-ink-soft">Resolusi Tinggi Terintegrasi - Palembang, Sumatera Selatan</p>
              </div>
              <button
                onClick={() => setShowLargeMap(false)}
                className="w-8 h-8 rounded-lg bg-white border border-line text-ink-soft hover:text-clay hover:bg-clay-light flex items-center justify-center font-bold cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-[60vh] relative bg-paper-deep overflow-hidden">
              {_renderMapContent(true)}
            </div>
            <div className="p-4 border-t border-line flex justify-end gap-2 bg-paper">
              <button
                onClick={() => setShowLargeMap(false)}
                className="btn-secondary px-4 py-2 rounded-lg text-xs font-bold border border-line bg-white hover:bg-paper cursor-pointer"
              >
                Tutup Peta Besar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function _renderMapContent(isLarge = false) {
    return (
      <>
        {/* BASEMAP LAYERS */}
        {mapType === "satelit" ? (
          <img
            src="/src/assets/images/palembang_satellite_map_1782196831123.jpg"
            alt="Satelit Palembang IT-I"
            className="absolute inset-0 w-full h-full object-cover select-none transition-all duration-300 pointer-events-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#EFE6D6] transition-all duration-300 pointer-events-none">
            {/* Topographic Vector Road Mockup */}
            <svg className="w-full h-full opacity-60">
              {/* Rivers */}
              <path d="M 0,250 Q 300,280 600,240 T 1200,290" fill="none" stroke="#A5C6D6" strokeWidth="24" />
              <path d="M 400,260 Q 480,150 520,0" fill="none" stroke="#A5C6D6" strokeWidth="12" />
              {/* Major Roads */}
              <line x1="100" y1="0" x2="100" y2="400" stroke="#E6DCC8" strokeWidth="10" />
              <line x1="0" y1="180" x2="1200" y2="180" stroke="#E6DCC8" strokeWidth="8" />
              <line x1="28%" y1="55%" x2="78%" y2="48%" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="3,3" />
              <line x1="35%" y1="28%" x2="60%" y2="62%" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="3,3" />
            </svg>
            <div className="absolute top-1/2 left-32 font-serif font-bold text-ink-soft text-xl tracking-widest uppercase opacity-20 pointer-events-none">
              SUNGAI MUSI
            </div>
            <div className="absolute bottom-6 left-12 font-serif font-bold text-green-primary text-xs pointer-events-none tracking-wider opacity-35">
              KECAMATAN ILIR TIMUR I
            </div>
          </div>
        )}

        {/* GRID OVERLAYS / CONNECTIVE DASHED LINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Connection vectors between critical centers to mimic high tech monitoring maps */}
          <line x1="35%" y1="28%" x2="52%" y2="42%" stroke="#C9971C" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-70 animate-pulse" />
          <line x1="52%" y1="42%" x2="68%" y2="38%" stroke="#C9971C" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-70" />
          <line x1="52%" y1="42%" x2="60%" y2="62%" stroke="#C9971C" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-70" />
          <line x1="28%" y1="55%" x2="42%" y2="70%" stroke="#C9971C" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-70" />
        </svg>

        {/* LOCATION PINS */}
        {villages.map((v) => {
          const pos = pinPositions[v.nama];
          if (!pos) return null;
          return (
            <div
              key={v.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer text-center"
              onClick={() => onSelectVillage(v.nama)}
            >
              {/* Pulsating Radar Rings */}
              <div className="relative">
                <span className="absolute inline-flex h-9 w-9 rounded-full bg-green-primary opacity-30 animate-ping -left-3 -top-3"></span>
                <span className="absolute inline-flex h-6 w-6 rounded-full bg-gold opacity-15 animate-ping -left-1.5 -top-1.5" style={{ animationDelay: "0.5s" }}></span>

                {/* Main Pin */}
                <div className="w-6 h-6 rounded-full bg-green-primary text-white border-2 border-white flex items-center justify-center hover:bg-gold shadow-md transition-all duration-200 group-hover:scale-125">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Tag Label Box above pin */}
              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-ink text-white font-bold text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-150">
                Ds. {v.nama} ({v.penduduk} Jiwa)
              </div>
              <div className="mt-1 font-bold text-[11px] bg-white/70 backdrop-blur-sm shadow-sm border border-line px-1.5 py-0.5 rounded text-ink font-serif whitespace-nowrap translate-y-0.5 pointer-events-none">
                {v.nama}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}
