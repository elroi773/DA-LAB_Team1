/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/Giver_Header";
import GroupCreateLogo from "../assets/group_clover.png";

// ✅ Space API
import { Space } from "../api/space.jsx";
// ✅ supabase client (세션 확인용)
import { supabase } from "../api/supabaseClient.js";

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const logoWrapper = css`
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const logoImg = css`
  width: 160px;
`;

const formWrapper = css`
  margin-top: 40px;
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & h1 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  & input {
    width: 92%;
    height: 48px;
    border: 1px solid #cfcfcf;
    border-radius: 10px;
    padding: 0 12px;
    margin-bottom: 30px;
    font-size: 16px;
  }
`;

const codeCreateRow = css`
  width: 100%;
  display: flex;
  gap: 12px;

  & input {
    flex: 1;
    margin-bottom: 0;
  }

  & button {
    width: 105px;
    border-radius: 10px;
    background: #78a366;
    color: #fff;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  & button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const submitBtn = css`
  margin-top: 50px;
  width: 100%;
  height: 58px;
  border-radius: 12px;
  background: #78a366;
  color: #fff;
  font-size: 18px;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const messageStyle = css`
  width: 85%;
  margin-top: 12px;
  font-size: 14px;
  color: #e74c3c;
`;

const successStyle = css`
  width: 85%;
  margin-top: 12px;
  font-size: 14px;
  color: #2ecc71;
`;
export default function GroupStatistics() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/giver-main");
    return null;
  }

  const { groupId, groupName } = location.state;

  const [rankings, setRankings] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ⭐⭐⭐ 멤버 / 클로버 모두 다시 불러오는 함수 ⭐⭐⭐ */
  const loadMembers = async () => {
    try {
      const rankingData = await getGroupRankings(groupId);
      setRankings(rankingData);

      const memberData = await getGroupMembers(groupId);
      setMembers(memberData);

      console.log("🔥 불러온 그룹 멤버:", memberData);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
    }
  };

  /* 첫 로딩 */
  useEffect(() => {
    const init = async () => {
      console.log("🔥 groupId 전달됨:", groupId);
      await loadMembers();
      setLoading(false);
    };
    init();
  }, [groupId]);

  const podium = rankings.slice(0, 3);

  return (
    <div css={wrapper}>
      <div css={mobileScreen}>
        <Header />

        {/* ─── 상단 PODIUM ─── */}
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

        {/* ─── 멤버 리스트 ─── */}
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
                userId={m.user_id}
                name={m.nickname}
                clovers={
                  rankings.find((r) => r.user_id === m.user_id)
                    ?.total_clovers || 0
                }
                onRefresh={loadMembers}  // ⭐ 삭제 & 칭찬 후 DB 다시 불러오기
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}