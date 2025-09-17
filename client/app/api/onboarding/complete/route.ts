import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { websiteAnalysis, websiteUrl, userName } = await req.json();

  // VALIDATE PARAMS
  if (!websiteAnalysis || !websiteUrl || !userName) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // CHECK USER INFO
  const supabase = supabaseAdmin;
  const { data: userInfo, error: userInfoError } = await supabase
    .from("user_info")
    .select("onboarding_completed")
    .eq("auth_user_id", user.id);

  if (userInfoError || !userInfo.length || userInfo[0].onboarding_completed) {
    return NextResponse.json(
      { error: userInfoError?.message || "Failed to update user info" },
      { status: 500 }
    );
  }

  // UPDATE WEBSITE ANALYSIS
  const { error: websiteAnalysisError } = await supabase
    .from("websites")
    .insert({
      name: websiteAnalysis.websiteName,
      description: websiteAnalysis.companyDescription,
      keywords: websiteAnalysis.keywordsToMonitor,
      competitors: websiteAnalysis.competitors,
      ideal_customer_profile: websiteAnalysis.idealCustomerProfile,
      url: websiteUrl,
      user_id: user.id,
    });
  if (websiteAnalysisError) {
    return NextResponse.json(
      {
        error:
          websiteAnalysisError.message || "Failed to update website analysis",
      },
      { status: 500 }
    );
  }

  // UPDATE USER INFO
  const { error: updateUserInfoError } = await supabase
    .from("user_info")
    .update({
      onboarding_completed: true,
      name: userName,
    })
    .eq("auth_user_id", user.id);
  if (updateUserInfoError) {
    return NextResponse.json(
      {
        error: updateUserInfoError.message || "Failed to update user info",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Onboarding completed" },
    { status: 200 }
  );
};
