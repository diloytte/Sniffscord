import express from "express";
import bodyParser from "body-parser";
import { handleIncomingMessage } from "./routes/message";

const app = express();
const PORT = 7898;

app.use(bodyParser.json());
app.post("/message", handleIncomingMessage);

app.listen(PORT, () => {
  console.log(`[✅] Sniffscord Server running on http://localhost:${PORT}`);
});
