import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/projects/[id]/documents/reorder - Reorder documents
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
  const { order } = body;

  if (!Array.isArray(order) || order.length === 0) {
    return NextResponse.json(
      { data: null, error: { message: "Order array is required", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Update each document's sort_order
  const updates = order.map((docId: string, index: number) => 
    supabase
      .from("documents")
      .update({ sort_order: index })
      .eq("id", docId)
      .eq("project_id", projectId)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    return NextResponse.json(
      { data: null, error: { message: "Failed to reorder some documents", code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true }, error: null });
}
