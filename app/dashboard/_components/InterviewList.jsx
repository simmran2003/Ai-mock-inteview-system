'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; // 👈 import Clerk's useUser
import InterviewCard from './InterviewCard';

function InterviewList() {
    const [interviewList, setInterviewList] = useState([]);
    const { user, isLoaded } = useUser(); // 👈 get user info from Clerk

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!isLoaded || !user) return; // wait until user info is available

            const userId = user.id; // Clerk gives you the user ID like this

            try {
                const res = await fetch(`http://localhost:5001/api/interviews?createdBy=${userId}`);
                const data = await res.json();

                const formattedData = data.map((interview) => ({
                    id: interview._id,
                    jobPosition: interview.jobRole,
                    jobExperience: interview.jsonResponse?.skills.length || 0,
                    createdAt: new Date(interview.createdAt).toISOString().split('T')[0],
                }));

                setInterviewList(formattedData);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            }
        };

        fetchInterviews();
    }, [user, isLoaded]); // run when user info is available

    return (
        <div className='mt-5'>
            <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList.map((interview, index) => (
                    <InterviewCard interview={interview} key={index} />
                ))}
            </div>
        </div>
    );
}

export default InterviewList;
