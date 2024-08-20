import { useParams } from "next/navigation"
import { useRouter } from "next/router"
import { useState } from "react"
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Item } from "../item/item";
import { FileIcon, FolderIcon } from "lucide-react";
import { toast } from "sonner";

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

    const {
        data: documents
    } = api.folder.getfolderDocs.useQuery({ id: parentFolderId || "" });




    const onRedirect = (folderId: string) => {
        router.push(`/f/${folderId}`)
    }

    const onRedirectDocument = (folderId: string) => {
        router.push(`/f/0/${folderId}`)
    }

    const { mutateAsync: moveToFolder } = api.document.moveToFolder.useMutation();

    const moveDocumentToFolder = (documentId: string, folderId: string) => {
        const promise = moveToFolder({
            documentId,
            folderId
        })
        toast.promise(promise, {
            loading: "Moving...",
            success: "Moved",
            error: "Failed to move",
        });
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
                        onClick={() => onRedirect(folder.id)}
                        label={folder.name}
                        icon={FolderIcon}
                        // documentIcon={document.icon}
                        active={params?.folderId === folder.id}
                        level={level}
                        onExpand={() => onExpand(folder.id)}
                        expanded={expanded[folder.id]}
                        onDrop={moveDocumentToFolder}
                    />
                    {expanded[folder.id] && (
                        <Folder parentFolderId={folder.id} level={level + 1} />
                    )}
                </div>
            ))}
            {documents?.documents.map((document) => (
                <div key={document.id}>
                    <Item
                        // id={folder.id}
                        onClick={() => onRedirectDocument(document.id)}
                        label={document.title}
                        icon={FileIcon}
                        // documentIcon={document.icon}
                        active={params?.docId === document.id}
                        level={level}
                    // onExpand={() => onExpand(folder.id)}
                    // expanded={expanded[folder.id]}
                    // onDrop={moveDocumentToFolder}
                    />
                </div>
            ))}
        </>
    );
}