import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "./CourseCard";
import {
  doc,

  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";
import { Link } from "@mui/material";
import { Button } from "@mui/material";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [course, setCourse] = useState([]);
  const [edittedValue, setEdittedValue] = useState("");

  const { courses, isLoading, isError } = useFetchCourses();

  const handleArchive = async (courseKey) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to archive this course?\n\nThis will mark the course as inactive and remove it from the current courses list."
      );

      if (confirmed) {
        const courseDocRef = doc(db, "courses", courseKey);

        await updateDoc(courseDocRef, { activeCourse: false });

        console.log("Course archived successfully");
      }
    } catch (error) {
      console.error("Error archiving course:", error);
    }
  };

  return (
    <div className="w-full text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <h1 className="text-3xl">Course List</h1>
      </div>
      {isLoading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      <div className="current-courses">
        {!isLoading && (
          <>
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Active</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Section</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((content) => (
                  <tr
                    key={
                      content.name +
                      content.code +
                      content.semester +
                      content.year
                    }
                  >
                    <td>{content.activeCourse ? "✅" : "❌"}</td>
                    <td>{content.name}</td>
                    <td>{content.courseCode}</td>
                    <td>{content.section}</td>
                    <td>{content.dayOfWeek}</td>
                    <td>{content.time}</td>
                    <td className="flex">
                      <Link href={`/viewCourseStudents/${content.id}`}>
                        <Button
                          size="small"
                          sx={{ mr: 1 }}
                          variant="contained"
                          color="success"
                        >
                          View Students
                        </Button>
                      </Link>
                      <Link href={`/courseContent/${content.id}`}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                        >
                          Edit Content
                        </Button>
                      </Link>
                      <Link href={`/editCourse/${content.id}`}>
                        <Button
                          size="small"
                          sx={{ mr: 1, ml: 1 }}
                          variant="contained"
                        >
                          Edit Course
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleArchive(content.id)}
                      >
                        Archive Course
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5">
              <Link
                href="/AddCourse"
                underline="hover"
                style={{ fontSize: "200%", marginBottom: ".5rem" }}
              >
                <Button size="large" variant="outlined">
                  Add New Course
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const GetServerSideProps = () => {};
