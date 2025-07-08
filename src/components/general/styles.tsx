import styled from "styled-components";

export const Holder = styled.section`
  display: flex;
  width: 100%;
  justify-content: space-between;
  /* height: 100vh; */
`;

export const Data = styled.div`
  display: flex;
  width: 100%;
  /* background-color: white; */
  flex-wrap: wrap;
  border-radius: 4px;
  flex-direction: column;
  align-items: center;
  b {
    margin-top: 1rem;
    background-color: white;
    padding: 1rem;
    width: 95%;
    text-align: center;
    border-radius: 4px;
  }
`;

export const Goals = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  align-items: center;
  gap: 1rem;
  width: 20%;
  height: 100%;
  margin-right: 1.5rem;
`;

interface ChartHolderProps {
  $scale: number;
  $x: number;
  $y: number;
}

export const ChartHolder = styled.div<ChartHolderProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 16rem;
  /* height: 100%; */
  background-color: white;
  overflow: hidden;

  svg {
    width: 500px;
    height: 370px;
    transform: scale(${(p) => p.$scale})
      translate(${(p) => p.$x}px, ${(p) => p.$y}px);
    transform-origin: center center;
    transition: transform 0.3s ease;
  }
  @media (min-width: 1600px) {
    width: 15rem;

    svg {
      width: 500px;
      height: 400px;
      transform: scale(${(p) => p.$scale - 0.8})
        translate(${(p) => p.$x - 70}px, ${(p) => p.$y - 25}px);
      /* transform-origin: center center; */
      transition: transform 0.3s ease;
    }
  }
`;

export const DataCardHolder = styled.div`
  display: flex;
  justify-content: space-between;
  /* background-color: red; */
  width: 98%;
  margin-top: 4rem;
`;
