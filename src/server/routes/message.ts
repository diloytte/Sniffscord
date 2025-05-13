import { Request, Response } from "express";

export function handleIncomingMessage(req: Request, res: Response): void {
  const { username, messageContent, rawHtml } = req.body;

  if (!username || !messageContent || !rawHtml) {
    //@ts-ignore
    return res.status(400).json({ error: "Missing username, messageContent, or rawHtml" });
  }

  if(username.toLowerCase().includes("daumen")){
    console.log(messageContent);
  }

  res.status(200).json({ status: "ok" });
}