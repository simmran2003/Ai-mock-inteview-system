'use client'
import React, { useState, useEffect } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
  
function feedback() {
    const [feedbackList, setFeedbackList] = useState([]);
    const router = useRouter()
    const { InterviewId } = useParams();
  
    console.log("Interview ID: ", InterviewId); // Debugging
    useEffect(() => {
      console.log("Fetching feedback...");
      const fetchFeedback = async () => {
        if (!InterviewId) return;
    
        try {
          const res = await fetch(`http://localhost:5000/api/questions/${InterviewId}`);
          const data = await res.json();
          console.log("Feedback Data: ", data); // Debugging
          if (!res.ok) throw new Error(data.message || "Failed to fetch feedback");
          setFeedbackList(data);
        } catch (err) {
          console.error("Error fetching feedback:", err.message);
          setFeedbackList([]);
        }
      };
      fetchFeedback();
    }, [InterviewId]);
    
    console.log("Feedback List: ",feedbackList); // Debugging
    return (
    <div className='p-10'>
         {feedbackList?.length==0?
         <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
         :
         <>
         <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>
         <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
         <h2 className='text-[#4845D2] text-lg my-3'>Your overall interview rating: <strong>7/10</strong></h2>
        <h2 className='text-sm text-gray-500'>Find below interview questions with correct answer, Your answer and feedback for improvement:</h2>
        {feedbackList&&feedbackList.map((item,index)=>(
            <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className='p-2 bg-secondary flex justify-between rounded-lg my-2 text-left gap-7 w-full'>{item.questionDesc}<ChevronsUpDown className='h-5 w-5'/></CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.score}</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer:</strong>{item.userAnswer}</h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong>{item.correctAnswer}</h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-[#4845D2]'><strong>Feedback:</strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}       
        </>}
        <Button onClick={()=>{router.replace('/dashboard')}}>Go Home</Button>
    </div>
  )
}

export default feedback 