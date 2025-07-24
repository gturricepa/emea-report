import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import * as S from "./styles";
interface ComplianceData {
  Country: string;
  Status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface RankingProps {
  data: ComplianceData[];
}

interface CountryRanking {
  country: string;
  complete: number;
  total: number;
  percent: number;
}

export const Ranking: React.FC<RankingProps> = ({ data }) => {
  // Agrupar dados por país
  const countryMap: Record<string, ComplianceData[]> = {};

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  data.forEach((entry) => {
    const country = entry.Country;
    if (!countryMap[country]) {
      countryMap[country] = [];
    }
    countryMap[country].push(entry);
  });

  // Calcular percentuais por país
  const ranking: CountryRanking[] = Object.entries(countryMap).map(
    ([country, entries]) => {
      const total = entries.length;
      const complete = entries.filter((e) => e.Status === "Complete").length;
      const percent =
        total > 0 ? parseFloat(((complete / total) * 100).toFixed(2)) : 0;

      return {
        country,
        complete,
        total,
        percent,
      };
    }
  );

  // Ordenar por percentual
  const sortedRanking = ranking.sort((a, b) => b.percent - a.percent);

  // Colunas da tabela
  const columns: ColumnsType<CountryRanking> = [
    {
      title: "#",
      render: (_value, _record, index) => index + 1,
      key: "position",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Completed",
      dataIndex: "complete",
      key: "complete",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Percentual",
      dataIndex: "percent",
      key: "percent",
      render: (value) => `${value}%`,
      sorter: (a, b) => a.percent - b.percent,
    },
  ];

  return (
    <S.Holder>
      <h3>Ranking</h3>
      <Table
        rowClassName={(record) =>
          record.country === selectedCountry ? "highlight-row" : ""
        }
        dataSource={sortedRanking}
        columns={columns}
        rowKey="country"
        pagination={false}
      />
    </S.Holder>
  );
};

// import React from "react";
// import { Table } from "antd";
// import type { ColumnsType } from "antd/es/table";

// interface ComplianceData {
//   Country: string;
//   "Data Privacy Policy": string | null;
//   "SAFE FLEET Policy Acceptance": string | null;
//   Pledge: string | null;
//   "Policy Scope": string | null;
//   "Insurance Policy Upload": string | null;
//   "Manager Pledge": string | null;
//   Status: string;
// }

// interface RankingProps {
//   data: ComplianceData[];
//   activities: string[];
// }

// interface CountryRanking {
//   country: string;
//   done: number;
//   applicable: number;
//   percent: number;
// }

// export const Ranking: React.FC<RankingProps> = ({ data, activities }) => {
//   // Agrupamento por país
//   const countryMap: Record<string, ComplianceData[]> = {};

//   data.forEach((entry) => {
//     const country = entry.Country;
//     if (!countryMap[country]) {
//       countryMap[country] = [];
//     }
//     countryMap[country].push(entry);
//   });

//   // Processamento do ranking por país
//   const ranking: CountryRanking[] = Object.entries(countryMap).map(
//     ([country, entries]) => {
//       let totalApplicable = 0;
//       let totalDone = 0;

//       entries.forEach((entry) => {
//         activities.forEach((activity) => {
//           const rawValue = entry[activity as keyof ComplianceData];
//           if (!rawValue) return;

//           const val = rawValue.toString().trim().toLowerCase();
//           if (val === "n/a") return;

//           totalApplicable++;

//           if (val !== "no") {
//             totalDone++;
//           }
//         });
//       });

//       const percent =
//         totalApplicable > 0
//           ? parseFloat(((totalDone / totalApplicable) * 100).toFixed(2))
//           : 0;

//       return {
//         country,
//         done: totalDone,
//         applicable: totalApplicable,
//         percent,
//       };
//     }
//   );

//   // Ordenar por percentual decrescente
//   const sortedRanking = ranking.sort((a, b) => b.percent - a.percent);

//   // Colunas da tabela
//   const columns: ColumnsType<CountryRanking> = [
//     {
//       title: "Posição",
//       render: (_value, _record, index) => index + 1,
//       key: "position",
//     },
//     {
//       title: "País",
//       dataIndex: "country",
//       key: "country",
//     },
//     {
//       title: "Concluídas",
//       dataIndex: "done",
//       key: "done",
//     },
//     {
//       title: "Aplicáveis",
//       dataIndex: "applicable",
//       key: "applicable",
//     },
//     {
//       title: "Percentual",
//       dataIndex: "percent",
//       key: "percent",
//       render: (value) => `${value}%`,
//       sorter: (a, b) => a.percent - b.percent,
//     },
//   ];

//   return (
//     <Table
//       dataSource={sortedRanking}
//       columns={columns}
//       rowKey="country"
//       pagination={false}
//     />
//   );
// };
