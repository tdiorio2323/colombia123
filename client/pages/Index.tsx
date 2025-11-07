import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Showcase from "../components/Showcase";
import Footer from "../components/Footer";

export default function Index() {
  return (
    <main className="bg-luxury-black text-luxury-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Luxury Background Layers */}
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <Showcase />
        <Footer />
      </div>
    </main>
  );
}
