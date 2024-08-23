import { ElementRef, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarIcon } from '@blocksuite/icons/rc';
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, FilesIcon, FoldersIcon, PlusCircle } from "lucide-react";
import { Item } from "../item/item";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Folder } from "../folder/folder";
import { useRouter } from "next/router";
import { AllDocsIcon, NewPageIcon } from '@blocksuite/icons/rc';


export const Navigation = () => {
    const pathname = usePathname()
    const isMobile = useMediaQuery("(max-width: 768px)")

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<"aside">>(null)
    const navbarRef = useRef<ElementRef<"div">>(null)
    const [isResetting, setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)


    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : "calc(100%-240px)",
            );
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            setTimeout(() => setIsResetting(false), 300);
        }
    };
    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = e.clientX;
        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`);
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const { mutateAsync: mutateAddFolder } =
        api.folder.addFolder.useMutation();

    const handleNewFolder = () => {
        const promise = mutateAddFolder({
            name: "Untitled"
        })
        toast.promise(promise, {
            loading: "Creating a new folder...",
            success: "New folder created",
            error: "Failed to create a new folder",
        });
    }
    const router = useRouter()
    const Redirect2F = () => {
        router.push(`/f`)
    }

    const Redirect2NoFolder = () => {
        router.push(`/f/no-folder`)
    }

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}>
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6   transition px-3 py-2 w-full",
                        isMobile && "opacity-100",
                    )}
                >

                    <SidebarIcon className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600" />
                </div>
                <div className="mt-4">

                    <Item
                        onClick={Redirect2F}
                        label="全部文档"
                        icon={AllDocsIcon}
                    />
                    <Item
                        onClick={Redirect2NoFolder}
                        label="未归档文档"
                        icon={AllDocsIcon}
                    />


                    <Item
                        onClick={handleNewFolder}
                        label="新建文件夹"
                        icon={NewPageIcon}
                    />

                </div>

                <div className="mt-4">
                    <Folder />
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full",
                )}
            >

                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && (
                        <SidebarIcon
                            onClick={resetWidth}
                            role="button"
                            className="h-6 w-6 hover:bg-neutral-300 text-muted-foreground rounded-sm"
                        />
                    )}
                </nav>

            </div>
        </>
    )
}