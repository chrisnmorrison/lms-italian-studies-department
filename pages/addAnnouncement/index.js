import React, { useReducer, useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Button = dynamic(() => import("@mui/material/Button"), { ssr: false });

const initialState = {
  title: "",
  releaseDate: "",
  expiryDate: "",
  text: "",
  courseCode: "",
  activeCourses: [],
};

function announcementReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_COURSE":
      return {
        ...state,
        activeCourses: action.checked
          ? [...state.activeCourses, action.value]
          : state.activeCourses.filter((id) => id !== action.value),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const useFetchActiveCourses = () => {
  const [activeCourses, setActiveCourses] = useState([]);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      const coursesQuery = query(
        collection(db, "courses"),
        where("activeCourse", "==", true)
      );
      const snapshot = await getDocs(coursesQuery);
      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActiveCourses(courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { activeCourses, error };
};

export default function AnnouncementsPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const { activeCourses, error } = useFetchActiveCourses();
  const [state, dispatch] = useReducer(announcementReducer, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "announcements"), {
        ...state,
        authorId: userInfo?.uid || "anonymous", 
      });

      dispatch({ type: "RESET" });
      router.push("/announcements");
    } catch (err) {
      console.error("Error adding announcement:", err);
      alert("Failed to add announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field) => (e) =>
    dispatch({ type: "SET_FIELD", field, value: e.target.value });

  const handleCourseToggle = (courseId) => (e) =>
    dispatch({
      type: "TOGGLE_COURSE",
      value: courseId,
      checked: e.target.checked,
    });

  return (
    <div className="w-full text-xs sm:text-sm mx-auto flex flex-col gap-5">
      <h2 className="mb-8 text-3xl text-center">Add New Announcement</h2>
      <form className="form-lg" onSubmit={handleSubmit}>
        <label>Announcement Title</label>
        <input
          value={state.title}
          onChange={handleFieldChange("title")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Announcement Title"
          required
        />

        <label>Announcement Release Date</label>
        <input
          value={state.releaseDate}
          onChange={handleFieldChange("releaseDate")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          type="datetime-local"
          required
        />

        <label>Announcement Expiry Date</label>
        <input
          value={state.expiryDate}
          onChange={handleFieldChange("expiryDate")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          type="datetime-local"
          required
        />

        <label>Announcement Text</label>
        <textarea
          value={state.text}
          onChange={handleFieldChange("text")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          rows="5"
          placeholder="Announcement Text"
          required
        />

        <div className="flex flex-col text-left">
          <label>
            Students registered in which courses should see this announcement?
          </label>
          {error && <p className="text-red-500">{error}</p>}
          {activeCourses.map((course) => (
            <div key={course.id} className="flex items-center">
              <input
                type="checkbox"
                value={course.id}
                checked={state.activeCourses.includes(course.id)}
                onChange={handleCourseToggle(course.id)}
              />
              <label className="ml-2">
                {course.courseCode} {course.section} - {course.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
