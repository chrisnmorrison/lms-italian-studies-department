import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import QuizForm from "../../../components/editCourseContent/EditQuizQuestions";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [courseContent, setCourseContent] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { docId } = router.query;
      if (!docId) return; 

      setDocumentId(docId);
      setLoading(true);

      try {
        const docRef = doc(db, "courseContent", docId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const courseContentData = docSnapshot.data();
          setCourseContent(courseContentData);
        } else {
          console.log("Document not found");
          setError("Content not found.");
        }
      } catch (fetchError) {
        console.error("Error retrieving course content:", fetchError);
        setError("Failed to fetch course content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h1>
        Currently editing: <strong>{courseContent?.title || "Untitled Content"}</strong>
      </h1>

      {courseContent && courseContent.type === "quiz" ? (
        <QuizForm documentId={documentId} type="Quiz" />
      ) : (
        <p>No quiz content to display.</p>
      )}
    </div>
  );
}
