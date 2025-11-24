/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../component/Giver_Header";
import MemberList from "../component/MemberList";
import { getGroupRankings } from "../api/Rank";
import { getGroupMembers } from "../api/group";

// ───────────────── CSS ───────────────────
const wrapper = css`
  width: 100%;
  min-height: 100vh;
  background: #cccccc;
  display: flex;
  justify-content: center;
`;

const mobileScreen = css`
  width: 100%;
  max-width: 402px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const graphSection = css`
  width: 100%;
  height: 300px;
  background: linear-gradient(180deg, #fff 11.06%, #80a867 73.56%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 60px;
`;

const podiumWrapper = css`
  display: flex;
  gap: 18px;
  align-items: flex-end;
`;

const podiumItem = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const nameStyle = css`
  font-size: 14px;
  font-weight: 600;
  color: #4b6a3b;
`;

const bar = css`
  width: 86px;
  border-radius: 10px 10px 0 0;
  background: #8fcd7a;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const countText = css`
  font-size: 20px;
  font-weight: 700;
  color: white;
`;

const listSection = css`
  width: 100%;
  padding: 26px 0 40px;
  background: #ffffff;
  margin-top: -40px;
  border-radius: 32px 32px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

// ───────────────── PAGE ───────────────────
export default function GroupStatistics() {
  const location = useLocation();
  const navigate = useNavigate();

  // 모든 useState를 최상단에 선언
  const [rankings, setRankings] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // location.state에서 groupId, groupName 추출 (없으면 null)
  const groupId = location.state?.groupId ?? null;
  const groupName = location.state?.groupName ?? null;

  // 멤버/랭킹 로드 함수 (refresh에도 사용)
  const loadMembers = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const rankingData = await getGroupRankings(groupId);
      setRankings(rankingData);

      const memberData = await getGroupMembers(groupId);
      setMembers(memberData);

      console.log("🔥 불러온 그룹 멤버:", memberData);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // state가 없으면 리다이렉트
  useEffect(() => {
    if (!location.state) {
      navigate("/giver-main");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (groupId) {
      console.log("🔥 groupId 전달됨:", groupId);
      loadMembers();
    }
  }, [groupId]);

  const podium = rankings.slice(0, 3);

  // groupId가 없으면 리다이렉트 중이므로 null 반환
  if (!groupId) return null;

  return (
    <div css={wrapper}>
      <div css={mobileScreen}>
        <Header />
        <section css={graphSection}>
          {loading ? (
            <div>불러오는 중...</div>
          ) : podium.length === 0 ? (
            <h2>아직 클로버가 없어요 😢</h2>
          ) : (
            <div css={podiumWrapper}>
              {podium.map((p) => (
                <div key={p.user_id} css={podiumItem}>
                  <span css={nameStyle}>{p.user_name}</span>
                  <div css={bar} style={{ height: 80 + p.total_clovers * 15 }}>
                    <span css={countText}>{p.total_clovers}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section css={listSection}>
          {loading ? (
            <p>로딩 중...</p>
          ) : members.length === 0 ? (
            <p>아직 멤버가 없어요.</p>
          ) : (
            members.map((m) => (
              <MemberList
                key={m.user_id}
                groupId={groupId}
                groupName={groupName} 
                userId={m.user_id}
                name={m.nickname}
                clovers={
                  rankings.find((r) => r.user_id === m.user_id)
                    ?.total_clovers || 0
                }
                onRefresh={loadMembers}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
