"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMap } from "usehooks-ts";

interface TitleProps {
    id?: string;
    value: string;
}

export const Title = ({ id, value: initialValue }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // const update = useMutation(api.documents.update);
    const { mutateAsync: update } = api.folder.updateFolder.useMutation();

    const [value, setValue] = useState(initialValue);
    const [title, setTitle] = useState(value);



    const [isEditing, setIsEditing] = useState(false)

    const enableInput = () => {
        setTitle(value);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0)
    }

    const disableInput = () => {
        setIsEditing(false);
    }

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value);
        if (!id) return;
        const promise = update({
            id: id,
            name: event.target.value || "Untitled"
        })
        toast.promise(promise, {
            loading: "Rename...",
            success: "Renamed",
            error: "Failed to rename",
        });
        setValue(event.target.value);
    }

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            console.log(value)
            disableInput();
        }
    }

    return (
        <div className="flex items-center gap-x-1">
            {/* {!!initialData.icon && <p>initialData.icon</p>} */}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent" />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-nomar h-auto p-1"
                >
                    <span className="truncate">
                        {value}
                    </span>

                </Button>
            )}
        </div>);
};


Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-16 rounded-md" />
    )
}