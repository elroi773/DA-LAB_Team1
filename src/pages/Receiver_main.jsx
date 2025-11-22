import { css } from "@emotion/react";
import Header from "../component/Header";
import Before from "../component/Before_Ui";

const mobileWrapper = css`
  width: 100vw;
  height: 100vh;
  max-width: 402px;
  margin: 0 auto;
  background-color: #fff;

  display: flex;
  flex-direction: column;
`;
export default function ReceiverMain(){
    return(
        <div css={mobileWrapper}>
            <Header content=""/>

            <Before/>
        </div>
    )
}