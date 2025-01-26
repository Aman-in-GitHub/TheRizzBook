function Error() {
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <button onClick={() => window.location.reload()}>Try again</button>
    </section>
  );
}

export default Error;
