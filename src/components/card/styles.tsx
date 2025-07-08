import styled from "styled-components";

export const Holder = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #ebe5eb;
  width: 16rem;
  height: 7rem;
  padding: 1rem;
  span:nth-of-type(1) {
    font-size: 1rem;
    color: #515151;
  }

  span:nth-of-type(2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      margin-left: 1rem;
      /* border: 1px solid grey; */
      font-size: 1rem;
      padding: 0.3rem;
      padding-left: 0.8rem;
      padding-right: 0.8rem;

      border-radius: 0.4rem;
    }
  }

  span:nth-of-type(3) {
    font-size: 0.8rem;
    color: #999;
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  height: 1px;
  width: 60%;
  background-color: #009688;
  justify-self: flex-end;
`;
