import { useEffect, useState } from 'react';
import Splash from '@/components/splash';

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
    <main className="motion-opacity-in motion-duration-1000">
      <h1>Rizz</h1>
    </main>
  );
}

export default App;
