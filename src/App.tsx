import { useEffect, useState } from 'react';
import { Route, BrowserRouter, Routes, Outlet } from 'react-router';
import Splash from '@/components/splash';
import Home from '@/pages/home';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';

import BottomTabs from '@/components/bottom-tabs';

function Layout() {
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
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
