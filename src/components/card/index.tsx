import * as S from "./styles";

interface CardProps {
  title: string;
  value: string;
  footer?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, footer }) => {
  return (
    <S.Holder>
      <span>{title}</span>
      <span>
        {value}
        {/* {value} <S.Detail></S.Detail>{" "} */}
      </span>
      {footer && <span>{footer}</span>}
    </S.Holder>
  );
};
