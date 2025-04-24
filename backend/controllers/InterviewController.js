const multer = require("multer");
const upload = multer();
const Interview = require("../models/Interview");

exports.createInterview = [
  upload.none(), // Parses text fields from FormData
  async (req, res) => {
      try {
          const { jobRole, jobDescription, createdBy, skills } = req.body;

          if (!jobRole || !jobDescription || !createdBy || !skills) {
              return res.status(400).json({ error: "All fields are required" });
          }

          const parsedSkills = JSON.parse(skills); // Comes in as a JSON string

          const newInterview = new Interview({
              jobRole,
              jobDescription,
              jsonResponse: {
                  skills: parsedSkills,
              },
              createdBy,
          });

          await newInterview.save();
          res.status(201).json({ message: "Interview created!", interviewId: newInterview._id });
      } catch (error) {
          console.error("Error creating interview:", error);
          res.status(500).json({ error: "Server error" });
      }
  }
];

exports.getInterviewById = async (req, res) => {
    try {
      const { interviewId } = req.params;
      const interview = await Interview.findById(interviewId);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };