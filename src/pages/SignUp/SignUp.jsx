/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { checkNickname, signUpUser } from "../../api/Users";

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;
`;

const title = css`
  font-size: 24px;
  font-weight: 500;
  padding-top: 86px;
  padding-left: 24px;
`;

const email = css`
  padding: 20px;
`;

const password = css`
  padding: 20px;
`;

const password2 = css`
  font-size: 15px;
`;

const password_check = css`
  padding: 20px;
`;

const extra = css`
  display: flex;
  flex-direction: row;
`;

const signUpBtn = css`
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
`;

const eText1 = css`
  color: #989898;
  font-size: 12px;
  bottom: 40px;
  margin-left: 20px;
`;

const eText2 = css`
  font-size: 14px;
  color: #989898;
  margin-left: 145px;
  text-decoration: underline;
  cursor: pointer;
`;

const sgupBtn = css`
  width: 100%;
  height: 40px;
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

const nickName = css`
  padding: 20px;
`;

const input_nick = css`
  width: 197px;
  height: 50px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
`;

const nick = css`
  font-size: 15px;
  display: block;
  margin-bottom: 8px;
`;

const duplicate_checkBtn = css`
  width: 125px;
  height: 50px;
  border-radius: 5px;
  background: #d7d7d7;
  margin-left: 30px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: #868686;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const box1 = css`
  display: flex;
`;

const msg = (color) => css`
  font-size: 12px;
  margin-top: 6px;
  color: ${color};
  margin-left: 2px;
`;

export default function SignUp() {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");

  // 입력 state
  const [nickname, setNickname] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [rePasswordValue, setRePasswordValue] = useState("");

  // 닉네임 중복확인 상태
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState("");

  // 회원가입 메시지/로딩
  const [signUpMsg, setSignUpMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isNickButtonDisabled = nickname.trim() === "";

  // 닉네임 변경 시 중복확인 다시 풀기
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setNicknameChecked(false);
    setNicknameMsg("");
  };

  // 닉네임 중복 확인 API 호출
  const handleCheckNickname = async () => {
    setNicknameMsg("");
    setSignUpMsg("");

    try {
      const res = await checkNickname(nickname.trim());
      setNicknameChecked(res.success);
      setNicknameMsg(res.message);
    } catch (err) {
      console.error(err);
      setNicknameChecked(false);
      setNicknameMsg("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignUpMsg("");

    if (!nickname.trim()) {
      setSignUpMsg("닉네임을 입력해주세요.");
      return;
    }
    if (!nicknameChecked) {
      setSignUpMsg("닉네임 중복확인을 해주세요.");
      return;
    }
    if (!emailValue.trim()) {
      setSignUpMsg("이메일을 입력해주세요.");
      return;
    }
    if (!passwordValue || !rePasswordValue) {
      setSignUpMsg("비밀번호를 입력해주세요.");
      return;
    }

    if (passwordValue.length < 6) {
        setSignUpMsg("비밀번호는 6자 이상이어야 합니다.");
        return;
      }

    try {
      setLoading(true);

      const res = await signUpUser(
        nickname.trim(),
        emailValue.trim(),
        passwordValue,
        rePasswordValue
      );

      if (!res.success) {
        setSignUpMsg(res.message || "회원가입 실패");
        return;
      }

      setSignUpMsg("회원가입 완료! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setSignUpMsg("회원가입 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={mobileWrapper}>
      <div css={box1}>
        <p css={title}>회원가입</p>
      </div>

      {/* form submit으로 통일 */}
      <form onSubmit={handleSubmit}>
        <div css={nickName}>
          <label css={nick}>닉네임</label>
          <input
            type="text"
            name="nickName"
            className="input_nick"
            css={input_nick}
            placeholder="닉네임 입력"
            value={nickname}
            onChange={handleNicknameChange}
          />
          <button
            type="button"
            disabled={isNickButtonDisabled}
            onClick={handleCheckNickname}
            css={duplicate_checkBtn}
            style={{ color: nickname ? "#000000ff" : "#868686" }}
          >
            중복확인
          </button>

          {nicknameMsg && (
            <p css={msg(nicknameChecked ? "#2ecc71" : "#e74c3c")}>
              {nicknameMsg}
            </p>
          )}
        </div>

        <div css={email}>
          <label css={email2}>이메일</label>
          <input
            type="email"
            name="email"
            className="input_email"
            css={input_email}
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
            className="input_password"
            css={input_password}
            placeholder="비밀번호 입력"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </div>

        <div css={password_check}>
          <label css={password2}>비밀번호 재확인</label>
          <input
            type="password"
            name="repassword"
            className="input_password"
            css={input_password}
            placeholder="비밀번호 재입력"
            value={rePasswordValue}
            onChange={(e) => setRePasswordValue(e.target.value)}
          />
        </div>

        <div css={extra}>
          <p css={eText1}>이미 회원가입을 하셨다면?</p>
          <p css={eText2} onClick={goToLogin}>
            로그인하기
          </p>
        </div>

        {signUpMsg && (
          <div css={signUpBtn}>
            <p css={msg(signUpMsg.includes("완료") ? "#2ecc71" : "#e74c3c")}>
              {signUpMsg}
            </p>
          </div>
        )}

        <div css={signUpBtn}>
          <button css={sgupBtn} type="submit" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </div>
      </form>
    </div>
  );
}
