import { createPortal } from 'react-dom';

export default function ConfirmPopup({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_150ms_ease-out]"
            onClick={onCancel}
        >
            <div
                className="bg-[#111211] rounded-2xl p-6 w-full max-w-sm shadow-xl border border-white/10 animate-[slide-up_150ms_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white text-base font-bold mb-1">{title}</h2>
                {message && <p className="text-white/50 text-sm mb-5">{message}</p>}

                <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
