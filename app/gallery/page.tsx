// app/gallery/[[...slug]]/page.tsx
"use client";
import React, { useEffect, use } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GalleryPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  // 2025 Next.js best practice: params is a Promise
  const resolvedParams = use(params);
  const currentType = resolvedParams.slug?.[0] || ""; 
  const { ref, inView } = useInView();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextPageToken) return null;
    
    // Construct flat URL with Query Params
    const url = new URL("/api/load-gallery", window.location.origin);
    if (currentType) url.searchParams.set("type", currentType);
    if (pageIndex > 0) url.searchParams.set("pageToken", previousPageData.nextPageToken);
    
    return url.toString();
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher);
  const allFiles = data ? data.flatMap((page) => page.items) : [];

  useEffect(() => {
    if (inView && !isLoading) setSize(size + 1);
  }, [inView, isLoading, setSize, size]);

  return (
    <main className="max-w-7xl mx-auto p-6 min-h-screen">
      <nav className="flex gap-2 mb-10 overflow-x-auto pb-2">
        {["", "jpg", "png", "gif"].map((t) => (
          <Link 
            key={t} 
            href={`/gallery/${t}`}
            className={`px-6 py-2 rounded-full transition-colors border ${
              currentType === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t === "" ? "All Photos" : t.toUpperCase()}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {allFiles.map((file) => (
          <div key={file.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src={file.thumbnailLink?.replace("=s220", "=s800") || "/placeholder.png"}
              alt={file.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-white text-xs truncate w-full">{file.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div ref={ref} className="h-40 flex items-center justify-center">
        {isLoading && <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />}
      </div>
    </main>
  );
}
