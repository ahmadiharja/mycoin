import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "public/contract-address.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(data);
      res.status(200).json({ contractAddress: json.contractAddress });
    } catch (e) {
      res.status(500).json({ error: "Failed to read contract address" });
    }
  } else if (req.method === "POST") {
    const { contractAddress } = req.body;
    if (!contractAddress || typeof contractAddress !== "string") {
      return res.status(400).json({ error: "Invalid contract address" });
    }
    try {
      fs.writeFileSync(filePath, JSON.stringify({ contractAddress }, null, 2));
      res.status(200).json({ contractAddress });
    } catch (e) {
      res.status(500).json({ error: "Failed to update contract address" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
