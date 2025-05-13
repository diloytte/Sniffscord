import express from "express";
import bodyParser from "body-parser";
import { handleIncomingMessage } from "./routes/message";
import cors from "cors"

const app = express();
const PORT = 7898;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.post("/message", handleIncomingMessage);

app.listen(PORT, () => {
  console.log(`[✅] Sniffscord Server running on http://localhost:${PORT}`);
});
