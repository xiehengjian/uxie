import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import "@/styles/globals.css";
import "@blocknote/react/style.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { SEO } from "../../next-seo.config";
import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const router = useRouter();
  const isReader = router.pathname.startsWith("/");
  const getLayout = Component.getLayout ?? ((page) => page)
  return (<DndProvider backend={HTML5Backend}>
    {getLayout(
      <SessionProvider session={session}>
        <DefaultSeo {...SEO} />
        {isReader ? (
          <Component {...pageProps} />
        ) : (
          <main>
            <Navbar />
            <div className="h-full mx-auto flex flex-col">
              <Component {...pageProps} />
            </div>
          </main>
        )}
        <Toaster />
      </SessionProvider>
    )}
  </DndProvider>);
};

export default api.withTRPC(MyApp);
