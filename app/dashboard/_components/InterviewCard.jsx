'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function InterviewCard({ interview }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onStart = () => {
    setLoading(true)
    router.push(`/dashboard/interview/${interview.id}/`)
  }

  const feedbackClick = () => {
    router.push(`/dashboard/interview/${interview.id}/feedback`)
  }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-[#4845D2]'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>Created At: {interview.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <Button onClick={feedbackClick} size="sm" variant="outline" className="w-full">
          Feedback
        </Button>

        <Button
          onClick={onStart}
          size="sm"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading...
            </span>
          ) : (
            'Start'
          )}
        </Button>
      </div>
    </div>
  )
}

export default InterviewCard
