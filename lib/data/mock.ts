export interface CastMember {
  name: string;
  photo: string;
}

export interface Episode {
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  synopsis: string;
  videoUrl: string;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  type: "drama" | "film";
  poster: string;
  backdrop: string;
  synopsis: string;
  genre: string[];
  year: number;
  rating: number;
  country: string;
  director: string;
  cast: CastMember[];
  duration: string;
  totalEpisodes?: number;
  episodes?: Episode[];
  isTrending?: boolean;
  isFeatured?: boolean;
  releaseDate?: string;
}

const SAMPLE_VIDEO_1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_VIDEO_2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const SAMPLE_VIDEO_3 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const SAMPLE_VIDEO_4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

export const GENRES = [
  "Action",
  "Romance",
  "Thriller",
  "Comedy",
  "Mystery",
  "Fantasy",
  "Sci-Fi",
  "Drama",
  "Crime",
  "Horror"
];

export const MOCK_CONTENTS: Content[] = [
  {
    id: "1",
    slug: "queen-of-tears",
    title: "Queen of Tears",
    type: "drama",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Ratu departemen store dan pangeran supermarket menghadapi krisis pernikahan. Namun cinta mereka secara ajaib mulai mekar kembali di tengah berbagai rintangan keluarga konglomerat.",
    genre: ["Romance", "Drama", "Comedy"],
    year: 2024,
    rating: 9.3,
    country: "Korea Selatan",
    director: "Jang Young-woo, Kim Hee-won",
    duration: "70 min/ep",
    totalEpisodes: 16,
    isTrending: true,
    isFeatured: true,
    releaseDate: "2024-03-09",
    cast: [
      { name: "Kim Soo-hyun", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
      { name: "Kim Ji-won", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80" },
      { name: "Park Sung-hoon", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Episode 1: Titik Balik",
        thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&auto=format&fit=crop&q=80",
        duration: "75 min",
        synopsis: "Baek Hyun-woo merasa putus asa dengan kehidupan pernikahannya dengan sang pewaris chaebol Hong Hae-in dan berencana menceraikannya.",
        videoUrl: SAMPLE_VIDEO_1
      },
      {
        number: 2,
        title: "Episode 2: Berita Tak Terduga",
        thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
        duration: "72 min",
        synopsis: "Pengakuan tak terduga dari Hae-in mengguncang Hyun-woo dan memicu perubahan drastis dalam dinamika hubungan mereka.",
        videoUrl: SAMPLE_VIDEO_2
      },
      {
        number: 3,
        title: "Episode 3: Percikan Masa Lalu",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
        duration: "70 min",
        synopsis: "Munculnya mantan kekasih masa lalu membangkitkan rasa cemburu dan memicu kembali perasaan yang lama terpendam.",
        videoUrl: SAMPLE_VIDEO_3
      },
      {
        number: 4,
        title: "Episode 4: Rahasia Terungkap",
        thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
        duration: "74 min",
        synopsis: "Tekanan bisnis dan rahasia medis mulai menyebar di kalangan petinggi Queens Group.",
        videoUrl: SAMPLE_VIDEO_4
      }
    ]
  },
  {
    id: "2",
    slug: "squid-game-season-2",
    title: "Squid Game: Season 2",
    type: "drama",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Tiga tahun setelah memenangkan Squid Game, Pemain 456 membatalkan rencananya pergi ke Amerika dan kembali dengan misi baru: mengakhiri permainan mematikan ini selamanya.",
    genre: ["Thriller", "Action", "Mystery"],
    year: 2024,
    rating: 9.1,
    country: "Korea Selatan",
    director: "Hwang Dong-hyuk",
    duration: "55 min/ep",
    totalEpisodes: 6,
    isTrending: true,
    isFeatured: true,
    releaseDate: "2024-12-26",
    cast: [
      { name: "Lee Jung-jae", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
      { name: "Lee Byung-hun", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80" },
      { name: "Wi Ha-joon", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Episode 1: Roti dan Lotere",
        thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
        duration: "58 min",
        synopsis: "Gi-hun melacak jejak sang perekrut kartu ddakji di stasiun bawah tanah dengan tekad membalas dendam.",
        videoUrl: SAMPLE_VIDEO_1
      },
      {
        number: 2,
        title: "Episode 2: Masuk Kembali",
        thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
        duration: "55 min",
        synopsis: "Sebuah kelompok pemain baru terbangun di asrama berlantai susun dengan nomor di dada mereka.",
        videoUrl: SAMPLE_VIDEO_2
      }
    ]
  },
  {
    id: "3",
    slug: "dune-part-two",
    title: "Dune: Part Two",
    type: "film",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Paul Atreides bersatu dengan Chani dan Fremen sambil membalas dendam terhadap para konspirator yang menghancurkan keluarganya di planet gurun Arrakis.",
    genre: ["Sci-Fi", "Action", "Drama"],
    year: 2024,
    rating: 8.8,
    country: "Amerika Serikat",
    director: "Denis Villeneuve",
    duration: "2h 46m",
    isTrending: true,
    isFeatured: true,
    releaseDate: "2024-03-01",
    cast: [
      { name: "Timothée Chalamet", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80" },
      { name: "Zendaya", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80" },
      { name: "Rebecca Ferguson", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Full Movie",
        thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
        duration: "166 min",
        synopsis: "Paul Atreides melanjutkan takdirnya sebagai Muad'Dib di Arrakis.",
        videoUrl: SAMPLE_VIDEO_4
      }
    ]
  },
  {
    id: "4",
    slug: "vincenzo",
    title: "Vincenzo",
    type: "drama",
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Seorang pengacara mafia Italia berkunjung ke tanah kelahirannya di Korea Selatan, di mana dia memberi konglomerat obat tanpa ampun rasa keadilan dengan caranya sendiri.",
    genre: ["Crime", "Comedy", "Action"],
    year: 2021,
    rating: 8.7,
    country: "Korea Selatan",
    director: "Kim Hee-won",
    duration: "80 min/ep",
    totalEpisodes: 20,
    isTrending: false,
    isFeatured: false,
    releaseDate: "2021-02-20",
    cast: [
      { name: "Song Joong-ki", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80" },
      { name: "Jeon Yeo-been", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Episode 1: Kedatangan Sang Konsiliere",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80",
        duration: "83 min",
        synopsis: "Vincenzo Cassano mendarat di Seoul untuk mengambil emas batangan tersembunyi di bawah Geumga Plaza.",
        videoUrl: SAMPLE_VIDEO_1
      },
      {
        number: 2,
        title: "Episode 2: Pesta Topeng Plaza",
        thumbnail: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80",
        duration: "80 min",
        synopsis: "Vincenzo menggelar pesta mewah untuk menghalau rencana pembongkaran paksa dari Babel Group.",
        videoUrl: SAMPLE_VIDEO_2
      }
    ]
  },
  {
    id: "5",
    slug: "oppenheimer",
    title: "Oppenheimer",
    type: "film",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Kisah fisikawan Amerika J. Robert Oppenheimer, yang memimpin Proyek Manhattan untuk mengembangkan bom atom pertama di dunia demi mengakhiri Perang Dunia II.",
    genre: ["Drama", "Thriller", "Mystery"],
    year: 2023,
    rating: 8.9,
    country: "Amerika Serikat",
    director: "Christopher Nolan",
    duration: "3h 00m",
    isTrending: true,
    isFeatured: false,
    releaseDate: "2023-07-21",
    cast: [
      { name: "Cillian Murphy", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
      { name: "Emily Blunt", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80" },
      { name: "Robert Downey Jr.", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Full Movie",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80",
        duration: "180 min",
        synopsis: "Kisah epik Proyek Manhattan dan dinamika sidang politik pascaperang.",
        videoUrl: SAMPLE_VIDEO_4
      }
    ]
  },
  {
    id: "6",
    slug: "twinkling-watermelon",
    title: "Twinkling Watermelon",
    type: "drama",
    poster: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Seorang anak CODA (Child of Deaf Adult) yang memiliki bakat musik jenius terlempar kembali ke tahun 1995 lewat sebuah toko musik misterius dan bertemu dengan versi muda ayahnya.",
    genre: ["Romance", "Comedy", "Fantasy", "Drama"],
    year: 2023,
    rating: 9.0,
    country: "Korea Selatan",
    director: "Son Jong-hyun",
    duration: "65 min/ep",
    totalEpisodes: 16,
    isTrending: false,
    isFeatured: false,
    releaseDate: "2023-09-25",
    cast: [
      { name: "Ryeoun", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
      { name: "Choi Hyun-wook", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80" },
      { name: "Seol In-ah", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Episode 1: Suara yang Tak Terdengar",
        thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
        duration: "65 min",
        synopsis: "Eun Gyeol menyeimbangkan kehidupan sebagai jembatan suara bagi keluarganya dan impian rahasianya bermusik.",
        videoUrl: SAMPLE_VIDEO_3
      },
      {
        number: 2,
        title: "Episode 2: Toko Musik La Vida",
        thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
        duration: "64 min",
        synopsis: "Setelah keluar dari toko musik misterius, Eun Gyeol mendapati dirinya berada di Seoul tahun 1995.",
        videoUrl: SAMPLE_VIDEO_1
      }
    ]
  },
  {
    id: "7",
    slug: "parasite",
    title: "Parasite",
    type: "film",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Keluarga Kim yang miskin menyusup satu per satu ke dalam rumah keluarga Park yang kaya raya, memicu serangkaian insiden yang tak terduga dan menegangkan.",
    genre: ["Thriller", "Drama", "Comedy"],
    year: 2019,
    rating: 8.6,
    country: "Korea Selatan",
    director: "Bong Joon-ho",
    duration: "2h 12m",
    isTrending: false,
    isFeatured: false,
    releaseDate: "2019-05-30",
    cast: [
      { name: "Song Kang-ho", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80" },
      { name: "Choi Woo-shik", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
      { name: "Park So-dam", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Full Movie",
        thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
        duration: "132 min",
        synopsis: "Peraih 4 Piala Oscar termasuk Best Picture karya sutradara Bong Joon-ho.",
        videoUrl: SAMPLE_VIDEO_2
      }
    ]
  },
  {
    id: "8",
    slug: "interstellar",
    title: "Interstellar",
    type: "film",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80",
    synopsis: "Ketika Bumi menjadi tak layak huni di masa depan, sekelompok penjelajah luar angkasa melakukan misi melintasi lubang cacing untuk mencari rumah baru bagi umat manusia.",
    genre: ["Sci-Fi", "Drama", "Mystery"],
    year: 2014,
    rating: 8.7,
    country: "Amerika Serikat",
    director: "Christopher Nolan",
    duration: "2h 49m",
    isTrending: false,
    isFeatured: false,
    releaseDate: "2014-11-07",
    cast: [
      { name: "Matthew McConaughey", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
      { name: "Anne Hathaway", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80" },
      { name: "Jessica Chastain", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" }
    ],
    episodes: [
      {
        number: 1,
        title: "Full Movie",
        thumbnail: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=80",
        duration: "169 min",
        synopsis: "Perjalanan melintasi lubang cacing dan batas waktu cinta manusiawi.",
        videoUrl: SAMPLE_VIDEO_4
      }
    ]
  }
];

export function getAllContents(): Content[] {
  return MOCK_CONTENTS;
}

export function getContentBySlug(slug: string): Content | undefined {
  return MOCK_CONTENTS.find((c) => c.slug === slug);
}

export function getDramaList(): Content[] {
  return MOCK_CONTENTS.filter((c) => c.type === "drama");
}

export function getFilmList(): Content[] {
  return MOCK_CONTENTS.filter((c) => c.type === "film");
}

export function getTrendingList(): Content[] {
  return MOCK_CONTENTS.filter((c) => c.isTrending);
}

export function getFeaturedContent(): Content {
  return MOCK_CONTENTS.find((c) => c.isFeatured) || MOCK_CONTENTS[0];
}

export function getContentsByGenre(genre: string): Content[] {
  return MOCK_CONTENTS.filter((c) =>
    c.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
  );
}

export function searchContents(query: string): Content[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return MOCK_CONTENTS.filter(
    (c) =>
      c.title.toLowerCase().includes(lower) ||
      c.synopsis.toLowerCase().includes(lower) ||
      c.genre.some((g) => g.toLowerCase().includes(lower)) ||
      c.director.toLowerCase().includes(lower) ||
      c.country.toLowerCase().includes(lower)
  );
}

export function getRelatedContents(content: Content): Content[] {
  return MOCK_CONTENTS.filter(
    (c) => c.id !== content.id && c.genre.some((g) => content.genre.includes(g))
  );
}
