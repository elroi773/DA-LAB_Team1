/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useLocation } from "react-router-dom";

const overlay = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const container = css`
  width: 342px;
  padding: 20px 24px 16px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const title = css`
  font-size: 14px;
  font-weight: 600;
  color: #b3b3b3;
  margin-bottom: 12px;
`;

const message = css`
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20px;
`;

const buttonRow = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const deleteBtn = css`
  min-width: 72px;
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  border: none;
  background: #f68268;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const cancelBtn = css`
  min-width: 72px;
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  border: none;
  background: #e0e0e0;
  color: #888888;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const Delete_Popup = ({ name, onConfirm, onCancel, type }) => {
  const location = useLocation();

  // 문구 변경
  let deleteText;
  if (type === "group") {
    deleteText = `${name} 그룹을 정말 삭제하시겠습니까?`;
  } else if (type === "member") {
    deleteText = `리스트에서 "${name}"를 삭제하시겠습니까?`;
  } else if (location.pathname === "/") {
    deleteText = `그룹에서 "${name}"를 삭제하시겠습니까?`;
  } else {
    deleteText = `그룹에서 "${name}"님을 삭제하시겠습니까?`;
  }

  return (
    <div css={overlay}>
      <div css={container}>
        <p css={title}>삭제</p>
        <p css={message}>{deleteText}</p>

        <div css={buttonRow}>
          <button css={deleteBtn} onClick={onConfirm}>
            삭제
          </button>
          <button css={cancelBtn} onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
