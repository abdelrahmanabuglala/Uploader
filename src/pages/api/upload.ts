import { type NextApiRequest, type NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { file, fileName, size } = req.body as {
        file: string;
        fileName: string;
        size: number;
      };

      if (!file || !fileName || !size) {
        res.status(400).json({ message: "ERROR: No file uploaded" });
        return;
      }

      if (!db) {
        res.status(500).json({ message: "Database not connected" });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const buffer = Buffer.from(file, "base64");

      fs.writeFileSync(path.join(process.cwd(), "uploads", fileName), buffer);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await db.uFile.create({
        data: {
          name: fileName,
          size,
          url: `/uploads/${fileName}`,
        },
      });

      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "ERROR: File not uploaded" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
