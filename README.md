# 🧠 AI-Powered Mock Interview System

An AI-driven mock interview platform that simulates real-world technical interviews using dynamic question generation, multimodal input analysis, and personalized feedback. Built for aspiring candidates to improve both technical skills and communication confidence.

## 🚀 Features

- 📄 **Resume & Job Description Parsing**: Extracts key skills from uploaded PDFs using fuzzy string matching.
- 🎯 **Adaptive Question Generation**: Uses Gemini API to create skill-specific questions with progressive difficulty.
- 🎙️ **Speech & Video Input Support**: Accepts answers via text, audio (transcribed using Wav2Vec2), or video.
- 😃 **Emotion & Confidence Analysis**:
  - Audio Emotion: Hugging Face model (fine-tuned on RAVDESS)
  - Facial Emotion: Ollama’s Gemma3 using stitched frame grid from user video
- 📊 **Automated Evaluation**: Combines technical correctness and emotion-based confidence into composite scores.
- 📝 **Personalized Feedback**: Visual feedback generated using Matplotlib, stored in MongoDB for progress tracking.

## 🛠️ Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Python (FastAPI)
- **NLP & Transcription**: Gemini API, Wav2Vec2
- **Emotion Models**: Hugging Face (Audio), Gemma3 (Video)
- **Database**: MongoDB
- **Visualization**: Matplotlib

## 📈 Results

- 89% accuracy in technical evaluation  
- 84% accuracy in emotion recognition  
- 17% average user performance improvement over 3 sessions  
## 📷 Sample Output

- Grid image input to Gemma3 (from video)
- Feedback dashboard with technical and emotional analysis
- Analytics plots for session-wise improvement

## 📁 Key Files

- 📄 [Final Project Report (IEEE Format)](https://drive.google.com/file/d/1AENm31LXqZ4BRr5HaVuqqKRQfBw_d6Xa/view?usp=sharing)
- 🧠 [Backend - Skill Matching,Resume & Job Description Parsing,Question Generation & Emotion Recognition](https://drive.google.com/file/d/1s3BWgqEiwhxyQNi1d6c0FAh1pubm9A0t/view?usp=drive_link)
- 📄 [Poster](https://drive.google.com/file/d/1LSPcX2CMVAEwFUoN8-heejzM2TzBVdsP/view?usp=drive_link)

## 🎬 Demo

📹 *Coming Soon — Project walkthrough and demo video will be uploaded here.*

## 🤝 Contributions

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.


