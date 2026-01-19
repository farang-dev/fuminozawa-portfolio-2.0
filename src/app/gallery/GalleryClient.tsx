'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InstagramMedia, getInstagramMedia } from '@/lib/instagram';
import { useInView } from 'react-intersection-observer';

// Optimized lazy loaded image component with intersection observer
const LazyImage = ({ item, index }: { item: InstagramMedia; index: number }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '400px 0px',
        threshold: 0.1,
    });

    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div ref={ref} className="relative overflow-hidden bg-gray-900 w-full" style={{ aspectRatio: '4/5' }}>
            {inView ? (
                <>
                    <Image
                        src={item.media_url}
                        alt={item.caption || 'Instagram photo'}
                        width={800}
                        height={800}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        priority={index < 12}
                        loading={index < 12 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
                        onLoad={() => setIsLoaded(true)}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/800?text=Image+Unavailable';
                            target.parentElement?.classList.add('image-error');
                            setIsLoaded(true);
                        }}
                    />
                    {!isLoaded && <div className="absolute inset-0 bg-gray-900 animate-pulse" />}
                </>
            ) : (
                <div className="w-full bg-gray-900 animate-pulse" style={{ aspectRatio: '4/5' }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    );
};

export default function GalleryClient({ locale = 'en' }: { locale?: 'en' | 'ja' }) {
    const [media, setMedia] = useState<InstagramMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(30);

    const loadMoreImages = useCallback(() => {
        setVisibleCount(prev => Math.min(prev + 20, media.length));
    }, [media.length]);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '800px 0px',
    });

    useEffect(() => {
        if (inView) {
            loadMoreImages();
        }
    }, [inView, loadMoreImages]);

    useEffect(() => {
        const fetchInstagramMedia = async () => {
            try {
                const data = await getInstagramMedia();
                setMedia(data);
            } catch (err) {
                console.error('Error fetching Instagram media:', err);
                setError('Unable to load Instagram gallery at the moment. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramMedia();
    }, []);

    const homeLink = locale === 'ja' ? '/ja' : '/';

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-5xl font-black text-blue-500 animate-pulse">
                    F
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href={homeLink} className="inline-block px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-full mx-auto">
                {media.length === 0 ? (
                    <div className="flex items-center justify-center h-screen">
                        <Link href={homeLink} className="fixed top-8 left-8 z-10 p-3 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                        {media.slice(0, visibleCount).map((item, index) => (
                            <div key={item.id} className="group relative overflow-hidden h-full">
                                <a href={item.permalink} target="_blank" rel="noopener noreferrer" className="block">
                                    <LazyImage item={item} index={index} />
                                </a>
                            </div>
                        ))}

                        {visibleCount < media.length && (
                            <div
                                ref={ref}
                                className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center items-center py-12"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <div className="text-white text-sm opacity-80">Loading more images...</div>
                                    <div className="text-white text-xs opacity-60 mt-1">Showing {visibleCount} of {media.length} images</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {media.length > 0 && (
                    <>
                        <Link href={homeLink} className="fixed top-8 left-8 z-10 p-3 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
