import { documentRouter } from "@/server/api/routers/document";
import { flashcardRouter } from "@/server/api/routers/flashcard";
import { highlightRouter } from "@/server/api/routers/highlight";
import { messageRouter } from "@/server/api/routers/message";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { folderRouter } from "@/server/api/routers/folder";

export const appRouter = createTRPCRouter({
  document: documentRouter,
  folder: folderRouter,
  user: userRouter,
  highlight: highlightRouter,
  message: messageRouter,
  flashcard: flashcardRouter,
});

export type AppRouter = typeof appRouter;
