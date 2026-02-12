import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/projects - List all projects
export async function GET() {
  const supabase = await createClient();
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Fetch projects with document count
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      documents:documents(count)
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Transform to include documents_count
  const transformed = projects.map((p) => ({
    ...p,
    documents_count: p.documents?.[0]?.count ?? 0,
    documents: undefined,
  }));

  return NextResponse.json({ data: transformed, error: null });
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
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
  const { name, funder, deadline, sections } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { data: null, error: { message: "Name is required", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Create project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      name: name.trim(),
      funder: funder?.trim() || null,
      deadline: deadline || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (projectError) {
    return NextResponse.json(
      { data: null, error: { message: projectError.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Create default sections if provided
  if (sections && Array.isArray(sections) && sections.length > 0) {
    const sectionTitles: Record<string, string> = {
      about: "About Us",
      need: "Statement of Need",
      project: "Project Description",
      outcomes: "Outcomes & Impact",
      budget: "Budget",
      sustainability: "Sustainability",
    };

    const documents = sections.map((sectionId: string, index: number) => ({
      project_id: project.id,
      title: sectionTitles[sectionId] || sectionId,
      content: "",
      sort_order: index,
    }));

    const { error: docsError } = await supabase
      .from("documents")
      .insert(documents);

    if (docsError) {
      console.error("Error creating default documents:", docsError);
      // Don't fail the whole request, project is created
    }
  }

  return NextResponse.json({ data: project, error: null }, { status: 201 });
}
