'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type InstagramMedia, getInstagramMedia } from '@/lib/instagram';
import { useInView } from 'react-intersection-observer';

// ---------- Lazy thumbnail ----------
const LazyImage = ({ item, index, onClick }: {
    item: InstagramMedia;
    index: number;
    onClick: () => void;
}) => {
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '400px 0px', threshold: 0.1 });
    const [isLoaded, setIsLoaded] = useState(false);
    const isCarousel = item.media_type === 'CAROUSEL_ALBUM' && (item.children?.length ?? 0) > 1;

    return (
        <div
            ref={ref}
            className="group relative overflow-hidden bg-gray-900 w-full shrink-0 cursor-pointer"
            style={{ aspectRatio: '4/5' }}
            onClick={onClick}
        >
            {inView ? (
                <>
                    <Image
                        src={item.media_url}
                        alt={item.caption || 'Instagram photo'}
                        width={800}
                        height={800}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        priority={index < 12}
                        loading={index < 12 ? 'eager' : 'lazy'}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
                        onLoad={() => setIsLoaded(true)}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800?text=Image+Unavailable';
                            setIsLoaded(true);
                        }}
                    />
                    {!isLoaded && <div className="absolute inset-0 bg-gray-900 animate-pulse" />}
                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* carousel indicator */}
                    {isCarousel && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2 6h15v13H2V6zm17-4h-2v2h1v13h1V2zm3 2h-2v2h1v11h1V4z" />
                            </svg>
                            {item.children?.length}
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full bg-gray-900 animate-pulse" style={{ aspectRatio: '4/5' }} />
            )}
        </div>
    );
};

// ---------- Carousel Modal ----------
const CarouselModal = ({ item, onClose }: { item: InstagramMedia; onClose: () => void }) => {
    const images = item.children && item.children.length > 0
        ? item.children.map(c => c.media_url)
        : [item.media_url];

    const [current, setCurrent] = useState(0);
    const total = images.length;

    const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);
    const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);

    // keyboard nav
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [prev, next, onClose]);

    // touch / swipe
    const touchStartX = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
        touchStartX.current = null;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close button — top-right corner */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors text-4xl leading-none font-thin"
                aria-label="Close"
            >
                ×
            </button>

            {/* IG icon — top-left corner, subtle */}
            <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="absolute top-4 left-4 z-10 text-white/25 hover:text-white/70 transition-colors"
                aria-label="View on Instagram"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            </a>

            {/* Main image area — fills the viewport, swipeable */}
            <div
                className="relative w-full h-full flex items-center justify-center px-0 sm:px-12"
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Image
                    key={images[current]}
                    src={images[current]}
                    alt={`Photo ${current + 1} of ${total}`}
                    width={1080}
                    height={1350}
                    sizes="100vw"
                    className="object-contain"
                    style={{ maxHeight: '100dvh', maxWidth: '100%', width: 'auto', height: 'auto' }}
                    priority
                />

                {/* Prev arrow — overlaid left edge */}
                {total > 1 && (
                    <button
                        onClick={prev}
                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/90 transition-colors text-5xl sm:text-6xl font-thin leading-none select-none"
                        aria-label="Previous photo"
                    >
                        ‹
                    </button>
                )}

                {/* Next arrow — overlaid right edge */}
                {total > 1 && (
                    <button
                        onClick={next}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/90 transition-colors text-5xl sm:text-6xl font-thin leading-none select-none"
                        aria-label="Next photo"
                    >
                        ›
                    </button>
                )}
            </div>

            {/* Dot indicators + counter — bottom centre */}
            {total > 1 && (
                <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
                    <div className="flex gap-1.5 pointer-events-auto">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/30'}`}
                                aria-label={`Go to photo ${i + 1}`}
                            />
                        ))}
                    </div>
                    <span className="text-white/30 text-xs">{current + 1} / {total}</span>
                </div>
            )}
        </div>
    );

};

// ---------- Marquee Column (constant pixel speed) ----------
const MarqueeColumn = ({ items, speed, reverse, onClick }: {
    items: InstagramMedia[];
    speed: number;
    reverse: boolean;
    onClick: (item: InstagramMedia) => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const distanceRef = useRef(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Loop distance = height of one duplicated set (half the content + half the gap)
        const measure = () => {
            const gap = Number.parseFloat(getComputedStyle(el).rowGap) || 0;
            distanceRef.current = (el.scrollHeight + gap) / 2;
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);

        let raf = 0;
        let last = performance.now();
        const dir = reverse ? -1 : 1;

        const tick = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            if (distanceRef.current > 0) {
                offsetRef.current = (offsetRef.current + dir * speed * dt) % distanceRef.current;
                if (offsetRef.current < 0) offsetRef.current += distanceRef.current;
                el.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [speed, reverse]);

    return (
        <div ref={ref} className="flex flex-col gap-3 sm:gap-4 will-change-transform">
            {items.map((item, i) => (
                <LazyImage key={`a-${item.id}`} item={item} index={i} onClick={() => onClick(item)} />
            ))}
            {items.map((item, i) => (
                <LazyImage key={`b-${item.id}`} item={item} index={i + items.length} onClick={() => onClick(item)} />
            ))}
        </div>
    );
};

// ---------- Main Gallery ----------
const MARQUEE_SPEEDS = [110, 90, 130];

export default function GalleryClient({ locale = 'en', description }: { locale?: 'en' | 'ja'; description?: string }) {
    const [media, setMedia] = useState<InstagramMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(30);
    const [selectedItem, setSelectedItem] = useState<InstagramMedia | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Mobile: static single-column list. Desktop: animated 3-column marquee.
    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const columnCount = isMobile ? 1 : 3;

    // Distribute media evenly into the marquee columns
    const columns = useMemo(() => {
        const cols: InstagramMedia[][] = Array.from({ length: columnCount }, () => []);
        media.slice(0, visibleCount).forEach((item, i) => cols[i % columnCount].push(item));
        return cols;
    }, [media, visibleCount, columnCount]);

    // Auto-load more images over time (hero fills the viewport, so no scroll trigger)
    useEffect(() => {
        if (loading || media.length === 0 || visibleCount >= media.length) return;
        const id = setInterval(() => {
            setVisibleCount(prev => Math.min(prev + 20, media.length));
        }, 2500);
        return () => clearInterval(id);
    }, [loading, media.length, visibleCount]);

    useEffect(() => {
        getInstagramMedia()
            .then(setMedia)
            .catch(() => setError('Unable to load Instagram gallery at the moment.'))
            .finally(() => setLoading(false));
    }, []);

    const homeLink = locale === 'ja' ? '/ja' : '/';

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-5xl font-black text-blue-500 animate-pulse">F</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href={homeLink} className="inline-block px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">← Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="min-h-screen bg-black flex flex-col">
            {/* Back link */}
            <Link href={homeLink} className="fixed top-8 left-8 z-10 p-3 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>

            {description && (
                <p className="text-center text-sm text-white/60 max-w-2xl mx-auto mb-5 px-20 sm:px-8 pt-8">
                    {description}
                </p>
            )}

            {media.length === 0 ? (
                <div className="flex-1" />
            ) : isMobile ? (
                <div className="flex flex-col gap-3 px-3 pb-6">
                    {media.slice(0, visibleCount).map((item, i) => (
                        <LazyImage
                            key={item.id}
                            item={item}
                            index={i}
                            onClick={() => setSelectedItem(item)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex gap-3 sm:gap-4 px-3 sm:px-6 lg:px-8 pb-4 flex-1 min-h-0 overflow-hidden">
                    {columns.map((col, ci) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: column count is static and never reorders
                        <div key={ci} className="flex-1 min-w-0 relative overflow-hidden">
                            <MarqueeColumn
                                items={col}
                                speed={MARQUEE_SPEEDS[ci % MARQUEE_SPEEDS.length]}
                                reverse={ci % 2 === 1}
                                onClick={setSelectedItem}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Modal */}
        {selectedItem && (
            <CarouselModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
        </>
    );
}
