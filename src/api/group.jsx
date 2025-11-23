//group 관리
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient.js";

//그룹 참여
export async function JoinGroup(group_id, user_id, role) {
  const { data, error } = await supabase
    .from("group_members")
    .insert([
      {
        group_id,
        user_id,
        role,
      },
    ])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: `Group 생성 실패: ${error.message}`,
      error,
    };
  } else {
    return { success: true, data };
  }
}
//그룹 관리하기
export async function GetGroups(group_id) {
  const { data, error } = await supabase
    .from("group_members")
    .select(`user_id, role, profiles(nickname)`)
    .eq("group_id", group_id);
  if (error) {
    return { success: false, message: `에러야: ${error.message}`, error };
  }
  return {
    success: true,
    members: data.map((m) => ({
      user_id: m.user_id,
      role: m.role,
      nickname: m.profiles?.nickname || null,
    })),
  };
}

//특정 학생이 그룹을 조회한다 내가 들어가있는 곳
export async function getGroupMembers(groupId) {
    // 1) 그룹 멤버 id 목록
    const { data: members, error } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId)
  
    if (error) throw error
  
    if (members.length === 0) return []
  
    // 2) user_id 배열로 nickname 조회
    const userIds = members.map(m => m.user_id)
  
    const { data: profiles, error: pError } = await supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", userIds)
  
    if (pError) throw pError
  
    // 3) 매칭해서 반환
    return members.map(m => ({
      user_id: m.user_id,
      nickname: profiles.find(p => p.id === m.user_id)?.nickname || "이름 없음"
    }))
  }
  

//특정 그룹 멤버 삭제
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
      console.warn("삭제할 멤버가 없음");
      return { success: false, message: "삭제할 멤버가 없거나 권한이 없습니다." };
    }
  
    return { success: true };
  }
//ture 기버, false면 리시버
