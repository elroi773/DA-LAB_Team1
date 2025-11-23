/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../component/Group.css";
import Left from "../assets/leftbtn.svg";
import Right from "../assets/rightbtn.svg";
import Stamp1 from "../assets/stamp1.svg";
import Stamp2 from "../assets/stamp2.svg";
import Stamp3 from "../assets/stamp3.svg";
import Stamp4 from "../assets/stamp4.svg";
import MsgNo from "../assets/message_no.svg";
import MsgYes from "../assets/message_yes.svg";
import Before from "../assets/Before.svg";
import { getCloverBook } from "../api/clover_join.jsx";
import { getStoredUserId } from "../api/Users.jsx";

// 칭찬 횟수에 따른 stamp 이미지 매핑 (1~3개: stamp1~3, 4개 완성 후 리셋)
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
  // created_at 기준으로 가장 최근 클로버의 메시지 반환
  const sorted = [...clovers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return sorted[0]?.message || null;
}

export default function Group() {
  const [index, setIndex] = useState(0);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGroups() {
      const userId = getStoredUserId();
      if (!userId) {
        navigate("/login");
        return;
      }

      const cloverData = await getCloverBook(userId);

      // 데이터를 UI에 맞게 변환
      const transformedGroups = cloverData.map((group) => ({
        id: group.groupId,
        name: group.groupName,
        imageUrl: getStampImage(group.totalCount),
        praiseMessage: getLatestMessage(group.clovers),
        totalCount: group.totalCount,
        completedClovers: group.completedClovers,
      }));

      setGroups(transformedGroups);
      setLoading(false);
    }

    fetchGroups();
  }, [navigate]);

  if (loading) {
    return <div className="wrapper">로딩 중...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="wrapper">
        <div className="content">
          <p className="group_title">아직 가입된 그룹이 없어요</p>
        </div>
      </div>
    );
  }

  const current = groups[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? groups.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === groups.length - 1 ? 0 : prev + 1));
  };
  const goToLookbook = () => {
    navigate("/look-book", { state: { groupId: current.id, groupName: current.name } });
  };

  return (
    <>
      <div className="wrapper">
        <img src={Left} onClick={handlePrev} className="left" />
        <div className="content" onClick={goToLookbook}>
          <p className="group_title">{current.name}</p>

          {current.imageUrl ? (
            <div className="box">
              <div className="boxmain">
                <img src={current.imageUrl} className="cloverimg" />
              </div>
            </div>
          ) : (
            <div className="box">
              <div className="boxmain">
                <img src={Before} className="beforimg" />
                <p className="text">아직 도장을 안 받았어요</p>
              </div>
            </div>
          )}
        </div>
        <div className="msg-wrapper">
          {" "}
          <p className="msgtitle">칭찬메세지</p>{" "}
          <div className="msg-choice">
            {" "}
            {current.praiseMessage ? (
              <img src={MsgYes} alt="yes" className="msg-icon" />
            ) : (
              <img src={MsgNo} alt="no" className="msg-icon" />
            )}{" "}
            <p className="msg-text">
              {" "}
              {current.praiseMessage ?? "아직 칭찬을 안받았어요"}{" "}
            </p>{" "}
          </div>{" "}
        </div>
        <img src={Right} onClick={handleNext} className="right" />
      </div>
    </>
  );
}
