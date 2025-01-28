import AnimatedGradient from '@/components/ui/animated-background';
import { Button } from '@/components/ui/button';
import { MorphingText } from '@/components/ui/morph-text';
import { SparklesText } from '@/components/ui/sparkle-text';
import { useToast } from '@/hooks/useToast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const texts = ['', 'WELCOME', 'TO', 'THE', 'RIZZ', 'BOOK'];

function Intro() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<string>('welcome');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMode('info');
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  async function handleInfoSubmit() {
    if (name.trim() === '' || age <= 0) {
      toast({
        title: 'Insufficient Information',
        description: 'Please enter your name and age',
        duration: 1500
      });

      return;
    }

    if (name.trim().length < 3) {
      toast({
        title: 'Name too short',
        description: 'Please enter a longer name',
        duration: 1500
      });

      return;
    }

    if (age < 18) {
      toast({
        title: 'Aww! You are too young, baby',
        duration: 1000
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      Object.assign(document.createElement('a'), {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: 'https://www.youtube.com/watch?v=XqZsoesa55w'
      }).click();

      return;
    }

    if (age > 70) {
      toast({
        title: 'Eww! You are too old, unc',
        duration: 1000
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      Object.assign(document.createElement('a'), {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: 'https://youtu.be/CruBRZh8quc?si=spR7YTk87wRlr4HW'
      }).click();

      return;
    }

    localStorage.removeItem('therizzbook-name');
    localStorage.removeItem('therizzbook-age');

    localStorage.setItem('therizzbook-name', name);
    localStorage.setItem('therizzbook-age', JSON.stringify(age));

    setMode('gender');
  }

  return (
    <main className="h-screen bg-secondaryBlack text-white motion-blur-in motion-opacity-in motion-duration-500">
      {mode === 'welcome' && (
        <>
          <AnimatedGradient
            colors={['#EC4899', '#F472B6', '#3B82F6']}
            speed={0.1}
            blur="heavy"
          />
          <div className="flex h-full w-full items-center justify-center bg-background p-2">
            <MorphingText texts={texts} />
          </div>
        </>
      )}

      {mode === 'info' && (
        <>
          <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-secondaryBlack p-12 motion-blur-in motion-opacity-in motion-duration-2000">
            <div>
              <SparklesText
                text="NAME"
                className="text-left font-heading text-[120px] font-bold"
              />
              <input
                placeholder="Your Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="w-full rounded-sm border-b-2 border-white/20 bg-transparent text-3xl focus:outline-0"
              />
            </div>

            <div>
              <SparklesText
                text="AGE"
                className="text-left font-heading text-[120px] font-bold"
              />
              <input
                placeholder="Your Age"
                type="number"
                onChange={(e) => {
                  setAge(Number(e.target.value));
                }}
                className="w-full rounded-sm border-b-2 border-white/20 bg-transparent text-3xl focus:outline-0"
              />
            </div>

            <Button
              className="animated-background h-20 w-full bg-gradient-to-r from-neutral-300 via-neutral-600 to-white py-8 font-heading text-2xl font-bold disabled:opacity-10"
              onClick={handleInfoSubmit}
            >
              <SparklesText text="Continue" className="pt-2 text-5xl" />
            </Button>
          </div>
        </>
      )}

      {mode === 'gender' && (
        <div className="flex h-full flex-col items-center justify-center motion-blur-in motion-opacity-in motion-duration-2000">
          <button
            className="h-[50%] w-full bg-pink-500 font-heading text-8xl font-bold duration-500 active:opacity-60"
            onClick={() => {
              localStorage.removeItem('therizzbook-gender');
              localStorage.setItem('therizzbook-gender', 'male');
              toast({
                title: `WELCOME TO THE RIZZ BOOK, ${name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1).toLowerCase()} 🌸`,
                duration: 1000
              });

              navigate('/');
            }}
          >
            MALE
          </button>
          <button
            className="h-[50%] w-full bg-blue-500 font-heading text-8xl font-bold duration-500 active:opacity-60"
            onClick={() => {
              localStorage.removeItem('therizzbook-gender');
              localStorage.setItem('therizzbook-gender', 'female');

              toast({
                title: `WELCOME TO THE RIZZ BOOK, ${name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1).toLowerCase()} 🌸`,
                duration: 1000
              });

              navigate('/');
            }}
          >
            FEMALE
          </button>
        </div>
      )}
    </main>
  );
}

export default Intro;
