/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const container = css`
  width: 342px;
  height: 129px;
`;

export const Delete_Popup = (name) => {
  return (
    <div css={container}>
      <p>삭제</p>
      <h1>그룹에서 {name}을 삭제하시겠습니까?</h1>
      <button>삭제</button>
      <button>취소</button>
    </div>
  );
};
