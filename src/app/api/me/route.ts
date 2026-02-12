import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/me - Get current user with profile and org status
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

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Check if user has any organizations
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id);

  const hasOrganization = memberships && memberships.length > 0;
  const needsOnboarding = !hasOrganization;

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      ...profile,
      has_organization: hasOrganization,
      needs_onboarding: needsOnboarding,
    },
    error: null,
  });
}
