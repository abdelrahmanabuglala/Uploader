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
// import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const files = [
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "play.png",
      size: "1.5MB",
      date: new Date().toLocaleDateString(),
    },
  ];

  return (
    <>
      <Head>
        <title>Upload me</title>
        <meta name="description" content="Upload any files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-300 to-slate-400">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 ">
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
              {files.map((file) => (
                <TableRow key={file.name}>
                  <TableCell>{file.size}</TableCell>
                  <TableCell className="text-right">{file.date}</TableCell>
                  <TableCell className="font-medium">{file.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>count</TableCell>
                <TableCell className="text-right">{files.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

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
              You are uploading now a new file
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </>
  );
}
