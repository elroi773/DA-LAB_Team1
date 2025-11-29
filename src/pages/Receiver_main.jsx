/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
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

  // Before 컴포넌트에서 현재 그룹 데이터를 받아옴
  const handleGroupData = (groupData) => {
    setCurrentGroupData(groupData);
  };

  const hasMessage = currentGroupData?.latestMessage;

  return (
    <div css={mobileWrapper}>
      <Header />

      <Before onGroupData={handleGroupData} />

      <div css={bottomWrapper}>
        <p css={bottomLabel}>칭찬메세지</p>

        <div css={messageContainer}>
          <img
            src={hasMessage ? MessageYes : MessageNo}
            alt={hasMessage ? "Has messages" : "No messages"}
            css={messageImage}
          />

          <p css={centerText}>
            {hasMessage ? currentGroupData.latestMessage : "아직 칭찬을 안받았어요"}
          </p>
        </div>
      </div>
    </div>
  );
}
