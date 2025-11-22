/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "../component/Giver_Header";
import MemberList from "../component/MemberList";

const wrapper = css`
  width: 100%;
  min-height: 100vh;
  background: #cccccc; /* 밖 영역(모바일 외부) */
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

/* ───────────── 상단 그래프 영역 ───────────── */
const graphSection = css`
  width: 100%;
  height: 300px;
  background: linear-gradient(180deg, #FFF 11.06%, #80A867 73.56%);
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

const name = css`
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

/* ───────────── 아래 리스트 카드 영역 ───────────── */
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

export default function GroupStatistics() {
  const groupMembers = [
    { id: 1, name: "오세영", count: 1, barHeight: 180 },
    { id: 2, name: "장하은", count: 2, barHeight: 150 },
    { id: 3, name: "우지영", count: 3, barHeight: 130 },
    { id: 4, name: "김이레", count: 0, barHeight: 0 },
  ];

  const podium = [
    groupMembers[1], // 2등: 장하은
    groupMembers[0], // 1등: 오세영
    groupMembers[2], // 3등: 우지영
  ];

  return (
    <div css={wrapper}>
      <div css={mobileScreen}>
        <Header />

        {/* 상단 그래프 */}
        <section css={graphSection}>
          <div css={podiumWrapper}>
            {podium.map((m) => (
              <div key={m.id} css={podiumItem}>
                <span css={name}>{m.name}</span>
                <div css={bar} style={{ height: m.barHeight }}>
                  <span css={countText}>{m.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 리스트 */}
        <section css={listSection}>
          {groupMembers.map((m) => (
            <MemberList key={m.id} groupName={m.name} />
          ))}
        </section>
      </div>
    </div>
  );
}
