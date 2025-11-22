/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // 지금은 안 쓰면 주석 처리해도 됨

import Clover from "../assets/clover_icon_list.png";
import { Delete_Popup } from "./Delete_Popup";
import { Give_Clover_Popup } from "./Give_Clover_Popup";

const itemWrapper = css`
  width: 354px;
  height: 89px;
  flex-shrink: 0;
  background: #f0f0f0;
  border-radius: 5px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const leftBox = css`
  display: flex;
  align-items: center;
  gap: 12px;

  & img {
    background-color: white;
    border-radius: 50%;
    width: 31px;
    height: 32px;
  }

  & span {
    font-size: 14px;
    font-weight: 600;
    color: #304125;
  }
`;

const rightBox = css`
  display: flex;
  align-items: center;
  gap: 18px; /* 버튼 사이 간격 */
`;

const greenbtn = css`
  width: 70px;
  height: 30px;
  border-radius: 5px;
  background: #aacd93;
  color: white;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const redbtn = css`
  width: 50px;
  height: 30px;
  border-radius: 5px;
  background: #f68268;
  color: white;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

export default function GroupList({ groupName }) {
  // const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showGivePopup, setShowGivePopup] = useState(false);

  // 칭찬주기 → 팝업 오픈
  const giveclover = () => {
    setShowGivePopup(true);
  };

  const openDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    console.log(`${groupName} 삭제 실행`);
    setShowDeletePopup(false);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  // 칭찬 팝업에서 확인 눌렀을 때
  const handleConfirmGive = (message, name) => {
    console.log(`${name}에게 보낸 칭찬: ${message}`);
    // TODO: 여기서 API 호출 / Supabase 저장 등 처리
    setShowGivePopup(false);
  };

  const handleCancelGive = () => {
    setShowGivePopup(false);
  };

  return (
    <>
      <div css={itemWrapper}>
        <div css={leftBox}>
          <img src={Clover} alt="clover icon" />
          <span>{groupName}</span>
        </div>

        <div css={rightBox}>
          <button css={greenbtn} onClick={giveclover}>
            칭찬주기
          </button>
          <button css={redbtn} onClick={openDeletePopup}>
            삭제
          </button>
        </div>
      </div>

      {showDeletePopup && (
        <Delete_Popup
          name={groupName}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {showGivePopup && (
        <Give_Clover_Popup
          name={groupName}
          onConfirm={handleConfirmGive}
          onCancel={handleCancelGive}
        />
      )}
    </>
  );
}
