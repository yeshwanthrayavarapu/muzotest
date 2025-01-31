import React from 'react';
import { Mic, Music, Download } from 'lucide-react';

const steps = [
  {
    icon: <Music className="w-12 h-12 text-cyan-400" />,
    title: "Describe your idea",
    description: "Start by typing your description of music you like to hear."
  },
  {
    icon: <Mic className="w-12 h-12 text-cyan-400" />,
    title: "Upload Recording",
    description: "Upload your recording or song idea."
  },
  {
    icon: <Download className="w-12 h-12 text-cyan-400" />,
    title: "Music Ready",
    description: "Download your fully-generated AI music in seconds."
  }
];

export function Features() {
  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-12 bg-[#0a0d12]">
      <h2 className="text-4xl font-bold text-cyan-400 mb-6">Create Your AI Music</h2>
      <p className="text-lg text-gray-400 max-w-2xl text-center mb-16">
        Experience the power of AI to transform your song ideas into reality.
        Describe your idea, upload your audio file, and let our AI generate professional-quality music tailored to your preferences.
      </p>
      
      <div className="flex justify-center gap-24 flex-wrap">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center max-w-xs">
            <div className="mb-6 p-4 bg-[#1a0b2e] rounded-full">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}