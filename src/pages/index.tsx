/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Info } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "~/@/components/ui/alert";
import { Button } from "~/@/components/ui/button";
import { Label } from "~/@/components/ui/label";
import { Separator } from "~/@/components/ui/separator";
import { Switch } from "~/@/components/ui/switch";
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
import { Dropzone } from "~/components/dropzone";
import { api } from "~/utils/api";

export default function Home() {
  const filesQuery = api.files.getAllFiles.useQuery();
  const resetAllMutation = api.files.resetAll.useMutation();

  const [isParallel, setIsParallel] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileNum, setFileNum] = useState<number>(0);
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
      // Simulate random wait time between 1 and 6 seconds
      const delay = Math.floor(Math.random() * 5000) + 1000;
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
        throw new Error("Failed to upload file");
      }

      toast.success(`Uploaded ${file.name} successfully!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to upload ${file.name} with error: ${error.message}}`,
        );
      }
      toast.error(`Failed to upload ${file.name}`);
    }

    void filesQuery.refetch();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [file.size + file.name]: _, ...rest } = uploadingFiles;
    setUploadingFiles(rest);
  };

  const acceptedFilesHandler = async (files: Record<string, File>) => {
    if (!Object.keys(files).length) return;

    setIsUploading(true);
    setFileNum(Object.keys(files).length);
    setUploadingFiles(files);
    toast.info(`Start processing ${Object.keys(files).length} files...`);

    if (isParallel) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const promises: any[] = [];
      Object.values(files).forEach((file) => {
        promises.push(uploadFile(file));
      });

      await Promise.all(promises).finally(() => {
        toast.info("Finish processing files!");

        void filesQuery.refetch();
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < Object.keys(files).length; i++) {
        const key = Object.keys(files)[i];
        if (!key) return;
        const file = files[key];
        if (!file) return;
        await uploadFile(file);
      }

      toast.info("Finish processing files!");

      void filesQuery.refetch();
    }

    setFileNum(0);
    setIsUploading(false);
  };

  const resetAllHandler = async () => {
    await resetAllMutation.mutateAsync();

    void filesQuery.refetch();
  };

  return (
    <>
      <Head>
        <title>Upload it</title>
        <meta name="description" content="Upload any files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-300 to-slate-400">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Dropzone onAcceptedFiles={acceptedFilesHandler} />

          {isUploading ? (
            <React.Fragment>
              <Separator orientation="horizontal" />
              <Alert className="bg-slate-300">
                <Info className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You are uploading {fileNum} files.
                </AlertDescription>
              </Alert>
            </React.Fragment>
          ) : null}

          <div className="flex w-full justify-between">
            <div className="space-x-2">
              <Label htmlFor="seq-mode">Sequential Mode</Label>
              <Switch
                id="seq-mode"
                checked={isParallel}
                onCheckedChange={setIsParallel}
              />
              <Label htmlFor="seq-mode">Parallel Mode</Label>
            </div>

            <Button
              variant={"destructive"}
              disabled={resetAllMutation.isLoading || !filesQuery.data?.length}
              className="disabled:opacity-50"
              onClick={resetAllHandler}
            >
              Reset All
            </Button>
          </div>

          <Table>
            <TableCaption className="pb-4">
              A list of your recent uploads.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Size</TableHead>
                <TableHead className="w-40 text-right">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-40">Preview</TableHead>
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
                  <TableCell className="font-medium">
                    <Image
                      src={file.url}
                      alt={`preview for ${file.name}`}
                      width={80}
                      height={80}
                    />
                  </TableCell>
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
