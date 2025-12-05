//clover 보드 관리
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
//클로버 count?
export async function getClovers(receiverId, groupId) {
    const{data,error} = await supabase.from('clovers').select('*').eq('receiver_id', receiverId).eq('group_id', groupId);
    if(error){
        console.error('클로버 조회 실패: ',error);
        return { clovers: [], totalCount: 0}
    }
    let CloverCount = 0;
    for(const i of data){
        CloverCount +=i.clover_count;
    }
    return{
        clovers: data,
        totalCount: CloverCount
    }
}
//클로버 완성!
export async function clearClover(receiverId, groupId) {
    const answer = await getClovers(receiverId, groupId);
    if(answer.totalCount >= 4){
        return {
            tf: true,
            totalCount: answer.totalCount
        };
    }else{
        return{
            tf: false,
            totalCount: answer.totalCount,
            count: 4 - answer.totalCount
        };
    }
}

export async function getCloverBook(receiverId) {
    const { data, error } = await supabase
        .from('clovers')
        .select(`*, groups (id, group_name)`)
        .eq('receiver_id', receiverId);

    if (error) {
        console.error('클로버 목록 조회 실패:', error);
        return [];
    }

    console.log("🔥 RAW CLOVER DATA:", data); // 반드시 찍어보기

    const ByGroup = {};

    data.forEach(clover => {
        const groupId = clover.group_id;

        // 🔥 여기가 핵심 (윈도우에서 undefined 였던 문제 해결)
        const countValue = Number(clover.clover_count ?? 1);  

        if (!ByGroup[groupId]) {
            ByGroup[groupId] = {
                groupId,
                groupName: clover.groups?.group_name || '알수없음',
                clovers: [],
                totalCount: 0,
                completedClovers: 0
            };
        }

        ByGroup[groupId].clovers.push(clover);

        ByGroup[groupId].totalCount += countValue;
        ByGroup[groupId].completedClovers = Math.floor(ByGroup[groupId].totalCount / 4);
    });

    return Object.values(ByGroup);
}
