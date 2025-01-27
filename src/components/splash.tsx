function Splash() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-background motion-blur-out motion-opacity-out motion-delay-[0.8s]">
      <img
        src="/logo.svg"
        alt="The Rizz Book"
        className="motion-preset-spin size-52 select-none motion-duration-1000 lg:size-96"
      />
    </section>
  );
}

export default Splash;
