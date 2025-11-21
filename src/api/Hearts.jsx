// 하트

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

// 하트 주기 (합계는 COUNT or SUM으로 계산)
export async function giveClover(groupId, receiverId, cloverCount, message) {
    const { data, error } = await supabase
    .from('clovers')
    .insert([{ 
        groupId: groupId, 
        receiver_Id: receiverId, 
        clover_count: cloverCount, 
        message: message 
    }])

    if (error) {
        return { success: false, message: '하트 주기 실패' }
    } else {
        return { success: true, message: '하트 주기 성공' }
    }
}

export { supabase }