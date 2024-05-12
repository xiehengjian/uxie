import { useEffect, useState } from 'react'
import { open,message } from "@tauri-apps/api/dialog"
import { copyFile } from "@tauri-apps/api/fs"
import { basename } from 'path';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

const UploadFileLocalModal = () =>{

  const handleUpload = async () => {
    const file = await open()
     if (!file) {
       return;
     }
    

    const destPath = './' // 需要替换成app专属的目录
    if (file.length > 0 && typeof destPath === 'string') {
        try {
            const filename = basename(file); // 获取文件名，包括扩展名
            await copyFile(file, destPath + filename)
            toast.success("File uploaded successfully.");
          } catch (error) {
            toast.error("Error occurred while uploading", {
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