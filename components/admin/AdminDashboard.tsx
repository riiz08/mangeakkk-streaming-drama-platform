"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Film,
  Tv,
  Plus,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  Sparkles,
  Layers,
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Search,
  RotateCcw,
  Loader2,
  CloudUpload,
  HardDrive,
  Info,
} from "lucide-react";
import { Content, AdminStats } from "@/lib/data/db";
import BadgeLabel from "@/components/ui/BadgeLabel";
import R2Uploader from "@/components/admin/R2Uploader";
import {
  createContentAction,
  updateContentAction,
  deleteContentAction,
  seedDefaultContentsAction,
} from "@/app/actions/content";

const AUTH_KEY = "mangeakkk_admin_auth_v1";
const ADMIN_PASSWORD = "admin123";

interface AdminDashboardProps {
  initialContents: Content[];
  stats?: AdminStats;
}

export default function AdminDashboard({ initialContents, stats }: AdminDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Active Tab: "overview" | "manage" | "create"
  const [activeTab, setActiveTab] = useState<"overview" | "manage" | "create">("overview");

  // Content List State
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "tv-series" | "film">("all");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // R2 Storage Configuration state
  const [r2Configured, setR2Configured] = useState<boolean | null>(null);

  // Form State for Create / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formType, setFormType] = useState<"tv-series" | "film">("tv-series");
  const [formPoster, setFormPoster] = useState("");
  const [formBackdrop, setFormBackdrop] = useState("");
  const [formSynopsis, setFormSynopsis] = useState("");
  const [formYear, setFormYear] = useState(new Date().getFullYear());
  const [formCountry, setFormCountry] = useState("Korea Selatan");
  const [formDuration, setFormDuration] = useState("60 min/ep");
  const [formVideoUrl, setFormVideoUrl] = useState("");

  // Badges
  const [formIsTrending, setFormIsTrending] = useState(false);
  const [formHasNewEpisode, setFormHasNewEpisode] = useState(false);
  const [formIsPilihan, setFormIsPilihan] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Episodes List for TV-series
  const [formEpisodes, setFormEpisodes] = useState<
    { number: number; slug: string; title: string; videoUrl: string; duration: string }[]
  >([
    {
      number: 1,
      slug: "episode-1",
      title: "Episode 1",
      duration: "60m",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  ]);

  // Load auth state from LocalStorage & check R2 status
  useEffect(() => {
    setIsClient(true);
    const authSaved = localStorage.getItem(AUTH_KEY);
    if (authSaved === "true") {
      setIsAuthenticated(true);
    }

    // Check Cloudflare R2 upload status
    fetch("/api/upload")
      .then((res) => res.json())
      .then((data) => setR2Configured(Boolean(data.configured)))
      .catch(() => setR2Configured(false));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, "true");
      }
    } else {
      setLoginError("Password salah! (Gunakan: admin123)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  };

  const autoGenerateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingId) {
      setFormSlug(autoGenerateSlug(val));
    }
  };

  const handleAddEpisodeRow = () => {
    const nextNum = formEpisodes.length + 1;
    setFormEpisodes([
      ...formEpisodes,
      {
        number: nextNum,
        slug: `episode-${nextNum}`,
        title: `Episode ${nextNum}`,
        duration: "60m",
        videoUrl: "",
      },
    ]);
  };

  const handleRemoveEpisodeRow = (index: number) => {
    if (formEpisodes.length <= 1) return;
    setFormEpisodes(formEpisodes.filter((_, i) => i !== index));
  };

  const handleEpisodeChange = (index: number, field: string, val: any) => {
    const updated = [...formEpisodes];
    updated[index] = { ...updated[index], [field]: val };
    setFormEpisodes(updated);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormSlug("");
    setFormType("tv-series");
    setFormPoster("");
    setFormBackdrop("");
    setFormSynopsis("");
    setFormYear(new Date().getFullYear());
    setFormCountry("Korea Selatan");
    setFormDuration("60 min/ep");
    setFormVideoUrl("");
    setFormIsTrending(false);
    setFormHasNewEpisode(false);
    setFormIsPilihan(false);
    setFormIsFeatured(false);
    setFormEpisodes([
      {
        number: 1,
        slug: "episode-1",
        title: "Episode 1",
        duration: "60m",
        videoUrl: "",
      },
    ]);
  };

  const handleEditContent = (item: Content) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormSlug(item.slug);
    setFormType(item.type);
    setFormPoster(item.poster);
    setFormBackdrop(item.backdrop);
    setFormSynopsis(item.synopsis);
    setFormYear(item.year);
    setFormCountry(item.country);
    setFormDuration(item.duration);
    setFormVideoUrl(item.videoUrl || "");
    setFormIsTrending(Boolean(item.isTrending));
    setFormHasNewEpisode(Boolean(item.hasNewEpisode));
    setFormIsPilihan(Boolean(item.isPilihan));
    setFormIsFeatured(Boolean(item.isFeatured));

    if (item.episodes && item.episodes.length > 0) {
      setFormEpisodes(
        item.episodes.map((ep) => ({
          number: ep.number,
          slug: ep.slug,
          title: ep.title,
          duration: ep.duration,
          videoUrl: ep.videoUrl,
        }))
      );
    } else {
      setFormEpisodes([
        {
          number: 1,
          slug: "episode-1",
          title: "Episode 1",
          duration: "60m",
          videoUrl: item.videoUrl || "",
        },
      ]);
    }
    setActiveTab("create");
  };

  const handleDeleteContent = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus "${title}" dari database?`)) return;

    setIsSubmitting(true);
    setFeedbackMsg("");
    setFeedbackError("");

    try {
      const res = await deleteContentAction(id);
      if (res.success) {
        setContents((prev) => prev.filter((c) => c.id !== id));
        setFeedbackMsg(`Konten "${title}" berhasil dihapus dari database.`);
      } else {
        setFeedbackError(res.error || "Gagal menghapus konten.");
      }
    } catch (err: any) {
      setFeedbackError(err.message || "Terjadi kesalahan saat menghapus konten.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFeedbackMsg("");
        setFeedbackError("");
      }, 5000);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm("Isi database dengan data bawaan (seed default data)?")) return;

    setIsSubmitting(true);
    setFeedbackMsg("");
    setFeedbackError("");

    try {
      const res = await seedDefaultContentsAction();
      if (res.success) {
        setFeedbackMsg(res.message || "Data bawaan berhasil disinkronkan ke database.");
        window.location.reload();
      } else {
        setFeedbackError(res.error || "Gagal sinkronisasi data bawaan.");
      }
    } catch (err: any) {
      setFeedbackError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFeedbackMsg("");
        setFeedbackError("");
      }, 5000);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Judul tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg("");
    setFeedbackError("");

    const payload = {
      title: formTitle,
      slug: formSlug.trim() || autoGenerateSlug(formTitle),
      type: formType,
      poster: formPoster,
      backdrop: formBackdrop,
      synopsis: formSynopsis,
      year: formYear,
      country: formCountry,
      duration: formType === "film" ? formDuration || "120 min" : `${formEpisodes.length} Episode`,
      videoUrl: formType === "film" ? formVideoUrl : undefined,
      isTrending: formIsTrending,
      hasNewEpisode: formHasNewEpisode,
      isPilihan: formIsPilihan,
      isFeatured: formIsFeatured,
      episodes: formType === "tv-series" ? formEpisodes : undefined,
    };

    try {
      if (editingId) {
        const res = await updateContentAction(editingId, payload);
        if (res.success && res.data) {
          setContents((prev) =>
            prev.map((c) => (c.id === editingId ? { ...c, ...(res.data as any) } : c))
          );
          setFeedbackMsg(`Konten "${payload.title}" berhasil diperbarui di database!`);
          handleResetForm();
          setActiveTab("manage");
        } else {
          setFeedbackError(res.error || "Gagal memperbarui konten.");
        }
      } else {
        const res = await createContentAction(payload);
        if (res.success && res.data) {
          setContents((prev) => [res.data as any, ...prev]);
          setFeedbackMsg(`Konten baru "${payload.title}" berhasil disimpan ke database!`);
          handleResetForm();
          setActiveTab("manage");
        } else {
          setFeedbackError(res.error || "Gagal menyimpan konten baru.");
        }
      }
    } catch (err: any) {
      setFeedbackError(err.message || "Terjadi kesalahan saat menyimpan ke database.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFeedbackMsg("");
        setFeedbackError("");
      }, 5000);
    }
  };

  const filteredContents = contents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate live stats based on props or local contents
  const currentTotalContents = stats?.totalContents ?? contents.length;
  const currentTotalDramas =
    stats?.totalDramas ?? contents.filter((c) => c.type === "tv-series").length;
  const currentTotalFilms =
    stats?.totalFilms ?? contents.filter((c) => c.type === "film").length;
  const currentTotalEpisodes =
    stats?.totalEpisodes ??
    contents.reduce((sum, c) => sum + (c.episodes?.length || c.totalEpisodes || 0), 0);
  const currentTotalTrending =
    stats?.totalTrending ?? contents.filter((c) => c.isTrending).length;
  const currentTotalFeatured =
    stats?.totalFeatured ?? contents.filter((c) => c.isFeatured).length;
  const currentTotalPilihan =
    stats?.totalPilihan ?? contents.filter((c) => c.isPilihan).length;

  const recentList = stats?.recentContents || contents.slice(0, 6);
  const popularList =
    stats?.popularContents || contents.filter((c) => c.isTrending || c.isPilihan).slice(0, 6);

  if (!isClient) {
    return null;
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-600/20 text-brand-500 border border-brand-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Console</h1>
            <p className="text-xs text-zinc-400">
              Masuk untuk mengelola database konten dan Cloudflare R2 Storage
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Password Admin
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 pl-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Password default: <code className="text-brand-400">admin123</code>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-400 text-xs font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-lg shadow-brand-600/20 hover:scale-[1.01]"
            >
              Masuk ke Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Prisma + Supabase Live
            </span>

            {/* Cloudflare R2 Status Pill */}
            {r2Configured ? (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <CloudUpload className="w-3 h-3 text-indigo-400" />
                Cloudflare R2 Terhubung
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-400" />
                R2 Menunggu Kredensial
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Admin Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-semibold border border-red-800/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 text-sm flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {feedbackError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-700/60 text-red-300 text-sm flex items-center gap-2 shadow-lg animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{feedbackError}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "overview"
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistik Realtime</span>
        </button>

        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "manage"
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Kelola Konten ({contents.length})</span>
        </button>

        <button
          onClick={() => {
            handleResetForm();
            setActiveTab("create");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "create" && !editingId
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? "Edit Konten" : "Tambah Konten Baru"}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & REALTIME STATISTICS */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Realtime Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Konten */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total Konten Terdaftar</span>
                <Layers className="w-4 h-4 text-brand-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {currentTotalContents}
                </span>
                <span className="text-xs font-bold text-brand-400">Judul</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                {currentTotalDramas} Drama TV &bull; {currentTotalFilms} Film Bioskop
              </p>
            </div>

            {/* Total Episode */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total Episode Tersedia</span>
                <Tv className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {currentTotalEpisodes}
                </span>
                <span className="text-xs font-bold text-emerald-400">Episode</span>
              </div>
              <p className="text-[11px] text-zinc-500">Dari seluruh serial drama bersambung</p>
            </div>

            {/* Konten Trending */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Konten Trending (HOT)</span>
                <TrendingUp className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {currentTotalTrending}
                </span>
                <span className="text-xs font-bold text-red-400">Sedang Hangat</span>
              </div>
              <p className="text-[11px] text-zinc-500">Ditampilkan di barisan Trending utama</p>
            </div>

            {/* Konten Featured & Pilihan */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Featured & Pilihan</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {currentTotalFeatured + currentTotalPilihan}
                </span>
                <span className="text-xs font-bold text-amber-400">Rekomendasi</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                {currentTotalFeatured} Hero Banner &bull; {currentTotalPilihan} Pilihan
              </p>
            </div>
          </div>

          {/* Cloudflare R2 Storage Guide / Status Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Cloudflare R2 Storage</span>
                    {r2Configured ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Siap Digunakan
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Memerlukan Kredensial
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Mendukung upload poster gambar dan upload folder video streaming HLS (.m3u8 +
                    segment .ts).
                  </p>
                </div>
              </div>

              {!r2Configured && (
                <div className="text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl max-w-sm">
                  <p className="font-semibold mb-1">Variabel .env yang dibutuhkan:</p>
                  <code className="text-[10px] text-zinc-300 block">
                    R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
                    R2_PUBLIC_URL
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Two-Column Realtime Content Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 1: Konten Terbaru di Database */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Konten Terbaru di Database</h3>
                  <p className="text-xs text-zinc-400">Judul-judul yang baru ditambahkan</p>
                </div>
                <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20">
                  Realtime
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 px-2">Konten</th>
                      <th className="pb-3 px-2">Tipe</th>
                      <th className="pb-3 px-2 text-right">Tahun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {recentList.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-10 rounded overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                              <Image
                                src={item.poster}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-white truncate max-w-[180px]">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-zinc-500">/{item.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.type === "tv-series"
                                ? "bg-brand-500/20 text-brand-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {item.type === "tv-series" ? "TV Series" : "Film"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right text-zinc-300 font-medium">
                          {item.year}
                        </td>
                      </tr>
                    ))}
                    {recentList.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-zinc-500">
                          Belum ada konten di database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Konten Paling Populer (HOT & Pilihan) */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Konten Populer & Pilihan</h3>
                  <p className="text-xs text-zinc-400">Konten dengan label Trending atau Pilihan</p>
                </div>
                <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                  🔥 Populer
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 px-2">Judul</th>
                      <th className="pb-3 px-2">Badges</th>
                      <th className="pb-3 px-2 text-right">Durasi / Ep</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {popularList.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-10 rounded overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                              <Image
                                src={item.poster}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-white truncate max-w-[180px]">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-zinc-500">{item.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {item.isTrending && <BadgeLabel type="hot" size="sm" />}
                            {item.isPilihan && <BadgeLabel type="pilihan" size="sm" />}
                            {item.isFeatured && <BadgeLabel type="featured" size="sm" />}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right text-zinc-300 font-medium">
                          {item.duration}
                        </td>
                      </tr>
                    ))}
                    {popularList.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-zinc-500">
                          Belum ada konten bertanda trending.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KELOLA KONTEN (CONTENT MANAGEMENT) */}
      {activeTab === "manage" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari judul atau slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              >
                <option value="all">Semua Tipe</option>
                <option value="tv-series">TV Series</option>
                <option value="film">Film</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDefaults}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors disabled:opacity-50"
                title="Sinkronkan data bawaan ke database"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Seed Data Bawaan</span>
              </button>

              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab("create");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Konten</span>
              </button>
            </div>
          </div>

          {/* Content Table */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Poster</th>
                    <th className="py-3.5 px-4">Judul & Slug</th>
                    <th className="py-3.5 px-4">Tipe</th>
                    <th className="py-3.5 px-4">Tahun / Durasi</th>
                    <th className="py-3.5 px-4">Badges Aktif</th>
                    <th className="py-3.5 px-4">Episode</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredContents.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-16 rounded-md overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/80">
                          <Image
                            src={item.poster}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-sm">{item.title}</p>
                          <p className="text-[11px] text-zinc-500">/{item.slug}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.type === "tv-series"
                              ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {item.type === "tv-series" ? "TV Series" : "Film"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-zinc-300">
                          <span>{item.year}</span>
                          <span className="text-zinc-500 mx-1">•</span>
                          <span>{item.duration}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.isFeatured && <BadgeLabel type="featured" size="sm" />}
                          {item.isTrending && <BadgeLabel type="hot" size="sm" />}
                          {item.hasNewEpisode && <BadgeLabel type="new" size="sm" />}
                          {item.isPilihan && <BadgeLabel type="pilihan" size="sm" />}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-zinc-300">
                        {item.type === "tv-series" ? (
                          <span>{item.episodes?.length || item.totalEpisodes || 0} Ep</span>
                        ) : (
                          <span className="text-zinc-500">Film Penuh</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditContent(item)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                            title="Edit Konten"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item.id, item.title)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                            title="Hapus Konten"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-zinc-500">
                        Tidak ada konten yang sesuai pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FORM INPUT / EDIT KONTEN WITH R2 UPLOAD */}
      {activeTab === "create" && (
        <form
          onSubmit={handleSaveContent}
          className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingId
                  ? "Edit Konten Streaming (Database)"
                  : "Tambah Konten Drama / Film Baru (Database)"}
              </h2>
              <p className="text-xs text-zinc-400">
                Lengkapi formulir di bawah ini. Anda dapat memasukkan URL langsung atau mengunggah
                poster dan folder video HLS (.m3u8) ke Cloudflare R2 Storage.
              </p>
            </div>
            {editingId && (
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                Mode Edit
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul Konten */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Judul Konten *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Queen of Tears, Exhuma..."
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>

            {/* Slug URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Slug URL (Otomatis) *
              </label>
              <input
                type="text"
                required
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="queen-of-tears"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>

            {/* Tipe Konten */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Tipe Tontonan *
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              >
                <option value="tv-series">TV Series & Drama</option>
                <option value="film">Film Bioskop</option>
              </select>
            </div>

            {/* Tahun & Durasi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Tahun Rilis
                </label>
                <input
                  type="number"
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Durasi / Ket
                </label>
                <input
                  type="text"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  placeholder="60 min/ep atau 134 min"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Poster URL with R2 Uploader */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Poster Image URL (Portrait)
              </label>
              <input
                type="url"
                value={formPoster}
                onChange={(e) => setFormPoster(e.target.value)}
                placeholder="https://... (URL poster gambar)"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
              <R2Uploader
                mode="image"
                label="Upload Poster ke R2 Storage"
                folderPrefix="posters"
                currentUrl={formPoster}
                onUploadComplete={(url) => setFormPoster(url)}
              />
            </div>

            {/* Backdrop URL with R2 Uploader */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Backdrop Banner URL (Landscape 16:9)
              </label>
              <input
                type="url"
                value={formBackdrop}
                onChange={(e) => setFormBackdrop(e.target.value)}
                placeholder="https://... (URL banner backdrop)"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
              <R2Uploader
                mode="image"
                label="Upload Backdrop ke R2 Storage"
                folderPrefix="backdrops"
                currentUrl={formBackdrop}
                onUploadComplete={(url) => setFormBackdrop(url)}
              />
            </div>
          </div>

          {/* Badges Selector */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Pilihan Badge
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-0"
                />
                <span className="text-xs text-amber-300 font-bold">
                  Drama Unggulan (Hero Banner)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={formIsTrending}
                  onChange={(e) => setFormIsTrending(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-0"
                />
                <span className="text-xs text-red-400 font-bold">Badge HOT (Trending)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={formHasNewEpisode}
                  onChange={(e) => setFormHasNewEpisode(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-0"
                />
                <span className="text-xs text-emerald-400 font-bold">Badge NEW (Episode Baru)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={formIsPilihan}
                  onChange={(e) => setFormIsPilihan(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-0"
                />
                <span className="text-xs text-purple-400 font-bold">Badge Pilihan</span>
              </label>
            </div>
          </div>

          {/* Sinopsis */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Sinopsis Lengkap
            </label>
            <textarea
              rows={3}
              value={formSynopsis}
              onChange={(e) => setFormSynopsis(e.target.value)}
              placeholder="Deskripsi cerita dan sinopsis..."
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* KHUSUS FILM: Video Stream URL with R2 Folder Upload */}
          {formType === "film" && (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Video Stream URL (.mp4 atau .m3u8 HLS)
              </label>
              <input
                type="url"
                value={formVideoUrl}
                onChange={(e) => setFormVideoUrl(e.target.value)}
                placeholder="https://.../playlist.m3u8 atau https://.../video.mp4"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-400">
                Atau unggah folder HLS yang berisi file <code className="text-brand-400">.m3u8</code>{" "}
                beserta segmen <code className="text-brand-400">.ts</code> langsung ke Cloudflare
                R2:
              </p>
              <R2Uploader
                mode="video-folder"
                folderPrefix={formSlug ? `film_${formSlug}` : "film"}
                currentUrl={formVideoUrl}
                onUploadComplete={(url) => setFormVideoUrl(url)}
              />
            </div>
          )}

          {/* KHUSUS DRAMA: Input Episode Dinamis with R2 Folder Upload */}
          {formType === "tv-series" && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Daftar Episode Drama</h3>
                  <p className="text-xs text-zinc-400">
                    Kelola daftar episode dan URL video. Anda dapat mengunggah folder HLS (.m3u8 +
                    .ts) per-episode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEpisodeRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-500" />
                  <span>Tambah Episode</span>
                </button>
              </div>

              <div className="space-y-4">
                {formEpisodes.map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-1">
                        <span className="text-xs font-bold text-zinc-400">#{idx + 1}</span>
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={ep.title}
                          onChange={(e) => handleEpisodeChange(idx, "title", e.target.value)}
                          placeholder="Judul Episode"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={ep.slug}
                          onChange={(e) => handleEpisodeChange(idx, "slug", e.target.value)}
                          placeholder="Slug: episode-1"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={ep.duration}
                          onChange={(e) => handleEpisodeChange(idx, "duration", e.target.value)}
                          placeholder="Durasi (misal 60m)"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveEpisodeRow(idx)}
                          disabled={formEpisodes.length <= 1}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Hapus baris episode"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Video URL & R2 Folder Upload per episode */}
                    <div className="pt-2 border-t border-zinc-800/60">
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                        URL Video Episode (atau upload folder HLS ke R2)
                      </label>
                      <input
                        type="text"
                        value={ep.videoUrl}
                        onChange={(e) => handleEpisodeChange(idx, "videoUrl", e.target.value)}
                        placeholder="https://.../stream.m3u8"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <R2Uploader
                        mode="video-folder"
                        folderPrefix={`${formSlug || "drama"}/${ep.slug || `episode-${idx + 1}`}`}
                        currentUrl={ep.videoUrl}
                        onUploadComplete={(url) => handleEpisodeChange(idx, "videoUrl", url)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                handleResetForm();
                setActiveTab("manage");
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingId ? "Simpan Perubahan ke DB" : "Simpan Konten Baru ke DB"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
