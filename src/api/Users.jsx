// Users.jsx 회원 (회원가입, 로그인, 프로필 관리)
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient.js'


// localStorage 키 이름 통일
const LS_USER_ID = "user_id";
const LS_SESSION = "sb_session";

// 세션 저장 helper
function saveSessionToStorage(session) {
  if (!session) return;
  localStorage.setItem(LS_SESSION, JSON.stringify(session));
}

function saveUserIdToStorage(userId) {
  if (!userId) return;
  localStorage.setItem(LS_USER_ID, userId);
}

function clearAuthStorage() {
  localStorage.removeItem(LS_SESSION);
  localStorage.removeItem(LS_USER_ID);
}

// 현재 저장된 세션/유저 가져오는 helper (필요하면 다른 페이지에서도 사용 가능)
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredUserId() {
  return localStorage.getItem(LS_USER_ID);
}


// 닉네임 중복 확인
export async function checkNickname(nickname) {
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('nickname', nickname)
    .maybeSingle()

  if (error) {
    return { success: false, message: error.message }
  }

  if (data !== null) {
    return { success: false, message: '이미 존재하는 이름입니다.' }
  }

  return { success: true, message: '사용 가능한 이름입니다.' }
}


// 회원가입
export async function signUpUser(nickname, email, password, repassword) {
  // 비밀번호 확인
  if (password !== repassword) {
    return { success: false, message: '비밀번호가 일치하지 않습니다.' }
  }

  // 회원가입
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password
  })

  if (authError) {
    console.error('회원가입 실패:', authError)
    return { success: false, message: authError.message }
  }

  // profiles 테이블에 닉네임 저장
  if (authData.user) {
    const { error: dbError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        nickname: nickname
      }])

    // Auth는 생성되었지만 profiles 저장 실패한 경우
    if (dbError) {
      // ⚠️ supabaseAdmin은 서버 전용. 클라이언트에 있으면 안됨.
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: '사용자 정보 저장에 실패했습니다.' }
    }
  }

  // 회원가입 직후 자동 로그인 세션이 있을 때 저장해두기
  if (authData.session?.user?.id) {
    saveSessionToStorage(authData.session);
    saveUserIdToStorage(authData.session.user.id);
  }

  return { success: true, user: authData.user }
}


// 로그인
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })

  if (error) {
    console.error('로그인 실패:', error)
    return { success: false, message: error.message }
  }

  if (!data.user) {
    return { success: false, message: '로그인에 실패했습니다.' }
  }

  // 여기서 세션 + userId 로컬 저장
  // supabase 기본 세션 저장과 별개로 "확실히" 남겨두는 보조 저장
  saveSessionToStorage(data.session);
  saveUserIdToStorage(data.user.id);

  return { success: true, user: data.user, userId: data.user.id }
}


// 로그아웃
export async function logOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('로그아웃 실패:', error)
    return { success: false, message: error.message }
  }

  // 로그아웃 시 로컬에 저장한 것도 삭제
  clearAuthStorage();

  return { success: true }
}


// 닉네임 변경
export async function updateNickname(userId, newNickname) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ nickname: newNickname })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return { success: false, message: '닉네임 변경 실패: ' + error.message }
  }

  return { success: true, profile: data }
}


// 회원 탈퇴
export async function deleteUser(id) {
  // profiles 수동 삭제
  const { error: dbError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (dbError) {
    return { success: false, message: 'profiles 삭제 실패' }
  }

  // Auth 삭제 
  // ⚠️ supabaseAdmin은 서버 전용. 클라이언트에 있으면 안됨.
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (authError) {
    return { success: false, message: 'Auth 삭제 실패' }
  }

  // 탈퇴 성공이면 로컬 저장도 삭제
  clearAuthStorage();

  return { success: true }
}

export { supabase }
