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
  Users,
  Clock,
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Search,
  RotateCcw,
} from "lucide-react";
import { Content, Episode, MOCK_CONTENTS } from "@/lib/data/mock";
import BadgeLabel from "@/components/ui/BadgeLabel";

const STORAGE_KEY = "mangeakkk_admin_contents_v1";
const AUTH_KEY = "mangeakkk_admin_auth_v1";
const ADMIN_PASSWORD = "admin123";

// Sample Traffic Data for Monitoring
const DAILY_TRAFFIC = [
  { day: "Senin", date: "01 Nov", views: 38200 },
  { day: "Selasa", date: "02 Nov", views: 41500 },
  { day: "Rabu", date: "03 Nov", views: 39800 },
  { day: "Kamis", date: "04 Nov", views: 44200 },
  { day: "Jumat", date: "05 Nov", views: 51200 },
  { day: "Sabtu", date: "06 Nov", views: 58900 },
  { day: "Minggu", date: "07 Nov", views: 48290 },
];

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

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Active Tab: "overview" | "manage" | "create"
  const [activeTab, setActiveTab] = useState<"overview" | "manage" | "create">("overview");

  // Content List State
  const [contents, setContents] = useState<Content[]>(MOCK_CONTENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "tv-series" | "film">("all");
  const [feedbackMsg, setFeedbackMsg] = useState("");

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

  // Load from LocalStorage
  useEffect(() => {
    setIsClient(true);
    const authSaved = localStorage.getItem(AUTH_KEY);
    if (authSaved === "true") {
      setIsAuthenticated(true);
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setContents(parsed);
        }
      } catch (err) {
        console.error("Failed to parse saved contents", err);
      }
    }
  }, []);

  const saveToStorage = (newContents: Content[]) => {
    setContents(newContents);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContents));
    }
  };

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

  const handleDeleteContent = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus "${title}"?`)) {
      const updated = contents.filter((c) => c.id !== id);
      saveToStorage(updated);
      setFeedbackMsg(`Konten "${title}" berhasil dihapus.`);
      setTimeout(() => setFeedbackMsg(""), 4000);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset semua konten kembali ke default awal?")) {
      saveToStorage(MOCK_CONTENTS);
      setFeedbackMsg("Data konten berhasil di-reset ke default.");
      setTimeout(() => setFeedbackMsg(""), 4000);
    }
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Judul tidak boleh kosong!");
      return;
    }

    const defaultPoster =
      formPoster.trim() ||
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80";
    const defaultBackdrop =
      formBackdrop.trim() ||
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1600&auto=format&fit=crop&q=80";

    const preparedEpisodes: Episode[] =
      formType === "tv-series"
        ? formEpisodes.map((ep) => ({
            number: ep.number,
            slug: ep.slug || `episode-${ep.number}`,
            title: ep.title || `Episode ${ep.number}`,
            duration: ep.duration || "60m",
            thumbnail: defaultBackdrop,
            synopsis: `Episode ${ep.number} serial ${formTitle}.`,
            videoUrl:
              ep.videoUrl ||
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          }))
        : [];

    const newContentItem: Content = {
      id: editingId || Date.now().toString(),
      slug: formSlug.trim() || autoGenerateSlug(formTitle),
      title: formTitle.trim(),
      type: formType,
      poster: defaultPoster,
      backdrop: defaultBackdrop,
      synopsis: formSynopsis.trim() || `Sinopsis resmi untuk ${formTitle}.`,
      year: Number(formYear) || new Date().getFullYear(),
      country: formCountry.trim() || "Korea Selatan",
      director: "Sutradara Pilihan",
      cast: [{ name: "Aktor Utama", photo: defaultPoster }],
      duration: formType === "film" ? formDuration || "120 min" : `${formEpisodes.length} Episode`,
      totalEpisodes: formType === "tv-series" ? formEpisodes.length : undefined,
      episodes: formType === "tv-series" ? preparedEpisodes : undefined,
      videoUrl:
        formType === "film"
          ? formVideoUrl.trim() || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          : undefined,
      isTrending: formIsTrending,
      hasNewEpisode: formHasNewEpisode,
      isPilihan: formIsPilihan,
      isFeatured: formIsFeatured,
    };

    let updatedList: Content[];
    if (editingId) {
      updatedList = contents.map((c) => (c.id === editingId ? newContentItem : c));
      setFeedbackMsg(`Konten "${newContentItem.title}" berhasil diperbarui!`);
    } else {
      updatedList = [newContentItem, ...contents];
      setFeedbackMsg(`Konten baru "${newContentItem.title}" berhasil ditambahkan!`);
    }

    saveToStorage(updatedList);
    handleResetForm();
    setActiveTab("manage");
    setTimeout(() => setFeedbackMsg(""), 4000);
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
              Masuk untuk mengelola konten dan melihat traffic Mangeakkk
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
              Live System Active
            </span>
            <span className="text-xs text-zinc-500">Mangeakkk v2.2</span>
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

          {/* SVG Charts: Daily Line Chart & Weekly Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Line Chart (2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Traffic Harian (7 Hari Terakhir)</h3>
                  <p className="text-xs text-zinc-400">Pantau fluktuasi penonton setiap hari</p>
                </div>
                <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20">
                  Total: 314.8K
                </span>
              </div>

              {/* Responsive SVG Line Chart */}
              <div className="w-full h-56 pt-2">
                <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Lines */}
                  {[0, 50, 100, 150].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y + 20}
                      x2="680"
                      y2={y + 20}
                      stroke="#27272a"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Area Fill */}
                  <polygon
                    points="
                      50,110
                      140,85
                      230,95
                      320,68
                      410,40
                      500,20
                      590,52
                      590,180
                      50,180
                    "
                    fill="url(#chartGradient)"
                  />

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="
                      50,110
                      140,85
                      230,95
                      320,68
                      410,40
                      500,20
                      590,52
                    "
                  />

                  {/* Data Points with tooltips */}
                  {[
                    { x: 50, y: 110, val: "38.2k", label: "Sen" },
                    { x: 140, y: 85, val: "41.5k", label: "Sel" },
                    { x: 230, y: 95, val: "39.8k", label: "Rab" },
                    { x: 320, y: 68, val: "44.2k", label: "Kam" },
                    { x: 410, y: 40, val: "51.2k", label: "Jum" },
                    { x: 500, y: 20, val: "58.9k", label: "Sab" },
                    { x: 590, y: 52, val: "48.3k", label: "Min" },
                  ].map((pt, idx) => (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#60a5fa"
                        stroke="#0b0f19"
                        strokeWidth="2.5"
                        className="cursor-pointer hover:r-7 transition-all"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fill="#93c5fd"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {pt.val}
                      </text>
                      <text
                        x={pt.x}
                        y="200"
                        textAnchor="middle"
                        fill="#a1a1aa"
                        fontSize="12"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Weekly Comparison (1 Col) */}
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
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors"
                title="Kembalikan data mock bawaan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
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
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors"
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
                {editingId ? "Edit Konten Streaming" : "Tambah Konten Drama / Film Baru"}
              </h2>
              <p className="text-xs text-zinc-400">
                Lengkapi formulir di bawah ini untuk memasukkan data ke sistem Mangeakkk.
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
                Video URL Film (.mp4 atau direct stream)
              </label>
              <input
                type="url"
                value={formVideoUrl}
                onChange={(e) => setFormVideoUrl(e.target.value)}
                placeholder="https://.../video.mp4"
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
                        placeholder="Video stream URL (.mp4)"
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
              onClick={() => {
                handleResetForm();
                setActiveTab("manage");
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30"
            >
              {editingId ? "Simpan Perubahan" : "Simpan Konten Baru"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

