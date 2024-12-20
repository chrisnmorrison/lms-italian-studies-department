import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import {
  query,
  collection,
  where,
  getDoc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export default function CourseCard(props) {
  const { children, edit, edittedValue, setEdittedValue, courseKey, onDelete } = props;
  const { code } = courseKey;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?\n\nDeleting a course will move it to Archived Courses."
    );
    if (confirmDelete) {
      try {
        const courseQuery = query(
          collection(db, "courses"),
          where("code", "==", code)
        );
        const querySnapshot = await getDocs(courseQuery);
        const courseDocRef = querySnapshot.docs[0].ref;

        const courseSnapshot = await getDoc(courseDocRef);
        const courseData = courseSnapshot.data();

        const archivedCoursesCollection = collection(db, "archivedCourses");
        await addDoc(archivedCoursesCollection, courseData);

        await deleteDoc(courseDocRef);

        console.log("Course moved to archives");
        if (onDelete) onDelete(); 
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <div className="p-2 relative sm:p-3 border flex items-center border-white border-solid">
      <div className="flex-1 flex flex-col">
        {!(edit === courseKey) ? (
          <>{children}</>
        ) : (
          <input
            className="bg-inherit flex-1 text-white outline-none"
            value={edittedValue}
            onChange={(e) => setEdittedValue(e.target.value)}
          />
        )}
      </div>
      <Link href={`editCourse/${courseKey.code}`}>
        <Button sx={{ mr: 0.5 }} variant="contained">
          Edit Course
        </Button>
      </Link>
      <Button
        sx={{ ml: 0.5 }}
        color="error"
        variant="contained"
        onClick={handleDelete}
      >
        Delete Course
      </Button>
    </div>
  );
}
