
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
import ComparisonSlider from "@/components/ComparisonSlider";
import BackgroundElements from "@/components/BackgroundElements";

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
  const compressWithCurrentSettings = useCallback(async () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    
    try {
      // Create a new Image object to ensure the image is fully loaded before compression
      const img = new Image();
      
      img.onload = async () => {
        try {
          const blob = await compressImage(imageUrl, format, quality);
          
          if (compressedImageUrl) {
            URL.revokeObjectURL(compressedImageUrl);
          }
          
          const url = URL.createObjectURL(blob);
          setCompressedImageUrl(url);
          setCompressedSize(blob.size);
        } catch (error) {
          console.error("Error in image onload handler:", error);
          toast({
            title: "Error",
            description: "Failed to process image",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };
      
      img.onerror = () => {
        console.error("Failed to load image for compression");
        toast({
          title: "Error",
          description: "Failed to load image for compression",
          variant: "destructive",
        });
        setIsProcessing(false);
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error("Error compressing image:", error);
      toast({
        title: "Error",
        description: "Failed to compress image",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }, [imageUrl, format, quality, compressedImageUrl, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(compressWithCurrentSettings, 300);
    return () => clearTimeout(timeoutId);
  }, [compressWithCurrentSettings]);

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

  // Handle comparison value change
  const handleComparisonChange = useCallback((value: number[]) => {
    setComparison(value[0]);
  }, []);
  
  // Handle drag events for better UX
  const handleComparisonDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);
  
  const handleComparisonDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto relative z-20">
      {/* Background animations */}
      <BackgroundElements />
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="mr-2 hover:bg-primary/10 transition-colors duration-300"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-heading font-bold gradient-text animate-scale-in">
          Compress Image
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8 animate-float">
        <div className="bg-card/80 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-primary/20 animate-bob" style={{animationDelay: "0.1s"}}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 animate-pulse-slow">
              <Image size={18} className="text-white" />
            </div>
            Compression Settings
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Tabs 
                defaultValue="webp" 
                value={format} 
                onValueChange={(v) => setFormat(v as "webp" | "jpeg" | "avif")}
                className="animate-sparkle"
              >
                <TabsList className="w-full grid grid-cols-3 bg-background/50 backdrop-blur-sm">
                  <TabsTrigger value="webp" className="data-[state=active]:bg-primary/70">WebP</TabsTrigger>
                  <TabsTrigger value="jpeg" className="data-[state=active]:bg-primary/70">JPEG</TabsTrigger>
                  <TabsTrigger value="avif" className="data-[state=active]:bg-primary/70">AVIF</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality" className="text-base">Quality: {quality}%</Label>
                <span className="text-sm bg-muted/70 px-3 py-1 rounded-full animate-pulse-slow">
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
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="bg-background/50 px-2 py-1 rounded-md">Smaller file</span>
                <span className="bg-background/50 px-2 py-1 rounded-md">Higher quality</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image comparison component */}
        {imageUrl && (
          <ComparisonSlider 
            originalImage={imageUrl}
            compressedImage={compressedImageUrl}
            originalSize={originalSize}
            compressedSize={compressedSize}
            comparison={comparison}
            isProcessing={isProcessing}
            onComparisonChange={handleComparisonChange}
            onDragStart={handleComparisonDragStart}
            onDragEnd={handleComparisonDragEnd}
            isDragging={isDragging}
          />
        )}
        
        <div className="bg-muted/30 p-6 rounded-2xl border border-primary/10 backdrop-blur-md animate-float" style={{animationDelay: "0.3s"}}>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-full">
              <Image size={28} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">How does it work?</h3>
              <p className="text-muted-foreground">
                Our compression tool uses advanced algorithms to reduce your image size while preserving visual quality. 
                WebP typically offers the best compression-to-quality ratio for most images, 
                while AVIF can provide even smaller files but with less browser support.
              </p>
              
              {compressedImageUrl && (
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button 
                    onClick={handleDownload} 
                    className="w-full md:w-auto group relative overflow-hidden"
                    size="lg"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:via-primary/20 animate-shimmer pointer-events-none"></span>
                    <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5 group-hover:scale-110 duration-300" />
                    Download Compressed Image
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleBack}
                    className="w-full md:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Try another image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressPage;
