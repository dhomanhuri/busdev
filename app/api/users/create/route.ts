import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Verify that the current user is an Admin
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is Admin
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role !== "Admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      email,
      password,
      nama_lengkap,
      role,
      gm_id,
      department,
      status_aktif,
      avatar_url,
      certificate_ids,
    } = body;

    // Validate required fields
    if (!email || !nama_lengkap || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create admin client using service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Generate password if not provided
    const userPassword = password || Math.random().toString(36).substring(7) + "A1!";

    // Create user using admin API (this won't create a session)
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: userPassword,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        nama_lengkap,
        role,
      },
    });

    if (createError) {
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    if (!authUser.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Update user profile with additional fields
    const { error: profileError } = await supabaseAdmin
      .from("users")
      .update({
        nama_lengkap,
        role,
        gm_id: role === "Sales" ? (gm_id || null) : null,
        department: role === "GM" ? (department || null) : null,
        avatar_url: avatar_url || null,
        status_aktif: status_aktif !== undefined ? status_aktif : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authUser.user.id);

    if (profileError) {
      // If profile update fails, try to delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // Insert user certificates if provided
    if (certificate_ids && certificate_ids.length > 0) {
      const userCertificates = certificate_ids.map((certificateId: string) => ({
        user_id: authUser.user.id,
        certificate_id: certificateId,
      }));

      const { error: ucError } = await supabaseAdmin
        .from("user_certificates")
        .insert(userCertificates);

      if (ucError) {
        console.error("Error inserting certificates:", ucError);
        // Don't fail the request if certificates fail
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        nama_lengkap,
        role,
        gm_id: role === "Sales" ? (gm_id || null) : null,
        department: role === "GM" ? (department || null) : null,
        avatar_url: avatar_url || null,
        status_aktif: status_aktif !== undefined ? status_aktif : true,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
