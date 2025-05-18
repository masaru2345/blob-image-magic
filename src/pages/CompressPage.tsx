
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Download, Image } from "lucide-react";
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
    
    const timeoutId = setTimeout(compressWithCurrentSettings, 500);
    return () => clearTimeout(timeoutId);
  }, [imageUrl, format, quality, toast, compressedImageUrl]);

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

  const handleComparisonChange = useCallback((value: number[]) => {
    setComparison(value[0]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-heading font-bold gradient-text">Compress Image</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Compression Settings</h2>
          
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
                      ({Math.round((compressedSize / originalSize) * 100)}% of original)
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
              />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Before vs After</h2>
          
          {imageUrl && compressedImageUrl ? (
            <div className="space-y-6">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
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
                      <div
                        className="absolute top-0 bottom-0 right-0 w-0.5 bg-primary"
                        style={{ boxShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                      ></div>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                      <img
                        src={compressedImageUrl}
                        alt="Compressed"
                        className="h-full w-auto max-w-none min-w-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 px-6">
                      <Slider
                        value={[comparison]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleComparisonChange}
                        className="z-10"
                      />
                    </div>
                    <div className="absolute top-4 left-4 bg-black/50 text-white text-xs py-1 px-2 rounded">
                      Original: {formatFileSize(originalSize)}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs py-1 px-2 rounded">
                      Compressed: {formatFileSize(compressedSize)}
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium mb-6 gradient-text">
                  Voilà, your compressed image is ready!
                </p>
                <Button 
                  onClick={handleDownload} 
                  className="w-full md:w-auto"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Compressed Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
              <div className="flex flex-col items-center">
                <Image className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Loading image...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-muted p-6 rounded-lg">
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
