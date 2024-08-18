import { useParams } from "next/navigation"
import { useRouter } from "next/router"
import { useState } from "react"
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Item } from "../item/item";
import { FolderIcon } from "lucide-react";

interface FolderListProps {
    parentFolderId?: string;
    level?: number;
    // data?: Doc<"documents">[];
}

export const Folder = ({
    parentFolderId,
    level = 0,
}: FolderListProps) => {

    const params = useParams()
    const router = useRouter()
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const onExpand = (folderId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [folderId]: !prevExpanded[folderId]
        }))
    }

    const {
        data: folders,
        isError,
        isLoading,
        refetch: refetchUserDocs,
    } = api.folder.getSubFolders.useQuery({ parentId: parentFolderId });





    const onRedirect = (folderId: string) => {
        router.push(`/f/${folderId}`)
    }

    return (
        <>
            <p
                style={{
                    paddingLeft: level ? `${level * 12 + 25}px` : undefined,
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden",
                )}
            >
                {/* No Page inside */}
            </p>
            {folders?.map((folder) => (
                <div key={folder.id}>
                    <Item
                        id={folder.id}
                        // onClick={() => onRedirect(document._id)}
                        label={folder.name}
                        icon={FolderIcon}
                        // documentIcon={document.icon}
                        // active={params.documentId === document._id}
                        level={level}
                        onExpand={() => onExpand(folder.id)}
                        expanded={expanded[folder.id]}
                    />
                    {expanded[folder.id] && (
                        <Folder parentFolderId={folder.id} level={level + 1} />
                    )}
                </div>
            ))}
        </>
    );
}