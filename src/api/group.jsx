import { supabase } from "./supabaseClient.js";

// 그룹 참여
export async function JoinGroup(group_id, user_id, role) {
  // 이미 가입한 상태인지 확인
  const { data: existing } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", group_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      message: "이미 참여한 그룹입니다.",
      error: { code: "ALREADY_MEMBER" },
    };
  }

  const { data, error } = await supabase
    .from("group_members")
    .insert([{ group_id, user_id, role }])
    .select()
    .single();

  if (error) {
    // 409 Conflict 에러 처리 (중복 삽입 시도)
    if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
      return {
        success: false,
        message: "이미 참여한 그룹입니다.",
        error,
      };
    }
    return {
      success: false,
      message: `Group 생성 실패: ${error.message}`,
      error,
    };
  }

  return { success: true, data };
}

// 특정 그룹 멤버 목록
export async function getGroupMembers(groupId) {
  const { data: members, error } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (error) throw error;
  if (!members.length) return [];

  const userIds = members.map((m) => m.user_id);

  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, nickname")
    .in("id", userIds);

  if (pErr) throw pErr;

  return members.map((m) => ({
    user_id: m.user_id,
    nickname: profiles.find((p) => p.id === m.user_id)?.nickname || "이름 없음",
  }));
}

// 그룹 상세 정보 (code 포함)
export async function getGroupDetail(groupId) {
  const { data, error } = await supabase
    .from("groups")
    .select("id, group_name, code")
    .eq("id", groupId)
    .single();

  if (error) {
    console.error("🔥 getGroupDetail error:", error);
    throw error;
  }

  return data;
}

// 멤버 삭제
export async function DeleteMember(group_id, user_id) {
  const { data, error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", group_id)
    .eq("user_id", user_id)
    .select("user_id");

  if (error) {
    console.error("멤버 삭제 실패: ", error);
    return { success: false, message: error.message };
  }

  if (!data || data.length === 0) {
    return { success: false, message: "삭제할 멤버가 없습니다." };
  }

  return { success: true };
}
