/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Info } from "lucide-react";
import Head from "next/head";
import { Alert, AlertDescription, AlertTitle } from "~/@/components/ui/alert";
import { Separator } from "~/@/components/ui/separator";
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
import { toast } from "sonner";
import React, { useState } from "react";
import { Dropzone } from "~/components/dropzone";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const filesQuery = api.files.getAllFiles.useQuery();
  const queryClient = useQueryClient();

  const [uploadingFiles, setUploadingFiles] = useState<Record<string, File>>(
    {},
  );

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
    try {
      // Simulate random wait time between 1 and 10 seconds
      const delay = Math.random() * (10000 - 1000) + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

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

      toast.success(`Uploaded ${file.name} successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${file.name}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [file.size]: _, ...rest } = uploadingFiles;
    setUploadingFiles(rest);

    void filesQuery.refetch();
    void queryClient.invalidateQueries(["files.getAllFiles"]);
  };

  const acceptedFilesHandler = async (files: Record<string, File>) => {
    if (!Object.keys(files).length) return;

    setUploadingFiles(files);
    toast.info(`Start processing ${Object.keys(files).length} files...`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises: any[] = [];
    Object.values(files).forEach((file) => {
      promises.push(uploadFile(file));
    });

    await Promise.all(promises).finally(() => {
      void filesQuery.refetch();
      void queryClient.invalidateQueries(["files.getAllFiles"]);

      setUploadingFiles({});
      toast.info("Finish processing files!");
    });
  };

  return (
    <>
      <Head>
        <title>Upload me</title>
        <meta name="description" content="Upload any files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-300 to-slate-400">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Dropzone onAcceptedFiles={acceptedFilesHandler} />

          {Object.keys(uploadingFiles).length > 0 ? (
            <React.Fragment>
              <Separator orientation="horizontal" />
              <Alert className="bg-slate-300">
                <Info className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You are uploading {Object.keys(uploadingFiles).length} files.
                </AlertDescription>
              </Alert>
            </React.Fragment>
          ) : null}

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
              {filesQuery.data?.map((file) => (
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
                  {filesQuery.data?.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </main>
    </>
  );
}
