// Users.jsx 회원 (회원가입, 로그인, 프로필 관리)

import {supabase} from '../lib/supabaseClient'

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
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
            return { success: false, message: '사용자 정보 저장에 실패했습니다.' }
        }
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

    return { success: true, user: data.user, userId: data.user.id }
}

// 로그아웃
export async function logOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        console.error('로그아웃 실패:', error)
        return { success: false, message: error.message }
    }

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
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authError) {
        return { success: false, message: 'Auth 삭제 실패' }
    }

    return { success: true }
}

export { supabase, supabaseAdmin }
