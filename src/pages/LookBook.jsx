/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../component/Giver_Header.jsx";
import Clover from "../assets/clover_complete.png";
import RightBtn from "../assets/rightbtn.svg";
import LeftBtn from "../assets/leftbtn.svg";
import { getCloverBook } from "../api/clover_join.jsx";
import { getStoredUserId } from "../api/Users.jsx";

const CARDS_PER_PAGE = 4; // 2x2 그리드

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const container = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
`;

const titleStyle = css`
  color: #304125;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
`;

const contentWrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  padding: 0 20px;
`;

const grid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
`;

const card = css`
  width: 130px;
  height: 150px;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const cloverImg = css`
  width: 80px;
  height: auto;
`;

const arrowBtn = css`
  width: 36px;
  height: 36px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const arrowPlaceholder = css`
  width: 36px;
  height: 36px;
`;

const emptyCard = css`
  width: 130px;
  height: 150px;
  border-radius: 14px;
  background-color: #f5f5f5;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const pageIndicator = css`
  margin-top: 30px;
  font-size: 14px;
  color: #888;
`;

const emptyMessage = css`
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 60px;
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
        <div css={container}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(cloverCount / CARDS_PER_PAGE) || 1;

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  // 현재 페이지에서 보여줄 클로버 개수 계산
  const startIdx = page * CARDS_PER_PAGE;
  const endIdx = Math.min(startIdx + CARDS_PER_PAGE, cloverCount);
  const currentPageCloverCount = endIdx - startIdx;

  // 4칸 그리드를 채우기 위한 배열 생성
  const gridItems = [];
  for (let i = 0; i < CARDS_PER_PAGE; i++) {
    if (i < currentPageCloverCount) {
      gridItems.push({ type: "clover", key: startIdx + i });
    } else {
      gridItems.push({ type: "empty", key: `empty-${i}` });
    }
  }

  return (
    <div css={mobileWrapper}>
      <Header />

      <div css={container}>
        <h1 css={titleStyle}>{groupName}</h1>

        {cloverCount === 0 ? (
          <p css={emptyMessage}>아직 완성된 클로버가 없어요</p>
        ) : (
          <>
            <div css={contentWrapper}>
              {/* 왼쪽 버튼 - 페이지가 2개 이상일 때만 표시 */}
              {totalPages > 1 ? (
                <img
                  src={LeftBtn}
                  alt="이전"
                  css={arrowBtn}
                  onClick={handlePrev}
                />
              ) : (
                <div css={arrowPlaceholder} />
              )}

              {/* 2x2 그리드 */}
              <div css={grid}>
                {gridItems.map((item) =>
                  item.type === "clover" ? (
                    <div key={item.key} css={card}>
                      <img src={Clover} alt="완성된 클로버" css={cloverImg} />
                    </div>
                  ) : (
                    <div key={item.key} css={emptyCard} />
                  )
                )}
              </div>

              {/* 오른쪽 버튼 - 페이지가 2개 이상일 때만 표시 */}
              {totalPages > 1 ? (
                <img
                  src={RightBtn}
                  alt="다음"
                  css={arrowBtn}
                  onClick={handleNext}
                />
              ) : (
                <div css={arrowPlaceholder} />
              )}
            </div>

            {/* 페이지 표시 */}
            {totalPages > 1 && (
              <p css={pageIndicator}>
                {page + 1} / {totalPages}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
