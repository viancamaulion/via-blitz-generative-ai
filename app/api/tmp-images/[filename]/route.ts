import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join("/tmp", filename);
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename=\"${filename}\"`,
    },
  });
}
