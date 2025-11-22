// 랭킹 보드

import { supabase } from '../lib/supabaseClient'

export async function getGroupRankings(groupId) {
    // 그룹 멤버 조회
    const { data: members, error: memberError } = await supabase
        .from('group_members')
        .select(`
            user_id,
            profiles (
                id,
                nickname
            )
        `)
        .eq('group_id', groupId)

    if (memberError) throw memberError

    // 클로버 데이터 조회
    const { data: clovers, error: cloverError } = await supabase
        .from('clovers')
        .select('receiver_Id, clover_count')
        .eq('groupId', groupId)

    if (cloverError) throw cloverError

    // 집계
    const cloverSummary = clovers.reduce((acc, row) => {
        acc[row.receiver_Id] = (acc[row.receiver_Id] || 0) + row.clover_count
        return acc
    }, {})

    // 랭킹 데이터 생성
    const rankings = members.map(member => ({
        user_id: member.user_id,
        user_name: member.profiles?.nickname || '알 수 없음',
        total_clovers: cloverSummary[member.user_id] || 0
    }))

    // 정렬 반환
    return rankings.sort((a, b) => b.total_clovers - a.total_clovers)
}
