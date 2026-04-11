export default function ShareInvite({ isOpen, onClose, inviteData }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease-out]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md shadow-xl border border-white/10 animate-[slide-up_200ms_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white text-lg font-bold mb-5">Share Room Invite Code</h2>

                <h2 className="text-[#77f298] text-5xl tracking-widest font-bold mb-5">{inviteData.link}</h2>

                <button
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black 
                    hover:bg-[#5ee07e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    Close
                </button>
                
            </div>
        </div>
    )
}