import { SpinnerPage } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

const UserLibraryPage = () => {
  const {
    data: userDocs,
    isError,
    isLoading,
    refetch: refetchUserDocs,
  } = api.user.getUsersDocs.useQuery();

  if (isError) return <div>Something went wrong</div>;
  if (isLoading) return <SpinnerPage />;
  if (!userDocs) return <div>Sorry no result found</div>;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-2 lg:px-16">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "my-2 w-fit justify-start p-2",
        )}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="flex items-start justify-between md:px-4">
        <div>
          <p className="mb-1 text-2xl font-semibold tracking-tighter">
            Hello, {userDocs?.name || "User"}
          </p>

          {userDocs?.documents.length +
            userDocs?.collaboratorateddocuments.length ===
          0 ? (
            <p className="text-muted-foreground">
              You have no files yet, upload one now!
            </p>
          ) : (
            <p className="text-muted-foreground">Here are your files</p>
          )}
        </div>

        <div>
          <UploadButton
            appearance={{
              button: buttonVariants({ variant: "default" }),
            }}
            endpoint="docUploader"
            onClientUploadComplete={async (res: any) => {
              refetchUserDocs();
              toast({
                title: "Success",
                description: "File uploaded successfully.",
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Error",
                description: "Something went wrong, please try again later.",
                variant: "destructive",
              });
              console.log(error.message);
            }}
          />
          <p className="text-xs max-w-[15rem] text-gray-500">&lt; 6 pages to use AI, flashcard. (For now)</p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 justify-items-center gap-2 xs:grid-cols-2 md:grid-cols-3 md:px-4 xl:grid-cols-4">
        {/* both combined should be sorted => some array generating logic should be used. */}
        {userDocs?.documents?.map((doc) => (
          <Doc key={doc.id} id={doc.id} title={doc.title} isCollab={false} />
        ))}

        {userDocs.collaboratorateddocuments.map((collab) => (
          <Doc
            key={collab.document.id}
            id={collab.document.id}
            title={collab.document.title}
            isCollab={true}
          />
        ))}
      </div>
    </div>
  );
};

const Doc = ({
  title,
  id,
  isCollab,
}: {
  title: string;
  id: string;
  isCollab: boolean;
}) => {
  return (
    <Link
      key={id}
      href={`/f/${id}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex w-full flex-col gap-2 border py-8",
      )}
    >
      <p className="mr-auto">
        {title?.slice(0, 30) + (title.length > 30 ? "..." : "") ?? "Untitled"}{" "}
      </p>

      {isCollab && (
        <Badge className="mr-auto" variant="outline">
          Collab
        </Badge>
      )}
      {/* maybe display first page of the pdf here */}
      {/* add menubar to delete, rename doc, download pdf */}
    </Link>
  );
};

export default UserLibraryPage;
