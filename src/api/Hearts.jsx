// 하트

import {supabase} from '../lib/supabaseClient'

// 하트 주기 (합계는 COUNT or SUM으로 계산)
export async function giveClover(groupId, receiverId, cloverCount, message) {
    const { data, error } = await supabase
    .from('clovers')
    .insert([{ 
        group_id: groupId, 
        receiver_id: receiverId, 
        clover_count: cloverCount, 
        message 
    }])    

    if (error) {
        return { success: false, message: '하트 주기 실패' }
    } else {
        return { success: true, message: '하트 주기 성공' }
    }
}

export { supabase }