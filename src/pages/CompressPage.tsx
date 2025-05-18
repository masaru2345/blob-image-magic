
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Download, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  compressImage,
  formatFileSize,
  downloadImage
} from "../utils/imageUtils";

const CompressPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [format, setFormat] = useState<"webp" | "jpeg" | "avif">("webp");
  const [quality, setQuality] = useState<number>(80);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [comparison, setComparison] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Get image from session storage
  useEffect(() => {
    const storedImageUrl = sessionStorage.getItem("imageFile");
    const storedFileName = sessionStorage.getItem("fileName");
    
    if (!storedImageUrl || !storedFileName) {
      navigate("/");
      return;
    }
    
    setImageUrl(storedImageUrl);
    setFileName(storedFileName);
    
    // Get original size
    fetch(storedImageUrl)
      .then(response => response.blob())
      .then(blob => {
        setOriginalSize(blob.size);
      });
  }, [navigate]);

  // Process image when format or quality changes
  useEffect(() => {
    const compressWithCurrentSettings = async () => {
      if (imageUrl) {
        setIsProcessing(true);
        
        try {
          const blob = await compressImage(imageUrl, format, quality);
          
          if (compressedImageUrl) {
            URL.revokeObjectURL(compressedImageUrl);
          }
          
          const url = URL.createObjectURL(blob);
          setCompressedImageUrl(url);
          setCompressedSize(blob.size);
        } catch (error) {
          console.error("Error compressing image:", error);
          toast({
            title: "Error",
            description: "Failed to compress image",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    const timeoutId = setTimeout(compressWithCurrentSettings, 300);
    return () => clearTimeout(timeoutId);
  }, [imageUrl, format, quality, toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!compressedImageUrl) {
      toast({
        title: "Error",
        description: "No compressed image available for download",
        variant: "destructive",
      });
      return;
    }
    
    fetch(compressedImageUrl)
      .then(response => response.blob())
      .then(blob => {
        const fileNameParts = fileName.split('.');
        fileNameParts.pop(); // Remove extension
        const baseName = fileNameParts.join('.');
        const newFileName = `${baseName}-compressed.${format}`;
        
        downloadImage(blob, newFileName);
        
        toast({
          title: "Success",
          description: "Voilà! Your compressed image has been saved.",
        });
      })
      .catch(error => {
        console.error("Error downloading image:", error);
        toast({
          title: "Error",
          description: "Failed to download image",
          variant: "destructive",
        });
      });
  }, [compressedImageUrl, fileName, format, toast]);

  // Handle back navigation
  const handleBack = () => {
    // Clean up URLs
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
    
    navigate("/");
  };

  // Enhanced comparison slider handling with mouse events for better control
  const handleComparisonChange = useCallback((value: number[]) => {
    setComparison(value[0]);
  }, []);
  
  const handleComparisonDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);
  
  const handleComparisonDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Enhanced UI with better visual indicators and animation
  return (
    <div className="max-w-6xl mx-auto relative z-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="mr-2 hover:bg-primary/10 transition-colors duration-300"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-heading font-bold gradient-text animate-fade-in">
          Compress Image
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8 animate-fade-in" style={{animationDelay: "0.1s"}}>
        <div className="bg-card rounded-lg shadow-md p-6 backdrop-blur-sm border border-primary/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Image size={16} className="text-primary" />
            </div>
            Compression Settings
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Tabs defaultValue="webp" value={format} onValueChange={(v) => setFormat(v as "webp" | "jpeg" | "avif")}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="webp">WebP</TabsTrigger>
                  <TabsTrigger value="jpeg">JPEG</TabsTrigger>
                  <TabsTrigger value="avif">AVIF</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality">Quality: {quality}%</Label>
                <span className="text-sm text-muted-foreground">
                  {compressedSize > 0 && (
                    <>
                      {formatFileSize(compressedSize)} 
                      {" "}
                      <span className={compressedSize < originalSize * 0.5 ? "text-green-500 font-medium" : ""}>
                        ({Math.round((compressedSize / originalSize) * 100)}% of original)
                      </span>
                    </>
                  )}
                </span>
              </div>
              <Slider
                id="quality"
                min={1}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6 backdrop-blur-sm border border-primary/10 animate-fade-in" style={{animationDelay: "0.2s"}}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Image size={16} className="text-primary" />
            </div>
            Before vs After
          </h2>
          
          {imageUrl && compressedImageUrl ? (
            <div className="space-y-6">
              <div className="relative h-[400px] rounded-xl overflow-hidden border border-muted group">
                {isProcessing ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
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
                          src={imageUrl}
                          alt="Original"
                          className="h-full w-auto max-w-none min-w-full object-cover"
                        />
                      </div>
                      {/* Label for the original image */}
                      <div className="absolute top-4 left-4 bg-black/70 text-white text-xs py-1 px-3 rounded-full font-medium z-30">
                        Original: {formatFileSize(originalSize)}
                      </div>
                      
                      {/* Draggable divider */}
                      <div
                        className={`absolute top-0 bottom-0 right-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-30 cursor-ew-resize ${isDragging ? 'ring-2 ring-primary' : ''}`}
                        onMouseDown={handleComparisonDragStart}
                        onMouseUp={handleComparisonDragEnd}
                        onTouchStart={handleComparisonDragStart}
                        onTouchEnd={handleComparisonDragEnd}
                      >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <div className="flex">
                            <ChevronLeft size={14} className="text-gray-600" />
                            <ChevronRight size={14} className="text-gray-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                      <img
                        src={compressedImageUrl}
                        alt="Compressed"
                        className="h-full w-auto max-w-none min-w-full object-cover"
                      />
                    </div>
                    
                    {/* Label for the compressed image */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs py-1 px-3 rounded-full font-medium z-20">
                      Compressed: {formatFileSize(compressedSize)}
                    </div>
                    
                    <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                      <Slider
                        value={[comparison]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleComparisonChange}
                        className="z-30"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-center p-6 bg-muted/30 backdrop-blur-md rounded-xl border border-primary/10">
                <p className="text-lg font-medium mb-6 gradient-text">
                  Voilà, your compressed image is ready!
                </p>
                <Button 
                  onClick={handleDownload} 
                  className="w-full md:w-auto group relative overflow-hidden"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:via-primary/20 animate-[shimmer_2s_infinite] pointer-events-none"></span>
                  <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5 group-hover:scale-110 duration-300" />
                  Download Compressed Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted/50 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center">
                <Image className="w-12 h-12 text-muted-foreground animate-pulse" />
                <p className="text-muted-foreground mt-2">Loading image...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-muted/30 p-6 rounded-xl border border-primary/5 backdrop-blur-sm animate-fade-in" style={{animationDelay: "0.3s"}}>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Image size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">How does it work?</h3>
              <p className="text-muted-foreground">
                Our compression tool uses advanced algorithms to reduce your image size while preserving visual quality. 
                WebP typically offers the best compression-to-quality ratio for most images, 
                while AVIF can provide even smaller files but with less browser support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressPage;
