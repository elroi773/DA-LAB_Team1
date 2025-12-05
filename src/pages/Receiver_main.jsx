/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import Header from "../component/Header";
import Before from "../component/Before_Ui";
import MessageNo from "../assets/message_no.svg";
import MessageYes from "../assets/message_yes.svg";

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #ffffffff;
  display: flex;
  flex-direction: column;
`;

/* 하단 고정 영역 */
const bottomWrapper = css`
  padding: 20px 20px 40px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const bottomLabel = css`
  font-size: 14px;
  margin-bottom: 8px;
`;

const messageContainer = css`
  position: relative;
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const messageImage = css`
  width: 100%;
  display: block;
`;

const centerText = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  padding-bottom: 30px;
  pointer-events: none;
  text-align: center;
  width: 80%;
`;

export default function ReceiverMain() {
  const [currentGroupData, setCurrentGroupData] = useState(null);

  // ⭐ Before에서 전달받은 데이터의 변경을 확실하게 감지하기 위해
  // shallow copy로 상태를 항상 갱신하도록 처리
  const handleGroupData = (groupData) => {
    if (!groupData) return;
    setCurrentGroupData({ ...groupData }); // 강제 렌더 유도
  };

  // ⭐ 데이터가 오기 전에는 Before가 먼저 렌더되도록 설정
  if (!currentGroupData) {
    return (
      <div css={mobileWrapper}>
        <Header />
        <Before onGroupData={handleGroupData} />
        {/* 로딩 메시지는 잠깐만 보여짐 */}
        <p style={{ textAlign: "center", marginTop: "20px" }}>로딩 중...</p>
      </div>
    );
  }

  // 최신 메시지 여부 판단
  const hasMessage = Boolean(currentGroupData.latestMessage);

  return (
    <div css={mobileWrapper}>
      <Header />

      {/* 그룹 선택 컴포넌트 */}
      <Before onGroupData={handleGroupData} />

      {/* 하단 메시지 표시 영역 */}
      <div css={bottomWrapper}>
        <p css={bottomLabel}>칭찬메세지</p>

        <div css={messageContainer}>
          <img
            src={hasMessage ? MessageYes : MessageNo}
            alt={hasMessage ? "Has messages" : "No messages"}
            css={messageImage}
          />

          <p css={centerText}>
            {hasMessage
              ? currentGroupData.latestMessage
              : "아직 칭찬을 안받았어요"}
          </p>
        </div>
      </div>
    </div>
  );
}
