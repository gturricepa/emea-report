import styled from "styled-components";

export const Holder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  width: 100%;
  p {
    color: "white";
    font-size: "2rem";
  }
  h2 {
    margin: 0;
    font-weight: 100;
  }
`;
export const LogoWrapper = styled.div`
  position: fixed; /* fica fixo na tela */
  left: -15%;
  top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  z-index: 10;

  img {
    filter: blur(20px);
    opacity: 0.5;
    /* width: 35rem;
     */

    width: 30rem;
  }
`;
