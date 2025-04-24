'use client'
import React, {useState} from 'react'
import InterviewCard from './InterviewCard'

function InterviewList() {
    const [interviewList, setInterviewList] = useState([
        {
            id: 1,
            jobPosition: "Frontend Developer",
            jobExperience: 2,
            createdAt: "2024-08-30"
        },
        {
            id: 2,
            jobPosition: "Backend Developer",
            jobExperience: 3,
            createdAt: "2024-08-28"
        },
        {
            id: 3,
            jobPosition: "Full Stack Engineer",
            jobExperience: 4,
            createdAt: "2024-08-25"
        },
        {
            id: 4,
            jobPosition: "Data Scientist",
            jobExperience: 5,
            createdAt: "2024-08-20"
        },
        {
            id: 5,
            jobPosition: "DevOps Engineer",
            jobExperience: 3,
            createdAt: "2024-08-18"
        }
    ]);
    
    return (
    <div className='mt-5'>
        <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {interviewList&&interviewList.map((interview,index)=>(
                <InterviewCard interview={interview} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default InterviewList