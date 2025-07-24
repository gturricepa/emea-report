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
      <div
        style={{
          display: "flex",
          width: "1550px",
          justifySelf: "center",
          alignSelf: "center",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
              value: "Argentina",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="AR" style={{ width: 20, height: 15 }} />
                  Argentina
                </div>
              ),
            },
            {
              value: "Brazil",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="BR" style={{ width: 20, height: 15 }} />
                  Brazil
                </div>
              ),
            },
            {
              value: "Canada",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="CA" style={{ width: 20, height: 15 }} />
                  Canada
                </div>
              ),
            },
            {
              value: "Chile",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="CL" style={{ width: 20, height: 15 }} />
                  Chile
                </div>
              ),
            },
            {
              value: "Colombia",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="CO" style={{ width: 20, height: 15 }} />
                  Colombia
                </div>
              ),
            },
            {
              value: "Costa Rica",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="CR" style={{ width: 20, height: 15 }} />
                  Costa Rica
                </div>
              ),
            },
            {
              value: "Dominican Republic",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="DO" style={{ width: 20, height: 15 }} />
                  Dominican Republic
                </div>
              ),
            },
            {
              value: "Ecuador",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="EC" style={{ width: 20, height: 15 }} />
                  Ecuador
                </div>
              ),
            },
            {
              value: "Guatemala",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="GT" style={{ width: 20, height: 15 }} />
                  Guatemala
                </div>
              ),
            },
            {
              value: "India",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="IN" style={{ width: 20, height: 15 }} />
                  India
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
              value: "Mexico",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="MX" style={{ width: 20, height: 15 }} />
                  Mexico
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
              value: "Panama",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="PA" style={{ width: 20, height: 15 }} />
                  Panama
                </div>
              ),
            },
            {
              value: "Paraguay",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="PY" style={{ width: 20, height: 15 }} />
                  Paraguay
                </div>
              ),
            },
            {
              value: "Peru",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="PE" style={{ width: 20, height: 15 }} />
                  Peru
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
              value: "Puerto Rico",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="PR" style={{ width: 20, height: 15 }} />
                  Puerto Rico
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
            {
              value: "United States",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="US" style={{ width: 20, height: 15 }} />
                  United States
                </div>
              ),
            },
            {
              value: "Uruguay",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="UY" style={{ width: 20, height: 15 }} />
                  Uruguay
                </div>
              ),
            },
            {
              value: "Venezuela",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Flag code="VE" style={{ width: 20, height: 15 }} />
                  Venezuela
                </div>
              ),
            },
          ]}
        />
      </div>
    </S.Holder>
  );
};
