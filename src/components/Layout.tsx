
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const Layout = () => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Add particles animation effect
    const addParticles = () => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle: Element) => {
        const htmlParticle = particle as HTMLElement;
        const size = Math.random() * 60 + 20;
        const speed = Math.random() * 10 + 20;
        const distance = Math.random() * 400 + 100;
        const position = Math.random() * 100;
        
        htmlParticle.style.width = `${size}px`;
        htmlParticle.style.height = `${size}px`;
        htmlParticle.style.left = `${position}%`;
        htmlParticle.style.animationDelay = `${Math.random() * 5}s`;
        htmlParticle.style.animationDuration = `${speed}s`;
        htmlParticle.style.opacity = (Math.random() * 0.4 + 0.1).toString();
        htmlParticle.style.transform = `translateY(${distance}px)`;
      });
    };
    
    setTimeout(addParticles, 100);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Dynamic animated blobs */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full filter blur-[80px] opacity-60 animate-blob" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full filter blur-[80px] opacity-60 animate-blob" style={{ animationDelay: "2s" }}></div>
        {!isMobile && (
          <div className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-accent/30 to-primary/30 rounded-full filter blur-[80px] opacity-50 animate-blob" style={{ animationDelay: "4s" }}></div>
        )}
        
        {/* Floating particles */}
        {mounted && (
          <>
            <div className="particle absolute rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-accent/10 to-primary/10 animate-float-up"></div>
            {!isMobile && (
              <>
                <div className="particle absolute rounded-full bg-gradient-to-br from-primary/10 to-accent/10 animate-float-up"></div>
                <div className="particle absolute rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 animate-float-up"></div>
              </>
            )}
          </>
        )}
        
        {/* Light effects */}
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white opacity-5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-white opacity-5 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
