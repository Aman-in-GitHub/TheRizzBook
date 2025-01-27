import { NavLink } from 'react-router';
import {
  PiSun as Sun,
  PiMoonStars as Moon,
  PiSigma as HomeLine,
  PiSigmaFill as HomeFill,
  PiGearSix as SettingsLine,
  PiGearSixFill as SettingsFill
} from 'react-icons/pi';
import { HIGHEST_Z_INDEX, TAB_BAR_ICON_STYLES } from '@/utils/constants';
import { useTheme } from '@/components/theme-provider';

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
  const { theme, setTheme } = useTheme();

  console.log(theme);

  return (
    <div
      className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-between border-t-2 border-border px-6"
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

      <button
        onClick={() => {
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          setTheme(theme === 'light' ? 'dark' : 'light');
        }}
      >
        {theme === 'light' ? (
          <Moon className={`${TAB_BAR_ICON_STYLES} fill-primary`} />
        ) : (
          <Sun className={`${TAB_BAR_ICON_STYLES} fill-primary`} />
        )}
      </button>
    </div>
  );
}

export default BottomTabs;
