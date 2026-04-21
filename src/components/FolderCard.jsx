import { Folder, Pin } from 'lucide-react';

export default function FolderCard({ id, type, title, links, roomid, color, icon, pinned, parentfolder, createdAt, colorMap, onClick }) {
    const bgStyle = colorMap?.[color] ?? {};

    return (
            <div
                className="rounded-xl px-4 py-3 w-full shadow-sm flex flex-row items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01]"
                style={bgStyle}
                title={title}
                onClick={onClick}
            >
                <Folder size={24} className="shrink-0" />

                <h3 className="text-lg font-bold flex-1 truncate">{title}</h3>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm opacity-75">{links.length} {links.length === 1 ? 'link' : 'links'}</span>
                    {pinned && <Pin size={16} className="fill-current opacity-90" />}
                </div>
            </div>
    );
}