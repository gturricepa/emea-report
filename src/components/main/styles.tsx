import styled from "styled-components";

export const Holder = styled.div`
  .ant-layout-sider-trigger {
    background-color: #009688;
    svg {
      fill: #fcfbfb; /* ou a cor que quiser */
    }
  }
  .ant-menu-light .ant-menu-item-selected {
  }

  .ant-menu-light .ant-menu-item-selected > .ant-menu-item-icon,
  .ant-menu-light .ant-menu-item-selected > a,
  .ant-menu-light .ant-menu-item-selected {
    color: #009688 !important;
  }
`;

export const Footer = styled.div<{ collapsed: boolean }>`
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  pointer-events: ${({ collapsed }) => (collapsed ? "none" : "auto")};
  transition: opacity 0.2s ease;

  span {
    font-weight: bold;
    color: #201e1ed1;
  }
  img {
    width: 8rem;
  }
`;
export const FullLogo = styled.img<{ collapsed: boolean }>`
  height: 2.2rem;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 14px;

  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  pointer-events: ${({ collapsed }) => (collapsed ? "none" : "auto")};
  transition: opacity 0.3s ease;
`;

export const SingleLogo = styled.img<{ collapsed: boolean }>`
  height: 2rem;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 14px;

  opacity: ${({ collapsed }) => (collapsed ? 1 : 0)};
  pointer-events: ${({ collapsed }) => (collapsed ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;
export const LogoWrapper = styled.div`
  height: 4.5rem;
  text-align: center;
  position: relative;
`;
