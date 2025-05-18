
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

interface DropZoneProps {
  title: string;
  description: string;
  toolPath: string;
  gradientClass: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  title,
  description,
  toolPath,
  gradientClass,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  return (
    <div
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 transform ${
        isDragging ? "scale-[1.02] shadow-xl" : "hover:scale-[1.01] shadow-lg"
      } ${gradientClass} animate-pulse-slow`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full min-h-[250px] cursor-pointer">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm ${
            isDragging ? "animate-bounce" : "animate-float"
          }`}
        >
          <Upload 
            className="w-8 h-8 text-white" 
            strokeWidth={1.5} 
          />
        </div>
        <h3 className="text-2xl font-heading font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-center max-w-xs">{description}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="absolute inset-0 animate-blob opacity-70"></div>
    </div>
  );
};

export default DropZone;
