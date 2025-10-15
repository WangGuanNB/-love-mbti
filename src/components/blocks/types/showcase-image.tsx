"use client";

import { useEffect, useMemo, useState } from "react";

export default function ShowcaseImage({
  code,
  title,
  className,
}: {
  code: string;
  title: string;
  className?: string;
}) {
  const candidates = useMemo(
    () => [
      // lower-case first
      `/imgs/showcases/${code}.png`,
      `/imgs/showcases/${code}.jpeg`,
      `/imgs/showcases/${code}.jpg`,
      `/imgs/showcases/${code}.webp`,
      // upper-case (部分素材后缀为大写)
      `/imgs/showcases/${code}.PNG`,
      `/imgs/showcases/${code}.JPEG`,
      `/imgs/showcases/${code}.JPG`,
    ],
    [code]
  );

  const [src, setSrc] = useState<string | null>(null);

  // 为避免 SSR 首次 404 时 onError 未绑定导致不触发的问题，挂载后主动探测可用的后缀
  useEffect(() => {
    let cancelled = false;
    const tryLoad = (i: number) => {
      if (i >= candidates.length) {
        if (!cancelled) setSrc(null);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setSrc(candidates[i]);
      };
      img.onerror = () => tryLoad(i + 1);
      img.src = candidates[i];
    };
    tryLoad(0);
    return () => {
      cancelled = true;
    };
  }, [candidates]);

  if (!src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={title} className={className} src="" />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={title} className={className} />;
}


