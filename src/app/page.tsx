import React from 'react';
import { HeroBanner } from '../components/catalog/HeroBanner';
import { CategoryRow } from '../components/catalog/CategoryRow';
import { mockVideos } from '../data/mockVideos';

export default function HomePage() {
  const featuredVideo = mockVideos[0];
  const trendingVideos = mockVideos.filter((v) => v.category === 'Trending');
  const movieVideos = mockVideos.filter((v) => v.category === 'Movies');
  const seriesVideos = mockVideos.filter((v) => v.category === 'Series');
  const liveVideos = mockVideos.filter((v) => v.category === 'Live');
  const docVideos = mockVideos.filter((v) => v.category === 'Documentary');

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <HeroBanner featuredVideo={featuredVideo} />

      {/* Video Categories Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Trending Section */}
        <CategoryRow
          id="trending"
          title="🔥 Sedang Hangat & Trending"
          subtitle="Tontonan paling banyak dinikmati minggu ini"
          videos={trendingVideos}
        />

        {/* Live Streaming Section */}
        {liveVideos.length > 0 && (
          <CategoryRow
            id="live"
            title="🔴 Siaran Langsung (Live Now)"
            subtitle="Streaming real-time kompetisi dan event dunia"
            videos={liveVideos}
          />
        )}

        {/* Movies Section */}
        <CategoryRow
          id="movies"
          title="🎬 Film Unggulan"
          subtitle="Koleksi sinema beresolusi tinggi dengan audio spasial"
          videos={[...movieVideos, ...docVideos]}
        />

        {/* Series Section */}
        <CategoryRow
          id="series"
          title="📺 Serial Pilihan"
          subtitle="Episode terbaru siap ditonton maraton"
          videos={seriesVideos}
        />
      </div>
    </div>
  );
}

