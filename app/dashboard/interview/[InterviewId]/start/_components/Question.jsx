'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Lightbulb, Volume2, VolumeX } from 'lucide-react'

function Question({ interviewQuestions, activeQuestion }) {
  const bubbleRefs = useRef([])
  const containerRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false) // <- Mute state

  bubbleRefs.current = interviewQuestions.map(
    (_, i) => bubbleRefs.current[i] || React.createRef()
  )

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  const smoothScrollTo = (container, to, duration = 500) => {
    const start = container.scrollLeft
    const change = to - start
    let currentTime = 0
    const increment = 20

    const animateScroll = () => {
      currentTime += increment
      const val = easeInOutQuad(currentTime, start, change, duration)
      container.scrollLeft = val
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll)
      }
    }
    animateScroll()
  }

  const textToSpeech = (text) => {
    if (!text || isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    const ref = bubbleRefs.current[activeQuestion]
    const container = containerRef.current
    if (ref && ref.current && container) {
      const element = ref.current
      const containerWidth = container.offsetWidth
      const elementOffset = element.offsetLeft
      const elementWidth = element.offsetWidth
      const scrollTarget = elementOffset - (containerWidth - elementWidth) / 2
      smoothScrollTo(container, scrollTarget, 600)
    }
  }, [activeQuestion])

  useEffect(() => {
    textToSpeech(interviewQuestions[activeQuestion]?.questionDesc)
  }, [activeQuestion, interviewQuestions, isMuted])

  if (!interviewQuestions.length) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        className="flex overflow-x-hidden whitespace-nowrap p-2"
      >
        {interviewQuestions.map((q, idx) => (
          <div
            key={q._id}
            ref={bubbleRefs.current[idx]}
            className={`inline-block px-4 py-2 mx-2 rounded-lg text-center cursor-pointer transition-all whitespace-nowrap ${
              activeQuestion === idx
                ? 'bg-[#4845D2] text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <h2 className="text-sm md:text-base font-semibold">
              Question #{idx + 1}
            </h2>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full mt-1 inline-block">
              {q.skill}
            </span>
          </div>
        ))}
      </div>

      <div className="p-5 border rounded-lg bg-gray-100 shadow-lg">
        <h2 className="text-lg md:text-xl font-semibold">
          {interviewQuestions[activeQuestion].questionDesc}
        </h2>
        <p className="text-sm md:text-base text-gray-700 mt-2">
          <strong>Skill:</strong>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {interviewQuestions[activeQuestion].skill}
          </span>
        </p>

        {/* Toggle Mute/Unmute Icon */}
        <div className="mt-4">
          {isMuted ? (
            <VolumeX
              className="cursor-pointer text-gray-700 hover:text-black transition-colors"
              size={20}
              onClick={() => setIsMuted(false)}
            />
          ) : (
            <Volume2
              className="cursor-pointer text-gray-700 hover:text-black transition-colors"
              size={20}
              onClick={() => {
                setIsMuted(true)
                window.speechSynthesis.cancel() // Stop speaking immediately
              }}
            />
          )}
        </div>

        <div className="border rounded-lg p-5 bg-blue-100 mt-6 shadow-md">
          <h2 className="flex gap-2 items-center text-[#4845D2]">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <p className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Question