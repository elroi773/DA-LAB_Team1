import Exit from "../assets/exit.svg";
import Create from "../assets/create.svg";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false); // 초기값은 안 열려있는거

  const goToMain = () => {
    navigate("/main");
  };
  const openModal = () => {
    setModal(true);
  }; // 모달 open

  const closeModal = () => {
    setModal(false);
  }; // 모달 close

  return (
    <div className="header-grid">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="26"
        viewBox="0 0 27 26"
        fill="none"
        className="exit"
        onClick={goToMain}
      >
        <path
          d="M13.3674 2.06966C14.9795 -1.14052 21.2825 -0.681588 25.2408 3.90413C29.199 8.48984 25.2408 25.0006 25.2408 25.0006H13.3674C13.3674 25.0006 11.7553 5.27983 13.3674 2.06966Z"
          fill="#304125"
        />
        <path
          d="M10.4001 10.7831C8.91581 9.40722 8.15379 6.70869 9.48961 5.70804C12.1538 3.7123 17.3261 5.70804 17.3261 5.70804V24.083H9.48961C9.48961 24.083 9.41053 20.4141 10.4 19.0382M1 14.9106H9.48936"
          stroke="#304125"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6.44199 12.1587C11.6265 14.0909 11.8107 15.2843 6.44199 17.6621"
          stroke="#304125"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="16.3364" cy="13.9934" r="0.952656" fill="white" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="26"
        viewBox="0 0 27 26"
        fill="none"
        className="create"
        onClick={openModal}
      >
        <path
          d="M14.7098 16.6787C14.7098 16.6787 20.6086 11.1818 23.826 8.18345C27.0434 5.18507 21.5895 -0.667534 18.372 2.33078C15.1545 5.32908 9.25581 10.826 9.25581 10.826"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M21.954 10.0669L16.5 4.21421"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M14.7098 16.6785L8.22698 17.2521L9.25575 10.8259"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M14.928 16.2144C15.7512 15.8642 16.4397 15.2696 16.8965 14.5247"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10.2739 9.3501C9.97107 9.62797 9.70975 9.94829 9.50002 10.3013"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M9.5 10.3012C8.7588 9.05367 7.37345 8.21436 5.78675 8.21436C3.41924 8.21436 1.5 10.083 1.5 12.388C1.5 14.0995 2.55805 15.5703 4.07205 16.2144"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M9.5 22.1275C8.7588 23.375 7.37345 24.2144 5.78675 24.2144C3.41924 24.2144 1.5 22.3458 1.5 20.0407C1.5 18.3293 2.55805 16.8584 4.07205 16.2144"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M9.5 22.1275C10.2412 23.375 11.6266 24.2144 13.2133 24.2144C15.5808 24.2144 17.5 22.3458 17.5 20.0407C17.5 18.3293 16.4419 16.8584 14.928 16.2144"
          stroke="#304125"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {modal && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <p>그룹 입장</p>
            <input type="text" placeholder="코드입력" />
            <button onClick={closeModal} className="closemodal">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
