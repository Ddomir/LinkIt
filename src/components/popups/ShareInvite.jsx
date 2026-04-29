import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ShareInvite({ isOpen, onClose, inviteData }) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/room/${inviteData.link}`;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(inviteData.link).then(() => {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        });
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
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
                <h2 className="text-white text-lg font-bold mb-5">Share Room</h2>

                {/* Invite code */}
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">Invite Code</p>
                <button
                    onClick={handleCopyCode}
                    className="w-full flex items-center justify-between gap-4 bg-white/5 border border-white/10 hover:border-[#77f298]/50 rounded-xl px-5 py-4 transition-colors duration-150 group cursor-pointer mb-4"
                >
                    <span className="text-[#77f298] text-2xl font-bold tracking-widest break-all text-left">
                        {inviteData.link}
                    </span>
                    <span className="shrink-0 text-white/40 group-hover:text-[#77f298] transition-colors">
                        {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                    </span>
                </button>
                {copiedCode && (
                    <p className="text-xs text-[#77f298] -mt-2 mb-3 ml-1">Copied to clipboard!</p>
                )}

                {/* Shareable link */}
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">Shareable Link</p>
                <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between gap-4 bg-white/5 border border-white/10 hover:border-[#77f298]/50 rounded-xl px-5 py-3 transition-colors duration-150 group cursor-pointer"
                >
                    <span className="text-white/70 text-sm break-all text-left truncate">
                        {shareUrl}
                    </span>
                    <span className="shrink-0 text-white/40 group-hover:text-[#77f298] transition-colors">
                        {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                    </span>
                </button>
                {copiedLink && (
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
