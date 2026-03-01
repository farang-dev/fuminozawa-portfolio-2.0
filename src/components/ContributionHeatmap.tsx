'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContributionHeatmapProps {
    contributions: Record<string, number>;
    onDateClick: (date: string | null) => void;
    selectedDate: string | null;
    locale: 'en' | 'ja';
}

export default function ContributionHeatmap({
    contributions,
    onDateClick,
    selectedDate,
    locale
}: ContributionHeatmapProps) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() + 1); // Start from the same day last year

    const days = useMemo(() => {
        const result = [];
        const current = new Date(oneYearAgo);

        // Find the most recent Sunday to start the grid (to align weeks like GitHub)
        const dayOfWeek = current.getDay();
        current.setDate(current.getDate() - dayOfWeek);

        // We need enough days to cover 1 year plus the offset to start at Sunday
        for (let i = 0; i < 378; i++) { // ~54 weeks to be safe
            const dateStr = current.toISOString().split('T')[0];
            const count = contributions[dateStr] || 0;

            result.push({
                date: new Date(current),
                dateStr,
                count,
                isToday: dateStr === today.toISOString().split('T')[0],
                isPast: current <= today && current >= oneYearAgo
            });

            current.setDate(current.getDate() + 1);
        }
        return result;
    }, [contributions]);

    // Group days into weeks for the grid
    const weeks = useMemo(() => {
        const result = [];
        for (let i = 0; i < days.length; i += 7) {
            result.push(days.slice(i, i + 7));
        }
        return result;
    }, [days]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-100 dark:bg-gray-800/40';
        if (count <= 1) return 'bg-blue-200';
        if (count <= 3) return 'bg-blue-400';
        if (count <= 5) return 'bg-blue-600';
        return 'bg-blue-800';
    };

    const monthNames = locale === 'ja'
        ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const weekDayNames = locale === 'ja'
        ? ['日', '月', '火', '水', '木', '金', '土']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-4 bg-blue-600 rounded-full"></span>
                    {locale === 'ja' ? '年間の更新頻度' : 'Contributions in the last year'}
                </h3>
                {selectedDate && (
                    <button
                        onClick={() => onDateClick(null)}
                        className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full"
                    >
                        {locale === 'ja' ? 'フィルター解除' : 'Clear Filter'}
                        <span className="text-lg leading-none">×</span>
                    </button>
                )}
            </div>

            <div className="flex gap-3">
                {/* Y-axis labels */}
                <div className="flex flex-col text-[9px] text-gray-400 pt-5 pb-1 h-[84px] justify-between w-6">
                    <span>{weekDayNames[1]}</span>
                    <span>{weekDayNames[3]}</span>
                    <span>{weekDayNames[5]}</span>
                </div>

                <div className="flex-grow overflow-x-auto scrollbar-hide">
                    <div className="inline-grid grid-rows-7 grid-flow-col gap-[3px]">
                        {days.map((day, i) => (
                            <div
                                key={day.dateStr}
                                onClick={() => day.isPast && onDateClick(day.dateStr)}
                                className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-200 ${day.isPast ? 'cursor-pointer hover:ring-2 hover:ring-blue-400/50' : 'opacity-10 cursor-default'
                                    } ${selectedDate === day.dateStr ? 'ring-2 ring-blue-500 scale-125 z-10 shadow-lg' : ''
                                    } ${getColor(day.count)}`}
                                title={`${day.dateStr}: ${day.count} posts`}
                            />
                        ))}
                    </div>

                    {/* Month labels */}
                    <div className="flex mt-2 text-[9px] text-gray-400 relative h-3">
                        {weeks.map((week, weekIdx) => {
                            const firstDayOfWeek = week[0];
                            if (firstDayOfWeek && firstDayOfWeek.date.getDate() <= 7) {
                                return (
                                    <span
                                        key={weekIdx}
                                        className="absolute whitespace-nowrap"
                                        style={{ left: `${weekIdx * 13}px` }}
                                    >
                                        {monthNames[firstDayOfWeek.date.getMonth()]}
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                    {selectedDate ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-blue-600 font-black text-xs uppercase tracking-tight">
                                {locale === 'ja' ? '表示中:' : 'Viewing:'} {new Date(selectedDate).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="text-gray-300 ml-1">({contributions[selectedDate] || 0} {locale === 'ja' ? '件の更新' : 'updates'})</span>
                        </div>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-3 bg-gray-200 rounded-full"></span>
                            {locale === 'ja' ? '日ごとの更新数を確認できます' : 'Activity tracking since last year'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-1.5 rounded-full self-start sm:self-auto">
                    <span>Less</span>
                    <div className="flex gap-[3px]">
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-gray-100 dark:bg-gray-800/40"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-200"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-400"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-600"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-800"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );

}
