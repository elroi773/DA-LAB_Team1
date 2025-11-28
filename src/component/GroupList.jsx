/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Clover from "../assets/clover_icon_list.png";
import { Delete_Popup } from "./Delete_Popup";
import { deleteSpace } from "../api/space";

const itemWrapper = css`
  width: 320px;
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

export default function GroupList({ groupId, groupName, onDelete }) {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const goToGiverStatistics = () => {
    navigate("/groupstatistics", { state: { groupId, groupName } });
  };

  const openDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    const result = await deleteSpace(groupId);
    if (result.success) {
      setShowDeletePopup(false);
      if (onDelete) {
        onDelete(groupId);
      }
    } else {
      console.error("그룹 삭제 실패:", result.error);
      alert("그룹 삭제에 실패했습니다.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
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
          type="group"
        />
      )}
    </>
  );
}
