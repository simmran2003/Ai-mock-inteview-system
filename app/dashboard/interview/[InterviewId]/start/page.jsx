'use client'
import Question from './_components/Question'
import React, { useEffect, useState } from 'react'
// import RecordAnswer from './_components/RecordAnswer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'


const RecordAnswer = dynamic(() => import('./_components/RecordAnswer'), {
  ssr: false,
  loading: () => <p>Loading...</p>, // optional: show while component loads
})


function StartInterview({ params }) {
    const { InterviewId } = useParams();  // Ensure key is correct
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [savedAnswers, setSavedAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // NEW
    
    useEffect(() => {
        async function fetchQuestions() {
            try {
                console.log(InterviewId); // Debugging
                const res = await fetch(`http://localhost:5000/api/questions/${InterviewId}`);
                const data = await res.json();
                setInterviewQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }

        if (InterviewId) fetchQuestions();  // Ensure it's fetched only when available
    }, [InterviewId]);
    console.log("Interview Questions: ",interviewQuestions); // Debugging
    const handleEndInterview = async () => {
        setIsSubmitting(true); // Show spinner
        const submissionData = interviewQuestions.map((q) => ({
            questionId: q._id,
            questionDesc: q.questionDesc,
            correctAnswer: q.correctAnswer,
            userAnswer: q.userAnswer || "",
        }));

        try {
            const response = await fetch('http://127.0.0.1:8000/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ InterviewId, submissionData }),
            });

            const { results } = await response.json();

            await Promise.all(
                results.map((res) =>
                    fetch(`http://localhost:5000/api/questions/${res.questionId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            questionId: res.questionId,
                            feedback: res.feedback,
                            score: res.score,
                        }),
                    })
                )
            );

            // Delay for 5 seconds before redirecting
            setTimeout(() => {
                window.location.href = `/dashboard/interview/${InterviewId}/feedback`;
            }, 5000);

        } catch (err) {
            console.error("Failed to evaluate or update answers:", err);
            setIsSubmitting(false);
        }
    };
      
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <Question activeQuestion={activeQuestion} interviewQuestions={interviewQuestions} />
                <div className="md:sticky md:top-20">
                <RecordAnswer
                setIsAnswerSaved={(status) => {
                    setSavedAnswers((prev) => ({
                    ...prev,
                    [interviewQuestions[activeQuestion]?._id]: status,
                    }));
                }}
                questionId={interviewQuestions[activeQuestion]?._id}
                questionDescription={interviewQuestions[activeQuestion]?.questionDesc}
                />
                </div>

            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestion > 0 && <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>Previous Question</Button>}
                {activeQuestion < interviewQuestions.length - 1 && (
                <Button
                    disabled={!savedAnswers[interviewQuestions[activeQuestion]?._id]}
                    onClick={() => {
                    setActiveQuestion(activeQuestion + 1);
                    }}
                >
                    Next Question
                </Button>
              
                )}
                {activeQuestion === interviewQuestions.length - 1 && (
                    <Button disabled={isSubmitting} onClick={handleEndInterview}>
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin w-4 h-4" />
                                Submitting...
                            </div>
                        ) : (
                            "End Interview"
                        )}
                    </Button>
                )}

            </div>
        </div>
    );
}

export default StartInterview;
