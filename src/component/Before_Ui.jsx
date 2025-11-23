/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import clover_img from "../assets/Before.svg";
import RightBtn from "../assets/rightbtn.svg";
import LeftBtn from "../assets/leftbtn.svg";
import { getCloverBook } from "../api/clover_join.jsx";
import { getStoredUserId } from "../api/Users.jsx";
import { supabase } from "../api/supabaseClient.js";

export default function Before() {
  const [groups, setGroups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      const userId = getStoredUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      // 유저가 가입한 그룹 목록 가져오기
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id, groups(id, group_name)")
        .eq("user_id", userId);

      if (error) {
        console.error("그룹 조회 실패:", error);
        setLoading(false);
        return;
      }

      const groupList = data
        .filter((item) => item.groups)
        .map((item) => ({
          id: item.groups.id,
          name: item.groups.group_name,
        }));

      setGroups(groupList);
      setLoading(false);
    }

    fetchGroups();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? groups.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === groups.length - 1 ? 0 : prev + 1));
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
            <div css={box}>
              <img src={clover_img} alt="clover" css={image} />
              <p css={text}>아직 칭찬을 안 받았어요</p>
            </div>
          </div>

          {/* 오른쪽 화살표 */}
          {groups.length > 1 && (
            <img src={RightBtn} alt="다음" css={arrowBtn} onClick={handleNext} />
          )}
        </div>
      </div>
    </div>
  );
}

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
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
  margin-bottom: 200px;
`;

const image = css`
  width: 128px;
  height: 128px;
  object-fit: contain;
  margin-bottom: 16px;
`;

const text = css`
  font-size: 14px;
  color: #444;
  text-align: center;
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
  margin-bottom: 170px;

  &:hover {
    opacity: 1;
  }
`;