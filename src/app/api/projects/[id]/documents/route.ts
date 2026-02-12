import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/projects/[id]/documents - List documents for a project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Fetch documents
  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: documents, error: null });
}

// POST /api/projects/[id]/documents - Create a new document
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
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

  if (!title?.trim()) {
    return NextResponse.json(
      { data: null, error: { message: "Title is required", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Get max sort_order if not provided
  let order = sort_order;
  if (order === undefined) {
    const { data: maxDoc } = await supabase
      .from("documents")
      .select("sort_order")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    
    order = (maxDoc?.sort_order ?? -1) + 1;
  }

  // Create document
  const { data: document, error } = await supabase
    .from("documents")
    .insert({
      project_id: projectId,
      title: title.trim(),
      content: content || "",
      sort_order: order,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: document, error: null }, { status: 201 });
}
