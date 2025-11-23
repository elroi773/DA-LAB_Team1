/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

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

const inputRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const inputStyle = css`
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333333;

  ::placeholder {
    color: #c7c7c7;
  }

  &:focus {
    outline: none;
    border-color: #aacd93;
    box-shadow: 0 0 0 2px rgba(170, 205, 147, 0.3);
  }
`;

const confirmBtn = css`
  width: 72px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #8fb96c;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background: #c9dcc0;
    cursor: default;
  }
`;

export const Give_Clover_Popup = ({ name, onConfirm, onCancel }) => {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onConfirm?.(1, trimmed); // ✅ 무조건 1개만 전송
    setMessage("");
  };

  return (
    <div css={overlay} onClick={onCancel}>
      <div css={container} onClick={(e) => e.stopPropagation()}>
        <p css={title}>{name}님에게 칭찬</p>

        <div css={inputRow}>
          <input
            css={inputStyle}
            type="text"
            placeholder="칭찬메세지 입력"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            css={confirmBtn}
            onClick={handleConfirm}
            disabled={!message.trim()}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
