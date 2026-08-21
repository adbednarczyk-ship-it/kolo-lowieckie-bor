export type GalleryAlbum = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  sort_order: number;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  album_id: string;
  image_url: string;
  alt: string;
  caption: string;
  sort_order: number;
};

export type GalleryAlbumCard = GalleryAlbum & {
  photo_count: number;
};
