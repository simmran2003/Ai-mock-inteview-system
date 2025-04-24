'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobRole, setJobRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const {user} = useUser();
// Handle file selection
const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
        alert("File uploaded successfully!"); // Show alert immediately after selecting the file
    }
};

// Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    try {
        const djangoFormData = new FormData();
        djangoFormData.append("resume", selectedFile);
        djangoFormData.append("jobDescription", jobDescription);

        // Call Django to extract skills only
        const djangoResponse = await axios.post("http://127.0.0.1:8000/skills/", djangoFormData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const { skills } = djangoResponse.data;
        if (!skills) {
            throw new Error("Missing skills from Django response");
        }

        // Send to Node backend to save interview
        const nodeFormData = new FormData();
        nodeFormData.append("jobRole", jobRole);
        nodeFormData.append("jobDescription", jobDescription);
        nodeFormData.append("createdBy", user?.id);
        nodeFormData.append("skills", JSON.stringify(skills)); // ✅ Only skills
        const response = await axios.post("http://localhost:5000/api/interviews/create", nodeFormData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (!response.data.interviewId) {
            throw new Error("interviewId missing in final response");
        }

        router.push(`/dashboard/interview/${response.data.interviewId}`);
    } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to generate interview. Please try again.");
    } finally {
        setIsUploading(false);
        setOpenDialog(false);
        setJobRole("");
        setJobDescription("");
        setSelectedFile(null);
    }
};



    

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="text-lg text-center">+ Add New</h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your job interview
                        </DialogTitle>
                        <form onSubmit={handleSubmit}>
                            <div className="text-sm text-muted-foreground">
                                <h2>Add details about your job position/role</h2>

                                <div className="mt-7 my-2">
                                    <label>Job Role/Job Position</label>
                                    <Input
                                        placeholder="Ex. Full Stack Developer"
                                        value={jobRole}
                                        onChange={(e) => setJobRole(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="my-3">
                                    <label>Job Description</label>
                                    <Textarea
                                        placeholder="Ex. React, Angular, NodeJs, MySQL etc."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="my-3">
                                    <label>Attach Resume</label>
                                    <Input
                                        type="file"
                                        className="hover:shadow-md cursor-pointer"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-5 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUploading}>
                                    {isUploading ? <>
                                    <LoaderCircle className='animate-spin'/>Generating from AI
                                    </>:'Start Interview'}
                                </Button>
                            </div>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
