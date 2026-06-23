import { useState, FormEvent, startTransition } from "react";
import { 
  Plus, 
  Settings, 
  ShieldAlert, 
  Award, 
  Trash2, 
  Edit2, 
  Key, 
  Database, 
  Activity, 
  CheckCircle2, 
  X, 
  UserCheck, 
  RefreshCw, 
  FileText, 
  Filter, 
  Lock, 
  Unlock,
  AlertTriangle
} from "lucide-react";
import { Pengguna, LogAktivitas } from "../types";

interface PagePenggunaProps {
  users: Pengguna[];
  logs: LogAktivitas[];
  currentUser: Pengguna;
  onSelectCurrentUser: (user: Pengguna) => void;
  onAddUser: (p: Omit<Pengguna, "id">) => void;
  onUpdateUser: (u: Pengguna) => void;
  onDeleteUser: (id: string) => void;
  onToggleUserStatus: (id: string) => void;
  onAddLog: (tag: string, badgeStyle: string, action: string) => void;
  showToast: (type: "success" | "info" | "warn" | "error", msg: string) => void;
}

const LIST_DESA_SELECTION = [
  "Desa Sei Selayur",
  "Desa Talang Kelapa",
  "Desa Gandus",
  "Desa Kertapati",
  "Desa Plaju",
  "Desa Sako",
  "Desa Bukit Lama"
];

export default function PagePengguna({
  users,
  logs,
  currentUser,
  onSelectCurrentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleUserStatus,
  onAddLog,
  showToast
}: PagePenggunaProps) {
  const [activeTab, setActiveTab] = useState<"akun" | "role" | "pembatasan" | "log">("akun");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logTagFilter, setLogTagFilter] = useState("");

  // Modals visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Active target objects for edit / reset operations
  const [editingUser, setEditingUser] = useState<Pengguna | null>(null);
  const [resettingUser, setResettingUser] = useState<Pengguna | null>(null);

  // Form states for adding user
  const [newUser, setNewUser] = useState({
    nama: "",
    username: "",
    password: "",
    role: "Operator Desa" as "Super Admin" | "Admin Kecamatan" | "Operator Desa",
    instansi: "Desa Sei Selayur",
    status: "Aktif" as "Aktif" | "Nonaktif",
  });

  // Form states for password reset
  const [newResetPassword, setNewResetPassword] = useState("");

  // Active highlighted role state inside permission matrix
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<"Super Admin" | "Admin Kecamatan" | "Operator Desa">("Operator Desa");

  const filteredUsers = users.filter((u) => {
    const matchSearch = 
      u.nama.toLowerCase().includes(search.toLowerCase()) || 
      u.username.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const filteredLogs = logs.filter((l) => {
    const matchSearch = 
      l.action.toLowerCase().includes(logSearch.toLowerCase()) || 
      l.user.toLowerCase().includes(logSearch.toLowerCase());
    const matchTag = !logTagFilter || l.tag === logTagFilter;
    return matchSearch && matchTag;
  });

  const handleSubmitAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newUser.nama.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      showToast("warn", "Nama, username, dan password wajib diisi!");
      return;
    }

    // Check duplicate username
    const usernameExists = users.some((u) => u.username.toLowerCase() === newUser.username.trim().toLowerCase());
    if (usernameExists) {
      showToast("error", `Username "${newUser.username}" sudah digunakan, silakan pilih username lain.`);
      return;
    }

    onAddUser({
      nama: newUser.nama.trim(),
      username: newUser.username.trim(),
      password: newUser.password.trim(),
      role: newUser.role,
      instansi: newUser.role === "Operator Desa" ? newUser.instansi : "Pemerintah Kecamatan",
      status: newUser.status,
      loginTerakhir: "Belum pernah"
    });

    setNewUser({
      nama: "",
      username: "",
      password: "",
      role: "Operator Desa",
      instansi: "Desa Sei Selayur",
      status: "Aktif",
    });
    setShowAddModal(false);
  };

  const handleEditClick = (user: Pengguna) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSubmitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.nama.trim() || !editingUser.username.trim()) {
      showToast("warn", "Nama lengkap dan username tidak boleh kosong!");
      return;
    }

    // Check duplicate username excluding self
    const usernameExists = users.some(
      (u) => u.id !== editingUser.id && u.username.toLowerCase() === editingUser.username.trim().toLowerCase()
    );
    if (usernameExists) {
      showToast("error", `Username "${editingUser.username}" sudah dipakai akun lain.`);
      return;
    }

    onUpdateUser({
      ...editingUser,
      nama: editingUser.nama.trim(),
      username: editingUser.username.trim(),
      instansi: editingUser.role === "Operator Desa" ? editingUser.instansi : "Pemerintah Kecamatan"
    });

    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleResetPasswordClick = (user: Pengguna) => {
    setResettingUser(user);
    setNewResetPassword("");
    setShowResetModal(true);
  };

  const handleGenerateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewResetPassword(password);
    showToast("info", "Password acak berhasil dibuat!");
  };

  const handleSubmitResetPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newResetPassword.trim()) {
      showToast("warn", "Password baru wajib diisi!");
      return;
    }

    onUpdateUser({
      ...resettingUser,
      password: newResetPassword.trim()
    });

    onAddLog(
      "KEAMANAN", 
      "bg-red-light text-red-dark", 
      `Mengubah / mereset password baru untuk operator <strong>${resettingUser.username}</strong>`
    );

    showToast("success", `Password untuk "${resettingUser.username}" berhasil di-reset.`);
    setShowResetModal(false);
    setResettingUser(null);
  };

  const handleDeleteClick = (user: Pengguna) => {
    setShowDeleteConfirm(user.id);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteUser(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="pengguna-hak-akses-root">
      {/* PAGE HEADER */}
      <div className="page-header mb-4" id="section-view-header">
        <div className="page-header-top flex justify-between items-start flex-wrap gap-4 mb-3">
          <div className="page-header-left">
            <span className="text-[10px] uppercase font-bold text-green-primary tracking-widest block mb-0.5 font-mono">Keamanan & Otoritas</span>
            <h2 className="text-2xl font-bold font-serif text-ink">Pengguna & Hak Akses</h2>
            <p className="text-xs text-ink-soft">Daftar operator portal desa, pengaturan matriks hak akses, demonstrasi pembatasan wilayah, dan log audit kecamatan</p>
          </div>
          {currentUser.role === "Super Admin" && (
            <button
              id="btn-tambah-operator"
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Akun Operator</span>
            </button>
          )}
        </div>
        <div className="motif"></div>
      </div>

      {/* CORE SUBTABS NAVIGATION */}
      <div className="tabs border-b border-line flex gap-1 overflow-x-auto" id="subtabs-pane">
        {(["akun", "role", "pembatasan", "log"] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-proc-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`tab px-4 py-3 text-xs font-bold font-serif capitalize border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === tab
                ? "border-b-gold text-green-primary bg-white/20"
                : "border-b-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "akun" 
              ? "Manajemen Akun" 
              : tab === "role" 
              ? "Role & Permission" 
              : tab === "pembatasan"
              ? "Pembatasan Data per Desa"
              : "Log Audit Aktivitas"}
          </button>
        ))}
      </div>

      {/* TAB PANEL 1: MANAJEMEN AKUN */}
      {activeTab === "akun" && (
        <div className="space-y-6 animate-fadeIn" id="tab-manajemen-akun">
          {/* SEARCH CONTROL BAR */}
          <div className="card bg-white border border-line p-4 rounded-xl shadow-sm flex flex-wrap gap-2.5 items-center justify-between">
            <div className="flex gap-2 items-center flex-1 max-w-md">
              <input
                id="search-pengguna"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama pengguna atau username..."
                className="form-control text-xs w-full border border-line-strong p-2 rounded-lg bg-white outline-none focus:border-gold"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <select
                id="filter-role-pengguna"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white text-ink font-bold outline-none"
              >
                <option value="">Semua Otoritas</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin Kecamatan">Admin Kecamatan</option>
                <option value="Operator Desa">Operator Desa</option>
              </select>
            </div>
          </div>

          {/* TABLE ACCOUNT LIST */}
          <div className="card bg-white border border-line rounded-xl overflow-hidden shadow-sm" id="table-pengguna-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="table-user-accounts">
                <thead>
                  <tr className="bg-paper border-b border-line">
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider">Nama Akun</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider">Username</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider">Role Otoritas</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider">Wilayah Kerja / Instansi</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Status</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider">Kredensial</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider">Log Terakhir</th>
                    <th className="p-3.5 text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isSystemSelf = u.id === currentUser.id;
                    return (
                      <tr key={u.id} className="border-b border-paper-deep hover:bg-paper/10 transition-all">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-light text-green-primary flex items-center justify-center font-bold text-xs shrink-0 font-serif">
                              {u.nama.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2)}
                            </div>
                            <div>
                              <span className="font-bold text-ink text-xs block">{u.nama}</span>
                              {isSystemSelf && (
                                <span className="text-[9px] uppercase tracking-wider font-bold text-gold bg-gold-light/40 px-1.5 py-0.2 rounded mt-0.5 inline-block">Sesi Aktif</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-xs font-mono text-ink-soft">{u.username}</td>
                        <td className="p-3.5 text-xs font-bold">
                          <span className={`badge px-2.5 py-0.5 rounded-full text-[10px] ${
                            u.role === "Super Admin" 
                              ? "bg-gold-light text-gold-dark" 
                              : u.role === "Admin Kecamatan"
                              ? "bg-plum-light text-plum"
                              : "bg-teal-light text-teal-dark"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs font-semibold text-ink">{u.role === "Operator Desa" ? u.instansi : "Pemerintah Kecamatan"}</td>
                        <td className="p-3.5 text-center">
                          <span className={`badge text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            u.status === "Aktif" 
                              ? "bg-green-light text-green-primary" 
                              : "bg-clay-light text-clay"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[11px] text-ink-soft bg-paper px-1.5 py-0.5 rounded max-w-[100px] truncate" title={u.password || "••••••••"}>
                              {u.password || "••••••••"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-xs font-mono text-ink-soft">{u.loginTerakhir}</td>
                        <td className="p-3.5">
                          <div className="flex gap-1.5 justify-center">
                            {/* Manage Account buttons - restricted if current user has no super authority, except editing themselves */}
                            <button
                              title="Ubah Detail Akun"
                              onClick={() => handleEditClick(u)}
                              disabled={currentUser.role !== "Super Admin" && !isSystemSelf}
                              className={`p-1.5 rounded-lg transition-all ${
                                currentUser.role === "Super Admin" || isSystemSelf
                                  ? "bg-paper-deep text-ink-soft hover:bg-gold hover:text-white cursor-pointer"
                                  : "text-ink/20 bg-paper cursor-not-allowed"
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              title="Reset Password Kredensial"
                              onClick={() => handleResetPasswordClick(u)}
                              disabled={currentUser.role !== "Super Admin" && !isSystemSelf}
                              className={`p-1.5 rounded-lg transition-all ${
                                currentUser.role === "Super Admin" || isSystemSelf
                                  ? "bg-paper-deep text-ink-soft hover:bg-teal-dark hover:text-white cursor-pointer"
                                  : "text-ink/20 bg-paper cursor-not-allowed"
                              }`}
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Enable/Disable Toggle option */}
                            <button
                              title={u.status === "Aktif" ? "Disable Akun (Suspended)" : "Aktifkan Akun"}
                              disabled={currentUser.role !== "Super Admin" || isSystemSelf}
                              onClick={() => onToggleUserStatus(u.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                currentUser.role === "Super Admin" && !isSystemSelf
                                  ? u.status === "Aktif"
                                    ? "bg-clay-light text-clay hover:bg-clay hover:text-white cursor-pointer"
                                    : "bg-green-light text-green-primary hover:bg-green-primary hover:text-white cursor-pointer"
                                  : "text-ink/20 bg-paper cursor-not-allowed"
                              }`}
                            >
                              {u.status === "Aktif" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete row with visual confirmation modal */}
                            {showDeleteConfirm === u.id ? (
                              <div className="flex items-center gap-1 animate-fadeIn">
                                <button
                                  onClick={() => handleConfirmDelete(u.id)}
                                  className="text-[10px] bg-clay text-white font-bold px-1.5 py-1 rounded hover:bg-clay-deep shrink-0 shadow-sm"
                                >
                                  Ya, Hapus
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="text-[10px] bg-paper-deep text-ink font-bold px-1.5 py-1 rounded shrink-0"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                title="Hapus Akun Operator"
                                disabled={currentUser.role !== "Super Admin" || isSystemSelf}
                                onClick={() => handleDeleteClick(u)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  currentUser.role === "Super Admin" && !isSystemSelf
                                    ? "bg-paper-deep text-ink-soft hover:bg-clay hover:text-white cursor-pointer"
                                    : "text-ink/20 bg-paper cursor-not-allowed"
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-xs text-ink-soft">
                        Tidak ada akun operator yang cocok dengan pencarian "{search}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 2: ROLE & PERMISSION MATRIX MAPS */}
      {activeTab === "role" && (
        <div className="space-y-6 animate-fadeIn" id="tab-peran-otoritas">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ROLE SUMMARY CARDS (STAGGERED SELECTION) */}
            <div className="lg:col-span-1 space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-green-primary mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold" />
                <span>Pilih Tipe Peran Otoritas</span>
              </h4>
              
              {["Super Admin", "Admin Kecamatan", "Operator Desa"].map((rk) => {
                const isSelected = selectedRoleDetail === rk;
                return (
                  <button
                    key={rk}
                    onClick={() => startTransition(() => setSelectedRoleDetail(rk as any))}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected 
                        ? "border-gold bg-gold-light/25 shadow-sm" 
                        : "border-line bg-white hover:bg-paper"
                    }`}
                  >
                    <div>
                      <h5 className="font-serif font-bold text-ink text-sm capitalize">{rk}</h5>
                      <p className="text-[10px] text-ink-soft mt-0.5">
                        {rk === "Super Admin" 
                          ? "Kewenangan penuh seluruh kecamatan & desa" 
                          : rk === "Admin Kecamatan"
                          ? "Fungsi pengawasan & verifikator wilayah"
                          : "Kewenangan lokal terbatas khusus milik desa"}
                      </p>
                    </div>
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0"></span>}
                  </button>
                );
              })}

              <div className="card border border-amber-500/30 bg-amber-50/70 rounded-xl p-4 text-xs text-amber-900 mt-4 leading-relaxed">
                <div className="flex gap-2 items-start">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold underline mb-1">Catatan Keamanan Penting</h5>
                    Sistem beroperasi berdasarkan standard pemisahan data aman (Data Siloing). Operator Desa hanya diijinkan mengedit rincian, mendaftar perangkat, publikasi komoditas, lapak, dan aset milik desanya sesuai pemetaan metadata instansinya.
                  </div>
                </div>
              </div>
            </div>

            {/* EXPANDED ROLE DETAIL VIEWS */}
            <div className="lg:col-span-2">
              <div className="card bg-white border border-line rounded-xl shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-paper-deep pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-ink-soft tracking-wider font-mono">Daftar Detail Otorisasi</span>
                    <h4 className="font-serif font-extrabold text-ink text-lg capitalize">{selectedRoleDetail}</h4>
                  </div>
                  <span className="badge px-3 py-1 bg-green-light text-green-primary font-bold rounded-lg text-xs">
                    {selectedRoleDetail === "Super Admin" ? "Admin Level 1" : selectedRoleDetail === "Admin Kecamatan" ? "Admin Level 2" : "Operator Lokal"}
                  </span>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-ink uppercase tracking-wider">Daftar Hak Akses Sistem:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRoleDetail === "Super Admin" && (
                      <>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Semua Hak Akses</strong> Mengelola seluruh data dari 7 desa tanpa batasan visual.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Manajemen Pengguna</strong> Menambah, mengedit, menonaktifkan, dan menghapus seluruh akun operator.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Security Reset (Lupa Akses)</strong> Mengintervensi, mereset password, dan mengunci akses akun bermasalah.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Audit Log & Trace</strong> Meninjau seluruh kronologi aktivitas dan menelusuri penyelewengan operator.</div>
                        </div>
                      </>
                    )}

                    {selectedRoleDetail === "Admin Kecamatan" && (
                      <>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Melihat Semua Desa</strong> Dapat melihat data, profil komoditas, dan lapak seluruh 7 desa.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Kirim Instruksi (Notice)</strong> Menambahkan instruksi kedinasan yang disematkan ke dasbor kelurahan.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Melihat Log Audit</strong> Membaca kronologi log, login, update komoditas yang diajukan desa.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs opacity-55">
                          <X className="w-4 h-4 text-clay shrink-0 mt-0.5" />
                          <div><strong className="block text-ink-soft">Dilarang Ubah Pengguna</strong> Tidak diijinkan melakukan manipulasi profil user administrator lain.</div>
                        </div>
                      </>
                    )}

                    {selectedRoleDetail === "Operator Desa" && (
                      <>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Kelola Potensi Desa Pribadi</strong> Bebas mengedit demografis, mendaftar komoditas, news, dan lapak desa miliknya.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Ubah Profil Administrasi</strong> Berhak membaharui data penduduk, kepemilikan aset, dan kepala urusan desanya.</div>
                        </div>
                        <div className="p-3 bg-paper text-orange-200/50 rounded-lg flex items-start gap-2 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div><strong className="block text-ink">Pembatasan Samping (Data Isolation)</strong> Otomatis di-filter agar tidak dapat melihat atau mengedit data kependudukan desa tetangga.</div>
                        </div>
                        <div className="p-3 bg-paper rounded-lg flex items-start gap-2 text-xs opacity-55">
                          <X className="w-4 h-4 text-clay shrink-0 mt-0.5" />
                          <div><strong className="block text-ink-soft">Tidak Ada Akses Keamanan</strong> Dilarang mengakses menu pengaturan kredensial server dan log aktivitas audit.</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-paper-deep pt-4">
                  <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Visualisasi Matriks Akses</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]" id="visualisation-matrix-mini">
                      <thead>
                        <tr className="bg-paper border-b border-line text-ink-soft font-mono">
                          <th className="p-2 font-bold select-none">Fiting Otoritas</th>
                          <th className="p-2 font-bold text-center select-none">Baca Semua Desa</th>
                          <th className="p-2 font-bold text-center select-none">Tambah/Hapus Data</th>
                          <th className="p-2 font-bold text-center select-none">Edit Pengguna</th>
                          <th className="p-2 font-bold text-center select-none">Tinjau Log Internal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-paper-deep font-semibold">
                          <td className="p-2 text-gold-dark font-serif">Super Admin</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                        </tr>
                        <tr className="border-b border-paper-deep font-semibold">
                          <td className="p-2 text-plum font-serif">Admin Kecamatan</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                          <td className="p-2 text-center text-clay">✕ Terlarang</td>
                          <td className="p-2 text-center text-green-primary">✓ Diizinkan</td>
                        </tr>
                        <tr className="border-b border-paper-deep font-semibold">
                          <td className="p-2 text-teal-dark font-serif">Operator Desa</td>
                          <td className="p-2 text-center text-clay">✕ Terlarang</td>
                          <td className="p-2 text-center text-green-primary">✓ Desa Sendiri</td>
                          <td className="p-2 text-center text-clay">✕ Terlarang</td>
                          <td className="p-2 text-center text-clay">✕ Terlarang</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB PANEL 3: PEMBATASAN DATA PER DESA (INSTRUCTION & QUICK SIMULATOR) */}
      {activeTab === "pembatasan" && (
        <div className="space-y-6 animate-fadeIn" id="tab-pembatasan-data">
          
          {/* SANDBOX ENFORCEMENT CALLOUT */}
          <div className="card bg-white border border-line rounded-xl p-5 shadow-sm">
            <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center">
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-1.5 bg-red-50 text-clay px-2.5 py-1 rounded-lg text-xs font-bold border border-clay-light">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Sistem Isolasi Sandbox (Enforced)</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-ink">Batas Otoritas Sesi & Pemisahan Data Komunitas</h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Sistem keamanan interaktif SIMDES mengaktifkan <strong>Multi-Tenant Data Siloing</strong>. 
                  Ketika pengguna login sebagai operator desa (misal: <em>Op. Sei Selayur</em>), sistem secara otomatis mengunci menu dropdown pilihan desa di formulir perangkat maupun monografi kependudukan, serta mem-filter draf kependudukan, lapak-lapak komoditas warga, publikasi blog, dan rekap aset hanya yang dimiliki oleh desa tersebut.
                </p>
                <div className="text-[11px] font-mono p-3 bg-paper border border-line-strong rounded-xl text-ink leading-relaxed">
                  <span className="text-green-primary font-bold">✓ Kebijakan Aktif:</span> Untuk menjamin keselamatan dan kedaulatan data desa, database akan menolak seluruh kueri yang mengarah ke data desa di luar kewenangan operator yang sedang login.
                </div>
              </div>
              
              <div className="w-full lg:w-[280px] shrink-0 p-4 border border-line-strong bg-paper/50 rounded-2xl flex flex-col justify-between space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-ink-soft font-mono">Sesi Deteksi Router</span>
                <div>
                  <div className="text-xs text-ink-soft mb-1 font-bold">Identitas:</div>
                  <div className="text-sm font-bold font-serif text-green-primary">{currentUser.nama}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-soft mb-1 font-bold">Kewenangan Wilayah:</div>
                  <div className="text-xs font-mono font-bold text-ink bg-white/80 p-1.5 rounded border border-line">
                    {currentUser.role === "Operator Desa" ? currentUser.instansi : "Seluruh Desa (Kecamatan)"}
                  </div>
                </div>
                <div className="text-[10.5px] text-ink-soft flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Status Proteksi Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-paper/20 rounded-xl p-1">
            
            {/* TERMINAL LIST */}
            <div className="card bg-white border border-line rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-ink text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-paper-deep pb-2 mb-3">
                  <Activity className="w-4 h-4 text-green-primary" />
                  <span>Terminal Simulasi Operator Desa</span>
                </h4>
                <p className="text-xs text-ink-soft mb-4">
                  Klik tombol <strong>"Beralih Masuk"</strong> pada salah satu operator desa di bawah ini untuk melihat bagaimana data kearsipan penduduk, lapak komoditas warga, aset, berita publikasi, dan perangkat desa otomatis ter-filter instan.
                </p>
                
                <div className="space-y-2.5">
                  {users.map((u) => {
                    const isActive = u.id === currentUser.id;
                    return (
                      <div 
                        key={u.id}
                        className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                          isActive 
                            ? "bg-green-light/25 border-green-primary shadow-sm"
                            : "bg-white hover:bg-paper border-line"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink font-serif">{u.nama}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-plum-light text-plum px-1.5 rounded">{u.role}</span>
                          </div>
                          <div className="text-[10px] text-ink-soft font-mono mt-0.5">
                            username: {u.username} · {u.role === "Operator Desa" ? `Tugas: ${u.instansi}` : "Tugas: Kecamatan"}
                          </div>
                        </div>
                        
                        {isActive ? (
                          <span className="text-xs font-bold text-green-primary flex items-center gap-1">
                            <UserCheck className="w-4 h-4 shrink-0" />
                            <span>Sedang login</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onSelectCurrentUser(u)}
                            disabled={u.status === "Nonaktif"}
                            className={`btn text-[10.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                              u.status === "Nonaktif"
                                ? "bg-paper text-ink-soft/40 cursor-not-allowed"
                                : "bg-green-primary hover:bg-green-dark text-white cursor-pointer hover:shadow-xs"
                            }`}
                          >
                            <span>Beralih Sesi</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ILLUSTRATED DIAGRAM SANDBOX */}
            <div className="card bg-white border border-line rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-ink text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-paper-deep pb-2 mb-3">
                  <Database className="w-4 h-4 text-gold" />
                  <span>Diagram Arsitektur Proteksi Sandbox</span>
                </h4>
                
                <div className="space-y-4 text-xs mt-3">
                  <div className="flex items-center gap-3 bg-paper p-3 rounded-xl border border-line-strong">
                    <div className="w-10 h-10 rounded-xl bg-gold text-green-dark flex items-center justify-center font-bold font-serif shadow-sm shrink-0">
                      DB
                    </div>
                    <div>
                      <strong className="block text-ink">Pusat Data Terpadu SIMDES</strong>
                      <span className="text-[10.5px] text-ink-soft block mt-0.5">Menyimpan arsip 7 desa (Kependudukan, Lapak, Perangkat, Aset)</span>
                    </div>
                  </div>

                  <div className="flex justify-center py-1">
                    <div className="h-6 w-0.5 bg-line border-dashed border"></div>
                  </div>

                  <div className="bg-green-light/20 p-3.5 rounded-xl border border-green-primary border-dashed relative">
                    <span className="absolute -top-2.5 left-4 bg-green-primary text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider uppercase select-none shadow">
                      Otoritas Router Engine
                    </span>
                    <div className="space-y-2 mt-1">
                      <div className="flex justify-between items-center text-[11px] font-mono border-b border-paper pb-1">
                        <span className="text-ink-soft">Simulasi User Terdeteksi:</span>
                        <span className="text-green-primary font-bold">{currentUser.username}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-ink-soft">Aturan Filter Kueri:</span>
                        <span className="text-amber-700 font-bold">
                          {currentUser?.role === "Operator Desa" 
                            ? `SELECT WHERE desa = '${(currentUser?.instansi || "").replace("Desa ", "")}'` 
                            : "ALLOW ALL (Semua Desa)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center py-1">
                    <div className="h-6 w-0.5 bg-line border-dashed border"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10.5px]">
                    <div className={`p-2.5 rounded-lg border transition-all ${
                      currentUser.role === "Operator Desa" && currentUser.instansi !== "Desa Sei Selayur"
                        ? "bg-paper text-ink-soft/40 border-line border-dashed opacity-55"
                        : "bg-paper-deep text-green-primary font-bold border-green-primary/30"
                    }`}>
                      Desa Sei Selayur {currentUser.role === "Operator Desa" && currentUser.instansi !== "Desa Sei Selayur" ? "[Terkunci]" : "[Terbuka]"}
                    </div>
                    <div className={`p-2.5 rounded-lg border transition-all ${
                      currentUser.role === "Operator Desa" && currentUser.instansi !== "Desa Talang Kelapa"
                        ? "bg-paper text-ink-soft/40 border-line border-dashed opacity-55"
                        : "bg-paper-deep text-green-primary font-bold border-green-primary/30"
                    }`}>
                      Desa Talang Kelapa {currentUser.role === "Operator Desa" && currentUser.instansi !== "Desa Talang Kelapa" ? "[Terkunci]" : "[Terbuka]"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB PANEL 4: LOG AUDIT AKTIVITAS */}
      {activeTab === "log" && (
        <div className="card bg-white border border-line rounded-xl p-5 shadow-sm animate-fadeIn" id="tab-log-audit">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-deep pb-4 mb-4">
            <div>
              <h4 className="font-bold font-serif text-ink text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-teal-dark" />
                <span>Kronologi Mutasi Pangkalan Data (Audit Trail Ledger)</span>
              </h4>
              <p className="text-[11px] text-ink-soft mt-0.5">Catatan tidak tertandingi mengenai penambahan, pengeditan, penghapusan data, tindakan validasi & login</p>
            </div>
            
            <div className="flex gap-2.5 flex-wrap w-full md:w-auto">
              <input
                id="search-audit-log"
                type="text"
                placeholder="Cari kata kunci, nama operator..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white outline-none focus:border-green-primary w-full md:w-[220px]"
              />
              <select
                id="filter-tag-audit-log"
                value={logTagFilter}
                onChange={(e) => setLogTagFilter(e.target.value)}
                className="form-control text-xs border border-line-strong p-2 rounded-lg bg-white text-ink font-bold outline-none cursor-pointer"
              >
                <option value="">Semua Tindakan</option>
                <option value="LOGIN">LOGIN</option>
                <option value="TAMBAH">TAMBAH</option>
                <option value="UBAH">UBAH</option>
                <option value="HAPUS">HAPUS</option>
                <option value="VALIDASI">VALIDASI</option>
                <option value="KEAMANAN">KEAMANAN</option>
              </select>
              
              <button
                onClick={() => {
                  showToast("success", "Audit trail terenkripsi berhasil diunduh dalam berkas CSV!");
                }}
                className="btn text-xs font-bold text-green-primary border border-green-primary/30 bg-green-light/20 hover:bg-green-primary hover:text-white px-3 py-2 rounded-lg cursor-pointer transition-all shrink-0"
              >
                Download Ledger CSV
              </button>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredLogs.map((lg) => (
              <div 
                key={lg.id} 
                className="flex flex-wrap md:flex-nowrap justify-between items-center text-xs p-3.5 rounded-xl border border-paper-deep bg-paper/30 hover:bg-white transition-all space-y-2 md:space-y-0"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className={`font-mono font-bold text-[9px] px-2.5 py-0.5 rounded tracking-wider uppercase shrink-0 mt-0.5 ${
                    lg.tag === "LOGIN"
                      ? "bg-green-light text-green-dark"
                      : lg.tag === "HAPUS" || lg.tag === "KEAMANAN"
                      ? "bg-clay-light text-clay"
                      : lg.tag === "TAMBAH"
                      ? "bg-teal-light text-teal-dark"
                      : lg.tag === "UBAH"
                      ? "bg-gold-light text-gold-dark"
                      : "bg-plum-light text-plum"
                  }`}>
                    {lg.tag}
                  </span>
                  <div className="min-w-0">
                    <p className="text-ink leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: lg.action }}></p>
                    <div className="text-[10px] text-ink-soft select-none font-medium mt-1">
                      Pelaku: <strong className="text-ink">{lg.user}</strong> · IP: 192.168.12.{(lg.id.charCodeAt(0) % 250) + 1}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink-soft shrink-0 ml-3">{lg.time}</span>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-xs text-ink-soft">
                Tidak ada entri log keamanan yang cocok dengan kriteria pencarian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD ACCOUNT OPERATOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleSubmitAdd}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center shadow-xs">
                <h3 className="font-serif font-extrabold text-base text-ink block">Mendaftarkan Operator Baru</h3>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-paper-deep rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-ink-soft" />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Lengkap Operator *</label>
                  <input
                    type="text"
                    required
                    name="nama"
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none bg-white"
                    placeholder="Contoh: Muhammad Yusuf, S.Kom"
                    value={newUser.nama}
                    onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Username Unik *</label>
                    <input
                      type="text"
                      required
                      name="username"
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none font-mono bg-white"
                      placeholder="op.yusuf"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Password Akses *</label>
                    <input
                      type="text"
                      required
                      name="password"
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none font-mono bg-white"
                      placeholder="Min 6 karakter"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Role Matriks</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white font-bold outline-none"
                      name="role"
                      value={newUser.role}
                      onChange={(e) => {
                        const targetRole = e.target.value as any;
                        setNewUser({ ...newUser, role: targetRole });
                      }}
                    >
                      <option value="Operator Desa">Operator Desa</option>
                      <option value="Admin Kecamatan">Admin Kecamatan</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Status Penugasan</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white outline-none"
                      name="status"
                      value={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                {newUser.role === "Operator Desa" && (
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Instansi / Desa Tugas *</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white font-serif font-semibold outline-none"
                      name="instansi"
                      value={newUser.instansi}
                      onChange={(e) => setNewUser({ ...newUser, instansi: e.target.value })}
                    >
                      {LIST_DESA_SELECTION.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-ink-soft mt-1 block font-mono">Pemasangan instansi mengikat kedaulatan data desa.</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ACCOUNT DETAILS */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleSubmitEdit}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center shadow-xs">
                <h3 className="font-serif font-extrabold text-base text-ink block">Sunting Akun Operator</h3>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-paper-deep rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-ink-soft" />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Nama Lengkap Operator *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none bg-white"
                    value={editingUser.nama}
                    onChange={(e) => setEditingUser({ ...editingUser, nama: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Username Unik *</label>
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none font-mono bg-white"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Role Otoritas</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white font-bold outline-none"
                      value={editingUser.role}
                      onChange={(e) => {
                        const targetRole = e.target.value as any;
                        setEditingUser({ ...editingUser, role: targetRole });
                      }}
                    >
                      <option value="Operator Desa">Operator Desa</option>
                      <option value="Admin Kecamatan">Admin Kecamatan</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Status Penugasan</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white outline-none"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                {editingUser.role === "Operator Desa" && (
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Instansi / Desa Tugas *</label>
                    <select
                      className="form-control text-xs w-full p-2.5 border border-line rounded-lg bg-white font-serif font-semibold outline-none"
                      value={editingUser.instansi}
                      onChange={(e) => setEditingUser({ ...editingUser, instansi: e.target.value })}
                    >
                      {LIST_DESA_SELECTION.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESET PASSWORD ADMINISTRATOR */}
      {showResetModal && resettingUser && (
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-line animate-fadeIn">
            <form onSubmit={handleSubmitResetPassword}>
              <div className="p-4 border-b border-line bg-paper flex justify-between items-center shadow-xs">
                <h3 className="font-serif font-extrabold text-base text-ink block">Reset Password Kredensial</h3>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => {
                    setShowResetModal(false);
                    setResettingUser(null);
                  }}
                  className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-paper-deep rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-ink-soft" />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="p-3 bg-red-50 text-clay-dark border border-clay-light text-xs rounded-xl flex gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <div>
                    Pastikan Anda memberikan password baru ini hanya kepada personil operator yang bersangkutan (<strong>{resettingUser.nama}</strong>). Tindakan keamanan ini dicatat di Audit Log.
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-0.5">Username Operator</label>
                  <div className="text-xs font-mono font-bold text-ink-soft bg-paper p-2.5 rounded-lg border border-line select-all">
                    {resettingUser.username}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-ink">Password Baru Akses *</label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomPassword}
                      className="text-[10.5px] font-bold text-green-primary hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Buat Password Acak</span>
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    required
                    className="form-control text-xs w-full p-2.5 border border-line rounded-lg focus:border-green-primary outline-none font-mono bg-white"
                    placeholder="Masukkan sandi baru"
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="p-4 border-t border-line bg-paper flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResettingUser(null);
                  }}
                  className="btn-secondary text-xs font-bold px-4 py-2 border border-line bg-white rounded-lg hover:bg-paper cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-primary hover:bg-green-dark text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
