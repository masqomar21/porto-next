'use client';

import React, { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react';
import { RotateCw, RefreshCw, ZoomIn, Sun, Sliders, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageEditorModalProps {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onSave: (editedBlob: Blob) => void;
}

export function ImageEditorModal({
  open,
  imageSrc,
  onClose,
  onSave,
}: ImageEditorModalProps) {
  // Image layout properties
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);

  // Editor states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset all states
  const resetToDefault = () => {
    setScale(1);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
  };

  useEffect(() => {
    if (open) {
      resetToDefault();
      setImgLoaded(false);
    }
  }, [open, imageSrc]);

  if (!open || !imageSrc) return null;

  // Dragging handlers
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - offsetX, y: clientY - offsetY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setOffsetX(clientX - dragStart.x);
    setOffsetY(clientY - dragStart.y);
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleStartDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleDragMove(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Render canvas & save edited image
  const handleApply = async () => {
    if (!imgRef.current) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, 600, 600);

        // Apply visual CSS filters to canvas context
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;

        // 1. Translate to center of canvas (600x600 is 2x scale of 300x300 viewport)
        ctx.translate(300 + offsetX * 2, 300 + offsetY * 2);
        
        // 2. Rotate
        ctx.rotate((rotation * Math.PI) / 180);
        
        // 3. Scale (multiplying by 2 to account for canvas resolution)
        ctx.scale(scale * 2, scale * 2);

        // Determine base dimensions on screen (similar to stylesheet object-fit math)
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth = 300;
        let drawHeight = 300;

        if (imgAspectRatio > 1) {
          drawHeight = 300;
          drawWidth = 300 * imgAspectRatio;
        } else {
          drawWidth = 300;
          drawHeight = 300 / imgAspectRatio;
        }

        // Draw image centered on origin
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

        // Output to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              onSave(blob);
            } else {
              console.error('Canvas conversion to blob failed.');
              setIsProcessing(false);
            }
          },
          'image/webp',
          0.85
        );
      }
    } catch (err) {
      console.error('Error applying image edits:', err);
      setIsProcessing(false);
    }
  };

  // Calculate base width/height aspect ratio classes for loading preview
  const imgAspectRatio = imgRef.current ? imgRef.current.naturalWidth / imgRef.current.naturalHeight : 1;
  const isLandscape = imgAspectRatio > 1;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-4xl rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl h-[90vh] max-h-[700px] animate-in zoom-in-95 duration-300">
        
        {/* Left Panel: Crop Editor view */}
        <div className="flex-1 bg-black/40 flex flex-col items-center justify-center p-6 relative select-none">
          <div className="text-xs text-muted-foreground absolute top-4 left-6 font-mono bg-background/50 px-2 py-1 rounded-md">
            Drag image to reposition inside square
          </div>

          <div
            ref={containerRef}
            className="w-[300px] h-[300px] relative overflow-hidden rounded-xl border border-violet-500/50 shadow-lg bg-muted/10 cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleEndDrag}
            onMouseLeave={handleEndDrag}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEndDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                imgRef.current = el;
                if (el && !imgLoaded) {
                  el.onload = () => setImgLoaded(true);
                }
              }}
              src={imageSrc}
              alt="Source editor"
              draggable={false}
              className={cn(
                'absolute pointer-events-none transition-opacity duration-300',
                imgLoaded ? 'opacity-100' : 'opacity-0',
                isLandscape ? 'h-[300px] max-w-none w-auto' : 'w-[300px] max-h-none h-auto'
              )}
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) saturate(${saturation}%) blur(${blur}px)`,
                transformOrigin: 'center center',
              }}
            />

            {/* Square framing border guide */}
            <div className="absolute inset-0 border-2 border-dashed border-violet-500/60 pointer-events-none rounded-xl" />
          </div>

          {/* Quick Toolbar */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="h-9 gap-2 cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-violet-500" />
              Rotate 90°
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="h-9 gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-500" />
              Reset Settings
            </Button>
          </div>
        </div>

        {/* Right Panel: Adjustment Sliders */}
        <div className="w-full md:w-[340px] border-t md:border-t-0 md:border-l border-border flex flex-col justify-between bg-card overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-6 max-h-[calc(90vh-140px)] md:max-h-none">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Sliders className="w-5 h-5 text-violet-500" />
              Adjust Image
            </h3>

            {/* Zoom Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Zoom</span>
                <span>{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Brightness Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Contrast</span>
                <span>{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Saturation Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Saturation</span>
                <span>{saturation}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Grayscale Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Grayscale</span>
                <span>{grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={grayscale}
                onChange={(e) => setGrayscale(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Sepia Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Sepia</span>
                <span>{sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Blur Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Blur</span>
                <span>{blur.toFixed(1)}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.2"
                value={blur}
                onChange={(e) => setBlur(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="p-6 border-t border-border flex gap-3 bg-muted/20 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 h-10 gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isProcessing}
              className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Apply'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
