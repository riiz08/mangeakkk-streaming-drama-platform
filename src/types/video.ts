export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: 'Trending' | 'Movies' | 'Series' | 'Live' | 'Documentary';
  rating: string;
  views: string;
  releaseYear: number;
  creator: string;
  tags: string[];
}

