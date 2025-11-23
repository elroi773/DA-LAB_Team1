/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

import Clover from "../assets/clover_icon_list.png";
import { Delete_Popup } from "./Delete_Popup";
import { Give_Clover_Popup } from "./Give_Clover_Popup";

const itemWrapper = css`
  width: 354px;
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

export default function MemberList({ name, clovers }) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showGivePopup, setShowGivePopup] = useState(false);

  return (
    <>
      <div css={itemWrapper}>
        <div css={leftBox}>
          <img src={Clover} alt="clover icon" />
          <span>
            {name} - {clovers}개
          </span>
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

      {showDeletePopup && (
        <Delete_Popup
          name={name}
          onConfirm={() => setShowDeletePopup(false)}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}

      {showGivePopup && (
        <Give_Clover_Popup
          name={name}
          onConfirm={() => setShowGivePopup(false)}
          onCancel={() => setShowGivePopup(false)}
        />
      )}
    </>
  );
}
