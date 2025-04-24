
"use client";
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../lib/firebase"; // adjust path if needed

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please choose a file!");

    setUploading(true);
    const fileRef = ref(storage, `photos/${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setImages((prev) => [...prev, url]);
      setFile(null);
      alert("✅ Image uploaded!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Optional: Fetch already existing images
  const fetchImages = async () => {
    const listRef = ref(storage, "photos");
    const items = await listAll(listRef);
    const urls = await Promise.all(items.items.map((item) => getDownloadURL(item)));
    setImages(urls);
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Upload Image to Firebase</h2>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={uploadFile}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <button
        onClick={fetchImages}
        className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Load Uploaded Images
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Uploaded ${idx}`}
            className="w-full h-64 object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
