/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import No_777 from "../../assets/No_777.svg";
import No777_2 from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

import { loginUser } from "../../api/Users"; // 로그인 API import

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;
`;

const group1 = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const email = css`
  padding: 20px;
`;

const password = css`
  padding: 20px;
`;

const password2 = css`
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const extra = css`
  display: flex;
  flex-direction: row;
`;

const loginBtn = css`
  padding: 20px;
`;

const input_email = css`
  width: 100%;
  height: 40px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
`;

const input_password = css`
  width: 100%;
  height: 40px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
`;

const email2 = css`
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const eText1 = css`
  color: #989898;
  font-size: 12px;
  bottom: 40px;
  margin-left: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const eText2 = css`
  font-size: 14px;
  color: #989898;
  margin-left: 145px;
  text-decoration: underline;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
`;

const lgnBtn = css`
  width: 100%;
  background-color: #80a867;
  width: 354px;
  height: 60px;
  font-size: 15px;
  color: #ffffff;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const msg = (color) => css`
  font-size: 12px;
  margin-top: 6px;
  color: ${color};
  margin-left: 2px;
`;

export default function Login() {
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup");
  };

  //  입력 state
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // 메시지/로딩 state
  const [loginMsg, setLoginMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 로그인 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginMsg("");

    if (!emailValue.trim()) {
      setLoginMsg("이메일을 입력해주세요.");
      return;
    }
    if (!passwordValue) {
      setLoginMsg("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(emailValue.trim(), passwordValue);

      if (!res.success) {
        setLoginMsg(res.message || "로그인 실패");
        return;
      }

      setLoginMsg("로그인 성공! 메인으로 이동합니다.");
      // Users.jsx에서 이미 localStorage에 session/user_id 저장됨
      navigate("/main");
    } catch (err) {
      console.error(err);
      setLoginMsg("로그인 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={mobileWrapper}>
      <div css={group1}>
        <img src={No_777} alt="No.777" css={img1} />
        <img src={No777_2} alt="No.777_2" css={img2} />
      </div>

      {/* form onSubmit으로 통일 */}
      <form onSubmit={handleSubmit}>
        <div css={email}>
          <label css={email2}>이메일</label>
          <input
            type="email"
            name="email"
            css={input_email}
            className="input_email"
            placeholder="이메일 입력"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </div>

        <div css={password}>
          <label css={password2}>비밀번호</label>
          <input
            type="password"
            name="password"
            css={input_password}
            className="input_password"
            placeholder="비밀번호 입력"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </div>

        <div css={extra}>
          <p css={eText1}>아직 회원이 아니라면?</p>
          <p css={eText2} onClick={goToSignUp}>
            회원가입하기
          </p>
        </div>

        {loginMsg && (
          <div css={loginBtn}>
            <p css={msg(loginMsg.includes("성공") ? "#2ecc71" : "#e74c3c")}>
              {loginMsg}
            </p>
          </div>
        )}

        <div css={loginBtn}>
          <button css={lgnBtn} type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </form>
    </div>
  );
}
