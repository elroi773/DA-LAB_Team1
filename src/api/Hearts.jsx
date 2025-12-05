// 하트

import {supabase} from './supabaseClient.js'

// 하트 주기 (합계는 COUNT or SUM으로 계산)
export async function giveClover(groupId, receiverId, cloverCount, message) {

    console.log("🟡 [giveClover] 전달된 groupId =", groupId);
    console.log("🟡 [giveClover] 전달된 receiverId =", receiverId);
    console.log("🟡 [giveClover] 전달된 cloverCount =", cloverCount);
    console.log("🟡 [giveClover] 전달된 message =", message);

    const { data, error } = await supabase
        .from('clovers')
        .insert([{
            group_id: groupId,
            receiver_id: receiverId,
            clover_count: cloverCount,
            message: message
        }])

    if (error) {
        console.error('칭찬 주기 실패:', error);
        return { success: false, message: '하트 주기 실패: ' + error.message }
    } else {
        return { success: true, message: '하트 주기 성공' }
    }
}


export { supabase }