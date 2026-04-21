import LinkCard from "./LinkCard"
import FolderCard from "./FolderCard"

export default function MainContent({ roomData, colorMap, searchQuery = '', filters = { folders: true, links: true, pinnedOnly: false }, sortOption = 'pinned', viewMode = true, onFolderClick, onEdit, onDelete }) {
    const entries = Object.entries(roomData?.links || {});

    const q = (searchQuery || '').trim().toLowerCase();

    const matchesSearch = (item) => {//matches by title or link url, case insensitive
        if (!q) return true;
        const title = (item.title || '').toLowerCase();
        const link = (item.link || '').toLowerCase();
        return title.includes(q) || link.includes(q);
    }

    const applyFilters = (item) => {//filters by type and pinned status
        if (filters?.pinnedOnly && !item.isPinned) return false;
        if (item.type === 'folder' && filters && !filters.folders) return false;
        if (item.type !== 'folder' && filters && !filters.links) return false;
        return true;
    }

    const folderEntries = entries
        .filter(([, link]) => link.type === 'folder' && applyFilters(link) && matchesSearch(link));

    const linkEntries = entries
        .filter(([, link]) => link.type !== 'folder' && applyFilters(link) && matchesSearch(link));

    const sortEntries = (arr) => {//sorts by pinned status first, then by title or creation date depending on sortOption
        return arr.slice().sort(([, a], [, b]) => {
            const ta = (a.title || '').toLowerCase();
            const tb = (b.title || '').toLowerCase();

            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

            switch (sortOption) {
                case 'az':
                    return ta.localeCompare(tb);
                case 'za':
                    return tb.localeCompare(ta);
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'pinned':
                default:
                    //shows pinned items first, then sorts by newest
                    const pinnedDiff = (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
                    if (pinnedDiff !== 0) return pinnedDiff;
                    return dateB - dateA;
            }
        });
    }

    const sortedFolders = sortEntries(folderEntries);
    const sortedLinks = sortEntries(linkEntries);

    return (
        //new card props (roomData) passed in this order:
        //CreateLinkPopup --> Header --> Room --> MainContent
        <div className="flex-1 min-h-0 h-full p-4 overflow-auto flex flex-col gap-3">
            {filters?.folders && sortedFolders.map(([id, link]) => (
                <FolderCard
                    key={id}
                    id={link.id}
                    type={link.type}
                    title={link.title}
                    roomid={link.id}
                    color={link.color}
                    icon={link.icon}
                    pinned={link.isPinned}
                    parentfolder={link.parentfolder}
                    createdAt={link.createdAt}
                    links={link.links}
                    colorMap={colorMap}
                    onClick={() => onFolderClick?.(link)}
                    onEdit={onEdit ? (item) => onEdit({ ...item, type: 'folder' }) : undefined}
                    onDelete={onDelete ? (fid) => onDelete(fid, 'folder') : undefined}
                />
            ))}

            <div className={`${viewMode ? `grid gap-3 grid-cols-[repeat(auto-fill,minmax(224px,1fr))]` : `flex flex-col gap-3`} mt-4`}>
                {filters?.links && sortedLinks.map(([id, link]) => (
                    <LinkCard
                        key={id}
                        id={link.id}
                        type={link.type}
                        title={link.title}
                        link={link.link}
                        roomid={link.id}
                        color={link.color}
                        icon={link.icon}
                        pinned={link.isPinned}
                        folderid={link.folderid}
                        createdAt={link.createdAt}
                        colorMap={colorMap}
                        viewMode={viewMode}
                        onEdit={onEdit ? (item) => onEdit({ ...item, type: link.type }) : undefined}
                        onDelete={onDelete ? (lid) => onDelete(lid, link.type) : undefined}
                    />
                ))}
            </div>
        </div>
    )
}