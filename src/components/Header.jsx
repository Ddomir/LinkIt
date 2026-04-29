import React, { useState } from "react";
import CreateLinkPopup from "./popups/CreateLinkPopup";
import ShareInvite from "./popups/ShareInvite";
import Search from "./Search";
import { Share2, Plus, SquareArrowRightExit } from "lucide-react";

export default function Header({ roomData, inviteData, onAddCard, COLOR_OPTIONS, searchQuery, setSearchQuery, filters, setFilters, sortOption, setSortOption, viewMode, setViewMode, selectedFolder, readOnly = false, mobileOpen = false, onHamburgerClick }) {
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [showInvitePopup, setInvitePopup] = useState(false);

    const handleCreateLink = (data) => {
        if (onAddCard && data) {
            onAddCard(data);
        }
        setShowLinkPopup(false);
    };

    return (
        <>
        {/* Mobile header: sticky, transparent with bottom gradient fade */}
        <div className="sm:hidden sticky top-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-b from-[#0E100E] via-[#0E100E]/80 to-transparent" />
            <div className="relative pointer-events-auto flex items-center justify-between px-3 pt-3 pb-6">
                {/* Spacer to balance the right-side actions */}
                <div className="w-10" />

                {/* Centered room name */}
                <h1 className="text-(--accent) text-2xl font-bold text-center absolute left-1/2 -translate-x-1/2">{roomData.name}</h1>

                {/* Right actions */}
                {!readOnly ? (
                    <div className="flex items-center gap-1">
                        <button
                            className="text-white hover:text-(--accent) cursor-pointer transition-colors duration-150 p-2"
                            aria-label="Share invite"
                            onClick={() => setInvitePopup(true)}
                        >
                            <Share2 size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setShowLinkPopup(true)}
                            aria-label="Add link or folder"
                            className="flex items-center justify-center bg-(--accent) text-black rounded-full w-8 h-8 shadow-lg hover:bg-[#5fd980] cursor-pointer transition-colors duration-150"
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>
                ) : (
                    <div className="w-10" />
                )}
            </div>
        </div>

        {/* Desktop header */}
        <div className="hidden sm:flex flex-col justify-between px-3 py-3 w-full">
            <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="text-(--accent) text-4xl font-bold text-left pl-3">{roomData.name}</h1>

                    {!readOnly && (
                    <div className="flex items-center justify-between gap-3">
                        <button
                            className="hover:bg-(--accent) text-(--text) hover:text-black hover:cursor-pointer rounded-full p-2 transition-colors duration-150"
                            aria-label="Share invite"
                            onClick={() => setInvitePopup(true)}
                        >
                            <Share2 strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setShowLinkPopup(true)}
                            aria-label="Add link or folder"
                            className="hover:bg-(--accent) text-(--text) hover:text-black hover:cursor-pointer rounded-full p-2 transition-colors duration-150"
                        >
                            <Plus size={28} strokeWidth={3} />
                        </button>
                    </div>
                    )}
                </div>

                <div className="w-full flex items-center justify-between gap-3">
                    <div className="w-full sm:w-1/2">
                        <Search
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            filters={filters}
                            onFilterChange={setFilters}
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile search bar (below the sticky header, scrolls with content) */}
        <div className="sm:hidden px-3 pb-3">
            <Search
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={setFilters}
                sortOption={sortOption}
                onSortChange={setSortOption}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
        </div>

        <CreateLinkPopup
            COLOR_OPTIONS={COLOR_OPTIONS}
            isOpen={showLinkPopup}
            onClose={() => setShowLinkPopup(false)}
            onCreate={handleCreateLink}
            selectedFolder={selectedFolder}
        />

        <ShareInvite isOpen={showInvitePopup} onClose={() => setInvitePopup(false)} inviteData={inviteData} />
        </>
    )
}