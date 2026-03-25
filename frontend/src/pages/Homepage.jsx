/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import HomeNavbar from "../components/HomeNavbar";

const images = ["/civic1.webp", "/civic2.webp", "/civic3.jpg"];

const Homepage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <HomeNavbar />

      {/* Hero Section with Image Carousel */}
      <div className="relative h-[600px] overflow-hidden pt-[72px]">
        <div className="absolute inset-0">
          <img
            src={images[currentImage]}
            alt={`banner-${currentImage + 1}`}
            className="w-full h-full object-cover object-center transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a]/70 via-[#0f0f1a]/40 to-[#0f0f1a]"></div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 rounded mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700 font-medium">
                Empowering Communities Since 2025
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-blue-600 font-bold">CivicConnect</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Your digital platform to connect with local government, manage
              civic services, and build stronger communities together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/signup"
                className="group flex items-center gap-2 px-8 py-3.5 bg-blue-600 from-blue-500 to-blue-600 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow transition-all duration-300 hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/signin"
                className="px-8 py-3.5 text-black font-medium rounded-xl bg-white border border-gray-200 rounded hover:bg-gray-200 transition-all duration-300"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-200 rounded rounded-full hover:bg-gray-200 transition-all z-20"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-200 rounded rounded-full hover:bg-gray-200 transition-all z-20"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? "w-8 bg-orange-500"
                  : "w-2 bg-white/30 hover:bg-gray-1000"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Users", value: "2,500+", icon: Users },
            { label: "Trash Pickups", value: "5,000+", icon: Trash2 },
            { label: "Sectors Covered", value: "7", icon: Shield },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-5 text-center "
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-black mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 ">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Everything you need in{" "}
            <span className="text-blue-600 font-bold">one place</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Streamline your civic interactions with our comprehensive suite of
            tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Trash Pickup"
            description="Schedule and track waste collection services. Get notified about service dates and manage requests effortlessly."
            icon={<Trash2 className="w-7 h-7" />}
            color="orange"
            delay={0}
          />
          <FeatureCard
            title="Community Events"
            description="Register events, get permits approved, and stay updated with local community activities and gatherings."
            icon={<Calendar className="w-7 h-7" />}
            color="teal"
            delay={0.1}
          />
          <FeatureCard
            title="Smart Management"
            description="Manage all your civic needs through a single intelligent platform with real-time updates and notifications."
            icon={<Zap className="w-7 h-7" />}
            color="amber"
            delay={0.2}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center bg-white border border-gray-300 rounded shadow p-6 animate-pulse-glow">
          <div className="absolute inset-0 bg-blue-500 from-blue-500/10 to-blue-600/5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ready to get connected?
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
              Join thousands of citizens already using CivicConnect to engage
              with their local government.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 from-blue-500 to-blue-600 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow transition-all duration-300 hover:-translate-y-1"
            >
              Create Your Free Account
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-semibold text-black">
                CivicConnect
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 CivicConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, color, delay }) => {
  const colorMap = {
    orange: {
      bg: "from-blue-500/20 to-orange-500/5",
      icon: "text-blue-600",
      border: "group-hover:border-orange-500/30",
    },
    teal: {
      bg: "from-teal-500/20 to-teal-500/5",
      icon: "text-green-600",
      border: "group-hover:border-teal-500/30",
    },
    amber: {
      bg: "from-gray-900mber-500/20 to-blue-600/5",
      icon: "text-yellow-600",
      border: "group-hover:border-amber-500/30",
    },
  };

  const colors = colorMap[color];

  return (
    <div
      className={`group bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-8  ${colors.border}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-blue-500 ${colors.bg} flex items-center justify-center mb-6 ${colors.icon} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
};

export default Homepage;
