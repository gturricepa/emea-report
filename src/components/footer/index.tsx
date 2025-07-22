import * as S from "./styles";
export const Footer = () => {
  return (
    <S.Holder>
      <span>
        CEPA MOBILITY <b>Brasil</b>
      </span>
      <span>© {new Date().getFullYear()} All rights reserved.</span>
    </S.Holder>
  );
};
