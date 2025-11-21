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
    const{data,error} = await supabase.from('group_members').select(`group_id, role, clovers!inner(receiver_id, clover_count, message)`).eq('user_id',user_id)
    if(error){
        console.error('유저의 그룹 조회 실패: ', error)
        return []
    }
    return{
        success: true,
        groups: data.map(row => ({
            group_id: row.group_id,
            role: row.role,
            clovers: row.clovers?.map(c => ({
                clover_count: c.clover_count,
                message: c.message
            })) || []
        }))
    }
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
