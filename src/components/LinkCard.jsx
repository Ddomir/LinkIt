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
                className={`${viewMode ? `flex-col h-30` : `gap-3 ml-3`} rounded-xl p-3 shadow-sm flex justify-between cursor-pointer transition-transform hover:scale-[1.02]`}
                style={bgStyle}
                title={title}
                href={normalizedLink}
                target="_blank"
            >
                {/* Icon and card title section */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
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
                        <h3 className="text-lg font-bold" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                            {title}
                        </h3>

                        {/* Display link section (list view) */}
                        {!viewMode && (
                            <>
                                <span className="text-sm opacity-90">|</span>
                                <div className="text-sm opacity-90 overflow-hidden whitespace-nowrap truncate" title={link ?? ''}>
                                    <span>{link}</span>
                                </div>
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