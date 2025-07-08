import styled from "styled-components";

export const Holder = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  align-items: center;
  gap: 1rem;
`;

export const LittleChartHolder = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  border-radius: 4px;
  width: 90%;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`;
export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  height: 1px;
  width: 15rem;
  background-color: #009688;
  justify-self: flex-end;
`;
