import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  setDoc,
  deleteField,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [course, setCourse] = useState("");
  const [edittedValue, setEdittedValue] = useState("");

  const { courses, setCourses, loading, error } = useFetchCourses();

  async function handleAddCourse() {
    if (!course) {
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        name: course,
      });
      setCourse("");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  }

  async function handleEditCourse(i) {
    if (!edittedValue) {
      return;
    }
    const newKey = edit;
    setCourses({ ...courses, [newKey]: edittedValue });
    try {
      const userRef = doc(db, "courses", currentUser.uid);
      await setDoc(
        userRef,
        {
          courses: {
            [newKey]: edittedValue,
          },
        },
        { merge: true }
      );
      setEdit(null);
      setEdittedValue("");
    } catch (error) {
      console.error("Error updating course:", error);
    }
  }

  function handleAddEdit(courseKey) {
    return () => {
      setEdit(courseKey);
      setEdittedValue(courses[courseKey]);
    };
  }

  function handleDelete(courseKey) {
    return async () => {
      const tempObj = { ...courses };
      delete tempObj[courseKey];
      setCourses(tempObj);

      try {
        const userRef = doc(db, "courses", currentUser.uid);
        await setDoc(
          userRef,
          {
            courses: {
              [courseKey]: deleteField(),
            },
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    };
  }

  return (
    <div className="text-center w-full text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <h1 className="text-center text-3xl">Home</h1>
      <p>Navigate to the page of your choice using the left sidebar.</p>
    </div>
  );
}

export const GetServerSideProps = () => {};

