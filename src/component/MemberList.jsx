/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

import Clover from "../assets/clover_icon_list.png";
import { Delete_Popup } from "./Delete_Popup";
import { Give_Clover_Popup } from "./Give_Clover_Popup";

// API
import { DeleteMember } from "../api/group";
import { giveClover } from "../api/Hearts";

/* ───────────── CSS ───────────── */
const itemWrapper = css`
  width: 314px;
  height: 89px;
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
    background: white;
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
  gap: 18px;
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

/* ───────────── COMPONENT ───────────── */
export default function MemberList({
  groupId,
  groupName,
  userId,
  name,
  clovers,
  onRefresh,   // ⭐ 삭제/칭찬 후 부모 컴포넌트 refresh
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showGivePopup, setShowGivePopup] = useState(false);

  /* ───────────────── 삭제 처리 ───────────────── */
  const handleDelete = async () => {
    const res = await DeleteMember(groupId, userId);

    if (res.success) {
      alert("삭제되었습니다.");
      setShowDeletePopup(false);
      onRefresh(); // ⭐ 부모 컴포넌트 새로고침
    } else {
      alert("삭제 실패: " + res.message);
    }
  };

  /* ───────────────── 칭찬 처리 ───────────────── */
  const handleGiveClover = async (count, message) => {
    const res = await giveClover(groupId, userId, count, message);
    if (res.success) {
      alert("칭찬이 전송되었습니다!");
      setShowGivePopup(false);
      onRefresh();
    } else {
      alert("칭찬 실패!");
    }
  };

  return (
    <>
      <div css={itemWrapper}>
        <div css={leftBox}>
          <img src={Clover} alt="clover icon" />
          <span>{name}</span>
        </div>

        <div css={rightBox}>
          <button css={greenbtn} onClick={() => setShowGivePopup(true)}>
            칭찬주기
          </button>
          <button css={redbtn} onClick={() => setShowDeletePopup(true)}>
            삭제
          </button>
        </div>
      </div>

      {/* 삭제 팝업 */}
      {showDeletePopup && (
        <Delete_Popup
          name={name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}

      {/* 칭찬 팝업 */}
      {showGivePopup && (
        <Give_Clover_Popup
          name={name}
          onConfirm={handleGiveClover}   // count, message 전달됨
          onCancel={() => setShowGivePopup(false)}
        />
      )}
    </>
  );
}
