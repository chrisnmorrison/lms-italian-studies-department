import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  doc,
  query,
  collection,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import TextForm from "../../../components/addCourseContent/AddCourseTextContent";
import QuizForm from "../../../components/addCourseContent/AddCourseQuizContent";
import VideoForm from "../../../components/addCourseContent/AddCourseVideoContent";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const router = useRouter();
  const { docId } = router.query;

  const fetchCourseData = useCallback(async () => {
    if (!docId) return;

    try {
      const docRef = doc(db, "courses", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        console.error("Course document does not exist.");
      }
    } catch (error) {
      console.error("Error retrieving course data:", error);
    }
  }, [docId]);

  const handleDropdownChange = (event) => {
    setSelectedDropdown(event.target.value);
  };

  const handleSubmit = useCallback(
    async (formData) => {
      try {
        await addDoc(collection(db, "courseContent"), formData);
        console.log("Content added successfully.");
        router.push(`/courseContent/${docId}`);
      } catch (error) {
        console.error("Error adding content:", error);
      }
    },
    [docId, router]
  );

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const renderFormComponent = () => {
    switch (selectedDropdown) {
      case "text":
        return <TextForm onSubmit={handleSubmit} documentId={docId} type="Text" />;
      case "video":
        return <VideoForm onSubmit={handleSubmit} documentId={docId} type="Video" />;
      case "quiz":
        return <QuizForm onSubmit={handleSubmit} documentId={docId} type="Quiz" />;
      default:
        return null;
    }
  };

  return (
    <div className="content-page">
      <h1>
        Adding New Content for Course:{" "}
        {data ? (
          <strong>
            {data.name} ({data.courseCode}
            {data.section})
          </strong>
        ) : (
          "Loading..."
        )}
      </h1>

      <div>
        <label htmlFor="options">Select Content Type:</label>
        <select
          id="options"
          value={selectedDropdown}
          onChange={handleDropdownChange}
          className="dropdown"
        >
          <option value="" disabled>
            -- Select an Option --
          </option>
          <option value="text">Text</option>
          <option value="video">Video</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>

      {renderFormComponent()}
    </div>
  );
}
