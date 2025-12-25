// app/gallery/GalleryView.tsx

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";

export type GalleryViewProps = {
  slug?: string[];
};

type DriveFile = {
  id: string;
  name: string;
  mimeType?: string;
  thumbnailLink?: string;
};

type DrivePage = {
  items: DriveFile[];
  nextPageToken: string | null;
};

const fetcher = (url: string): Promise<DrivePage> => fetch(url).then((res) => res.json());

export default function GalleryView({ slug }: GalleryViewProps) {
  const currentType = slug?.[0]?.toLowerCase() || "";
  const { ref, inView } = useInView();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [router, status]);

  const getKey = (pageIndex: number, previousPageData: DrivePage | null) => {
    if (status !== "authenticated") return null;
    if (previousPageData && !previousPageData.nextPageToken) return null;

    const params = new URLSearchParams();
    if (pageIndex > 0 && previousPageData?.nextPageToken) {
      params.set("pageToken", previousPageData.nextPageToken);
    }

    const basePath = currentType ? `/api/load-gallery/${currentType}` : "/api/load-gallery";
    const query = params.toString();

    return `${basePath}${query ? `?${query}` : ""}`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  });
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
            href={t ? `/gallery/${t}` : "/gallery"}
            className={`px-6 py-2 rounded-full transition-colors border ${
              currentType === t
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t === "" ? "All Photos" : t.toUpperCase()}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {allFiles.map((file) => (
          <div
            key={file.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm"
          >
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
        {isLoading && (
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </main>
  );
}