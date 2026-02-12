import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/projects/[id]/documents/[docId] - Get a single document
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { docId } = await params;
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Fetch document
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", docId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { data: null, error: { message: "Document not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: document, error: null });
}

// PATCH /api/projects/[id]/documents/[docId] - Update a document
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { docId } = await params;
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Parse body
  const body = await request.json();
  const { title, content, sort_order } = body;

  // Build update object
  const updates: Record<string, any> = {};
  if (title !== undefined) updates.title = title.trim();
  if (content !== undefined) updates.content = content;
  if (sort_order !== undefined) updates.sort_order = sort_order;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { data: null, error: { message: "No fields to update", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Update document
  const { data: document, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", docId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { data: null, error: { message: "Document not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: document, error: null });
}

// DELETE /api/projects/[id]/documents/[docId] - Delete a document
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { docId } = await params;
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Delete document
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", docId);

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true }, error: null });
}
