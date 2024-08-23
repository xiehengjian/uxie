import { ElementRef, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarIcon, ImportIcon } from '@blocksuite/icons/rc';
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, FilesIcon, FoldersIcon, PlusCircle } from "lucide-react";
import { Item } from "../item/item";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Folder } from "../folder/folder";
import { useRouter } from "next/router";
import { AllDocsIcon, NewPageIcon } from '@blocksuite/icons/rc';
import UploadFileModal from "../workspace/upload-file-modal";
import { SpinnerPage } from "../ui/spinner";


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

    const {
        data: userDocs,
        isError,
        isLoading,
        refetch: refetchUserDocs,
    } = api.user.getUsersDocs.useQuery();
    if (isLoading) return <SpinnerPage />;
    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-white overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}>
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6   transition px-3 py-2",
                        isMobile && "opacity-100",
                    )}
                >

                    {/*             
                        h-6:高6个单位
                        w-6:宽6个单位
                        text-muted-foreground：设置元素文本的前景色为灰色
                        rounded-sm: 设置元素的边框为一个小的圆角
                    */}
                    <SidebarIcon className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600" />
                </div>
                <div
                    onClick={collapse}
                    role="button"

                    className={cn(
                        "h-6 w-6  transition  absolute top-3 right-2",
                        isMobile && "opacity-100",
                    )}
                >
                    <ImportIcon className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600" />
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
                    // className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                    className="opacity-100 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
                {/* 
              fixed：使该元素固定在视口中，不随滚动而移动。
                    bottom-0：将该元素定位在底部。
                    w-full：使该元素宽度充满父容器。
                    left-0和right-0：使该元素水平方向上居中。
              */}
                <div className="fixed bottom-0 left-0 right-0 w-full">
                    <UploadFileModal
                        docsCount={userDocs?.documents.length as number}
                        refetchUserDocs={refetchUserDocs}

                    /></div>

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