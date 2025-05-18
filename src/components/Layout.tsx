
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
    
    // Create sparkles effect
    const createSparkles = () => {
      const sparkleContainer = document.createElement('div');
      sparkleContainer.className = 'absolute inset-0 pointer-events-none z-0 overflow-hidden';
      document.body.appendChild(sparkleContainer);
      
      const createSparkle = () => {
        const sparkle = document.createElement('div');
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 5;
        
        sparkle.className = 'absolute rounded-full bg-white animate-sparkle';
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${posX}px`;
        sparkle.style.top = `${posY}px`;
        sparkle.style.opacity = '0';
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.animationDelay = `${delay}s`;
        
        sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => {
          sparkle.remove();
        }, (duration + delay) * 1000);
      };
      
      // Create initial batch of sparkles
      for (let i = 0; i < 20; i++) {
        createSparkle();
      }
      
      // Continuously create new sparkles
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          createSparkle();
        }
      }, 300);
      
      return () => {
        clearInterval(interval);
        sparkleContainer.remove();
      };
    };
    
    const cleanupSparkles = createSparkles();
    
    return () => {
      cleanupSparkles();
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Enhanced Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Dynamic animated blobs with more vibrant colors */}
        <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full filter blur-[80px] opacity-70 animate-blob" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-gradient-to-br from-secondary/40 to-accent/40 rounded-full filter blur-[80px] opacity-70 animate-blob" style={{ animationDelay: "2s", animationDuration: "20s" }}></div>
        <div className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] bg-gradient-to-br from-accent/40 to-primary/40 rounded-full filter blur-[80px] opacity-60 animate-blob" style={{ animationDelay: "4s", animationDuration: "25s" }}></div>
        <div className="absolute bottom-[20%] right-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full filter blur-[60px] opacity-50 animate-blob" style={{ animationDelay: "1s", animationDuration: "30s" }}></div>
        
        {/* Additional animated elements for visual depth */}
        <div className="absolute top-[10%] left-[40%] w-[20vw] h-[20vw] bg-gradient-to-br from-white/5 to-white/10 rounded-full filter blur-[40px] opacity-40 animate-pulse-slow" style={{ animationDuration: "8s" }}></div>
        <div className="absolute bottom-[40%] right-[30%] w-[25vw] h-[25vw] bg-gradient-to-br from-white/5 to-white/10 rounded-full filter blur-[50px] opacity-30 animate-pulse-slow" style={{ animationDuration: "12s", animationDelay: "2s" }}></div>
        
        {/* Enhanced floating particles with better animations */}
        {mounted && (
          <>
            <div className="particle absolute rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-accent/10 to-primary/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-primary/10 to-accent/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-white/5 to-white/20 animate-float-up"></div>
            <div className="particle absolute rounded-full bg-gradient-to-br from-white/10 to-white/5 animate-float-up"></div>
          </>
        )}
        
        {/* Enhanced light effects with glow */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary opacity-5 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary opacity-5 rounded-full filter blur-[150px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
        {/* Grid overlay for depth */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTRoMnptMCAyNHYtMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNGgtMmMwIDkuOTQgOC4wNiAxOCAxOCAxOHoiIHN0cm9rZT0iIzIwMjAyMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiLz48L2c+PC9zdmc+')] opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
