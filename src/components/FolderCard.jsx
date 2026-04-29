import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Folder, Pin, MoreHorizontal } from 'lucide-react';
import ConfirmPopup from './popups/ConfirmPopup';

export default function FolderCard({ id, type, title, links, roomid, color, icon, pinned, parentfolder, createdAt, colorMap, onClick, onEdit, onDelete }) {
    const bgStyle = colorMap?.[color] ?? {};
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const openMenu = (e) => {
        e.stopPropagation();
        const rect = btnRef.current.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
        setMenuOpen((o) => !o);
    };

    return (
        <div className="relative w-full">
            <div
                className="rounded-xl px-3 py-2 w-full shadow-sm flex flex-row items-center gap-2.5 cursor-pointer transition-transform hover:scale-[1.01]"
                style={bgStyle}
                title={title}
                onClick={onClick}
            >
                <Folder size={24} className="shrink-0" />

                <h3 className="text-sm font-semibold flex-1 truncate">{title}</h3>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm opacity-75">{links.length} {links.length === 1 ? 'link' : 'links'}</span>
                    {pinned && <Pin size={16} className="fill-current opacity-90" />}
                    {(onEdit || onDelete) && (
                        <button
                            ref={btnRef}
                            className="p-1 rounded-md hover:bg-black/20 transition-colors"
                            onClick={openMenu}
                            title="Options"
                        >
                            <MoreHorizontal size={16} />
                        </button>
                    )}
                </div>
            </div>

            {menuOpen && createPortal(
                <div
                    ref={menuRef}
                    className="fixed bg-[#1a1d1a] border border-white/10 rounded-xl shadow-xl z-999 overflow-hidden min-w-27.5"
                    style={{ top: menuPos.top, right: menuPos.right }}
                >
                    {onEdit && (
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit({ id, title, color, pinned }); }}
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setConfirmOpen(true); }}
                        >
                            Delete
                        </button>
                    )}
                </div>,
                document.body
            )}

            <ConfirmPopup
                isOpen={confirmOpen}
                title="Delete folder?"
                message={`"${title}" and all its contents will be permanently deleted.`}
                confirmLabel="Delete"
                onConfirm={() => { setConfirmOpen(false); onDelete(id); }}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
