import React, { useState, useEffect, useRef } from "react";



export default function CreateLinkPopup({ isOpen, onClose, onCreate, COLOR_OPTIONS }) {
    const [type, setType] = useState(""); //folder or link (value used when creating)
    const [openSection, setOpenSection] = useState(""); //controls for which form is open
    const [title, setTitle] = useState("");
    const [link, setLink] = useState(""); //only for links
    const [color, setColor] = useState("#FFD700");

    const [visible, setVisible] = useState(false);
    const contentRef = useRef(null);
    const [showPalette, setShowPalette] = useState(false);

    useEffect(() => {
        setVisible(false); // trigger entrance animation on mount
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => { cancelAnimationFrame(raf); setVisible(false); };
    }, []);

    const resetAll = () => {
        setOpenSection("");
        setType("");
        setTitle("");
        setLink("");
        setColor("#FFD700");
    };

    const handleSubmit = async () => {
        if (!title.trim() || !type) return;
        onCreate({ type, title, link, color });
        resetAll();
        onClose();
    };

    const toggleSection = (section) => {
        if (openSection === section) {
            //close section
            setOpenSection("");
            setType("");
            setShowPalette(false);
        } else {
            setOpenSection(section);
            setType(section);
            setShowPalette(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease-out] ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => { if (e.target === e.currentTarget) { resetAll(); onClose(); } }}
        >
            <div
                ref={contentRef}
                className={`bg-[#1a1a1a] rounded-2xl p-4 w-full max-w-sm shadow-xl border border-white/10 transform transition-all animate-[slide-up_200ms_ease-out] ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center mb-6">
                    <h2 className="text-[#77f298] text-xl font-bold mb-4 self-center">Add New Card</h2>
                </div>

                <div className="space-y-0">

                    {/* Link Section */}
                    <button
                        onClick={() => toggleSection("link")}
                        className={`w-full flex items-center justify-between bg-gray-300/80 text-black px-4 py-2 ${openSection === "link" ? "rounded-t-lg" : "rounded-lg"}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">Insert Link</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                            </svg>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${openSection === "link" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.0l-4.25 4.66a.75.75 0 01-1.12 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Expanded link form */}
                    <div className={`overflow-hidden transition-all duration-200 ${openSection === 'link' ? 'max-h-96 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        <div className="bg-gray-300/80 rounded-b-lg p-4 text-black">
                            <label className="block text-lg font-bold text-gray-800">Link Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give the link a title"
                                autoFocus={openSection === 'link'}
                                className="w-full bg-[#dfe3e7] rounded-md border border-white/10 px-3 py-2 text-sm outline-none mb-3"
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { resetAll(); onClose(); } }}
                            />

                            <label className="block text-lg font-bold text-gray-800">URL</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Insert link here"
                                className="w-full bg-[#dfe3e7] rounded-md border border-white/10 px-3 py-2 text-sm outline-none mb-4"
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { resetAll(); onClose(); } }}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowPalette((s) => !s)}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                        aria-expanded={showPalette}
                                    >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
                                                <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                                <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7"/>
                                            </svg>
                                        <span>Color</span>
                                    </button>

                                    <div className={`flex gap-2 items-center transition-all duration-150 ${showPalette ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
                                        {/* Color display */}
                                        {/* Fix this soon somehow */}
                                        <div className="w-[10rem] overflow-x-auto flex gap-2 p-2">
                                            {COLOR_OPTIONS.map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setColor(c)}
                                                    className={`w-6 h-6 shrink-0 rounded-full border ${color === c ? 'ring-2 ring-offset-1 ring-gray-400' : 'border-white/20'}`}
                                                    style={{ background: c }}
                                                    aria-label={`Choose color ${c}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleSubmit} className="text-sm font-semibold text-white bg-[#0f1720] px-3 py-1.5 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:cursor-pointer transition-colors duration-150" disabled={!title.trim() || !link.trim()}>
                                    Add Card
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Folder Section */}
                    <button
                        onClick={() => toggleSection("folder")}
                        className={`w-full flex items-center justify-between bg-gray-300/80 text-black px-4 py-2 mt-5 ${openSection === "folder" ? "rounded-t-lg" : "rounded-lg"}`}
                    >
                        <div className="flex items-center gap-2">   
                            <span className="text-xl font-bold">New Folder</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-folder2" viewBox="0 0 16 16">
                                <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5z"/>
                            </svg>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${openSection === "folder" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.0l-4.25 4.66a.75.75 0 01-1.12 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Expanded folder form */}
                    <div className={`overflow-hidden transition-all duration-200 ${openSection === 'folder' ? 'max-h-72 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        <div className="bg-gray-300/80 rounded-b-lg p-4 text-black">
                            <label className="block text-lg font-bold text-gray-800">Folder Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give the folder a title"
                                autoFocus={openSection === 'folder'}
                                className="w-full bg-[#f0f0f0] rounded-md border border-white/10 px-3 py-2 text-sm outline-none mb-4"
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { resetAll(); onClose(); } }}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowPalette((s) => !s)}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                        aria-expanded={showPalette}
                                    >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
                                                <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                                <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7"/>
                                            </svg>
                                        <span>Color</span>
                                    </button>

                                    <div className={`flex gap-2 items-center transition-all duration-150 ${showPalette ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
                                        {/* Color display */}
                                        <div className="w-[10rem] overflow-x-auto flex gap-2 p-2">
                                            {COLOR_OPTIONS.map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setColor(c)}
                                                    className={`w-6 h-6 shrink-0 rounded-full border ${color === c ? 'ring-2 ring-offset-1 ring-gray-400' : 'border-white/20'}`}
                                                    style={{ background: c }}
                                                    aria-label={`Choose color ${c}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleSubmit} className="text-sm font-semibold text-white bg-[#0f1720] px-3 py-1.5 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:cursor-pointer transition-colors duration-150" disabled={!title.trim()}>
                                    Add Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* close button */}
                <div className="mt-4 flex items-center justify-start">
                    <button onClick={() => { resetAll(); onClose(); }} className="text-gray-300 text-sm p-1 rounded hover:bg-white/5 hover:text-white hover:cursor-pointer">✕</button>
                </div>
            </div>
        </div>
    );
}
