
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatFileSize } from "@/utils/imageUtils";

interface ComparisonSliderProps {
  originalImage: string | null;
  compressedImage: string | null;
  originalSize: number;
  compressedSize: number;
  comparison: number;
  isProcessing: boolean;
  isDragging: boolean;
  onComparisonChange: (value: number[]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const ComparisonSlider = ({
  originalImage,
  compressedImage,
  originalSize,
  compressedSize,
  comparison,
  isProcessing,
  isDragging,
  onComparisonChange,
  onDragStart,
  onDragEnd
}: ComparisonSliderProps) => {
  if (!originalImage || !compressedImage) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/50 backdrop-blur-sm rounded-2xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full animate-blob bg-primary/30 flex items-center justify-center">
            <div className="spinner"></div>
          </div>
          <p className="text-muted-foreground mt-2">Loading image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/80 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-primary/20 animate-bob" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 animate-pulse-slow">
          <div className="w-5 h-5 bg-white/50 rounded-full animate-ping absolute"></div>
          <div className="w-5 h-5 bg-white/80 rounded-full relative"></div>
        </div>
        Before vs After
      </h2>
      
      <div className="space-y-6">
        <div className="relative h-[400px] rounded-2xl overflow-hidden border border-muted group bg-gradient-to-br from-background to-muted/30">
          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div
                className="absolute top-0 left-0 h-full bg-transparent overflow-hidden"
                style={{ width: `${comparison}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-center">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="h-full w-auto max-w-none min-w-full object-cover"
                  />
                </div>
                {/* Label for the original image */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary/70 to-secondary/70 text-white text-xs py-1.5 px-4 rounded-full font-medium z-30 backdrop-blur-sm shadow-lg animate-pulse-slow">
                  Original: {formatFileSize(originalSize)}
                </div>
                
                {/* Draggable divider */}
                <div
                  className={`absolute top-0 bottom-0 right-0 w-0.5 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-30 cursor-ew-resize ${isDragging ? 'ring-2 ring-primary' : ''}`}
                  onMouseDown={onDragStart}
                  onMouseUp={onDragEnd}
                  onTouchStart={onDragStart}
                  onTouchEnd={onDragEnd}
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center animate-pulse-slow">
                    <div className="flex">
                      <ChevronLeft size={16} className="text-primary" />
                      <ChevronRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                <img
                  src={compressedImage}
                  alt="Compressed"
                  className="h-full w-auto max-w-none min-w-full object-cover"
                />
              </div>
              
              {/* Label for the compressed image */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary/70 to-primary/70 text-white text-xs py-1.5 px-4 rounded-full font-medium z-20 backdrop-blur-sm shadow-lg animate-pulse-slow">
                Compressed: {formatFileSize(compressedSize)}
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                <Slider
                  value={[comparison]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={onComparisonChange}
                  className="z-30"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
