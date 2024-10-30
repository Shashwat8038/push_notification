import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    type: process.env.GOOGLE_TYPE,
    project_id:process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY!,
    client_email:process.env.GOOGLE_CLIENT_EMAIL,
    client_id:process.env.GOOGLE_CLIENT_ID,
    auth_uri:process.env.GOOGLE_AUTH_URI,
    token_uri:process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url:process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url:process.env.GOOGLE_CLIENT_CERT_URL,
    universe_domain:process.env.GOOGLE_UNIVERSAL_DOMAIN
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function POST(request: NextRequest) {
  const { token, title, message, link } = await request.json();

  const payload: Message = {
    token,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
