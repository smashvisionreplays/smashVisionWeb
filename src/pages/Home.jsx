import BlurredContainer from "../../components/home/BlurredContainer";

export default function Home({ triggerNotification }) {
  return (
    <div className="min-h-screen flex items-start justify-center px-4 ">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-white/90 mb-6">
            Find Your Game
          </h1>
          <p className="text-xl text-white/60 mb-8 leading-relaxed">
            Search and watch your padel matches by selecting your club, court, and game time. 
            Relive your best moments and analyze your gameplay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Live matches available</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>7-day history</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full">
          <BlurredContainer triggerNotification={triggerNotification} />
        </div>
      </div>
    </div>
  );
}