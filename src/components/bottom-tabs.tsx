import { NavLink } from 'react-router';
import {
  PiSigma as HomeLine,
  PiSigmaFill as HomeFill,
  PiChatsCircle as StarterLine,
  PiChatsCircleFill as StarterFill
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
    name: 'Starter',
    href: '/convo-starter',
    lineIcon: <StarterLine className={`${TAB_BAR_ICON_STYLES} fill-primary`} />,
    fillIcon: <StarterFill className={`${TAB_BAR_ICON_STYLES} fill-primary`} />
  }
];

function BottomTabs() {
  const { toast } = useToast();
  const name = localStorage.getItem('therizzbook-name');

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
      <button
        className={`border-2 border-primary ${TAB_BAR_ICON_STYLES} rounded-[1000px] text-xl font-bold text-primary`}
        onClick={() => {
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          toast({
            title: 'Coming Soon',
            description: "It's never coming, XD!",
            duration: 1500
          });
        }}
      >
        {name?.charAt(0).toUpperCase()}
      </button>
    </div>
  );
}

export default BottomTabs;
