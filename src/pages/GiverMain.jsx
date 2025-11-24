/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { GetMyGroups } from "../api/GetMyGroups";
import Header from "../component/Giver_Header";
import GroupList from "../component/GroupList";
import { supabase } from "../api/Users";

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

const contentWrapper = css`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const title = css`
  margin-top: 113px;
  color: #304125;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
`;

const nullWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const svgStyle = css`
  margin-top: 26px;
`;

const nullText = css`
  margin-top: 26px;
  color: #000;
  font-size: 15px;
  font-weight: 700;
`;

const notNullWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const groupListWrapper = css`
  margin-top: 63px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export default function GiverMain() {
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인 유저 가져오기
  useEffect(() => {
    const init = async () => {
      // 현재 세션 확인
      const { data: session } = await supabase.auth.getSession();
      const uid = session?.session?.user?.id;

      setUserId(uid);

      // uid가 있을 때만 그룹 불러오기
      if (uid) {
        const result = await GetMyGroups(uid);
        if (result.success) {
          setGroups(result.groups);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const hasGroup = groups.length > 0;

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  return (
    <div css={mobileWrapper}>
      <Header />

      <div css={contentWrapper}>
        {loading ? (
          <div css={nullWrapper}>
            <h1 css={title}>오늘은 어떤 그룹을 관리할까요?</h1>
            <p css={nullText}>불러오는 중...</p>
          </div>
        ) : hasGroup ? (
          <div css={notNullWrapper}>
            <h1 css={title}>오늘은 어떤 그룹을 관리할까요?</h1>

            <div css={groupListWrapper}>
              {groups.map((g) => (
                <GroupList
                  key={g.id}
                  groupId={g.id}
                  groupName={g.group_name}
                  onDelete={handleDeleteGroup}
                />
              ))}
            </div>
          </div>
        ) : (
          <div css={nullWrapper}>
            <h1 css={title}>오늘은 어떤 그룹을 관리할까요?</h1>

            {/* SVG 생략… */}
            <p css={nullText}>
              {userId ? "아직 만든 그룹이 없어요!" : "로그인이 필요해요!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
