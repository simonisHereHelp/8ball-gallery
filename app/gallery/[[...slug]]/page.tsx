//app/gallery/[...slug]/page.tsx

import GalleryView from "../GalleryView";

export default function GalleryCatchAllPage({ params }: { params: { slug: string[] } }) {
  return <GalleryView slug={params.slug} />;
}