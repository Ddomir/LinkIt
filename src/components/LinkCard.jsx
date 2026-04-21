import { useState } from 'react';
import { Pin } from 'lucide-react';

function normalizeUrl(link) {
    if (!link) return "";
    return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

function getFaviconUrl(link) {
    try {
        const { hostname } = new URL(normalizeUrl(link));
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
        return null;
    }
}

export default function LinkCard({ id, type, title, link, roomid, color, icon, pinned, folderid, createdAt, colorMap, viewMode }) {
    const bgStyle = colorMap?.[color] ?? {backgroundColor: 'white'};
    const [faviconError, setFaviconError] = useState(false);
    const normalizedLink = normalizeUrl(link);
    const faviconUrl = getFaviconUrl(link);

    return (
            <a
                className={`${viewMode ? `flex-col h-30 p-3` : `gap-3 w-full px-4 py-3`} rounded-xl shadow-sm flex justify-between cursor-pointer transition-transform hover:scale-[1.02] min-w-0 overflow-hidden`}
                style={bgStyle}
                title={title}
                href={normalizedLink}
                target="_blank"
            >
                {/* Icon and card title section */}
                <div className="flex items-center justify-between gap-2 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        {faviconUrl && !faviconError && (
                            <img
                                src={faviconUrl}
                                width={16}
                                height={16}
                                className="shrink-0 rounded-sm"
                                onError={() => setFaviconError(true)}
                                alt=""
                            />
                        )}
                        <h3 className="text-lg font-bold shrink-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                            {title}
                        </h3>

                        {/* Display link section (list view) */}
                        {!viewMode && (
                            <>
                                <span className="text-sm opacity-90 shrink-0">|</span>
                                <p className="text-sm opacity-90 truncate flex-1 min-w-0" title={link ?? ''}>{link}</p>
                            </>
                        )}
                    </div>
                    {pinned && <Pin size={16} className="fill-current opacity-90 shrink-0" />}
                </div>

                {/* Display link section (tile view) */}
                {viewMode && (
                    <div className="text-sm opacity-90 w-full overflow-hidden whitespace-nowrap truncate" title={link ?? ''}>
                        <span>{link}</span>
                    </div>
                )}
            </a>
    );
}