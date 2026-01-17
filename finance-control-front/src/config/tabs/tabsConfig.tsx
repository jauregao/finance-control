import { TabBarIcon } from '@/components/TabBarIcon';
import { HeaderRightButton } from './headerConfig';

type TabConfig = {
  name: string;
  title: string;
  iconName: React.ComponentProps<typeof TabBarIcon>['name'];
  showHeaderButton?: boolean;
};

export const TABS_CONFIG: TabConfig[] = [
  {
    name: 'dashboard',
    title: 'Dashboard',
    iconName: 'home',
    showHeaderButton: true,
  },
  {
    name: 'two',
    title: 'Tab Two',
    iconName: 'code',
    showHeaderButton: true,
  },
];

export const getTabScreenOptions = (
  tab: TabConfig,
  textColor: string
) => ({
  title: tab.title,
  tabBarIcon: ({ color }: { color: string }) => (
    <TabBarIcon name={tab.iconName} color={color} />
  ),
  ...(tab.showHeaderButton && {
    headerRight: () => <HeaderRightButton color={textColor} />,
  }),
});
