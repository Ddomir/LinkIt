import { useState, useEffect, useRef } from "react";
import { X, Pin } from "lucide-react";

export default function EditCardPopup({ isOpen, onClose, onSave, item, COLOR_OPTIONS }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [color, setColor] = useState(null);
    const [pinned, setPinned] = useState(false);
    const [visible, setVisible] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !item) return;
        setTitle(item.title ?? "");
        setLink(item.link ?? "");
        setColor(item.color ?? null);
        setPinned(item.pinned ?? false);
        setVisible(false);
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => { cancelAnimationFrame(raf); setVisible(false); };
    }, [isOpen, item]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSave({ id: item.id, type: item.type, title: title.trim(), link, color, pinned });
        onClose();
    };

    const selectedStyle = color !== null ? (COLOR_OPTIONS?.[color] ?? {}) : {};

    if (!isOpen || !item) return null;

    const isLink = item.type !== "folder";

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                ref={contentRef}
                className={`bg-[#111211] rounded-2xl p-5 w-full max-w-sm shadow-2xl border border-white/10 transform transition-all duration-200 ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#77f298] text-lg font-bold">Edit {isLink ? "Link" : "Folder"}</h2>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#77f298]/50 transition-colors"
                            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
                        />
                    </div>

                    {isLink && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">URL</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#77f298]/50 transition-colors"
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
                            />
                        </div>
                    )}

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

                    <button
                        onClick={() => setPinned((p) => !p)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${pinned ? 'bg-[#77f298]/10 border-[#77f298]/40 text-[#77f298]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    >
                        <Pin size={14} className={pinned ? 'fill-current' : ''} />
                        {pinned ? 'Pinned' : 'Pin'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="w-full mt-1 py-2 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5fd980] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
