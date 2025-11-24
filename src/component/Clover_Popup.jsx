/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

const overlay = css`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const popup = css`
  width: 330px;
  padding: 20px;
  background: white;
  border-radius: 12px;
`;

const title = css`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
`;

const inputBox = css`
  width: 100%;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 16px;
`;

const btnRow = css`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export function Clover_Popup({ name, onConfirm, onCancel }) {
  const [msg, setMsg] = useState("");

  return (
    <div css={overlay}>
      <div css={popup}>
        <div css={title}>{name}님에게 칭찬 메시지 보내기</div>

        <textarea
          css={inputBox}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="칭찬 메시지를 입력하세요"
        />

        <div css={btnRow}>
          <button onClick={onCancel}>취소</button>
          <button onClick={() => onConfirm(msg)}>보내기</button>
        </div>
      </div>
    </div>
  );
}
