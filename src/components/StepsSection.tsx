const StepsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark overflow-hidden">
      <div className="container-main">
        <div className="flex justify-center">
          <video
            className="w-full max-w-4xl rounded-lg shadow-lg"
            controls
            preload="metadata"
          >
            <source src="/videos/welcome.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
