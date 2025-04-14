import { NavMainItemProps } from "../components/NavMain";
import { NavProjectsItemProps } from "../components/NavProjects";
import { NavSecondaryItemProps } from "../components/NavSecondary";
import { CredentialsEnum } from "../enums/CredentialsEnum";

export type MenuItem =
  | NavSecondaryItemProps
  | NavProjectsItemProps
  | NavMainItemProps;

export type MenuItemWithCredentials = Partial<MenuItem> & {
  credentials: CredentialsEnum[];
  items: MenuItemWithCredentials[];
};

export function FilterByCredentials(
  data: MenuItemWithCredentials[],
  allowedCredentials: CredentialsEnum[]
): MenuItemWithCredentials[] {
  if (!data || data.length === 0) return [];
  if (!allowedCredentials || allowedCredentials.length === 0) return [];

  return data.reduce((navMenu, item) => {
    if (item.credentials.some((cred) => allowedCredentials.includes(cred))) {
      const filteredItems = item.items
        ? FilterByCredentials(item.items, allowedCredentials)
        : [];
      navMenu.push({ ...item, items: filteredItems });
    }
    return navMenu;
  }, [] as MenuItemWithCredentials[]);
}
