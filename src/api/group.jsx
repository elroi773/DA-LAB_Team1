//group 관리
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient.js'

//그룹 참여
export async function JoinGroup(group_id,user_id,role){

    const {data, error} = await supabase.from('group_members')
    .insert([{
        group_id, user_id,role
    }]).select().single()

    if(error){
        return {success: false, message: `Group 생성 실패: ${error.message}`,error};
    }else{
        return {success: true,data};
    }
}
//그룹 관리하기
export async function GetGroups(group_id) {
    const {data, error} = await supabase.from('group_members').select(`user_id, role, profiles(nickname)`).eq('group_id',group_id)
    if(error){
        return {success: false,message: `에러야: ${error.message}`,error};
    }
    return{
        success: true,
        members: data.map(m => ({
            user_id: m.user_id,
            role: m.role,
            nickname: m.profiles?.nickname || null
        }))
    }
}

//특정 학생이 그룹을 조회한다 내가 들어가있는 곳
export async function GetMembers(user_id) {
    const { data: members, error } = await supabase
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", user_id);
  
    if (error) {
      console.error("유저의 그룹 조회 실패:", error);
      return { success: false, groups: [] };
    }
  
    const groups = [];
  
    for (const m of members) {
      const { data: clovers } = await supabase
        .from("clovers")
        .select("clover_count, message")
        .eq("group_id", m.group_id);
  
      groups.push({
        group_id: m.group_id,
        role: m.role,
        clovers: clovers || [],
      });
    }
  
    return { success: true, groups };
  }
  

//특정 그룹 멤버 삭제 
export async function DeleteMember(group_id,user_id) {
    const{error} = await supabase.from('group_members').delete().eq('group_id',group_id).eq('user_id',user_id)

    if(error){
        console.error('멤버 삭제 실패: ', error)
        return { success: false, message: error.message }
    }else{
        return { success: true }
    }
}
//ture 기버, false면 리시버
