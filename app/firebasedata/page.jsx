
// app/hello/page.js
"use client"; // Important! Needed for using useState/useEffect in App Router

import { useState, useEffect } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../lib/firebase"; // adjust the path to your firebase.js

export default function HelloPage() {
  const [imgUrl, setImgUrl] = useState([]);

  useEffect(() => {
    listAll(ref(storage, "photos")).then((imgs) => {
      const urls = [];
      const promises = imgs.items.map((val) =>
        getDownloadURL(val).then((url) => {
          urls.push(url);
        })
      );
      Promise.all(promises).then(() => {
        setImgUrl(urls);
      });
    });
  }, []);

  return (
    <div className="photos-page">
      <header className="page-header">
        <h1>All Photos</h1>
      </header>

      <div className="photo-grid grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {imgUrl.map((photo, index) => (
          <div className="photo-item" key={index}>
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="rounded shadow-md"
              style={{ height: "300px", width: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
