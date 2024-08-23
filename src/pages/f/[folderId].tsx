import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpinnerPage } from "@/components/ui/spinner";
import { CustomTooltip } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, SearchIcon, Sparkle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Navigation } from "@/components/navigation/navigation";
import FLayout from '@/components/layout/layout'
import type { ReactElement } from 'react'
import { useParams } from "next/navigation";
import DocCard from "@/components/doc-card/card";

const FolderLibraryPage = () => {
    const params = useParams();
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: userDocs,
        isError,
        isLoading,
        refetch: refetchUserDocs,
    } = api.folder.getfolderDocs.useQuery({ id: params?.folderId as string });


    if (isError) return <div>Something went wrong</div>;
    if (isLoading) return <SpinnerPage />;
    if (!userDocs) return <div>Sorry no result found</div>;

    const combinedUserDocs = [
        ...userDocs,
        // ...userDocs?.collaboratorateddocuments?.map((collab) => collab.document),
    ]?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    const filteredUserDocs = combinedUserDocs?.filter((doc) =>
        doc.title.trim().toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

    return (
        <div className="flex w-full max-w-5xl flex-col px-4 py-2 lg:px-16">

            {/* <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "my-2 w-fit justify-start p-2",
                )}
            >
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Back
            </Link> */}
            <div className="flex items-start justify-between md:px-4">
                <div>
                    {/* <p className="mb-1 text-2xl font-semibold tracking-tighter">
                        Hello, { "User"}
                    </p> */}

                    {/* {combinedUserDocs.length === 0 ? (
                        <p className="text-muted-foreground">
                            You have no files yet, upload one now!
                        </p>
                    ) : (
                        <p className="text-muted-foreground">Here are your files</p>
                    )} */}
                </div>

                {/* <UploadFileModal
                    docsCount={userDocs.length}
                    refetchUserDocs={refetchUserDocs}
                /> */}
            </div>

            {combinedUserDocs.length > 0 && (
                <div className="mt-2 flex flex-col justify-center md:px-4">
                    <div className="relative my-4">
                        <SearchIcon className="absolute left-3 top-[50%] h-4 w-4 -translate-y-[50%] text-muted-foreground" />
                        <Input
                            className="pl-9 border-gray-200"
                            type="search"
                            placeholder="Search for a document"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 "> */}
                    <div className="flex flex-col gap-2">
                        {filteredUserDocs?.map((doc) => (
                            <DocCard
                                isVectorised={doc.isVectorised}
                                key={doc.id}
                                id={doc.id}
                                title={doc.title}
                                // isCollab={userDocs.collaboratorateddocuments.some(
                                //     (collab) => collab.document.id === doc.id,
                                // )
                                isCollab={false}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};




export default FolderLibraryPage;

FolderLibraryPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <FLayout>
            {page}
        </FLayout>
    )
}