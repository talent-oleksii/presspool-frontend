import { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>["items"][number];

const GetItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  theme?: "light" | "dark"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    theme,
  } as MenuItem;
};

export {GetItem}