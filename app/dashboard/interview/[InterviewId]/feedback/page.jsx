'use client'
import React, { useState, useEffect } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state

  const router = useRouter();
  const { InterviewId } = useParams();

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!InterviewId) return;
  
      try {
        setIsLoading(true); // Start loading
        const res = await fetch(`http://localhost:5001/api/questions/${InterviewId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch feedback");
        setFeedbackList(data);
      } catch (err) {
        console.error("Error fetching feedback:", err.message);
        setFeedbackList([]);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchFeedback();
  }, [InterviewId]);
  
  const getRatingLabelAndEmoji = (avgScore) => {
    if (avgScore >= 8) return { label: "Excellent", emoji: "🌟", color: "text-green-600" };
    if (avgScore >= 6) return { label: "Good", emoji: "👍", color: "text-blue-600" };
    if (avgScore >= 4) return { label: "Average", emoji: "🙂", color: "text-yellow-600" };
    if (avgScore >= 2) return { label: "Needs Improvement", emoji: "⚠️", color: "text-orange-600" };
    return { label: "Poor", emoji: "❌", color: "text-red-600" };
  };

  const avgScore = feedbackList.length > 0
    ? feedbackList.reduce((acc, curr) => acc + (curr.score || 0), 0) / feedbackList.length
    : null;

  const rating = avgScore !== null ? getRatingLabelAndEmoji(avgScore) : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <h2 className="text-2xl font-semibold text-gray-700">Generating your results...</h2>
        <p className="text-gray-500">Please wait while we fetch your interview feedback.</p>
      </div>
    );
  }
  
  return (
    <div className='p-8 max-w-6xl mx-auto'>
      {feedbackList?.length === 0 ? (
        <h2 className='font-semibold text-xl text-gray-500 text-center'>No Interview Feedback Record Found</h2>
      ) : (
        <>
          <div className="text-center mb-8 space-y-2">
            <h2 className='text-4xl font-bold text-green-600 animate-pulse'>🎉 Congratulations!</h2>
            <h2 className='text-2xl font-semibold text-gray-800'>Here is your interview feedback</h2>
            {avgScore !== null && (
              <h2 className={`text-lg font-medium ${rating.color}`}>
                Your overall interview rating: <strong>{avgScore.toFixed(1)}/10</strong> {rating.emoji}
                <span className="ml-2 text-sm text-gray-600">({rating.label})</span>
              </h2>
            )}
            <p className='text-sm text-gray-500'>Below are your responses with evaluation and feedback.</p>
          </div>

          <div className='space-y-5'>
            {feedbackList.map((item, index) => (
              <Collapsible key={index} className='rounded-lg shadow-md transition duration-300'>
                <CollapsibleTrigger className='p-4 bg-gray-100 flex justify-between items-center rounded-lg hover:bg-gray-200 transition-colors duration-300 text-left w-full'>
                  <span className="text-md font-medium text-gray-800">{item.questionDesc}</span>
                  <ChevronsUpDown className='h-5 w-5 text-gray-600' />
                </CollapsibleTrigger>
                <CollapsibleContent className='p-4 bg-white border-t'>
                  <div className='flex flex-col gap-3 text-sm'>
                    <div className="flex gap-2 items-center">
                      <strong>Rating:</strong>
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${item.score >= 8 ? 'bg-green-500' : item.score >= 6 ? 'bg-blue-500' : item.score >= 4 ? 'bg-yellow-500 text-black' : 'bg-red-500'}`}>
                        {item.score}/10
                      </span>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <strong className="text-red-700">Your Answer:</strong> {item.userAnswer}
                    </div>
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <strong className="text-green-700">Correct Answer:</strong> {item.correctAnswer}
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <strong className="text-blue-700">Feedback:</strong> {item.feedback}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </>
      )}
      <div className='mt-10 text-center'>
        <Button className="bg-[#4845D2] hover:bg-[#3733b5] text-white px-6 py-2 rounded-lg shadow-md" onClick={() => router.replace('/dashboard')}>
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default Feedback;
