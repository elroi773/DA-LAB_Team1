/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Clover from "../assets/clover_icon_list.png";
import { Delete_Popup } from "./Delete_Popup";

// API
import { giveClover } from "../api/Hearts";
import { DeleteMember } from "../api/group";

const itemWrapper = css`
  width: 344px;
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
  gap: 12px;
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

export default function GroupList({
  groupId,
  userId,
  groupName,
}) {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // ⭐ 가장 쉬운 방법: state 로 전달
  const goToGiverStatistics = () => {
    navigate("/groupstatistics", {
      state: {
        groupId,
        groupName
      }
    });
  };

  return (
    <>
      <div css={itemWrapper}>
        <div css={leftBox}>
          <img src={Clover} alt="clover icon" />
          <span>{groupName}</span>
        </div>

        <div css={rightBox}>
          <button css={greenbtn} onClick={goToGiverStatistics}>
            관리하기
          </button>

          <button css={redbtn} onClick={() => setShowDeletePopup(true)}>
            삭제
          </button>
        </div>
      </div>

      {showDeletePopup && (
        <Delete_Popup
          name={groupName}
          onConfirm={() => setShowDeletePopup(false)}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </>
  );
}
