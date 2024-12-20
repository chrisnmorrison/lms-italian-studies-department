import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import {
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Button } from "@mui/material";
import { startCase } from "lodash";
import Link from "next/link";

export default function Page() {
  const [courseContent, setCourseContent] = useState([]);
  const router = useRouter();
  const { docId } = router.query;

  useEffect(() => {
    if (!docId) return;

    const fetchData = async () => {
      try {
        const courseContentCollection = collection(db, "courseContent");
        const q = query(
          courseContentCollection,
          where("courseDocId", "==", docId)
        );
        const querySnapshot = await getDocs(q);

        const contentData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        contentData.sort((a, b) => a.contentOrder - b.contentOrder);
        setCourseContent(contentData);
      } catch (error) {
        console.error("Error retrieving course content:", error);
      }
    };

    fetchData();
  }, [docId]);

  const handleDelete = async (contentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this content?\nIt will be moved to Archived Course Content."
      )
    )
      return;

    try {
      const courseDocRef = doc(db, "courseContent", contentId);
      const courseSnapshot = await getDoc(courseDocRef);

      if (courseSnapshot.exists()) {
        const courseData = courseSnapshot.data();

        const archivedCollection = collection(db, "archivedCourseContent");
        await addDoc(archivedCollection, courseData);

        await deleteDoc(courseDocRef);

        setCourseContent((prev) =>
          prev.filter((content) => content.id !== contentId)
        );

        console.log("Content moved to archives.");
      } else {
        console.error("Content document does not exist.");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date format";

    const options = { month: "long", day: "numeric", year: "numeric" };
    return `${date.toLocaleDateString(undefined, options)} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div>
      <table className="table-dark">
        <thead>
          <tr>
            <th>Content Order</th>
            <th>Title</th>
            <th>Type</th>
            <th>Due At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseContent.map((content) => (
            <tr key={content.id}>
              <td>{content.contentOrder}</td>
              <td>{content.title}</td>
              <td>{startCase(content.type)}</td>
              <td>{formatDate(content.due)}</td>
              <td>
                {content.type === "video" && (
                  <Link href={`${docId}/editTimestamps/${content.id}`}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      sx={{ mx: 0.5 }}
                    >
                      Edit Video Questions
                    </Button>
                  </Link>
                )}
                {content.type === "quiz" && (
                  <Link href={`${docId}/editQuizQuestions/${content.id}`}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      sx={{ mx: 0.5 }}
                    >
                      Edit Quiz Questions
                    </Button>
                  </Link>
                )}
                <Link href={`${docId}/editCourseContent/${content.id}`}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ mx: 0.5 }}
                  >
                    Edit Content
                  </Button>
                </Link>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  sx={{ mx: 0.5 }}
                  onClick={() => handleDelete(content.id)}
                >
                  Delete Content
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5">
        <Link href={`/addCourseContent/${docId}`}>
          <Button variant="contained">Add New Content</Button>
        </Link>
      </div>
    </div>
  );
}
