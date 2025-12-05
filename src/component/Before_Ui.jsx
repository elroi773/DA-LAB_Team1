/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clover_img from "../assets/Before.svg";
import RightBtn from "../assets/rightbtn.svg";
import LeftBtn from "../assets/leftbtn.svg";
import Stamp1 from "../assets/stamp1.svg";
import Stamp2 from "../assets/stamp2.svg";
import Stamp3 from "../assets/stamp3.svg";
import Stamp4 from "../assets/stamp4.svg";
import { getCloverBook } from "../api/clover_join.jsx";
import { getStoredUserId } from "../api/Users.jsx";
import { supabase } from "../api/supabaseClient.js";

// 칭찬 횟수에 따른 stamp 이미지 매핑 (1~3개: stamp1~3, 4개 완성)
const stampImages = {
  0: null,
  1: Stamp1,
  2: Stamp2,
  3: Stamp3,
};

// 칭찬 횟수에 따라 적절한 stamp 이미지 반환
function getStampImage(cloverCount) {
  // 4개마다 완성되므로 나머지로 현재 진행 상태 계산
  const currentProgress = cloverCount % 4;
  return stampImages[currentProgress];
}

// 가장 최근 메시지 가져오기
function getLatestMessage(clovers) {
  if (!clovers || clovers.length === 0) return null;

  // created_at이 존재하면 created_at 기준 정렬
  if (clovers[0]?.created_at) {
    const sorted = [...clovers].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return sorted[0]?.message || null;
  }

  // created_at이 없으면 "마지막에 들어온 데이터가 최신"
  return clovers[clovers.length - 1]?.message || null;
}

export default function Before({ onGroupData }) {
  const [groups, setGroups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGroups() {
      const userId = getStoredUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      // 1. 유저가 가입한 그룹 목록 가져오기
      const { data: memberData, error: memberError } = await supabase
        .from("group_members")
        .select("group_id, groups(id, group_name)")
        .eq("user_id", userId);

      if (memberError) {
        console.error("그룹 조회 실패:", memberError);
        setLoading(false);
        return;
      }

      // 2. 클로버(칭찬) 데이터 가져오기
      const cloverData = await getCloverBook(userId);
      // 3. 그룹 목록과 클로버 데이터 병합

      const groupList = memberData
        .filter((item) => item.groups)
        .map((item) => {
          const groupId = item.groups.id; // ❗ UUID이므로 string 유지해야 함

          // UUID끼리 문자열로 비교해야 함
          const cloverInfo = cloverData.find((c) => c.groupId === groupId) || {
            totalCount: 0,
            completedClovers: 0,
            clovers: [],
          };

          return {
            id: groupId,
            name: item.groups.group_name,
            totalCount: cloverInfo.totalCount,
            completedClovers: cloverInfo.completedClovers,
            clovers: cloverInfo.clovers,
            stampImage: getStampImage(cloverInfo.totalCount),
            latestMessage: getLatestMessage(cloverInfo.clovers),
          };
        });

      setGroups(groupList);
      setLoading(false);
    }

    fetchGroups();
  }, []);

  // 현재 그룹 정보를 부모에게 전달
  useEffect(() => {
    if (groups.length > 0) {
      onGroupData?.(groups[currentIndex]);
    }
  }, [currentIndex, groups]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? groups.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === groups.length - 1 ? 0 : prev + 1));
  };

  // 클로버 박스 클릭 시 LookBook으로 이동
  const goToLookBook = () => {
    if (groups.length > 0) {
      const currentGroup = groups[currentIndex];
      navigate("/look-book", {
        state: { groupId: currentGroup.id, groupName: currentGroup.name },
      });
    }
  };

  if (loading) {
    return (
      <div css={mobileWrapper}>
        <div css={headerArea}></div>
        <div css={centerArea}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 가입된 그룹이 없을 때
  if (groups.length === 0) {
    return (
      <div css={mobileWrapper}>
        <div css={headerArea}></div>
        <div css={centerArea}>
          <div css={box}>
            <img src={clover_img} alt="clover" css={image} />
            <p css={text}>아직 참여한 그룹이 없어요!</p>
          </div>
        </div>
      </div>
    );
  }

  // 가입된 그룹이 있을 때
  const currentGroup = groups[currentIndex];
  const hasClover = currentGroup.totalCount > 0;

  return (
    <div css={mobileWrapper}>
      <div css={headerArea}></div>
      <div css={centerArea}>
        <div css={contentWrapper}>
          {/* 왼쪽 화살표 */}
          {groups.length > 1 && (
            <img src={LeftBtn} alt="이전" css={arrowBtn} onClick={handlePrev} />
          )}

          <div css={boxWithTitle}>
            <p css={groupTitle}>{currentGroup.name}</p>
            <div css={box} onClick={goToLookBook}>
              {hasClover && currentGroup.stampImage ? (
                <>
                  <img
                    src={currentGroup.stampImage}
                    alt="stamp"
                    css={stampImage}
                  />
                  {currentGroup.completedClovers > 0 && (
                    <p css={completedText}>
                      완성 클로버: {currentGroup.completedClovers}개
                    </p>
                  )}
                </>
              ) : (
                <>
                  <img src={clover_img} alt="clover" css={image} />
                  <p css={text}>아직 칭찬을 안 받았어요</p>
                </>
              )}
            </div>
          </div>

          {/* 오른쪽 화살표 */}
          {groups.length > 1 && (
            <img
              src={RightBtn}
              alt="다음"
              css={arrowBtn}
              onClick={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const mobileWrapper = css`
  width: 100vw;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* 상단 아이콘 영역 높이를 조절하고 싶으면 여기를 조절 */
const headerArea = css`
  height: 80px;
  flex-shrink: 0;
`;

/* 실제로 가운데 정렬을 맡는 영역 */
const centerArea = css`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const box = css`
  width: 274px;
  height: 289px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.3);
  }
`;

const image = css`
  width: 128px;
  height: 128px;
  object-fit: contain;
  margin-bottom: 16px;
`;

const stampImage = css`
  width: 180px;
  height: 180px;
  object-fit: contain;
`;

const text = css`
  font-size: 14px;
  color: #444;
  text-align: center;
`;

const completedText = css`
  font-size: 12px;
  color: #78a366;
  margin-top: 8px;
  font-weight: 600;
`;

const contentWrapper = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const boxWithTitle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const groupTitle = css`
  font-size: 18px;
  font-weight: 700;
  color: #304125;
  margin-bottom: 16px;
  text-align: center;
`;

const arrowBtn = css`
  width: 32px;
  height: 32px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;
