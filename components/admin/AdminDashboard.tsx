"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Film,
  Plus,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  Users,
  Clock,
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Search,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Content } from "@/lib/data/db";
import BadgeLabel from "@/components/ui/BadgeLabel";
import {
  createContentAction,
  updateContentAction,
  deleteContentAction,
  seedDefaultContentsAction,
} from "@/app/actions/content";

const AUTH_KEY = "mangeakkk_admin_auth_v1";
const ADMIN_PASSWORD = "admin123";

// Sample Traffic Data for Monitoring
const WEEKLY_TRAFFIC = [
  { week: "Minggu 1", views: 245000, growth: "+12%" },
  { week: "Minggu 2", views: 278000, growth: "+13.5%" },
  { week: "Minggu 3", views: 295000, growth: "+6.1%" },
  { week: "Minggu 4", views: 314800, growth: "+8.2%" },
];

const POPULAR_PAGES = [
  { rank: 1, title: "Queen of Tears", type: "tv-series", views: "14,820", share: "30.7%" },
  { rank: 2, title: "Exhuma", type: "film", views: "11,450", share: "23.7%" },
  { rank: 3, title: "Lovely Runner", type: "tv-series", views: "8,920", share: "18.5%" },
  { rank: 4, title: "Parasite", type: "film", views: "6,200", share: "12.8%" },
  { rank: 5, title: "Squid Game", type: "tv-series", views: "4,190", share: "8.7%" },
];

interface AdminDashboardProps {
  initialContents: Content[];
}

export default function AdminDashboard({ initialContents }: AdminDashboardProps) {
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

  // Load auth state from LocalStorage
  React.useEffect(() => {
    setIsClient(true);
    const authSaved = localStorage.getItem(AUTH_KEY);
    if (authSaved === "true") {
      setIsAuthenticated(true);
    }
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
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
          videoUrl: item.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
        // Refresh page to load fresh contents from database
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
              Masuk untuk mengelola database konten Prisma + Supabase
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
              Prisma + Supabase Active
            </span>
            <span className="text-xs text-zinc-500">Mangeakkk Server DB</span>
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
          <span>Overview & Traffic</span>
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

      {/* TAB 1: OVERVIEW & TRAFFIC MONITORING */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Views Hari Ini</span>
                <Eye className="w-4 h-4 text-brand-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">48,290</span>
                <span className="text-xs font-bold text-emerald-400">+14.8%</span>
              </div>
              <p className="text-[11px] text-zinc-500">Dibandingkan kemarin (42,050)</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Views 7 Hari Terakhir</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">314,800</span>
                <span className="text-xs font-bold text-emerald-400">+8.2%</span>
              </div>
              <p className="text-[11px] text-zinc-500">Minggu lalu (295,000)</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>User Streaming Online</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">1,428</span>
                <span className="text-xs font-bold text-amber-400">Live</span>
              </div>
              <p className="text-[11px] text-zinc-500">Sedang memutar video saat ini</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <span>Rata-Rata Durasi</span>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">36m 40s</span>
                <span className="text-xs font-bold text-emerald-400">+4.1%</span>
              </div>
              <p className="text-[11px] text-zinc-500">Watch-time per sesi penonton</p>
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Traffic Mingguan</h3>
              <p className="text-xs text-zinc-400">Total views 4 minggu terakhir</p>
            </div>

            <div className="space-y-4 pt-2">
              {WEEKLY_TRAFFIC.map((item, idx) => {
                const maxViews = 350000;
                const pct = Math.round((item.views / maxViews) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">{item.week}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {(item.views / 1000).toFixed(0)}k
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {item.growth}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Halaman & Konten Terpopuler */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Tontonan & Halaman Terpopuler</h3>
                <p className="text-xs text-zinc-400">Konten dengan kontribusi traffic tertinggi</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-2">Rank</th>
                    <th className="pb-3 px-2">Judul Tontonan</th>
                    <th className="pb-3 px-2">Tipe</th>
                    <th className="pb-3 px-2 text-right">Views Hari Ini</th>
                    <th className="pb-3 px-2 text-right">Share Traffic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {POPULAR_PAGES.map((page) => (
                    <tr key={page.rank} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-2 font-bold text-zinc-300">#{page.rank}</td>
                      <td className="py-3 px-2 font-semibold text-white">{page.title}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300">
                          {page.type === "tv-series" ? "TV Series" : "Film"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-brand-400">
                        {page.views}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-zinc-300">
                        {page.share}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* TAB 3: FORM INPUT / EDIT KONTEN */}
      {activeTab === "create" && (
        <form
          onSubmit={handleSaveContent}
          className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Konten Streaming (Database)" : "Tambah Konten Drama / Film Baru (Database)"}
              </h2>
              <p className="text-xs text-zinc-400">
                Lengkapi formulir di bawah ini untuk menyimpan data ke Prisma + Supabase.
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

            {/* Poster URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Poster Image URL
              </label>
              <input
                type="url"
                value={formPoster}
                onChange={(e) => setFormPoster(e.target.value)}
                placeholder="https://images.unsplash.com/... (poster portrait)"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>

            {/* Backdrop URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Backdrop Banner URL (Landscape)
              </label>
              <input
                type="url"
                value={formBackdrop}
                onChange={(e) => setFormBackdrop(e.target.value)}
                placeholder="https://images.unsplash.com/... (backdrop 16:9)"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
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
                <span className="text-xs text-amber-300 font-bold">Drama Unggulan (Hero Banner)</span>
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

          {/* KHUSUS FILM: Video Stream URL */}
          {formType === "film" && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Video URL Film (.mp4 atau .m3u8 HLS)
              </label>
              <input
                type="url"
                value={formVideoUrl}
                onChange={(e) => setFormVideoUrl(e.target.value)}
                placeholder="https://.../video.mp4 atau https://.../playlist.m3u8"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}

          {/* KHUSUS DRAMA: Input Episode Dinamis */}
          {formType === "tv-series" && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Daftar Episode Drama</h3>
                  <p className="text-xs text-zinc-400">
                    Kelola daftar episode dan URL video pemutar.
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

              <div className="space-y-3">
                {formEpisodes.map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-1">
                      <span className="text-xs font-bold text-zinc-400">#{idx + 1}</span>
                    </div>

                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={ep.title}
                        onChange={(e) => handleEpisodeChange(idx, "title", e.target.value)}
                        placeholder="Judul Episode"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={ep.slug}
                        onChange={(e) => handleEpisodeChange(idx, "slug", e.target.value)}
                        placeholder="Slug: episode-1"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={ep.videoUrl}
                        onChange={(e) => handleEpisodeChange(idx, "videoUrl", e.target.value)}
                        placeholder="Video URL (.mp4 atau .m3u8)"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveEpisodeRow(idx)}
                        disabled={formEpisodes.length <= 1}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

