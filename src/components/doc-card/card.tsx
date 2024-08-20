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

    return drag(
        <div style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Link
                key={id}
                href={`/f/0/${id}`}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex flex-col gap-2 border py-8 hover:border-blue-300",
                )}
            >
                <div className="w-full flex justify-between">
                    <p className="mr-auto min-w-0 truncate">{title}</p>
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
            </Link>
        </div>
    );
};

export default DocCard;