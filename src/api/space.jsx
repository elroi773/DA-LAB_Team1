// ./api/space.jsx
import { supabase } from './supabaseClient.js'

// 랜덤 코드 생성 함수
function generateCode() {
  let code = Math.random().toString(36).substring(2, 8)
  return code.toUpperCase()
}

// SPACE(그룹) 생성
export async function Space(group_name) {
  const code = generateCode()

  const { data, error } = await supabase
    .from("groups")
    .insert([
      {
        group_name,
        code
      }
    ])
    .select()
    .single()

  if (error) {
    return { success: false, error }
  }

  return { success: true, group: data }
}

// 참여 코드로 그룹 찾기
export async function getSpaceCode(code) {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("code", code.toUpperCase())
    .single()

  if (error) {
    return { success: false, error }
  }

  return { success: true, group: data }
}

// SPACE 참여
export async function JoinSpace(userId, code) {
  // 1) 그룹 찾기
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("code", code.toUpperCase())
    .single()

  if (groupError || !group) {
    return { success: false, error: "유효하지 않은 코드입니다." }
  }

  // 2) 이미 참여 여부 확인
  const { data: ingroup } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", group.id)
    .eq("user_id", userId)
    .maybeSingle()

  if (ingroup) {
    return { success: false, error: "이미 참여한 그룹입니다." }
  }

  // 3) 참여 insert
  const { error: insertError } = await supabase
    .from("group_members")
    .insert([
      {
        group_id: group.id,
        user_id: userId,
      }
    ])

  if (insertError) {
    return { success: false, error: insertError.message }
  }

  return { success: true, group }
}

// 내가 생성한 그룹들 가져오기
export async function mySpace() {
  const { data, error } = await supabase
    .from("groups")
    .select("*")

  if (error) {
    return []
  }

  return data
}

// 그룹 구성원 조회
export async function MygetMember(groupId) {
  const { data, error } = await supabase
    .from("group_members")
    .select(`
      user_id,
      profiles ( nickname )
    `)
    .eq("group_id", groupId)

  if (error) {
    return { success: false, error }
  }

  const members = data.map(m => ({
    id: m.user_id,
    nickname: m.profiles.nickname,
  }))

  return { success: true, members }
}

// 그룹 구성원 삭제
export async function removeMember(groupId, memberId) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", memberId)

  if (error) {
    return { success: false, error }
  }

  return { success: true }
}

// 그룹 삭제
export async function deleteSpace(groupId) {
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId)

  if (error) {
    return { success: false, error }
  }

  return { success: true }
}
