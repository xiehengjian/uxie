import React, { useEffect, useState } from 'react'
import { open,message } from "@tauri-apps/api/dialog"
import { copyFile, createDir } from "@tauri-apps/api/fs"
import path, { basename } from 'path';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { api } from '@/lib/api';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { appDataDir } from '@tauri-apps/api/path';


const UploadFileLocalModal = () =>{

    const { isLoading: isUrlUploading, mutateAsync: mutateAddDocumentByLink } =
    api.document.addDocumentByLink.useMutation();

    const getAppDataDir = React.useCallback(async () => {
        const {appDataDir} = await import("@tauri-apps/api/path")
       return  appDataDir()
    },[]);

  const handleUpload = async () => {
    const file = await open()
     if (!file) {
       return;
     }
    
      const destPath =await  getAppDataDir();
  
    try {
      await createDir(destPath, { recursive: true });
    } catch (error) {
      toast.error("Error occurred while creating directory"+error)
    }
   
    // toast.message(appDataDirPath)
    if (file.length > 0 &&typeof file === "string"&& typeof destPath === 'string') {
        try {
            const filename = basename(file); // 获取文件名，包括扩展名
            await copyFile(file, destPath + filename)

            const assetUrl = convertFileSrc(destPath + filename);

            await mutateAddDocumentByLink({
                title: filename ?? "Untitled",
                url: assetUrl,
              });

            toast.success("File uploaded successfully.");
          } catch (error) {
            toast.error("Error occurred while uploading"+error, {
                duration: 3000,
              });
          }

         

      } else {
        console.error("No file selected or destination path is undefined");
      }
   }

  return (
    <div className={cn(buttonVariants())}>
      <button onClick={handleUpload}>Upload local file</button>
    </div>
  )
}

export default UploadFileLocalModal;