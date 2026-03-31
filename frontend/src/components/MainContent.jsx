import LinkCard from "./LinkCard"
import FolderCard from "./FolderCard"

export default function MainContent({ roomData }) {
    console.log("Main content was rendered properly", {roomData});

    return (
        //new card props (roomData) passed in this order:
        //CreateLinkPopup --> Header --> Room --> MainContent
        <div className="flex-1 min-h-0 h-full p-4 overflow-auto">
            <div className="flex flex-wrap items-start gap-10 justify-start">
                {Object.entries(roomData?.links || {}).map(([id,link]) => {
                    if (link.type === "folder") {
                        
                        return (
                            <FolderCard
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
                    else{


                    return (
                        <LinkCard
                            id={link.id}
                            type={link.type}
                            title={link.title}
                            link={link.links}
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



