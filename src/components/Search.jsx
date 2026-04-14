import React, { useState } from 'react';                // Import React library and useState hook for managing state in the component
import searchLogo from '../assets/search-logo.svg'; 
import sortLogo from '../assets/sort-logo.svg'; 
import filterLogo from '../assets/filter-logo.svg'; 

function Search() {

    const [showSort, setShowSort] = useState(false); // State to control visibility of sort options
    const [showFilter, setShowFilter] = useState(false); // State to control visibility of filter options

    return (
        <>
        <div className="flex gap-2 p-3 text-base items-center">

            {/* text input for searching for cards/folders */}
            <div className="relative w-full sm:w-1/2"> 
                <input 
                    type="text" 
                    placeholder="Search for cards and folders..." 
                    className="w-full h-10 px-3 pr-10 bg-[#0C0A0A] text-white border border-[D9D9D9] rounded-full" 
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
                            <label className="block">
                                <input type="radio" name="sort" /> A-Z
                            </label>
                            <label className="block">
                                <input type="radio" name="sort" /> Z-A
                            </label>
                            <label className="block">
                                <input type="radio" name="sort" /> Newest
                            </label>
                            <label className="block">
                                <input type="radio" name="sort" /> Oldest
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
                            <label className="block">  
                                <input type="checkbox" /> Folders
                            </label>
                            <label className="block">
                                <input type="checkbox" /> Links
                            </label>
                            <label className="block">
                                <input type="checkbox" /> Pinned 
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default Search; // Allows other files to iport this component

// I need to export search to room and put it in between the title and the actual rooms instead of having it in the dashboard page. 
// from thereon I need to add an input and two buttons in horizontal order (figma).
