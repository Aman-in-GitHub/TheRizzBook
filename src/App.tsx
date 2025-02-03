/* eslint-disable */

import { useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter,
  Routes,
  Outlet,
  useNavigate
} from 'react-router';
import { isMobile } from 'react-device-detect';
import Splash from '@/components/splash';
import Home from '@/pages/home';
import Starter from '@/pages/starter';
import Intro from '@/pages/intro';
import NotFound from '@/pages/not-found';
import BottomTabs from '@/components/bottom-tabs';
import { SparklesText } from '@/components/ui/sparkle-text';

function Layout() {
  const navigate = useNavigate();

  console.clear();
  console.log(
    "THERIZZBOOK ~ This site saves all your screenshots, even those which aren't submitted. %cDON'T SUBMIT ANYTHING YOU DON'T WANT TO BE SAVED%c",
    'color: red; font-weight: bold;',
    'color: inherit;'
  );

  if (!isMobile) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-background motion-blur-in motion-opacity-in motion-duration-[2s] lg:gap-20">
        <img
          src="/logo.svg"
          alt="The Rizz Book"
          className="motion-preset-spin size-52 select-none motion-duration-1000 lg:size-96"
        />

        <SparklesText
          text="THE RIZZ BOOK is only available on mobile devices"
          className="mt-10 select-none text-center font-heading text-5xl font-bold"
        />
      </section>
    );
  }

  useEffect(() => {
    const name = localStorage.getItem('therizzbook-name');
    const age = localStorage.getItem('therizzbook-age');
    const gender = localStorage.getItem('therizzbook-gender');

    if (!name || !age || !gender) {
      navigate('/intro', {
        replace: true
      });
    }
  }, []);

  return (
    <>
      <Outlet />
      <BottomTabs />
    </>
  );
}

function App() {
  const [showSplashscreen, setShowSplashscreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplashscreen(false);
    }, 1500);
  }, []);

  if (showSplashscreen) {
    return <Splash />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="convo-starter" element={<Starter />} />
        </Route>
        <Route path="intro" element={<Intro />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
