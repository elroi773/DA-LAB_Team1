/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import No_777 from "../assets/No_777.svg";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const mobileWrapper = css`
  width: 100vw;
  min-height: 100vh; 
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;
  text-align: center;
`;

const group1 = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const group2 = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 73.02px;
`;

const groupBtn = css`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  background: #80a867;
  width: 354px;
  height: 60px;
  font-size: 15px;
  color: #ffffff;
  border: none;
  cursor: pointer;
  margin-bottom: 11px;
`;

const img1 = css`
  margin: auto;
  display: block;
  margin-top: 200px;
`;

const img2 = css`
  margin: auto;
  display: block;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const extra = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const eText2 = css`
  color: #565656;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
`;

export default function SpaceMain() {
  const navigate = useNavigate();

  const goToReceiverMain = () => {
    navigate("/receiver-main");
  };

  const goToGiverMain = () => {
    navigate("/giver-main");
  };

  return (
    <>
      <div css={mobileWrapper}>
        <div css={group1}>
          <img src={No_777} alt="No.777" css={img1} />
          <img src={logo} alt="logo" css={img2} />
        </div>

        <div css={group2}>
          <button css={groupBtn} onClick={goToGiverMain}>
            그룹 생성하기
          </button>
          <button onClick={goToReceiverMain} css={groupBtn}>
            그룹 입장하기
          </button>
        </div>

        <div css={extra}>
          <p css={eText2}>로그아웃</p>
        </div>
      </div>
    </>
  );
}
