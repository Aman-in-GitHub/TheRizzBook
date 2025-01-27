import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

function NotFound() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-background motion-blur-in motion-opacity-in motion-duration-[2s] lg:gap-20">
      <img
        src="/logo.svg"
        alt="The Rizz Book"
        className="motion-preset-spin size-52 select-none motion-duration-1000 lg:size-96"
      />

      <Link to="/" className="mt-10 text-xl text-text" replace={true}>
        <Button>Go To Home</Button>
      </Link>
    </section>
  );
}

export default NotFound;
