import { Request, Response } from "express";

interface MessageRequest {
  sender: string;
  message: string;
}

export function handleIncomingMessage(req: Request, res: Response): void {
  const { sender, message } = req.body as MessageRequest;

  if (!sender || !message) {
    res.status(400).json({ error: "Missing sender or message" });
    return;
  }

  console.log(`[📬] Received from ${sender}: ${message}`);
  res.status(200).json({ status: "ok" });
}
