/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/@/components/ui/table";

import { Alert, AlertDescription, AlertTitle } from "~/@/components/ui/alert";

import Head from "next/head";
import { Separator } from "~/@/components/ui/separator";
import { Terminal } from "lucide-react";
import { toast } from "sonner";
import { Dropzone } from "~/components/dropzone";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();
  const files = api.files.getAllFiles.useQuery();

  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const getSize = (size: number): string => {
    return `${(size / (1024 * 1024)).toFixed(2)}MB`;
  };

  const fileToBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve((reader.result as string).split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([file]));
    });

  const uploadFile = async (file: File) => {
    const base64 = await fileToBase64(file);

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: base64,
        fileName: file.name,
        size: file.size,
      }),
    });
    if (!response.ok) {
      throw new Error("File upload failed");
    }
  };

  useEffect(() => {
    const upload = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const promises: any[] = [];
      uploadingFiles.forEach((file) => {
        promises.push(uploadFile(file));
      });

      await Promise.all(promises);
      void queryClient.invalidateQueries(["files"]);

      setUploadingFiles([]);
    };
    if (uploadingFiles.length) {
      void upload();
    }
  }, [uploadingFiles]);

  return (
    <>
      <Head>
        <title>Upload me</title>
        <meta name="description" content="Upload any files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-300 to-slate-400">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Dropzone
            onAcceptedFiles={(files) => {
              setUploadingFiles((prev) => [...prev, ...files]);
            }}
          />

          {uploadingFiles.map((f) => (
            <React.Fragment key={f.size}>
              <Separator orientation="horizontal" />
              <Alert
                className="bg-slate-300"
                onClick={() => {
                  toast.info("Hello world");
                }}
              >
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You are uploading {f.name} ({getSize(f.size)})
                </AlertDescription>
              </Alert>
            </React.Fragment>
          ))}

          <Table>
            <TableCaption className="pb-4">
              A list of your recent uploads.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Size</TableHead>
                <TableHead className="w-40 text-right">Date</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.data?.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{getSize(file.size)}</TableCell>
                  <TableCell className="text-right">
                    {file.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{file.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>count</TableCell>
                <TableCell className="text-right">
                  {files.data?.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </main>
    </>
  );
}
