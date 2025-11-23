/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/Giver_Header";
import GroupCreateLogo from "../assets/group_clover.png";

// ✅ Space API import (경로는 프로젝트 구조에 맞게 조정)
import { Space } from "../api/space.jsx";
// ✅ supabase client (세션 확인용)
import { supabase } from "../api/supabaseClient.js";

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const logoWrapper = css`
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const logoImg = css`
  width: 160px;
`;

const formWrapper = css`
  margin-top: 40px;
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & h1 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  & input {
    width: 92%;
    height: 48px;
    border: 1px solid #cfcfcf;
    border-radius: 10px;
    padding: 0 12px;
    margin-bottom: 30px;
    font-size: 16px;
  }
`;

const codeCreateRow = css`
  width: 100%;
  display: flex;
  gap: 12px;

  & input {
    flex: 1;
    margin-bottom: 0;
  }

  & button {
    width: 105px;
    border-radius: 10px;
    background: #78a366;
    color: #fff;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  & button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const submitBtn = css`
  margin-top: 50px;
  width: 100%;
  height: 58px;
  border-radius: 12px;
  background: #78a366;
  color: #fff;
  font-size: 18px;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const messageStyle = css`
  width: 85%;
  margin-top: 12px;
  font-size: 14px;
  color: #e74c3c;
`;

const successStyle = css`
  width: 85%;
  margin-top: 12px;
  font-size: 14px;
  color: #2ecc71;
`;

export default function GroupCreate() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [previewCode, setPreviewCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ 현재 로그인 유저 세션 상태
  const [user, setUser] = useState(null);

  // ✅ 페이지 들어오면 세션 확인
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("세션 불러오기 실패:", error);
        setUser(null);
        setErrorMsg("세션 정보를 불러오지 못했습니다. 다시 로그인해주세요.");
        return;
      }

      const sessionUser = data?.session?.user ?? null;
      setUser(sessionUser);

      if (!sessionUser) {
        setErrorMsg("로그인이 필요합니다. 먼저 로그인해주세요.");
      }
    };

    loadSession();

    // (선택) 로그인/로그아웃 실시간 반영
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setErrorMsg("로그인이 필요합니다. 먼저 로그인해주세요.");
        } else {
          setErrorMsg("");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // UX: 미리 코드 생성
  const handleGenerateCodePreview = () => {
    let code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPreviewCode(code);
  };

  // 그룹 생성
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const creatorId = localStorage.getItem("user_id"); // 너가 쓰는 키로 수정 가능

    if (!creatorId) {
      setErrorMsg("로그인이 필요합니다. user_id가 없습니다.");
      return;
    }

    if (!groupName.trim()) {
      setErrorMsg("그룹 이름을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await Space(creatorId, groupName.trim());

      if (!res.success) {
        console.error(res.error);
        setErrorMsg("그룹 생성에 실패했습니다.");
        return;
      }

      // 성공
      setSuccessMsg(
        `그룹 생성 완료! 참여코드: ${res.group.code}`
      );

      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (err) {
      console.error(err);
      setErrorMsg("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={mobileWrapper}>
      <Header />

      <div css={logoWrapper}>
        <img src={GroupCreateLogo} alt="group create logo" css={logoImg} />
      </div>

      <form css={formWrapper} onSubmit={handleSubmit}>
        <h1>그룹 이름</h1>
        <input
          type="text"
          placeholder="그룹 이름 입력"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <h1>코드 생성</h1>
        <div css={codeCreateRow}>
          <input type="text" placeholder="코드 생성" value={previewCode} readOnly />
          <button
            type="button"
            onClick={handleGenerateCodePreview}
            disabled={loading}
          >
            코드 생성
          </button>
        </div>

        <button css={submitBtn} type="submit" disabled={loading}>
          {loading ? "생성중..." : "생성하기"}
        </button>
      </form>

      {errorMsg && <p css={messageStyle}>{errorMsg}</p>}
      {successMsg && <p css={successStyle}>{successMsg}</p>}
    </div>
  );
}
