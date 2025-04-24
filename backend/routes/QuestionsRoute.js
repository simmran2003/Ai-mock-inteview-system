const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Interview = require("../models/Interview");
const Question = require("../models/Question");

router.post("/generate/:interviewId", async (req, res) => {
    try {
      const interview = await Interview.findById(req.params.interviewId);
      if (!interview) return res.status(404).json({ message: "Interview not found" });
  
      const { Questions } = req.body;
      if (!Questions || typeof Questions !== "object") {
        return res.status(400).json({ message: "Invalid questions format" });
      }
  
      const allQuestions = [];
      // rawQuestions = { Python: {...}, Django: {...}, ... }
      Object.entries(Questions).forEach(([skill, levels]) => {
        if (typeof levels !== "object") return;
        ["easy", "medium", "hard"].forEach(level => {
          const questionText = levels[level];
          if (questionText) {
            allQuestions.push({
              skill,
              questionDesc: questionText,
              correctAnswer: "", // Can be filled later
              interviewId: interview._id,
            });
          }
        });
      });
  
      await Question.insertMany(allQuestions);
  
      res.status(201).json({
        message: "Questions stored successfully",
        count: allQuestions.length,
      });
    } catch (error) {
      console.error("Error storing questions:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
// API to fetch questions for an interview
router.get("/:interviewId", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.interviewId)) {
            return res.status(400).json({ message: "Invalid interview ID format" });
        }

        const questions = await Question.find({ interviewId: req.params.interviewId });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update user's answer, feedback, or score for a specific question
router.put("/:questionId", async (req, res) => {
  try {
      const { userAnswer, correctAnswer, feedback, score } = req.body;

      const updateFields = {};

      if (userAnswer !== undefined) {
          if (userAnswer.length < 10) {
              return res.status(400).json({ message: "Answer must be at least 10 characters long" });
          }
          updateFields.userAnswer = userAnswer;
      }

      if (correctAnswer !== undefined) {
          updateFields.correctAnswer = correctAnswer;
      }

      if (feedback !== undefined) {
          updateFields.feedback = feedback;
      }

      if (score !== undefined) {
          updateFields.score = score;
      }

      const updatedQuestion = await Question.findByIdAndUpdate(
          req.params.questionId,
          updateFields,
          { new: true }
      );

      if (!updatedQuestion) {
          return res.status(404).json({ message: "Question not found" });
      }

      res.json({ message: "Question updated successfully", question: updatedQuestion });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
