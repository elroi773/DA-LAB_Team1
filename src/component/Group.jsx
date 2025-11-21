import React, { useState } from "react";
import "./Group.css";
import Left from "../assets/leftbtn.svg";
import Right from "../assets/rightbtn.svg";
import Stamp1 from "../assets/stamp1.svg";
import Stamp2 from "../assets/stamp2.svg";
import MsgNo from "../assets/message_no.svg";
import MsgYes from "../assets/message_yes.svg";
import Before from "../assets/Before.svg";

const groups = [
  // 더미데이터
  {
    id: "group-1",
    name: "1조",
    imageUrl: Stamp1,
    praiseMessage: "오늘 정말 멋진 협동심을 보여줬어요!",
  },
  {
    id: "group-2",
    name: "2조",
    imageUrl: null,
    praiseMessage: null,
  },
  {
    id: "group-3",
    name: "3조",
    imageUrl: Stamp2,
    praiseMessage: "과제 수행 속도가 아주 빨라요!",
  },
  {
    id: "group-4",
    name: "4조",
    imageUrl: null,
    praiseMessage: "조용하지만 강한 팀워크가 인상적이었습니다.",
  },
];

export default function Group() {
  const [index, setIndex] = useState(0);

  const current = groups[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? groups.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === groups.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="wrapper">
        <img src={Left} onClick={handlePrev} className="left" />
        <div className="content">
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
