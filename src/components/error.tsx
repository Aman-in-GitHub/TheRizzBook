import { Button } from '@/components/ui/button';

function Error() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-background motion-blur-in motion-opacity-in motion-duration-[2s] lg:gap-20">
      <img
        src="/logo.svg"
        alt="The Rizz Book"
        className="motion-preset-spin size-52 select-none motion-duration-1000 lg:size-96"
      />

      <Button onClick={() => window.location.reload()} className="mt-10">
        Try again
      </Button>
    </section>
  );
}

export default Error;
