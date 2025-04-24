'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
function InterviewCard({interview}) {
  
    const router = useRouter()  
    const onStart = () => {
        router.push(`/dashboard/interview/12/`)
    }
    const feedbackClick = () => {
        router.push(`/dashboard/interview/12/feedback`)
    }
    return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-[#4845D2]'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{interview.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-400'>Created At: {interview.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-5'>
            <Button onClick={feedbackClick}size="sm" variant="outline" className="w-full">Feedback</Button>
            <Button onClick={onStart} size="sm" className="w-full">Start</Button>
        </div>
    </div>
  )
}

export default InterviewCard