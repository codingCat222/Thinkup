import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutThinkUp from "@/components/AboutThinkUp";
import AboutChallenge from "@/components/AboutChallenge";
import AgeCategories from "@/components/AgeCategories";
import HowItWorks from "@/components/HowItWorks";
import EventDetails from "@/components/EventDetails";
import RegistrationForm from "@/components/RegistrationForm";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
      <AboutThinkUp />
      <AboutChallenge />
      <AgeCategories />
      <HowItWorks />
      <EventDetails />
      <RegistrationForm />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}

