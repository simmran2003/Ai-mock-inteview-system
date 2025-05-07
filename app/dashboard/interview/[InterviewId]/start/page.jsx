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
    const [isNextLoading, setIsNextLoading] = useState(false);

    
    useEffect(() => {
        async function fetchQuestions() {
            try {
                console.log(InterviewId); // Debugging
                const res = await fetch(`http://localhost:5001/api/questions/${InterviewId}`);
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
    
        const fallbackPhrases = [
            "i don't know",
            "i am not sure",
            "i'm not familiar",
            "no idea",
            "not sure",
            "don't know"
        ];
    
        // Separate questions that require evaluation and those that don't
        const autoEvaluated = [];
        const toEvaluate = [];
    
        interviewQuestions.forEach((q) => {
            const userAnswer = q.userAnswer?.toLowerCase().trim() || "";
        
            const isEmpty = userAnswer === "";
            const shouldAutoScore = isEmpty || fallbackPhrases.some(phrase => userAnswer.includes(phrase));
        
            if (shouldAutoScore) {
                autoEvaluated.push({
                    questionId: q._id,
                    feedback: isEmpty
                        ? "No answer submitted. Please attempt the question next time."
                        : "Please prepare for this topic in more detail.",
                    score: 0,
                });
            } else {
                toEvaluate.push({
                    questionId: q._id,
                    questionDesc: q.questionDesc,
                    correctAnswer: q.correctAnswer,
                    userAnswer: q.userAnswer || "",
                });
            }
        });
        
    
        try {
            let evaluatedResults = [];
    
            if (toEvaluate.length > 0) {
                const response = await fetch('http://127.0.0.1:8000/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ InterviewId, submissionData: toEvaluate }),
                });
    
                const { results } = await response.json();
                evaluatedResults = results;
            }
    
            const combinedResults = [...autoEvaluated, ...evaluatedResults];
    
            await Promise.all(
                combinedResults.map((res) =>
                    fetch(`http://localhost:5001/api/questions/${res.questionId}`, {
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
    
            // Delay before redirecting
            setTimeout(() => {
                window.location.href = `/dashboard/interview/${InterviewId}/feedback`;
            }, 5000);
    
        } catch (err) {
            console.error("Failed to evaluate or update answers:", err);
            setIsSubmitting(false);
        }
    };
    
    const fetchAndStoreCorrectAnswer = async (question) => {
        try {
          let correctAnswer = localStorage.getItem(`correctAnswer-${question._id}`);
          if (!correctAnswer) {
            const correctRes = await fetch('http://127.0.0.1:8000/get-correct-answer/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                questionDescription: question.questionDesc,
              }),
            });
      
            const correctData = await correctRes.json();
            if (!correctRes.ok) throw new Error(correctData.error || 'Failed to fetch correct answer');
      
            correctAnswer = correctData.correctAnswer;
            console.log("Correct Answer: ", correctAnswer); // Debugging
            localStorage.setItem(`correctAnswer-${question._id}`, correctAnswer);
      
            // Also immediately update DB
            await fetch(`http://localhost:5001/api/questions/${question._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ correctAnswer }),
            });
          }
        } catch (err) {
          console.error('Error fetching/storing correct answer:', err);
        }
        console.log("Correct Answer: ", question.correctAnswer); // Debugging
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
                    disabled={isNextLoading}
                    // disabled={!savedAnswers[interviewQuestions[activeQuestion]?._id]}
                    onClick={async () => {
                    setIsNextLoading(true);
                    await fetchAndStoreCorrectAnswer(interviewQuestions[activeQuestion]);
                    setActiveQuestion(activeQuestion + 1);
                    setIsNextLoading(false);
                    }}
                    >
                        {isNextLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Loading...
                        </div>
                        ) : (
                        "Next Question"
                        )}
                    </Button>
              
                )}
                {activeQuestion === interviewQuestions.length - 1 && (
                    <Button
                        disabled={isSubmitting}
                        onClick={async () => {
                        await fetchAndStoreCorrectAnswer(interviewQuestions[activeQuestion]);
                        handleEndInterview();
                        }}
                    >
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
