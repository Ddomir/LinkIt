import LinkCard from "./LinkCard"
import FolderCard from "./FolderCard"

export default function MainContent({ roomData, colorMap }) {
    return (
        //new card props (roomData) passed in this order:
        //CreateLinkPopup --> Header --> Room --> MainContent
        <div className="flex-1 min-h-0 h-full p-4 overflow-auto flex flex-col gap-3">
            {Object.entries(roomData?.links || {})
                .filter(([, link]) => link.type === "folder")
                .sort(([, a], [, b]) => b.isPinned - a.isPinned)
                .map(([id, link]) => (
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
                    />
                ))
            }

            <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(224px, 1fr))', gap: '0.75rem' }}>
                {Object.entries(roomData?.links || {})
                    .filter(([, link]) => link.type !== "folder")
                    .sort(([, a], [, b]) => b.isPinned - a.isPinned)
                    .map(([id, link]) => (
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
                        />
                    ))
                }
            </div>
        </div>
    )
}



