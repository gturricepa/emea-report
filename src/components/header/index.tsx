import { Select } from "antd";
import Flag from "react-world-flags";
import * as S from "./styles";
import { useDispatch } from "react-redux";
import { setSelectedCountry } from "../../store/slices/countrySlice";

interface HeaderProps {
  selectedSession: string;
}

export const Header: React.FC<HeaderProps> = ({ selectedSession }) => {
  const dispatch = useDispatch();

  return (
    <S.Holder>
      <h2>{selectedSession.toUpperCase()}</h2>
      <Select
        defaultValue="all"
        style={{ width: 220, marginRight: "1rem" }}
        onChange={(value) => dispatch(setSelectedCountry(value))}
        options={[
          {
            value: "all",
            label: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                🌐 All Countries
              </div>
            ),
          },
          {
            value: "Algeria",
            label: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Flag code="DZ" style={{ width: 20, height: 15 }} />
                Algeria
              </div>
            ),
          },

          {
            value: "Netherlands",
            label: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Flag code="NL" style={{ width: 20, height: 15 }} />
                Netherlands
              </div>
            ),
          },
          {
            value: "Ireland",
            label: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Flag code="IE" style={{ width: 20, height: 15 }} />
                Ireland
              </div>
            ),
          },
          {
            value: "Portugal",
            label: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Flag code="PT" style={{ width: 20, height: 15 }} />
                Portugal
              </div>
            ),
          },
          {
            value: "United Kingdom",
            label: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Flag code="GB" style={{ width: 20, height: 15 }} />
                United Kingdom
              </div>
            ),
          },
        ]}
      />
    </S.Holder>
  );
};
