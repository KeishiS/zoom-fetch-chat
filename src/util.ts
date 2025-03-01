import "dotenv/config";
import { Buffer } from "buffer";
import { URLSearchParams } from "url";

const ACCOUNT_ID = process.env.ACCOUNT_ID!;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const ZOOM_TOKEN_ENDPOINT = "https://zoom.us/oauth/token";

export async function get_access_token_with_code(code: string) {
  const authorization = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );
  const headers = {
    authorization: `Basic ${authorization}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append(
    "redirect_uri",
    "https://83f2-133-58-244-157.ngrok-free.app/callback",
  );

  const response = await fetch(ZOOM_TOKEN_ENDPOINT, {
    method: "POST",
    headers: headers,
    body: params.toString(),
  });
  const body = await response.json();
  if (!body.access_token) {
    console.error(`\tFailed to retrieve access_token: `, body);
  } else {
    console.log(`\tSuccess to retrieve access_token: ${body.access_token}`);
  }
}

export async function get_access_token() {
  const authorization = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );
  const headers = {
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch(
    `${ZOOM_TOKEN_ENDPOINT}?grant_type=account_credentials&account_id=${ACCOUNT_ID}`,
    {
      method: "POST",
      headers: headers,
    },
  );

  if (response.ok) {
    const body = await response.json();
    console.log("[SUCCESS] %o", body);
  } else {
    console.log(`[FAIL] ${response.status}`);
  }
}
