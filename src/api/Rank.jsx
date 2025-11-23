// src/api/Rank.jsx
import { supabase } from "../lib/supabaseClient";

export async function getGroupRankings(groupId) {
  if (!groupId) return [];

  // 1) 그룹 멤버 리스트
  const { data: members = [], error: memErr } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (memErr) throw memErr;

  const userIds = members.map((m) => m.user_id).filter(Boolean);
  if (userIds.length === 0) return [];

  // 2) 프로필 닉네임
  const { data: profiles = [], error: pErr } = await supabase
    .from("profiles")
    .select("id, nickname")
    .in("id", userIds);

  if (pErr) throw pErr;

  const profileMap = profiles.reduce((acc, p) => {
    acc[p.id] = p.nickname ?? "이름 없음";
    return acc;
  }, {});

  // 3) 클로버(칭찬) 데이터
  const { data: clovers = [], error: cErr } = await supabase
    .from("clovers")
    .select("receiver_id, clover_count")
    .eq("group_id", groupId);

  if (cErr) throw cErr;

  // receiver별 합산 (숫자 캐스팅 + receiver_id 없는건 제외)
  const cloverSum = {};
  for (const c of clovers) {
    const rid = c.receiver_id;
    if (!rid) continue;

    const countNum = Number(c.clover_count ?? 0);
    cloverSum[rid] = (cloverSum[rid] || 0) + (Number.isNaN(countNum) ? 0 : countNum);
  }

  // 4) 멤버 + 닉네임 + 총합 => 랭킹 배열
  const rankings = members.map((m) => {
    const uid = m.user_id;
    return {
      user_id: uid,
      user_name: profileMap[uid] || "이름 없음",
      total_clovers: cloverSum[uid] || 0,
    };
  });

  // 5) 정렬 (클로버 내림차순, 동점이면 이름 오름차순)
  rankings.sort((a, b) => {
    if (b.total_clovers !== a.total_clovers) {
      return b.total_clovers - a.total_clovers;
    }
    return (a.user_name || "").localeCompare(b.user_name || "");
  });

  return rankings;
}
