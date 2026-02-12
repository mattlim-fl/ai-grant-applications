import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/projects/[id] - Get a single project with documents
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Fetch project with documents
  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      documents:documents(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { data: null, error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Sort documents by sort_order
  if (project.documents) {
    project.documents.sort((a: any, b: any) => a.sort_order - b.sort_order);
  }

  return NextResponse.json({ data: project, error: null });
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const { name, funder, deadline, status } = body;

  // Build update object
  const updates: Record<string, any> = {};
  if (name !== undefined) updates.name = name.trim();
  if (funder !== undefined) updates.funder = funder?.trim() || null;
  if (deadline !== undefined) updates.deadline = deadline || null;
  if (status !== undefined) updates.status = status;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { data: null, error: { message: "No fields to update", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Update project
  const { data: project, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { data: null, error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: project, error: null });
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Delete project (documents cascade)
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true }, error: null });
}
