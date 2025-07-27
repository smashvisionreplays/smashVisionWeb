import React from 'react';
import { Carousel, Button, Card, ConfigProvider } from 'antd';
import { EyeOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';

const tournaments = [
  {
    id: 1,
    title: "Summer Championship 2024",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
    date: "July 15-20, 2024",
    prize: "$10,000",
    description: "Annual summer tournament featuring top players from around the region."
  },
  {
    id: 2,
    title: "Masters Cup",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    date: "August 5-10, 2024",
    prize: "$15,000",
    description: "Elite tournament for professional players with international participation."
  },
  {
    id: 3,
    title: "Youth League Finals",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    date: "September 12-15, 2024",
    prize: "$5,000",
    description: "Championship for young talents under 18 years old."
  },
  {
    id: 4,
    title: "Winter Open",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
    date: "December 1-5, 2024",
    prize: "$8,000",
    description: "End of year tournament open to all skill levels."
  }
];

const Tournaments = () => {
  const handleSeeMore = (tournament) => {
    console.log("See more:", tournament);
    // Navigate to tournament details or open modal
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            dotActiveWidth: 24,
            dotHeight: 6,
            dotWidth: 16,
          },
          Card: {
            colorBgContainer: 'rgba(255, 255, 255, 0.1)',
            colorText: 'rgba(255, 255, 255, 0.9)',
            colorTextDescription: 'rgba(255, 255, 255, 0.7)',
          },
          Button: {
            colorPrimary: '#DDF31A',
            colorPrimaryHover: '#c9de17',
          }
        },
      }}
    >
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white/90 mb-4">
              Tournaments
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Discover upcoming padel tournaments and competitions. Join the excitement and compete with the best players.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
            <Carousel
              autoplay
              autoplaySpeed={4000}
              dots={{ className: "custom-dots" }}
              effect="fade"
            >
              {tournaments.map((tournament) => (
                <div key={tournament.id}>
                  <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[500px]">
                    {/* Tournament Image */}
                    <div className="relative group">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        <img
                          src={tournament.image}
                          alt={tournament.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    </div>

                    {/* Tournament Info */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white/90 mb-4">
                          {tournament.title}
                        </h2>
                        <p className="text-lg text-white/70 leading-relaxed">
                          {tournament.description}
                        </p>
                      </div>

                      {/* Tournament Details */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-white/80">
                          <CalendarOutlined className="text-xl" />
                          <span className="text-lg">{tournament.date}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-white/80">
                          <TrophyOutlined className="text-xl" />
                          <span className="text-lg">Prize Pool: {tournament.prize}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Button
                          type="primary"
                          size="large"
                          icon={<EyeOutlined />}
                          onClick={() => handleSeeMore(tournament)}
                          className="h-12 px-8 text-black font-semibold rounded-xl shadow-lg"
                        >
                          See More Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Tournament Grid Preview */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white/90 mb-8 text-center">
              All Tournaments
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tournaments.map((tournament) => (
                <Card
                  key={tournament.id}
                  hoverable
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                  cover={
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        alt={tournament.title}
                        src={tournament.image}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      key="details"
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleSeeMore(tournament)}
                      className="text-white/80 hover:text-white"
                    >
                      Details
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={<span className="text-white/90 text-base">{tournament.title}</span>}
                    description={<span className="text-white/60 text-sm">{tournament.date}</span>}
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-dots .slick-dots li button {
          background: rgba(255, 255, 255, 0.3) !important;
          border-radius: 8px !important;
        }
        .custom-dots .slick-dots li.slick-active button {
          background: rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default Tournaments;