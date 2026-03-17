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
            <div className="relative flex-1"> 
            <input 
                type="text" 
                placeholder="Search for cards and folders..." 
                className="w-full h-10 px-3 pr-10 bg-[#0C0A0A] text-white border border-[D9D9D9] rounded-full" 
            />
            <img src={searchLogo} alt="search icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>

            <div className="relative"> {/*relative positioning for the sort button and its dropdown*/}
                {/*sort button*/}
                <button 
                    onClick = {() => setShowSort(!showSort)} // Toggle sort options visibility on click
                    className="flex items-center gap-2 px-6 py-2 bg-[#0C0A0A] text-white rounded-full border border-[D9D9D9] transition-transform duration-200 hover:scale-105">
                    <img src={sortLogo} alt="sort icon" className="flex w-4 h-4" />
                    Sort
                </button>

                {/* sort options dropdown */}
                {showSort && (
                    <div className="absolute mt-2 bg-[#0C0A0A] text-gray-300 font-semibold border border-[D9D9D9] rounded-lg p-3">
                        <label className="block">                        {/*Label connects the text to the input, and block makes it so each option is on a new line*/}
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
                {/*filter button*/}
                <button 
                    onClick = {() => setShowFilter(!showFilter)} // Toggle filter options visibility on click
                    className="flex items-center gap-2 px-6 py-2 bg-[#0C0A0A] text-white rounded-full border border-[D9D9D9] transition-transform duration-200 hover:scale-105">
                    <img src={filterLogo} alt="filter icon" className="flex w-4 h-4" />
                    Filter
                </button>

                {/* filter options dropdown */}
                {showFilter && (
                    <div className="absolute mt-2 bg-[#0C0A0A] text-gray-300 font-semibold border border-[D9D9D9] rounded-lg p-3">
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
        </>
    );
}

export default Search; // Allows other files to iport this component

// I need to export search to room and put it in between the title and the actual rooms instead of having it in the dashboard page. 
// from thereon I need to add an input and two buttons in horizontal order (figma).
