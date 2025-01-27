import { NavLink } from 'react-router';
import {
  PiSigma as HomeLine,
  PiSigmaFill as HomeFill,
  PiGearSix as SettingsLine,
  PiGearSixFill as SettingsFill,
  PiQuestion
} from 'react-icons/pi';
import { HIGHEST_Z_INDEX, TAB_BAR_ICON_STYLES } from '@/utils/constants';
import { useToast } from '@/hooks/useToast';

const tabs = [
  {
    name: 'Home',
    href: '/',
    lineIcon: <HomeLine className={`${TAB_BAR_ICON_STYLES} fill-primary`} />,
    fillIcon: <HomeFill className={`${TAB_BAR_ICON_STYLES} fill-primary`} />
  },
  {
    name: 'Settings',
    href: '/settings',
    lineIcon: (
      <SettingsLine className={`${TAB_BAR_ICON_STYLES} fill-primary`} />
    ),
    fillIcon: <SettingsFill className={`${TAB_BAR_ICON_STYLES} fill-primary`} />
  }
];

function BottomTabs() {
  const { toast } = useToast();

  return (
    <div
      className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-between border-t-2 border-border bg-background px-6"
      style={{
        zIndex: HIGHEST_Z_INDEX
      }}
    >
      {tabs.map((tab) => {
        return (
          <NavLink
            key={tab.name}
            to={tab.href}
            onClick={() => {
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }
            }}
          >
            {({ isActive }) => (isActive ? tab.fillIcon : tab.lineIcon)}
          </NavLink>
        );
      })}
      <PiQuestion
        className={`${TAB_BAR_ICON_STYLES} fill-primary`}
        onClick={() => {
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          toast({
            title: 'Coming Soon',
            description: 'As the title says',
            duration: 1500
          });
        }}
      />
    </div>
  );
}

export default BottomTabs;
