import { useState, useEffect, useRef } from "react";
import { Link, Folder, X, ChevronDown } from "lucide-react";

export default function CreateLinkPopup({ isOpen, onClose, onCreate, COLOR_OPTIONS }) {
    const [type, setType] = useState("");
    const [openSection, setOpenSection] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [color, setColor] = useState(null);
    const [visible, setVisible] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        setVisible(false);
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => { cancelAnimationFrame(raf); setVisible(false); };
    }, []);

    const resetAll = () => {
        setOpenSection("");
        setType("");
        setTitle("");
        setLink("");
        setColor(null);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !type) return;
        onCreate({ type, title, link, color });
        resetAll();
        onClose();
    };

    const toggleSection = (section) => {
        if (openSection === section) {
            setOpenSection("");
            setType("");
        } else {
            setOpenSection(section);
            setType(section);
        }
    };

    const selectedStyle = color !== null ? (COLOR_OPTIONS?.[color] ?? {}) : {};

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => { if (e.target === e.currentTarget) { resetAll(); onClose(); } }}
        >
            <div
                ref={contentRef}
                className={`bg-[#111211] rounded-2xl p-5 w-full max-w-sm shadow-2xl border border-white/10 transform transition-all duration-200 ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[#77f298] text-lg font-bold">Add New Card</h2>
                    <button
                        onClick={() => { resetAll(); onClose(); }}
                        className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col gap-2">

                    {/* Link Section */}
                    <div className="rounded-xl overflow-hidden border border-white/10">
                        <button
                            onClick={() => toggleSection("link")}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors duration-150 ${openSection === "link" ? "bg-[#77f298] text-black" : "bg-white/5 text-white hover:bg-white/10"}`}
                        >
                            <div className="flex items-center gap-2">
                                <Link size={16} />
                                <span>Insert Link</span>
                            </div>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${openSection === "link" ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-200 ${openSection === "link" ? "max-h-96" : "max-h-0"}`}>
                            <div className="p-4 flex flex-col gap-3 border-t border-white/10">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Give the link a title"
                                        autoFocus={openSection === "link"}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#77f298]/50 transition-colors"
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { resetAll(); onClose(); } }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">URL</label>
                                    <input
                                        type="text"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#77f298]/50 transition-colors"
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { resetAll(); onClose(); } }}
                                    />
                                </div>

                                <ColorPicker COLOR_OPTIONS={COLOR_OPTIONS} color={color} setColor={setColor} selectedStyle={selectedStyle} />

                                <button
                                    onClick={handleSubmit}
                                    disabled={!title.trim() || !link.trim()}
                                    className="w-full mt-1 py-2 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5fd980] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Folder Section */}
                    <div className="rounded-xl overflow-hidden border border-white/10">
                        <button
                            onClick={() => toggleSection("folder")}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors duration-150 ${openSection === "folder" ? "bg-[#77f298] text-black" : "bg-white/5 text-white hover:bg-white/10"}`}
                        >
                            <div className="flex items-center gap-2">
                                <Folder size={16} />
                                <span>New Folder</span>
                            </div>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${openSection === "folder" ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-200 ${openSection === "folder" ? "max-h-72" : "max-h-0"}`}>
                            <div className="p-4 flex flex-col gap-3 border-t border-white/10">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Give the folder a title"
                                        autoFocus={openSection === "folder"}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#77f298]/50 transition-colors"
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { resetAll(); onClose(); } }}
                                    />
                                </div>

                                <ColorPicker COLOR_OPTIONS={COLOR_OPTIONS} color={color} setColor={setColor} selectedStyle={selectedStyle} />

                                <button
                                    onClick={handleSubmit}
                                    disabled={!title.trim()}
                                    className="w-full mt-1 py-2 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5fd980] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                                >
                                    Add Folder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ColorPicker({ COLOR_OPTIONS, color, setColor, selectedStyle }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Color</label>
            <div className="flex flex-wrap gap-2">
                {Object.entries(COLOR_OPTIONS || {}).map(([id, style]) => {
                    const numId = Number(id);
                    const isSelected = color === numId;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setColor(numId)}
                            className={`w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-110 ${isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                            style={{ background: style.background?.replace('to right', 'to bottom right') }}
                            aria-label={`Color ${id}`}
                        />
                    );
                })}
            </div>
            {color !== null && (
                <div className="h-6 w-full rounded-lg mt-1" style={selectedStyle} />
            )}
        </div>
    );
}
