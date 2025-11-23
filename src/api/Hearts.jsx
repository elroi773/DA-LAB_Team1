// src/api/Hearts.jsx
import { supabase } from "../api/supabaseClient";

export async function giveClover(groupId, receiverId, cloverCount, message) {
  const { data: { session } } = await supabase.auth.getSession();
  console.log(" session at giveClover:", session);
  console.log(" access_token exists?", !!session?.access_token);

  const { data: { user } } = await supabase.auth.getUser();
  console.log("user at giveClover:", user);

  const { data, error } = await supabase
    .from("clovers")
    .insert([{
      group_id: groupId,
      receiver_id: receiverId,
      clover_count: cloverCount,
      message,
    }])
    .select();

  if (error) {
    console.error("하트 주기 실패:", error);
    return { success: false, message: error.message };
  }
  return { success: true, data };
}
