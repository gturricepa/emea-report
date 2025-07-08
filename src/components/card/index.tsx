import * as S from "./styles";

interface CardProps {
  title: string;
  value: string;
  footer?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, value, footer, icon }) => {
  return (
    <S.Holder>
      <span>{title}</span>
      <span>
        {value}
        {/* {value} <S.Detail></S.Detail>{" "} */} {icon && <>{icon}</>}
      </span>
      {footer && <span>{footer}</span>}
    </S.Holder>
  );
};
