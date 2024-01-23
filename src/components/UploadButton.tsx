'use client';

import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useRouter } from 'next/navigation';
import trpc from '@/app/_trpc/client';
import { useUploadThing } from '@/lib/uploadthing';
import { Cloud, Divide, File, Loader2 } from 'lucide-react';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';

const UploadDropzone = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { startUpload } = useUploadThing('pdfUploader');

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess(file) {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulateProcess = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async acceptedFiles => {
        setIsUploading(true);
        const processInterval = startSimulateProcess();

        const res = await startUpload(acceptedFiles);
        console.log(res);

        if (!res) {
          setIsUploading(false);
          return toast({
            title: '未知错误',
            description: '请重试',
            variant: 'destructive',
          });
        }
        const { key } = res[0];

        if (!key) {
          return toast({
            title: '未知错误',
            description: '请重试',
            variant: 'destructive',
          });
        }
        startPolling({ key });
        clearInterval(processInterval);
        setUploadProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => {
        return (
          <div {...getRootProps()} className="m-4 h-64 rounded-lg border border-dashed border-gray-300">
            <div className="flex h-full w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="flex size-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 duration-100  hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <Cloud className="mb-2 size-6 text-zinc-500" />
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold">点击</span> 或 <span className="font-semibold">拖拽</span>上传文件
                  </p>
                  <p className="text-xs text-zinc-500">PDF （最大4MB）</p>
                </div>
                {acceptedFiles && acceptedFiles[0] ? (
                  <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                    <div className="grid h-full place-items-center px-3 py-2">
                      <File className="size-4 text-blue-500" />
                    </div>
                    <div className="h-full truncate px-3 py-2 text-sm">{acceptedFiles[0].name}</div>
                  </div>
                ) : null}

                {isUploading && (
                  <div className="mx-auto mt-4 w-full max-w-xs">
                    <Progress
                      indicatorColor={uploadProgress === 100 ? 'bg-green-500' : ''}
                      value={uploadProgress}
                      className="h-1 w-full bg-zinc-200"
                    />
                    {uploadProgress === 100 && (
                      <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                        <Loader2 className="size3 animate-spin" />
                        跳转中...
                      </div>
                    )}
                  </div>
                )}
                <input type="file" id="dropzone-file" className="hidden" {...getInputProps()} />
              </label>
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
};

export default function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={v => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>上传 PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
}
