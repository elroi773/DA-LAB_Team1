// src/api/GetMyGroups.js
import { supabase } from "./Users";

export async function GetMyGroups(userId) {
  const { data, error } = await supabase
    .from("groups")
    .select("id, group_name")
    .eq("creatorId", userId);

  if (error) {
    console.error("🛑 그룹 불러오기 실패:", error);
    return { success: false, groups: [] };
  }

  return { success: true, groups: data };
}
