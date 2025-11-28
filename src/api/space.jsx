//Space 관리
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { supabase } from './supabaseClient.js'

//Space 생성
export async function Space(group_name, previewCode = null) {
    // 현재 로그인 유저를 auth에서 직접 가져와서 100% 일치 보장
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userErr || !user) {
      return { success: false, error: userErr || "로그인이 필요합니다." };
    }

    // previewCode가 있으면 사용, 없으면 새로 생성
    const code = previewCode || Math.random().toString(36).substring(2, 8).toUpperCase();
  
    //  DB default(auth.uid())가 자동으로 넣음
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
    console.log('JoinSpace 호출:', { userId, code: code.toUpperCase() });

    // 1. 프로필 확인 및 생성
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (!profile) {
        console.log('프로필이 없습니다. 기본 프로필을 생성합니다.');
        // 프로필이 없으면 기본 닉네임으로 생성
        const { data: userData } = await supabase.auth.getUser();
        const defaultNickname = userData?.user?.email?.split('@')[0] || '사용자';

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert(
                {
                    id: userId,
                    nickname: defaultNickname,
                },
                { onConflict: 'id' }
            );

        if (profileError) {
            console.error('프로필 생성 실패:', profileError);
            return {success: false, error: "프로필 생성에 실패했습니다. 다시 로그인해주세요."};
        }
    }

    // 2. 그룹 조회
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('code', code.toUpperCase())
        .maybeSingle();

    console.log('그룹 조회 결과:', { group, groupError });

    if (groupError) {
        console.error('그룹 조회 에러:', groupError);
        return {success: false, error: "그룹 조회 중 오류가 발생했습니다"};
    }
    if (!group){
        return {success: false, error: "유효하지 않은 코드입니다"};
    }

    // 2-1. 그룹 생성자인지 확인
    if (group.created_by === userId || group.creatorId === userId || group.creator_id === userId) {
        console.log('그룹 생성자는 참여할 수 없습니다');
        return {success: false, error: "그룹을 만든 사람은 참여할 수 없습니다."};
    }

    // 3. 이미 가입한 상태인지 확인
    const {data: ingroup} = await supabase.from('group_members').select(`*`).eq('group_id',group.id).eq('user_id',userId).maybeSingle();

    console.log('중복 체크 결과:', { ingroup, groupId: group.id, userId });

    if(ingroup){
        console.log('이미 가입된 그룹입니다');
        return {success: false, error: "이미 참여한 그룹입니다."};
    }

    // 4. 멤버 추가
    console.log('멤버 추가 시도:', { group_id: group.id, user_id: userId });
    const {error: insertError} = await supabase.from('group_members').insert([{group_id: group.id, user_id: userId}]);
    if(insertError){
        console.error('멤버 추가 에러:', insertError);
        // 409 Conflict 에러 처리 (중복 삽입 시도)
        if (insertError.code === '23505' || insertError.message.includes('duplicate') || insertError.message.includes('unique')) {
            return {success: false, error: "이미 참여한 그룹입니다."};
        }
        // Foreign key 에러 처리
        if (insertError.code === '23503') {
            return {success: false, error: "프로필 오류가 발생했습니다. 로그아웃 후 다시 로그인해주세요."};
        }
        return {success: false, error: "그룹 가입 중 오류가 발생했습니다: " + insertError.message};
    }
    console.log('멤버 추가 성공');
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
