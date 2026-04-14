import { Pin } from 'lucide-react';

export default function LinkCard({ id, type, title, link, roomid, color, icon, pinned, folderid, createdAt, colorMap }) {
    const bgStyle = colorMap?.[color] ?? {};

    return (
            <a
                className="rounded-xl p-3 h-30 shadow-sm flex flex-col justify-between cursor-pointer transition-transform hover:scale-[1.02]"
                style={bgStyle}
                title={title}
                href={link}
                target="_blank"
            >
                {/* Icon and card title section */}
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {title}
                    </h3>
                    {pinned && <Pin size={16} className="fill-current opacity-90" />}
                </div>

                {/* Display link section */}
                <div className="text-sm opacity-90 w-full overflow-hidden whitespace-nowrap truncate" title={link ?? ''}>
                    <span>{link}</span>
                </div>
            </a>
    );
}