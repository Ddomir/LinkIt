import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ShareInvite({ isOpen, onClose, inviteData }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteData.link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease-out]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-[#111211] rounded-2xl p-6 w-full max-w-md shadow-xl border border-white/10 animate-[slide-up_200ms_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white text-lg font-bold mb-5">Share Room Invite Code</h2>

                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-between gap-4 bg-white/5 border border-white/10 hover:border-[#77f298]/50 rounded-xl px-5 py-4 transition-colors duration-150 group cursor-pointer"
                >
                    <span className="text-[#77f298] text-2xl font-bold tracking-widest break-all text-left">
                        {inviteData.link}
                    </span>
                    <span className="shrink-0 text-white/40 group-hover:text-[#77f298] transition-colors">
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </span>
                </button>

                {copied && (
                    <p className="text-xs text-[#77f298] mt-2 ml-1">Copied to clipboard!</p>
                )}

                <div className="flex justify-end mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
