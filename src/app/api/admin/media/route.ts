import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const BUCKET = "library";

export async function GET() {
  try {
    const { data: files, error } = await supabaseAdmin.storage.from(BUCKET).list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) throw error;

    // Generate public URLs for each file
    const filesWithUrls = files.map((file) => {
      const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(file.name);
      return {
        ...file,
        url: publicUrl,
      };
    });

    return NextResponse.json(filesWithUrls);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    return NextResponse.json({ message: "File uploaded successfully", path: data.path });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([fileName]);

    if (error) throw error;

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
