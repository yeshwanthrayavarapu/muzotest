import React, { useState, useRef } from 'react';
import { Upload, Mic } from 'lucide-react';

interface AudioInputProps {
  onAudioCapture: (file: File) => void;
}

export function AudioInput({ onAudioCapture }: AudioInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioCapture(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        onAudioCapture(file);
        setRecordingStatus('Recording completed');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus('Recording in progress...');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setRecordingStatus('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-[#2c284e] p-5 rounded-lg flex gap-5 items-center">
      <div>
        <label className="text-gray-400 text-sm block mb-2">Upload Audio File</label>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          id="audio-upload"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => document.getElementById('audio-upload')?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-[#3b3159] hover:bg-cyan-400 transition-colors rounded-lg text-white"
        >
          <Upload size={20} />
          Choose Audio
        </button>
      </div>

      <div>
        <label className="text-gray-400 text-sm block mb-2">Record Audio</label>
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b3159] hover:bg-cyan-400 transition-colors rounded-lg text-white"
          >
            <Mic size={20} />
            Start Recording
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 bg-[#7b6eff] hover:bg-cyan-400 transition-colors rounded-lg text-white"
            >
              Stop Recording
            </button>
            <p className="text-sm text-gray-400">{recordingStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}