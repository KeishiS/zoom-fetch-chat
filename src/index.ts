import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { createHmac } from "crypto";

const app = express();
const ZOOM_VERIFICATION_TOKEN = process.env.ZOOM_VERIFICATION_TOKEN!;
const ZOOM_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN!;
const PORT = 10808;

type Event =
  | "meeting.chat_message_sent"
  | "meeting.participant_joined"
  | "meeting.participant_left";

interface MessageDetail {
  date_time: string;
  sender_session_id: string;
  sender_name: string;
  sender_email: string;
  sender_type: string;
  recipient_session_id: string;
  recipient_name: string;
  recipient_email: string;
  recipient_type: string;
  message_id: string;
  message_content: string;
  file_ids: string[];
}
interface MessageSent {
  event: Event;
  payload: {
    account_id: string;
    object: {
      id: number;
      uuid: string;
      chat_message: MessageDetail;
    };
  };
}

interface MessageResponse {
  status: string;
}

app.use(bodyParser.json());
app.post("/", (req: Request, res: Response) => {
  console.log("[INFO] Start `post`");
  res.status(200).send("OK");
});
app.post("/zoom/webhook", (req: Request, res: Response) => {
  console.log("[INFO] Start `post` in /zoom/webhook");

  const zoomToken = req.headers["authorization"];
  if (!zoomToken || zoomToken != ZOOM_VERIFICATION_TOKEN) {
    console.error("\tInvalid Request");
    res.status(401).send("Unauthorized");
    return;
  }
  const eventType = req.body.event;
  const payload = req.body.payload;

  console.info(`\t[INFO] eventType: ${eventType}`);
  if (eventType === "endpoint.url_validation") {
    const hashForValidate = createHmac("sha256", ZOOM_SECRET_TOKEN)
      .update(payload.plainToken)
      .digest("hex");
    res.json({
      plainToken: payload.plainToken,
      encryptedToken: hashForValidate,
    });
  } else if (eventType === "meeting.chat_message_sent") {
  } else if (eventType === "meeting.participant_joined") {
  } else if (eventType === "meeting.participant_left") {
  }

  res.status(200);
});

app.listen(PORT, () => {
  console.log("[INFO] Start web serv");
});
