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
          console.log('window is defined, start importing Workspace component');
          return import("@/components/workspace").then((module) => {
              console.log('Successfully imported Workspace component');
              return module;
          }).catch((error) => {
              console.error('Error when importing Workspace component', error);
              throw error;
          });
      }
      console.log('window is not defined. Failed to import Workspace component');
      return () => null; // Return a null component if window is undefined
  }) as any,
  { ssr: false },
);

export default DynamicDocViewerPage;


