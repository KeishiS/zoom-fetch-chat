import { get_access_token_with_code } from "./util";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { createHmac } from "crypto";
import {
  ZoomBody,
  ParticipantJoinedPayload,
  ParticipantLeftPayload,
  MessageSentPayload,
  UrlValidationPayload,
} from "./types/zoom";

// get_access_token();
const app = express();
const WEBHOOK_VERIFICATION_TOKEN = process.env.WEBHOOK_VERIFICATION_TOKEN!;
const WEBHOOK_SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN!;
const PORT = 10808;

app.use(bodyParser.json());

app.get("/callback", (req: Request, res: Response) => {
  console.log("[INFO] start `get` in /callback");
  const code = req.query.code as string | undefined;
  res.status(200).send("OK");
  if (!code) {
    return;
  }
  console.log(`\tcode: ${code}`);
  get_access_token_with_code(code);
});

app.post("/webhook", (req: Request<{}, {}, ZoomBody>, res: Response) => {
  console.log("[INFO] Start `post` in /webhook");

  const zoomToken = req.headers["authorization"];
  if (!zoomToken || zoomToken != WEBHOOK_VERIFICATION_TOKEN) {
    console.error("\tInvalid Request");
    res.status(401).send("unauthorized");
    return;
  }
  const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(req.body)}`;
  const hashForVerify = createHmac("sha256", WEBHOOK_SECRET_TOKEN)
    .update(message)
    .digest("hex");
  const signature = `v0=${hashForVerify}`;
  if (req.headers["x-zm-signature"] != signature) {
    console.error(
      `\tFailed Verification: x-zm-signature: ${req.headers["x-zm-signature"]}, signature: ${signature}`,
    );
    res.status(401).send("unauthorized");
    return;
  }

  console.info(`\teventType: ${req.body.event}`);
  switch (req.body.event) {
    case "meeting.chat_message_sent": {
      const payload: MessageSentPayload = req.body.payload;
      const sender = payload.object.chat_message.sender_name;
      const content = payload.object.chat_message.message_content;
      console.info(`\t${sender}: ${content}`);
      res.json({
        message: "OK",
        status: 200,
      });
      break;
    }
    case "meeting.participant_joined": {
      const payload: ParticipantJoinedPayload = req.body.payload;
      const user_id = payload.object.participant.user_id;
      const join_time = payload.object.participant.join_time;
      console.info(`\t${join_time}: ${user_id}`);
      res.json({
        message: "OK",
        status: 200,
      });
      break;
    }
    case "meeting.participant_left": {
      const payload: ParticipantLeftPayload = req.body.payload;
      const user_id = payload.object.participant.user_id;
      const leave_time = payload.object.participant.leave_time;
      console.info(`\t${leave_time}: ${user_id}`);
      res.json({
        message: "OK",
        status: 200,
      });
      break;
    }
    case "endpoint.url_validation": {
      const payload: UrlValidationPayload = req.body.payload;
      const hashForValidate = createHmac("sha256", WEBHOOK_SECRET_TOKEN)
        .update(payload.plainToken)
        .digest("hex");
      res.json({
        plainToken: payload.plainToken,
        encryptedToken: hashForValidate,
      });
      break;
    }
    default: {
      console.error("\tUnexpected Event happend");
      res.json({
        message: "OK",
        status: 200,
      });
    }
  }

  res.status(200);
});

app.listen(PORT, () => {
  console.log("[INFO] Start web serv");
});
