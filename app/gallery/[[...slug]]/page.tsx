//app/gallery/[...slug]/page.tsx
import GalleryView from "../GalleryView";

export default function GalleryOptionalCatchAllPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  return <GalleryView slug={params.slug} />;
}