'use client';

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  barColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  height?: number;
}

export function AudioVisualizer({
  audioElement,
  isPlaying,
  barColor = '#22d3ee',
  gradientFrom = '#22d3ee',
  gradientTo = '#1d4ed8',
  height = 200
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    // Cleanup function to handle unmounting
    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };

    // Setup audio context and analyzer only once
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const audioSource = audioContextRef.current.createMediaElementSource(audioElement);
        audioSource.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error('Error setting up audio visualization:', error);
        return cleanup;
      }
    }

    // Draw visualization
    const draw = () => {
      if (!analyserRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawVisualization = () => {
        animationRef.current = requestAnimationFrame(drawVisualization);
        
        analyserRef.current!.getByteFrequencyData(dataArray);
        
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          
          if (isPlaying) {
            // Create gradient effect when playing
            const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, gradientFrom);
            gradient.addColorStop(1, gradientTo);
            canvasCtx.fillStyle = gradient;
          } else {
            // Dimmed color when not playing
            canvasCtx.fillStyle = `${barColor}50`; // 50 is hex for 30% opacity
          }
          
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        }
      };
      
      drawVisualization();
    };
    
    draw();
    
    return cleanup;
  }, [audioElement, isPlaying, barColor, gradientFrom, gradientTo]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      width={1000}
      height={height}
    />
  );
}
