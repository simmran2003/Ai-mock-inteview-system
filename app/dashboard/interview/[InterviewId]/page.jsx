'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from "axios";


function Interview() {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const { InterviewId } = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const enableMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebCamEnabled(true);
      stream.getTracks().forEach(track => track.stop()); // Stop immediately after checking permission
    } catch (err) {
      console.error("Permission denied or error in accessing media devices:", err);
      setWebCamEnabled(false);
    }
  };
  
  useEffect(() => {
    if (!InterviewId) return;
    
    const fetchInterviewDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/interviews/${InterviewId}`);
        const data = await response.json();
        setInterviewData(data);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      }
    };

    fetchInterviewDetails();
  }, [InterviewId]);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const interviewRes = await axios.get(`http://localhost:5000/api/interviews/${InterviewId}`);
      const { jsonResponse } = interviewRes.data;
      const skills = jsonResponse?.skills;
  
      if (!skills || skills.length === 0) {
        throw new Error("No skills found for this interview");
      }
  
      // Step 1: Get questions from Django
      const djangoRes = await fetch("http://127.0.0.1:8000/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
  
      if (!djangoRes.ok) {
        throw new Error("Failed to generate questions");
      }
  
      const djangoData = await djangoRes.json();
      const Questions = djangoData.questions;


      // console.log("✅ RAW Questions from Django before sending to Node:", JSON.stringify(Questions, null, 2));

      // Step 2: Send questions to Node.js server to store them
      const storeRes = await axios.post(`http://localhost:5000/api/questions/generate/${InterviewId}`, {
        Questions,
      });
  
      if (storeRes.status !== 201) {
        throw new Error("Failed to store generated questions");
      }
  
      console.log("Questions stored:", storeRes.data);
      router.push(`/dashboard/interview/${InterviewId}/start`);
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start the interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className='my-10'>
      <h2 className='font-bold flex justify-center text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div>
          
          {webCamEnabled ? (
            <Webcam
            audio={true}
            muted={true}
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            style={{ height: 400, width: 450 }}
            mirrored={true}
            />
          ) : (
            <>
              <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary' />
              <div className='flex justify-center'>
              <Button
                className="bg-red-500 text-white hover:bg-red-700"
                onClick={enableMediaDevices}
              >
                Enable Web Cam and Microphone
              </Button>

              </div>
            </>
          )}
        </div>
        <div className='flex flex-col my-5 gap-5'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData?.jobRole || 'Loading...'}</h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData?.jobDescription || 'Loading...'}</h2>
          </div>
          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'>
              <Lightbulb />
              <strong>Information:</strong>
            </h2>
            <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
      </div>
      <div className='flex justify-end items-end'>
        <div className="flex flex-col items-end">
          <Button 
            onClick={handleStartInterview} 
            disabled={loading || !webCamEnabled}
            className={`${(!webCamEnabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Starting..." : "Start Interview"}
          </Button>
          {!webCamEnabled && (
            <p className="text-sm text-red-500 mt-2 italic">
              Please enable your webcam and microphone to proceed.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Interview;
