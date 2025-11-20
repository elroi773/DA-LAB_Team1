/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Header from "../component/Giver_Header.jsx";
import Clover from "../assets/clover_complete.png";
// import { getCloverBook } from "../../api/backend_clover/src/clover_join.jsx";
// import { supabase } from "../../api/backend_clover/src/supabaseClient.js";

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;
`;

const h1Style = css`
  color: #000;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 700;
`;

const container = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const name = "리액트 스터디";

const id = "08086f46-4bf2-490c-99a2-615c953133f4";
//더미 데이터 id
export default function LookBook() {
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchUserName() {
      const { data, error } = await supabase
        .from("users")
        .select()
        // .eq("id", id)
        // .maybeSingle();

      if (error) {
        console.error("DB 조회 에러 : ", error);
      } else {
        setName(data);
      }
    }
    fetchUserName();
  }, []);

  return (
    <div css={mobileWrapper}>
      <Header />

      <div className="container" css={container}>
        <h1 css={h1Style}>{name}</h1>
        <h1>{name ? name : "로딩 중.."}</h1>
      </div>
    </div>
  );
}
