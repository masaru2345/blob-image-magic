
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
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      className={`relative overflow-hidden rounded-[2rem] transition-all duration-300 transform cursor-pointer
        ${isDragging ? "scale-[1.02] shadow-xl" : isHovering ? "scale-[1.01] shadow-lg" : "shadow-md"}
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
        borderRadius: "60% 40% 60% 40% / 40% 60% 40% 60%",
        transition: "all 0.5s ease, border-radius 4s ease-in-out",
        animation: "blob-morph 10s ease-in-out infinite alternate",
      }}
    >
      {/* Ripple effect */}
      {isHovering && (
        <div 
          className="absolute bg-white/20 rounded-full pointer-events-none animate-ripple"
          style={{
            width: 100,
            height: 100,
            top: position.y - 50,
            left: position.x - 50,
          }}
        ></div>
      )}
      
      <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full min-h-[280px]">
        <div 
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm ${
            isDragging ? "animate-bounce" : "animate-float"
          }`}
        >
          <Upload 
            className="w-10 h-10 text-white" 
            strokeWidth={1.5} 
          />
        </div>
        <h3 className="text-2xl font-heading font-bold text-white mb-3">{title}</h3>
        <p className="text-white/90 text-center max-w-xs text-lg">{description}</p>
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
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute inset-0 animate-pulse-slow opacity-70"></div>
      </div>
    </div>
  );
};

export default EnhancedDropZone;
