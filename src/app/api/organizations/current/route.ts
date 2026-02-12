import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/organizations/current - Get current organization
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

  // Get profile with current org
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.current_organization_id) {
    return NextResponse.json({ data: null, error: null });
  }

  // Get the organization with user's role
  const { data: membership, error } = await supabase
    .from("organization_members")
    .select(`
      role,
      organization:organizations(*)
    `)
    .eq("organization_id", profile.current_organization_id)
    .eq("user_id", user.id)
    .single();

  if (error || !membership) {
    return NextResponse.json({ data: null, error: null });
  }

  return NextResponse.json({
    data: { ...membership.organization, role: membership.role },
    error: null,
  });
}

// PUT /api/organizations/current - Switch current organization
export async function PUT(request: Request) {
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
  const { organization_id } = body;

  if (!organization_id) {
    return NextResponse.json(
      { data: null, error: { message: "organization_id is required", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Verify user is member of the org
  const { data: membership, error: memberError } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", organization_id)
    .eq("user_id", user.id)
    .single();

  if (memberError || !membership) {
    return NextResponse.json(
      { data: null, error: { message: "Not a member of this organization", code: "FORBIDDEN" } },
      { status: 403 }
    );
  }

  // Update current org
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ current_organization_id: organization_id })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { data: null, error: { message: updateError.message, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }

  // Get the organization details
  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organization_id)
    .single();

  return NextResponse.json({
    data: { ...org, role: membership.role },
    error: null,
  });
}
