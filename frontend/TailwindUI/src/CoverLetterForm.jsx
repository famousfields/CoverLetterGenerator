import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CoverLetterForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription.trim()) {
      alert("Please upload your resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://coverlettergenerator-io59.onrender.com/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data.cover_letter);
    } catch (err) {
      console.error(err);
      alert("There was an error generating the cover letter.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Save feedback when rating is selected
  useEffect(() => {
    const sendFeedback = async () => {
      if (rating > 0 && response) {
        try {
          await axios.post("https://coverlettergenerator-io59.onrender.com/submit-feedback", {
            rating,
            cover_letter: response,
          });
          console.log("✅ Feedback submitted successfully");
        } catch (err) {
          console.error("❌ Error submitting feedback:", err);
        }
      }
    };
    sendFeedback();
  }, [rating, response]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Cover Letter Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Upload Resume (PDF or DOCX)
          </label>
          <div>
            <label
              htmlFor="resume-upload"
              className="inline-block px-4 py-2 border rounded-md border-gray-300 cursor-pointer hover:bg-gray-100"
            >
              {resumeFile ? resumeFile.name : "Choose File"}
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="8"
            placeholder="Paste the job description here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </form>

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Generated Cover Letter
          </h2>
          <div className="p-4 border rounded whitespace-pre-wrap bg-gray-50 text-black">
            {response}
          </div>

          {/* ⭐ Rating Area */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Rate This Cover Letter</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`text-3xl cursor-pointer ${
                    (hoveredRating || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                You rated this: {rating} star{rating > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}