
import { useEffect, useState } from "react";

const BackgroundElements = () => {
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    size: number;
    left: number;
    delay: number;
    duration: number;
    opacity: number;
  }>>([]);
  
  useEffect(() => {
    // Create random background bubbles
    const newBubbles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 150 + 50,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 15,
      opacity: Math.random() * 0.3 + 0.1
    }));
    
    setBubbles(newBubbles);
  }, []);
  
  return (
    <>
      {/* Ambient background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background to-background/80"></div>
        
        {/* Animated bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full animate-float-up bg-gradient-to-br from-primary/10 to-secondary/5"
            style={{
              width: bubble.size + 'px',
              height: bubble.size + 'px',
              left: bubble.left + '%',
              bottom: '-150px',
              opacity: bubble.opacity,
              animationDuration: bubble.duration + 's',
              animationDelay: bubble.delay + 's',
              filter: 'blur(10px)',
              '--opacity': bubble.opacity.toString()
            } as React.CSSProperties}
          ></div>
        ))}
        
        {/* Light beams */}
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-1/4 w-3/4 h-1/2 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Particles */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-sparkle"></div>
        <div className="absolute top-2/3 left-3/4 w-3 h-3 bg-secondary/40 rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-primary/20 rounded-full animate-sparkle" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Enhanced main page glows */}
      <div className="fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary/5 to-transparent blur-2xl"></div>
      <div className="fixed inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-secondary/5 to-transparent blur-2xl"></div>
    </>
  );
};

export default BackgroundElements;
