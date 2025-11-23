// src/App.jsx
import { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import ReceiverMain from "./pages/Receiver_main";
import SpaceMain from "./pages/SpaceMain";
import LookBook from "./pages/LookBook";
import GroupCreate from "./pages/GroupCreate";
import GiverMain from "./pages/GiverMain";
import Intro from "./pages/Intro";
import GroupStatistics from "./pages/GroupStatistics.jsx";
import Receiver_Group from "./pages/Receiver_Group.jsx";

//Supabase 클라이언트
import { supabase } from "./api/supabaseClient.js";
//네가 만든 localStorage 세션 getter
import { getStoredSession } from "./api/Users.jsx";

function App() {
  //  앱 시작할 때 localStorage 세션을 Supabase에 주입
  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const s = getStoredSession(); // { access_token, refresh_token, ... } 형태

        if (s?.access_token && s?.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: s.access_token,
            refresh_token: s.refresh_token,
          });

          if (error) {
            console.error("세션 주입(setSession) 실패:", error);
          } else {
            // 디버그용
            const { data } = await supabase.auth.getSession();
            console.log(" hydrated session:", data.session);
          }
        } else {
          // 저장된 세션이 없는 경우 (처음 방문 / 로그아웃 상태)
          // console.log("저장된 세션 없음");
        }
      } catch (err) {
        console.error("세션 주입 중 예외:", err);
      }
    };

    hydrateSession();

    //토큰 자동 갱신/로그인 상태 변화를 localStorage에도 동기화
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          localStorage.setItem("sb_session", JSON.stringify(session));
          localStorage.setItem("user_id", session.user.id);
        } else {
          localStorage.removeItem("sb_session");
          localStorage.removeItem("user_id");
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/receiver-main" element={<ReceiverMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<SpaceMain />} />
        <Route path="/look-book" element={<LookBook />} />
        <Route path="/groupcreate" element={<GroupCreate />} />
        <Route path="/giver-main" element={<GiverMain />} />
        <Route path="/groupstatistics" element={<GroupStatistics />} />
        <Route path="/receiver_Group" element={<Receiver_Group />} />
      </Routes>
    </>
  );
}

export default App;
