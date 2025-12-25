// app/api/drive/files/route.ts
import { google } from "googleapis";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.toLowerCase();
  const pageToken = searchParams.get("pageToken") || undefined;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken as string });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // 2025 Best Practice: Construct query based on parameters
  const mimeType = type ? MIME_MAP[type] : null;
  let q = `'${process.env.FOLDER_ID}' in parents and trashed = false`;
  
  if (mimeType) {
    q += ` and mimeType = '${mimeType}'`;
  } else {
    // Default image filter
    q += ` and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'image/gif')`;
  }

  try {
    const response = await drive.files.list({
      q,
      pageSize: 12,
      pageToken,
      fields: "nextPageToken, files(id, name, mimeType, thumbnailLink)",
      orderBy: "name",
    });

    return NextResponse.json({
      items: response.data.files || [],
      nextPageToken: response.data.nextPageToken || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
