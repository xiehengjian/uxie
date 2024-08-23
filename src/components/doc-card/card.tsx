import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpinnerPage } from "@/components/ui/spinner";
import { CustomTooltip } from "@/components/ui/tooltip";
import UploadFileModal from "@/components/workspace/upload-file-modal";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, SearchIcon, Sparkle } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Navigation } from "@/components/navigation/navigation";
import FLayout from '@/components/layout/layout'
import type { ReactElement } from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd';
import React from 'react';
import { Title } from "../title/title";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { PageIcon, FolderIcon } from '@blocksuite/icons/rc';

type DocCardProps = {
    title: string;
    id: string;
    isCollab: boolean;
    isVectorised: boolean;
};


const DocCard: React.FC<DocCardProps> = ({
    title,
    id,
    isCollab,
    isVectorised,
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: "file",
        item: { id },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const router = useRouter()

    const { mutateAsync: updateDocName } = api.document.updateDocumentName.useMutation();
    const updateDocumentName = (id: string, name: string) => {
        const promise = updateDocName({
            id: id,
            name: name
        })
        toast.promise(promise, {
            loading: "Rename...",
            success: "Renamed",
            error: "Failed to rename",
        });
    }

    const onRedirectDocument = (id: string) => {
        router.push(`/f/0/${id}`)
    }

    return drag(
        <div style={{ opacity: isDragging ? 0.5 : 1 }}>
            <div
                key={id}
                onClick={() => onRedirectDocument(id)}
                // href={`/f/0/${id}`}
                // className={cn(
                //     buttonVariants({ variant: "ghost" }),
                //     "flex flex-col gap-2 border py-8 hover:border-blue-300",
                // )}
                className={cn(
                    "flex justify-between items-center py-2 hover:bg-gray-200",
                )}
            >
                <div className="w-full flex justify-between">
                    <PageIcon className="shrink-0 h-[25px] mr-2 text-muted-foreground" />
                    <p className="mr-auto min-w-0 truncate"> <Title id={id} value={title} update={updateDocumentName} /></p>

                    <CustomTooltip
                        content={
                            isVectorised
                                ? "Document is AI vectorised"
                                : "Document isn't AI vectorised"
                        }
                    >
                        <Sparkle
                            className={cn(
                                "h-4 w-4",
                                isVectorised ? "text-primary" : "text-gray-200",
                            )}
                        />
                    </CustomTooltip>
                </div>

                {isCollab && (
                    <Badge className="mr-auto" variant="outline">
                        Collab
                    </Badge>
                )}
                {/* maybe display first page of the pdf here */}
                {/* add menubar to delete, rename doc, download pdf */}
            </div>
        </div>
    );
};

export default DocCard;