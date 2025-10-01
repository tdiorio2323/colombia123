import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Showcase from "../components/Showcase";
import Footer from "../components/Footer";

export default function Index() {
  return (
    <main className="bg-primary text-secondary min-h-screen flex flex-col">
      <Hero />
      <Features />
      <Showcase />
      <Footer />
    </main>
  );
}
