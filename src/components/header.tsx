import { PiSun as Sun, PiMoonStars as Moon } from 'react-icons/pi';
import { useTheme } from '@/components/theme-provider';
import { HIGHEST_Z_INDEX, TAB_BAR_ICON_STYLES } from '@/utils/constants';

function Header({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className="fixed flex h-16 w-full items-center justify-between border-b-4 border-border bg-background px-2 motion-blur-in motion-opacity-in motion-duration-1000"
      style={{
        zIndex: HIGHEST_Z_INDEX
      }}
    >
      <a href="/" className="flex items-center gap-3">
        <img
          src="/logo.svg"
          alt="The Rizz Book"
          className="motion-preset-spin size-8 select-none motion-duration-2000"
        />
        <h1 className="pt-2 text-center font-heading text-4xl font-bold text-primary">
          {title}
        </h1>
      </a>

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
    </nav>
  );
}

export default Header;
