import LinkCard from "./LinkCard"
import FolderCard from "./FolderCard"

export default function MainContent({ roomData }) {
    return (
        //new card props (roomData) passed in this order:
        //CreateLinkPopup --> Header --> Room --> MainContent
        <div className="flex-1 min-h-0 h-full p-4 overflow-auto">
            <div className="sm:flex sm:flex-row sm:flex-wrap grid items-start grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(roomData?.links || {}).map(([id,link]) => {
                    if (link.type === "folder") {
                        return (
                            <FolderCard
                                key={link.id}
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
                                />
                            )
                        }
                        else {
                            return (
                                <LinkCard
                                key={link.id}
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
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}



