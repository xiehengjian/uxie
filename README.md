## Deployed at [https://uxie.vercel.app](https://uxie.vercel.app)

### Built using

- **Nextjs** App dir For the frontend and serverless api routes
- **tRPC** For typesafe api routes
- **zod** For validation
- **Typescript** For type safety
- **Tailwind CSS** For styling
- **React Query** for data fetching
- **React Hook Form** for form handling
- **Shadcn UI + Radix UI** For UI components
- **Supabase** As the database
- **Prisma** As the ORM
- **Blocknote** for note taking
- **Uploadthing** for storing pdfs
- **Next Auth** for authentication
- **React-pdf-highlighter** for pdf rendering,highlighting
- **Vercel AI SDK, Langchain** for AI responses and streaming
- **Pinecone DB** for storing embeddings of pdfs
- **Fireworks AI** for LLM
- **Huggingface Model** for generating Embeddings
- **Liveblocks** for realtime collaboration

### Features:

- Note taking, later download the note as markdown
- Summarise, ask questions about the PDFs
- Chat and collab with other
- custom blocks in editor
- highlights block which on click takes you to that highlight on the doc.

## REGRETS

- [ ] 10s limit on serverless function SUCKS! Should've chosen drizzle over prisma (for edge functions) UGHGHH

## BUGS

- [ ] see if u can see all the users in the liveblocks room, (and display it at top)
- [ ] get light coloured background for `liveblocks presence` => https://stackoverflow.com/questions/23601792/get-only-light-colors-randomly-using-javascript
- [ ] reduce pdfreader scrollbar height + width
- [ ] remove the weird dragging thing on area-highlight => prob better to rebuilt the library.

### Low priority

- [ ] replace prisma w. drizzle and use edge runtime for chat
- [ ] setup permissions inside liveblocks dashboard
- [ ] fix `.tippy-arrow` appearing on screen at all times => added a temp fix. still appears when hovered over the pdf reader
- [ ] areahighlight from pdf => imagelink stored on editor is base64 one => possible soln: store it as base64 to the notes, then in the same addhighlighttonotes function upload it to uploadthing, and then update the url of the block in the notes. => would prob need to create a custom block for this, else there'd be a noticable lag. => open issue https://github.com/TypeCellOS/BlockNote/issues/410
- [ ] abstract userIsOwner and userHasAccess (either collab or owner) to a separate trpc procedure. => api called `experimental_standaloneMiddleware`: but

  1. it requries the types for the entire input, the only way seems to be putting any for the rest => losing typesafety for the whole route
  2. most times data is returned from this, so query will also run twice

  solution seems to be => create separate helper functions

- [ ] move all error messages to a helper fn
- [ ] remove hardcoded heights using vh

## Known bug

- new file w. blank editor => u cant add highlight => open issue https://github.com/TypeCellOS/BlockNote/issues/366
- note with images cant be downloaded as markdown => open issue in blocknote

## FEATURE SUGGESTIONS

- [ ] see if the liveblocks stuff can be replaced w. sockets
- [ ] maybe switch uploadthing with `cloudinary` => also provides the getFirstPage of pdf thing. (see whether i should save this or call this every time => on how much resource it takes)
- [ ] store highlights as plain jsonb. it was super dumb to store it as separate tables. => READ ON THIS. Deleting by id could be expensive if its stored as jsonb/json. (jsonb is better than json), but still could be worse than having it as separate tables.
- [ ] have a "summarise" text option right next to highlight text on selecting the text.

## Setting up guide

### Pinecone

- Create index => Dimensions = 768, Metric = Cosine
