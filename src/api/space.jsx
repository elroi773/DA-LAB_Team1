//Space 관리
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { supabase } from './supabaseClient.js'

//Space 생성
export async function Space(group_name) {
    // ✅ 현재 로그인 유저를 auth에서 직접 가져와서 100% 일치 보장
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData?.user;
  
    if (userErr || !user) {
      return { success: false, error: userErr || "로그인이 필요합니다." };
    }
  
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    // creatorId는 보내지 마! DB default(auth.uid())가 자동으로 넣음
    const { data, error } = await supabase
      .from("groups")
      .insert([{ group_name, code }])
      .select("*")
      .maybeSingle(); // single() 절대 금지
  
    if (error) {
      return { success: false, error };
    }

    if (!data) {
      const { data: again, error: againErr } = await supabase
        .from("groups")
        .select("*")
        .eq("code", code)
        .maybeSingle();
        
      if (againErr || !again) {
        return { success: false, error: againErr || "생성 후 조회 실패" };
      }
      return { success: true, group: again };
    }
  
    return { success: true, group: data };
  }
//참여 코드 생성
export async function getSpaceCode(code) {
    const {data, error} = await supabase.from('groups').select('*').eq('code',code.toUpperCase()).single();

    if(error){
        return { success: false, error };
    }else
        return {success: true, group: data};
}
//Space 참여
export async function JoinSpace(userId, code) {
    const { data: group, error: groupError } = await supabase.from('groups').select('*').eq('code',code.toUpperCase()).single();
    if (groupError || !group){
        return {success: false, error: "유효하지 않은 코드"};
    }
    //이미 가입한 상태인지 확인
    const {data: ingroup} = await supabase.from('group_members').select(`*`).eq('group_id',group.id).eq('user_id',userId).maybeSingle();

    if(ingroup){
        return {success: false, error: "이미 참여한 그룹입니다."};
    }

    //멤버 추가
    const {error: insertError} = await supabase.from('group_members').insert([{group_id: group.id, user_id: userId}]);
    if(insertError){
        return {success: false, error: insertError.message};
    }
    return {success: true, group};
}
//그룹 관리
export async function mySpace(creatorId) {
    const { data,error} = await supabase.from('groups').select('*').eq('creatorId',creatorId)
    if(error){
        return [];
    }else{
        return data;
    }
}
//그룹 구성원 관리
export async function MygetMember(groupId) {
    const {data, error} = await supabase.from('group_members').select(`user_id, profiles(nickname)`).eq('group_id', groupId);
    if(error){
        return {success: false,error};
    }
    const members = data.map(m =>({
        id: m.user_id,
        nickname: m.profiles.nickname
    }));
    return {success: true, members};
}
//그룹 구성원 삭제
export async function removeMember(groupId,memberId) {
    const {data, error} = await supabase.from('group_members').delete().eq('group_id',groupId).eq('user_id',memberId);
    if(error){
        return {success: false,error};
    }
    else{
        return {success: true};
    }
}
//Space 삭제
export async function deleteSpace(groupId) {
    const {error} = await supabase.from('groups').delete().eq('id',groupId);
    if(error)
        return {success: false,error};
    else
        return {success: true};
}