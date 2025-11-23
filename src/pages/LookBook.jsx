/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../component/Giver_Header.jsx";
import Clover from "../assets/clover_complete.png";
import { getCloverBook } from "../api/clover_join.jsx";
import { getStoredUserId } from "../api/Users.jsx";

const CARDS_PER_PAGE = 4;

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;
`;

const container = css`
  position: relative; /* 화살표 버튼 위치 기준 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

const h1Style = css`
  color: #000;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 32px;
`;

const grid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const card = css`
  width: 130px;
  height: 170px;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const cloverImg = css`
  width: 70px;
  height: auto;
`;

const arrowButton = css`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
`;

export default function LookBook() {
  const [page, setPage] = useState(0);
  const [cloverCount, setCloverCount] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClovers() {
      const userId = getStoredUserId();
      if (!userId) {
        navigate("/login");
        return;
      }

      const cloverData = await getCloverBook(userId);

      // location.state에서 특정 그룹 정보가 있으면 해당 그룹만 표시
      const { groupId, groupName: passedGroupName } = location.state || {};

      if (groupId) {
        // 특정 그룹의 완성된 클로버 표시
        const targetGroup = cloverData.find((g) => g.groupId === groupId);
        if (targetGroup) {
          setCloverCount(targetGroup.completedClovers);
          setGroupName(passedGroupName || targetGroup.groupName);
        } else {
          setCloverCount(0);
          setGroupName(passedGroupName || "알 수 없음");
        }
      } else {
        // 전체 완성된 클로버 합계 표시
        const totalCompleted = cloverData.reduce((sum, g) => sum + g.completedClovers, 0);
        setCloverCount(totalCompleted);
        setGroupName("전체 클로버");
      }

      setLoading(false);
    }

    fetchClovers();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div css={mobileWrapper}>
        <Header />
        <div css={container}>로딩 중...</div>
      </div>
    );
  }

  const totalPages = Math.ceil(cloverCount / CARDS_PER_PAGE) || 1;

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  // 전체 클로버를 하나의 배열
  const allClovers = Array.from({ length: cloverCount }, (_, index) => index);

  // 현재 페이지에서 보여줄 범위를 계산
  const first = page * CARDS_PER_PAGE;
  const last = first + CARDS_PER_PAGE;

  // 실제 보여줄 클로버 4개만 잘라냄
  const currentPageClovers = allClovers.slice(first, last);

  return (
    <div css={mobileWrapper}>
      <Header />
      <br />
      <div css={container}>
        <h1 css={h1Style}>{groupName}</h1>

        {cloverCount === 0 ? (
          <p>아직 완성된 클로버가 없어요</p>
        ) : (
          <div css={grid}>
            {currentPageClovers.map((idx) => (
              <div key={idx} css={card}>
                <img src={Clover} alt="클로버" css={cloverImg} />
              </div>
            ))}
          </div>
        )}

        {/* 클로버가 4개 초과일 때만 화살표 보이게 */}
        {totalPages > 1 && cloverCount > CARDS_PER_PAGE && (
          <button type="button" css={arrowButton} onClick={handleNext}>
            ›
          </button>
        )}
      </div>
    </div>
  );
}
