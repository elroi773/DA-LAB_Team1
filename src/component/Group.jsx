import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { giveClover } from "../api/Hearts";

import "./Group.css";

import Left from "../assets/leftbtn.svg";
import Right from "../assets/rightbtn.svg";

import Stamp1 from "../assets/stamp1.svg";
import Stamp2 from "../assets/stamp2.svg";
import Stamp3 from "../assets/stamp3.svg";
import Stamp4 from "../assets/stamp4.svg";

import MsgNo from "../assets/message_no.svg";
import MsgYes from "../assets/message_yes.svg";
import Before from "../assets/Before.svg";

export default function Group() {
  const { groupId } = useParams(); // URL에서 그룹 ID 읽기
  const [clover, setClover] = useState(null); // 최신 스탬프 데이터
  const [loading, setLoading] = useState(true);

  // 스탬프 이미지 매핑
  const stamps = {
    1: Stamp1,
    2: Stamp2,
    3: Stamp3,
    4: Stamp4,
  };

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1) 현재 로그인한 유저 정보 가져오기
      const { data: userData } = await giveClover.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        console.log("로그인 필요");
        setLoading(false);
        return;
      }

      // 2) 클로버 정보 가져오기
      const { data, error } = await giveClover
        .from("clovers")
        .select("*")
        .eq("groupId", groupId)
        .eq("receiver_Id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.log("클로버 조회 오류:", error);
      }

      setClover(data); // 최신 clover row
      setLoading(false);
    }

    load();
  }, [groupId]);

  if (loading) return <div>불러오는 중...</div>;

  // clover가 없으면 도장 데이터 없음
  const hasStamp = !!clover;
  const stampImg = clover ? stamps[clover.clover_count] : null;
  const praiseMessage = clover?.message;

  return (
    <div className="container">
      <div className="section">
        <img src={Left} className="left" />

        <div className="card">
          <p className="group_name"> 그룹 {groupId} </p>

          {hasStamp ? (
            <div className="stamp-box">
              <img src={stampImg} className="stamp-img" alt="도장" />
            </div>
          ) : (
            <div className="stamp-box">
              <img src={Before} className="before-img" alt="빈 도장" />
              <p className="empty-text">아직 도장을 안 받았어요</p>
            </div>
          )}
        </div>

        <img src={Right} className="right" />
      </div>

      {/* 칭찬 메시지 영역 */}
      <div className="praise-section">
        <div className="praise-header">
          <span>칭찬메세지</span>
        </div>

        <div className="praise-box">
          {hasStamp ? (
            <img src={MsgYes} alt="메시지 있음" className="praise-bg" />
          ) : (
            <img src={MsgNo} alt="메시지 없음" className="praise-bg" />
          )}

          <p className="praise-text">
            {praiseMessage || "아직 칭찬을 안받았어요"}
          </p>
        </div>
      </div>
    </div>
  );
}
