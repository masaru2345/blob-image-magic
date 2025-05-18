
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

interface EnhancedDropZoneProps {
  title: string;
  description: string;
  toolPath: string;
  gradientClass: string;
}

const EnhancedDropZone: React.FC<EnhancedDropZoneProps> = ({
  title,
  description,
  toolPath,
  gradientClass,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [blobShape, setBlobShape] = useState({
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%"
  });
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animate blob on mount
  useEffect(() => {
    setIsVisible(true);
    
    // Animate blob shape
    const interval = setInterval(() => {
      const randomBorderRadius = [
        `${60 + Math.random() * 20}% ${40 + Math.random() * 20}% ${30 + Math.random() * 20}% ${70 + Math.random() * 20}%`,
        `/${60 + Math.random() * 20}% ${30 + Math.random() * 20}% ${70 + Math.random() * 20}% ${40 + Math.random() * 20}%`
      ].join(' ');
      
      setBlobShape({ borderRadius: randomBorderRadius });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle ripple effect on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback(
    (file: File) => {
      // Store the file in sessionStorage as a URL
      const fileUrl = URL.createObjectURL(file);
      sessionStorage.setItem("imageFile", fileUrl);
      sessionStorage.setItem("fileName", file.name);
      // Navigate to the tool page
      navigate(toolPath);
    },
    [navigate, toolPath]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          processFile(file);
        }
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  // Handle mouse enter/leave
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden transition-all duration-700 transform cursor-pointer
        ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
        ${isDragging ? "scale-[1.03] shadow-xl" : isHovering ? "scale-[1.02] shadow-lg" : "shadow-md"}
        ${gradientClass}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: blobShape.borderRadius,
        transition: "all 0.5s ease, border-radius 3s ease-in-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Ripple effects */}
      {isHovering && (
        <>
          <div 
            className="absolute bg-white/20 rounded-full pointer-events-none animate-ripple"
            style={{
              width: 120,
              height: 120,
              top: position.y - 60,
              left: position.x - 60,
            }}
          ></div>
          <div 
            className="absolute bg-white/10 rounded-full pointer-events-none animate-ripple"
            style={{
              width: 200,
              height: 200,
              top: position.y - 100,
              left: position.x - 100,
              animationDelay: "0.2s",
              animationDuration: "1.5s",
            }}
          ></div>
        </>
      )}
      
      <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full min-h-[280px]">
        <div 
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm ${
            isDragging ? "animate-bounce" : "animate-float"
          }`}
        >
          <Upload 
            className="w-12 h-12 text-white" 
            strokeWidth={1.5} 
          />
        </div>
        <h3 className="text-3xl font-heading font-bold text-white mb-3 drop-shadow-md">{title}</h3>
        <p className="text-white/95 text-center max-w-xs text-lg font-medium drop-shadow-sm">{description}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Upload image to ${title}`}
        />
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute inset-0 animate-pulse-slow opacity-80"></div>
        
        {/* Interior depth effects */}
        <div className="absolute -inset-[40%] top-[80%] left-[10%] w-full h-full rounded-[50%] bg-white/10 blur-xl"></div>
        <div className="absolute -inset-[10%] bottom-[20%] right-[5%] w-1/2 h-1/2 rounded-[50%] bg-white/5 blur-md"></div>
      </div>
    </div>
  );
};

export default EnhancedDropZone;
