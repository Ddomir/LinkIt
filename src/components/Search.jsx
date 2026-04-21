import React, { useState } from 'react';                // Import React library and useState hook for managing state in the component
import searchLogo from '../assets/search-logo.svg'; 
import sortLogo from '../assets/sort-logo.svg'; 
import filterLogo from '../assets/filter-logo.svg'; 
import { List, LayoutGrid } from "lucide-react";

function Search({ searchQuery = '', onSearchChange = () => {}, filters = { folders: true, links: true, pinnedOnly: false }, onFilterChange = () => {}, sortOption = 'pinned', onSortChange = () => {}, viewMode = true, setViewMode = () => {} }) {
    const [showSort, setShowSort] = useState(false); // State to control visibility of sort options
    const [showFilter, setShowFilter] = useState(false); // State to control visibility of filter options

    const MAX_SEARCH_LENGTH = 200;
    const NOTALLOWED_CHARS_REGEX = /[<>;`$\\{}|^~\x00-\x1F]/g;

    const sanitize = (raw) => {//sanitize user input
        if (typeof raw !== 'string') return '';
        let s = raw.replace(NOTALLOWED_CHARS_REGEX, '');
        s = s.replace(/\s+/g, ' ');
        s = s.replace(/--+/g, '-');
        s = s.trim();
        if (s.length > MAX_SEARCH_LENGTH) s = s.slice(0, MAX_SEARCH_LENGTH);
        return s;
    }

    const handleInputChange = (e) => {//when user types in the search input
        const raw = e.target.value || '';
        const sanitized = sanitize(raw);
        onSearchChange(sanitized);
    }

    const handlePaste = (e) => {//when user pastes
        try {
            const clipboard = (e.clipboardData || window.clipboardData).getData('text') || '';            
            const sanitized = sanitize(clipboard);
            e.preventDefault();
            const next = sanitize((searchQuery || '') + sanitized);
            onSearchChange(next);
        } catch (err) {
            //error
        }
    }

    return (
        <div className="flex gap-2 p-3 text-base justify-between items-center">

            {/* text input for searching for cards/folders */}
            <div className="relative w-full sm:w-1/2"> 
                <input 
                    type="text" 
                    placeholder="Search for cards and folders..." 
                    className="w-full h-10 px-3 pr-10 bg-[#0C0A0A] text-white border border-[D9D9D9] rounded-full" 
                    value={searchQuery}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                />
                <img src={searchLogo} alt="search icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4" />
            </div>

            {/* Buttons grouped to the right of the search bar */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <button 
                        onClick={() => setShowSort(!showSort)}
                        className="flex items-center gap-2 px-3 py-2 bg-[#0C0A0A] text-white rounded-full border border-[D9D9D9] transition-transform duration-200 hover:scale-105">
                        <img src={sortLogo} alt="sort icon" className="w-6 h-6 min-w-[14px] min-h-[14px]" />
                        <span className="hidden sm:inline">Sort</span>
                    </button>

                    {showSort && (
                        <div className="absolute mt-2 right-0 bg-[#0C0A0A] text-gray-300 font-semibold border border-[D9D9D9] rounded-lg p-3">
                            <label className="block flex items-center">
                                <input type="radio" name="sort" checked={sortOption === 'az'} onChange={() => onSortChange('az')} /> 
                                <span className="ml-1"> A-Z </span>
                            </label>
                            <label className="block flex items-center">
                                <input type="radio" name="sort" checked={sortOption === 'za'} onChange={() => onSortChange('za')} /> 
                                <span className="ml-1"> Z-A </span>
                            </label>
                            <label className="block flex items-center">
                                <input type="radio" name="sort" checked={sortOption === 'newest'} onChange={() => onSortChange('newest')} /> 
                                <span className="ml-1"> Newest </span>
                            </label>
                            <label className="block flex items-center">
                                <input type="radio" name="sort" checked={sortOption === 'oldest'} onChange={() => onSortChange('oldest')} /> 
                                <span className="ml-1"> Oldest </span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 px-3 py-2 bg-[#0C0A0A] text-white rounded-full border border-[D9D9D9] transition-transform duration-200 hover:scale-105">
                        <img src={filterLogo} alt="filter icon" className="w-6 h-6 min-w-[14px] min-h-[14px]" />
                        <span className="hidden sm:inline">Filter</span>
                    </button>

                    {showFilter && (
                        <div className="absolute mt-2 right-0 bg-[#0C0A0A] text-gray-300 font-semibold border border-[D9D9D9] rounded-lg p-3">
                            <label className="block flex items-center">  
                                <input type="checkbox" checked={!!filters.folders} onChange={(e) => onFilterChange({ ...filters, folders: e.target.checked })} /> 
                                <span className="ml-1"> Folders </span>
                            </label>
                            <label className="block flex items-center">
                                <input type="checkbox" checked={!!filters.links} onChange={(e) => onFilterChange({ ...filters, links: e.target.checked })} /> 
                                <span className="ml-1"> Links </span>
                            </label>
                            <label className="block flex items-center">
                                <input type="checkbox" checked={!!filters.pinnedOnly} onChange={(e) => onFilterChange({ ...filters, pinnedOnly: e.target.checked })} /> 
                                <span className="ml-1"> Pinned </span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex">
                    <button 
                        onClick={() => setViewMode(!viewMode)}
                        className={`${viewMode ? `bg-white text-[#0C0A0A]` : `bg-[#0C0A0A] text-white`} pl-3 pr-1.5 py-2  rounded-l-full border border-r-[0.5px] border-white transition-transform duration-200 hover:scale-105 cursor-pointer`}>
                        <LayoutGrid className="size-6" />
                    </button>
                    <button 
                        onClick={() => setViewMode(!viewMode)}
                        className={`${viewMode ? `bg-[#0C0A0A] text-white` : `bg-white text-[#0C0A0A]`} pr-3 pl-1.5 py-2 rounded-r-full border border-l-[0.5px] border-white transition-transform duration-200 hover:scale-105 cursor-pointer`}>
                        <List className="size-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Search; // Allows other files to import this component
