import React, { useState, useRef, useEffect } from 'react';
import { List, LayoutGrid, SearchIcon, SortDesc, Filter, Check } from "lucide-react";

function Search({ searchQuery = '', onSearchChange = () => {}, filters = { folders: true, links: true, pinnedOnly: false }, onFilterChange = () => {}, sortOption = 'pinned', onSortChange = () => {}, viewMode = true, setViewMode = () => {} }) {
    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const sortRef = useRef(null);
    const filterRef = useRef(null);

    const MAX_SEARCH_LENGTH = 200;
    const NOTALLOWED_CHARS_REGEX = /[<>;`$\\{}|^~\x00-\x1F]/g;

    const sanitize = (raw) => {
        if (typeof raw !== 'string') return '';
        let s = raw.replace(NOTALLOWED_CHARS_REGEX, '');
        s = s.replace(/\s+/g, ' ');
        s = s.replace(/--+/g, '-');
        s = s.trim();
        if (s.length > MAX_SEARCH_LENGTH) s = s.slice(0, MAX_SEARCH_LENGTH);
        return s;
    };

    const handleInputChange = (e) => {
        onSearchChange(sanitize(e.target.value || ''));
    };

    const handlePaste = (e) => {
        try {
            const clipboard = (e.clipboardData || window.clipboardData).getData('text') || '';
            e.preventDefault();
            onSearchChange(sanitize((searchQuery || '') + clipboard));
        } catch {}
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
            if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const sortOptions = [
        { value: 'pinned', label: 'Pinned first' },
        { value: 'az', label: 'A → Z' },
        { value: 'za', label: 'Z → A' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ];

    const panelClass = "absolute top-full mt-2 right-0 z-50 min-w-40 bg-[#1a1d1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden";

    return (
        <div className="flex gap-2 items-center w-full">

            {/* Search input */}
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-9 pl-4 pr-10 bg-white/5 text-(--text) border border-white/10 rounded-full text-sm placeholder:text-(--text) focus:outline-none focus:border-white/25 transition-colors"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                />
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
            </div>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
                <button
                    onClick={() => { setShowSort(s => !s); setShowFilter(false); }}
                    className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-150 cursor-pointer text-(--text) ${showSort ? 'bg-white/15 border-white/25' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    aria-label="Sort"
                >
                    <SortDesc className="w-4 h-4 text-white" />
                </button>
                {showSort && (
                    <div className={panelClass}>
                        {sortOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortOption === opt.value ? 'text-(--accent) font-semibold' : 'text-white/70 hover:bg-white/5'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => { setShowFilter(f => !f); setShowSort(false); }}
                    className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-150 cursor-pointer text-(--text) ${showFilter ? 'bg-white/15 border-white/25' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    aria-label="Filter"
                >
                    <Filter className="w-4 h-4 text-white" />
                </button>
                {showFilter && (
                    <div className={panelClass}>
                        {[
                            { key: 'folders', label: 'Folders' },
                            { key: 'links', label: 'Links' },
                            { key: 'pinnedOnly', label: 'Pinned only' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => onFilterChange({ ...filters, [key]: !filters[key] })}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors"
                            >
                                <span>{label}</span>
                                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${filters[key] ? 'bg-(--accent) border-(--accent)' : 'border-white/20'}`}>
                                    {filters[key] && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* View toggle — desktop only */}
            <div className="hidden sm:flex rounded-full border border-white/10 overflow-hidden">
                <button
                    onClick={() => setViewMode(true)}
                    className={`p-2 transition-colors cursor-pointer text-(--text) ${viewMode ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'}`}
                    aria-label="Grid view"
                >
                    <LayoutGrid className="w-4 h-4 text-white" />
                </button>
                <button
                    onClick={() => setViewMode(false)}
                    className={`p-2 transition-colors cursor-pointer text-(--text) ${!viewMode ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'}`}
                    aria-label="List view"
                >
                    <List className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
}

export default Search;
