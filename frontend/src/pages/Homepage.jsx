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
  MapPin,
  Activity,
  CheckCircle,
  BarChart3,
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
                100% Geo-Verified Reporting
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-blue-600 font-bold">CivicConnect</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              The smartest way to report infrastructure issues, schedule trash pickups, and track municipal action with total transparency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/signup"
                className="group flex items-center gap-2 px-8 py-3.5 bg-blue-600 from-blue-500 to-blue-600 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow transition-all duration-300 hover:-translate-y-1"
              >
                Get Started
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

      {/* Modern Process Steps Overlapping Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-6 md:p-8 hover:shadow-blue-500/10 transition-all duration-500">
          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200/60">
            {[
              { 
                title: "1. Report Issue", 
                desc: "Geo-verified snap & submit", 
                icon: MapPin, 
                color: "text-blue-600",
                bg: "bg-blue-600/10"
              },
              { 
                title: "2. Live Tracking", 
                desc: "Monitor officer assignment", 
                icon: Activity, 
                color: "text-amber-600",
                bg: "bg-amber-500/10"
              },
              { 
                title: "3. Swift Resolution", 
                desc: "City infrastructure improved", 
                icon: CheckCircle, 
                color: "text-green-600",
                bg: "bg-green-500/10"
              },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-5 pt-6 md:pt-0 md:px-8 first:pt-0 first:pl-0 last:pr-0 group cursor-default">
                <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 ">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Built for{" "}
            <span className="text-blue-600 font-bold">Accountability</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Experience the future of civic management with tools designed to solve real problems, faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Verified Reporting"
            description="Report potholes, broken lights, and hazards. Our strict GPS and camera verification guarantees the authenticity of every issue."
            icon={<MapPin className="w-7 h-7" />}
            color="orange"
            delay={0}
          />
          <FeatureCard
            title="Executive Analytics"
            description="Empower city planners with macro-level insights. Visualize resolution rates, sector-by-sector performance, and advanced infrastructure metrics."
            icon={<BarChart3 className="w-7 h-7" />}
            color="teal"
            delay={0.1}
          />
          <FeatureCard
            title="Total Transparency"
            description="Direct dispatch to sector officers. Track resolution timestamps and immutable status logs for holding authorities accountable."
            icon={<Shield className="w-7 h-7" />}
            color="amber"
            delay={0.2}
          />
        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-center bg-gradient-to-br from-gray-900 via-[#0f172a] to-blue-950 shadow-2xl transform hover:scale-[1.01] transition-all duration-500 group">
          {/* Advanced abstract glows */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">better city?</span>
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Join leading municipalities and verified citizens already using 
              CivicConnect to seamlessly transform their local neighborhoods.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/signup"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-950 text-lg font-bold rounded-2xl hover:bg-gray-100 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
              >
                Create Your Account
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/signin"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white/10 text-white border border-white/20 text-lg font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
              >
                Sign In
              </a>
            </div>
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
      bg: "bg-orange-50/80",
      icon: "text-orange-600",
      border: "group-hover:border-orange-300",
      glow: "group-hover:shadow-orange-500/20",
    },
    teal: {
      bg: "bg-teal-50/80",
      icon: "text-teal-600",
      border: "group-hover:border-teal-300",
      glow: "group-hover:shadow-teal-500/20",
    },
    amber: {
      bg: "bg-amber-50/80",
      icon: "text-amber-600",
      border: "group-hover:border-amber-300",
      glow: "group-hover:shadow-amber-500/20",
    },
  };

  const colors = colorMap[color];

  return (
    <div
      className={`group relative bg-white border border-gray-200 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default ${colors.border} ${colors.glow}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Decorative gradient orb for hover */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 ${colors.bg}`}></div>
      
      <div
        className={`relative z-10 w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-8 ${colors.icon} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 border border-white shadow-sm`}
      >
        {icon}
      </div>
      <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="relative z-10 text-gray-600 leading-relaxed text-base">{description}</p>
    </div>
  );
};

export default Homepage;
