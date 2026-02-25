'use client';

import { useState, useEffect, useCallback } from 'react';
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
            className="relative overflow-hidden bg-gray-900 w-full cursor-pointer"
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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl mx-4 flex flex-col items-center"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-3xl leading-none"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Image + side arrows */}
                <div className="relative w-full flex items-center justify-center gap-2">
                    {/* Prev arrow */}
                    {total > 1 && (
                        <button
                            onClick={prev}
                            className="flex-shrink-0 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl"
                            aria-label="Previous photo"
                        >
                            ‹
                        </button>
                    )}

                    {/* Image container */}
                    <div className="flex-1 flex items-center justify-center" style={{ maxHeight: '80vh' }}>
                        <Image
                            key={images[current]}
                            src={images[current]}
                            alt={`Photo ${current + 1} of ${total}`}
                            width={1080}
                            height={1350}
                            sizes="(max-width: 768px) 100vw, 672px"
                            className="rounded-lg object-contain"
                            style={{ maxHeight: '80vh', width: 'auto', maxWidth: '100%' }}
                        />
                    </div>

                    {/* Next arrow */}
                    {total > 1 && (
                        <button
                            onClick={next}
                            className="flex-shrink-0 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl"
                            aria-label="Next photo"
                        >
                            ›
                        </button>
                    )}
                </div>

                {/* Dot indicators */}
                {total > 1 && (
                    <div className="flex gap-1.5 mt-4">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
                                aria-label={`Go to photo ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Counter + IG link */}
                <div className="flex items-center gap-4 mt-3">
                    {total > 1 && (
                        <span className="text-white/60 text-sm">{current + 1} / {total}</span>
                    )}
                    <a
                        href={item.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        View on Instagram
                    </a>
                </div>
            </div>
        </div>
    );
};

// ---------- Main Gallery ----------
export default function GalleryClient({ locale = 'en' }: { locale?: 'en' | 'ja' }) {
    const [media, setMedia] = useState<InstagramMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(30);
    const [selectedItem, setSelectedItem] = useState<InstagramMedia | null>(null);

    const loadMoreImages = useCallback(() => {
        setVisibleCount(prev => Math.min(prev + 20, media.length));
    }, [media.length]);

    const { ref, inView } = useInView({ threshold: 0, rootMargin: '800px 0px' });

    useEffect(() => {
        if (inView) loadMoreImages();
    }, [inView, loadMoreImages]);

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
        <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link href={homeLink} className="fixed top-8 left-8 z-10 p-3 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>

            <div className="max-w-full mx-auto">
                {media.length === 0 ? (
                    <div className="flex items-center justify-center h-screen" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                        {media.slice(0, visibleCount).map((item, index) => (
                            <div key={item.id} className="group relative overflow-hidden h-full">
                                <LazyImage
                                    item={item}
                                    index={index}
                                    onClick={() => setSelectedItem(item)}
                                />
                            </div>
                        ))}

                        {visibleCount < media.length && (
                            <div ref={ref} className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center items-center py-12">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                                    <div className="text-white text-sm opacity-80">Loading more images...</div>
                                    <div className="text-white text-xs opacity-60 mt-1">Showing {visibleCount} of {media.length} images</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedItem && (
                <CarouselModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
}
