import dynamic from "next/dynamic";
import { useState } from 'react';


const DynamicDocViewerPage = () => {
  const [loading, setLoading] = useState("Start to load");
  return (
    <div>
      <p>{loading}</p>
      <WorkspaceComponent />
    </div>
  )
}


const WorkspaceComponent = dynamic(
  (() => {
    if (typeof window !== "undefined") {
      return import("@/components/workspace");
    }
  }) as any,
  { ssr: false },
);

export default DynamicDocViewerPage;


