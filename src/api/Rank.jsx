// src/api/Rank.jsx
import { supabase } from "../lib/supabaseClient";

export async function getGroupRankings(groupId) {

    // 1) 그룹 멤버 리스트 불러오기
    const { data: members, error: memErr } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId);

    if (memErr) throw memErr;

    const userIds = members.map(m => m.user_id);
    if (userIds.length === 0) return [];

    // 2) 프로필 닉네임 불러오기
    const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", userIds);

    if (pErr) throw pErr;

    const profileMap = {};
    profiles.forEach(p => (profileMap[p.id] = p.nickname));

    // 3) 클로버 불러오기
    const { data: clovers, error: cErr } = await supabase
        .from("clovers")
        .select("receiver_id, clover_count")
        .eq("group_id", groupId);

    if (cErr) throw cErr;

    const cloverSum = {};
    clovers.forEach(c => {
        cloverSum[c.receiver_id] =
            (cloverSum[c.receiver_id] || 0) + c.clover_count;
    });

    // 4) 합쳐서 랭킹 배열 생성
    return members.map(m => ({
        user_id: m.user_id,
        user_name: profileMap[m.user_id] || "이름 없음",
        total_clovers: cloverSum[m.user_id] || 0,
    })).sort((a, b) => b.total_clovers - a.total_clovers);
}
