"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

import {
    ChevronDown,
    ChevronRight,
    LucideIcon,
    MoreHorizontal,
    Plus,
    Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Title } from "../title/title";

interface ItemProps {
    id?: string;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;// 元素展示的字符串
    onClick?: () => void;// 元素被点击时调用
    icon: LucideIcon; // 元素的图标
}

export const Item = ({
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    isSearch,
    level = 0,
    onExpand,
    expanded,
}: ItemProps) => {
    // const { user } = useUser();

    // const create = useMutation(api.documents.create);
    const { mutateAsync: mutateAddFolder } = api.folder.addFolder.useMutation();
    const { mutateAsync: mutateDeleteFolder } = api.folder.deleteFolder.useMutation();


    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;
        const promise = mutateDeleteFolder({ folderId: id });
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash",
            error: "Failed to archive note",
        });
    };

    const router = useRouter();
    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
        onExpand?.();
    };

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;
        const promise = mutateAddFolder
            ({
                name: "Untitled",
                parentId: id,
            }).then((folderId) => {
                if (!expanded) {
                    onExpand?.();
                }
                // router.push(`documents/${documentId}`)
            });

    };

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        // 一个大的div容器，内部包裹中一些元素
        <div
            onClick={onClick}// 元素被点击时的函数，由调用者传入
            role="button" // 
            style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            )}

            {id ? (
                <Title id={id} value={label} />
            ) : (<span className="truncate">{label}</span>)}



            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            )}

            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* <div className="text-xs text-muted-foreground p-2">
                                Last edited by:{user?.fullName}
                            </div> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{
                paddingLeft: level ? `${level * 12 + 25}px` : "12px",
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};
