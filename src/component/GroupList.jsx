/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Clover from "../assets/clover_icon_list.png";
import { useNavigate } from "react-router-dom";
import { Delete_Popup } from "./Delete_Popup";

const itemWrapper = css`
  width: 354px;
  height: 89px;
  flex-shrink: 0;
  padding:18px;
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
  gap: 10px;
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
`;

export default function GroupList({ groupName }) {
  const navigate = useNavigate();

  const goToGiverStatistics = () => {
    navigate("/look-book");
  };

  const remove = () => {
    
  };

  return (
    <div css={itemWrapper}>
      <div css={leftBox}>
        <img src={Clover} alt="clover icon" />
        <span>{groupName}</span>
      </div>

      <div css={rightBox}>
        <button css={greenbtn} onClick={goToGiverStatistics}>
          관리하기
        </button>
        <button css={redbtn} onClick={remove}>
          삭제
        </button>
      </div>
    </div>
  );
}
