import type { JSX } from "react";
import { CPMM } from "../cpmm";
import { Crashes } from "../crashes";
import { General } from "../general";
import { Compliance } from "../ipmm";
import * as S from "./styles";
import { Header } from "../header";

type ContentDataProps = {
  selectedSession: "general" | "cpmm - ipmm" | "compliance" | "crashes";
};

const componentMap: Record<ContentDataProps["selectedSession"], JSX.Element> = {
  general: <General />,
  "cpmm - ipmm": <CPMM />,
  compliance: <Compliance />,
  crashes: <Crashes />,
};

export const ContentData = ({ selectedSession }: ContentDataProps) => {
  return (
    <S.Holder>
      <Header selectedSession={selectedSession} />
      {componentMap[selectedSession]}
    </S.Holder>
  );
};
