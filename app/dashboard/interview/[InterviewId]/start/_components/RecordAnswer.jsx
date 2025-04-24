'use client'
import Webcam from 'react-webcam'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic, StopCircle, Save, PlayCircle, PauseCircle } from 'lucide-react'
import { toast } from 'sonner'

function RecordAnswer({ questionId ,setIsAnswerSaved, questionDescription }) {
  const [webCamEnabled, setWebCamEnabled] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioChunks = useRef([])
  const audioRef = useRef(null)

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  })
  useEffect(() => {
    setUserAnswer('');
    setAudioURL('');
    setResults([]);
  }, [questionId]);
  
  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results.map((result) => result?.transcript).join(' '))
    }
  }, [results])

  // 🎤 Start/Stop Recording
  const handleRecordingToggle = async () => {
    if (isRecording) {
      stopSpeechToText()
      if (mediaRecorder) mediaRecorder.stop()
    } else {
      setResults([])
      setUserAnswer('')

      startSpeechToText()

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)

      audioChunks.current = []
      recorder.ondataavailable = (e) => audioChunks.current.push(e.data)

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        audioRef.current = new Audio(url)
        audioRef.current.onended = () => setIsPlaying(false) // reset on end
      }

      recorder.start()
    }
  }

  const handleAnalyzeAudio = async () => {
    if (!audioURL && !localStorage.getItem(`recordedAudio-${questionId}`)) {
      return toast.error('No recorded audio to analyze.');
    }
  
    try {
      setLoading(true);
  
      // Fetch the blob from the audioURL
      const res = await fetch(audioURL);
      const audioBlob = await res.blob();
  
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.wav');
  
      const response = await fetch('http://127.0.0.1:8000/interview/analyze/', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
  
      toast.success(`Emotion Detected: ${data.audio_emotion}`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to analyze audio: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveText = async () => {
    if (userAnswer.trim().length < 10) {
      toast.error('Answer must be at least 10 characters long');
      return;
    }
  
    try {
      setLoading(true);
      handleAnalyzeAudio(); // Call the audio analysis function
      // Check if correctAnswer is already in localStorage
      let correctAnswer = localStorage.getItem(`correctAnswer-${questionId}`);
  
      // If not, fetch from the server
      if (!correctAnswer) {
        const correctRes = await fetch('http://127.0.0.1:8000/get-correct-answer/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionDescription: questionDescription,
          }),
        });
  
        const correctData = await correctRes.json();
  
        if (!correctRes.ok) {
          throw new Error(correctData.error || 'Failed to fetch correct answer');
        }
  
        correctAnswer = correctData.correctAnswer;
  
        // Save to localStorage to avoid future fetches
        localStorage.setItem(`correctAnswer-${questionId}`, correctAnswer);
      }
  
      // Save both userAnswer and correctAnswer to DB
      const saveRes = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAnswer, correctAnswer }),
      });
  
      const saveData = await saveRes.json();
  
      if (!saveRes.ok) {
        throw new Error(saveData.message || 'Failed to update answer');
      }
  
      toast.success('Answer saved successfully to the database!');
      setIsAnswerSaved(true);
  
      localStorage.setItem(`userAnswer-${questionId}`, userAnswer);
      if (audioURL) {
        localStorage.setItem(`recordedAudio-${questionId}`, audioURL);
      }
  
    } catch (err) {
      console.error(err);
      toast.error('Error saving answer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handlePlayAudio = () => {
    if (!audioRef.current) {
      const storedURL = audioURL || localStorage.getItem(`recordedAudio-${questionId}`)
      if (!storedURL) return toast.error('No audio found')
      audioRef.current = new Audio(storedURL)
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col justify-center items-center bg-black p-5 rounded-lg relative my-10'>
            <Image
            width={200}
            height={200}
            src={'/webcam.svg'}
            alt='webcam'
            className='absolute'
            />
            <Webcam
            mirrored={true}
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            style={{ height: 300, width: '100%', zIndex: 10 }}
            />
        </div>

        {/* 🎤 Buttons aligned horizontally */}
        <div className='flex space-x-4 my-4'>
            {/* 🎤 Toggle Record */}
            <Button
            className='flex items-center gap-2'
            variant='outline'
            onClick={handleRecordingToggle}
            disabled={loading}
            >
            {isRecording ? (
                <span className='text-red-600 flex items-center gap-2'>
                <StopCircle size={20} /> Stop Recording
                </span>
            ) : (
                <span className='text-[#4845D2] flex items-center gap-2'>
                <Mic size={20} /> Record Answer
                </span>
            )}
            </Button>

            {/* 💾 Save Text */}
            <Button
            className='flex items-center gap-2'
            variant='outline'
            onClick={handleSaveText}
            >
            <Save size={20} /> Save Text Answer
            </Button>

            {/* 🔊 Play/Pause Audio */}
            <Button
            className='flex items-center gap-2'
            variant='outline'
            onClick={handlePlayAudio}
            disabled={!audioURL && !localStorage.getItem('recordedAudio')}
            >
            {isPlaying ? (
                <>
                <PauseCircle size={20} /> Pause Audio
                </>
            ) : (
                <>
                <PlayCircle size={20} /> Play Audio
                </>
            )}
            </Button>
            {/* ⬇️ Download Audio
          <Button
            className='flex items-center gap-2'
            variant='outline'
            onClick={() => {
              const storedURL = audioURL || localStorage.getItem(`recordedAudio-${questionId}`);
              if (!storedURL) return toast.error('No audio to download');

              const a = document.createElement('a');
              a.href = storedURL;
              a.download = `answer-${questionId}.wav`;
              a.click();
            }}
            disabled={!audioURL && !localStorage.getItem(`recordedAudio-${questionId}`)}
          >
            <Save size={20} /> Download Audio
          </Button> */}

        </div>
    </div>

  )
}

export default RecordAnswer
