import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/organizations - List user's organizations
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

  // Fetch organizations where user is a member
  const { data: memberships, error } = await supabase
    .from("organization_members")
    .select(`
      role,
      organization:organizations(*)
    `)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: error.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Transform to include role
  const organizations = memberships.map((m) => ({
    ...m.organization,
    role: m.role,
  }));

  return NextResponse.json({ data: organizations, error: null });
}

// POST /api/organizations - Create a new organization
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
  const { name } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { data: null, error: { message: "Name is required", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check if slug exists
  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: name.trim(),
      slug: finalSlug,
    })
    .select()
    .single();

  if (orgError) {
    return NextResponse.json(
      { data: null, error: { message: orgError.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Add user as owner
  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    // Rollback org creation
    await supabase.from("organizations").delete().eq("id", org.id);
    return NextResponse.json(
      { data: null, error: { message: memberError.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Set as current org
  await supabase
    .from("profiles")
    .update({ current_organization_id: org.id })
    .eq("id", user.id);

  return NextResponse.json({ data: { ...org, role: "owner" }, error: null }, { status: 201 });
}
