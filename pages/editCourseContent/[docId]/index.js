import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, collection, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import TextForm from "../../../components/editCourseContent/EditCourseTextContent";
import QuizForm from "../../../components/editCourseContent/EditCourseQuizContent";
import VideoForm from "../../../components/editCourseContent/EditCourseVideoContent";

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
          console.error("Document not found");
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

  const handleSubmit = async (formData) => {
    if (!documentId) {
      setError("No document ID provided.");
      return;
    }

    try {
      const docRef = doc(db, "courseContent", documentId);
      await updateDoc(docRef, formData);
      console.log("Form submitted successfully");
    } catch (submitError) {
      console.error("Error submitting form:", submitError);
      setError("Failed to submit the form. Please try again.");
    }
  };

  let formComponent = null;

  if (courseContent) {
    switch (courseContent.type) {
      case "text":
        formComponent = (
          <TextForm onSubmit={handleSubmit} documentId={documentId} type="Text" />
        );
        break;
      case "video":
        formComponent = (
          <VideoForm onSubmit={handleSubmit} documentId={documentId} type="Video" />
        );
        break;
      case "quiz":
        formComponent = (
          <QuizForm onSubmit={handleSubmit} documentId={documentId} type="Quiz" />
        );
        break;
      default:
        formComponent = <p>Unsupported content type.</p>;
    }
  }

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
      {formComponent || <p>No content available to edit.</p>}
    </div>
  );
}
