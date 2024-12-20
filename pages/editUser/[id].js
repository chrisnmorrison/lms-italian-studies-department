import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "@mui/material";

export default function Page() {
  const options = ["ITA 1113", "ITA 1114", "ITA 1911"];
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    program: '',
    studentNumber: '',
    enrollmentDate: '',
    registeredCourses: [],
    activeStudent: false,
    isAdmin: false,
  });
  const [activeCourses, setActiveCourses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", id);
        const userDoc = await getDoc(userRef);

        const coursesCollection = collection(db, "courses");
        const activeCoursesQuery = query(coursesCollection, where("activeCourse", "==", true));
        const coursesSnapshot = await getDocs(activeCoursesQuery);
        
        const courseData = [];
        coursesSnapshot.forEach((doc) => {
          courseData.push({ id: doc.id, ...doc.data() });
        });

        setActiveCourses(courseData);

        if (userDoc.exists()) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...userDoc.data(),
            registeredCourses: userDoc.data().registeredCourses || [],
          }));
        }
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error retrieving user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedFormData = { ...formData, registeredCourses: formData.registeredCourses || [] };
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, updatedFormData);
      setSuccessMessage("Data saved successfully!");

      setTimeout(() => {
        router.push("/users");
      }, 5000);
    } catch (error) {
      setError("Error updating user data.");
      console.error("Error updating user:", error);
    }
  };

  const handleRegisteredCourseChange = (event) => {
    const courseId = event.target.value;
    const isChecked = event.target.checked;

    setFormData((prevFormData) => {
      const updatedCourses = isChecked
        ? [...prevFormData.registeredCourses, courseId]
        : prevFormData.registeredCourses.filter((course) => course !== courseId);

      return {
        ...prevFormData,
        registeredCourses: updatedCourses,
      };
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!formData) return <p>No profile data</p>;

  return (
    <>
      <h1 className="lg-title mb-5">Edit User</h1>
      <h2 className="md-title">
        User: <strong>{formData.firstName} {formData.lastName} ({formData.email})</strong>
      </h2>
      <form className="form-lg" id="editCourseForm" onSubmit={handleSubmit}>
        {["Title", "First Name", "Last Name", "Email", "Department", "Program", "Student Number"].map((field, idx) => (
          <div key={idx}>
            <label htmlFor={field.toLowerCase()}>{field}</label>
            <input
              type={field === "Email" ? "email" : "text"}
              id={field.toLowerCase()}
              name={field.toLowerCase()}
              placeholder={field}
              value={formData[field.toLowerCase()]}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            />
          </div>
        ))}
        <div className="date-picker-container">
          <label className="mr-2" htmlFor="enrollmentDate">Student&apos;s Enrolment Date:</label>
          <input
            type="date"
            id="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
          />
        </div>

        <div className="flex flex-col text-left">
          <label>Courses Registration</label>
          {activeCourses.map((course, i) => (
            <div className="flex items-center" key={i}>
              <input
                type="checkbox"
                name="registeredCourses"
                value={course.id}
                checked={formData.registeredCourses.includes(course.id)}
                onChange={handleRegisteredCourseChange}
              />
              <label className="ml-2">{course.courseCode} {course.section} - {course.name}</label>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <label>Active Student?</label>
          <input
            type="checkbox"
            name="activeStudent"
            checked={formData.activeStudent}
            onChange={(e) => setFormData({ ...formData, activeStudent: e.target.checked })}
          />
          <label htmlFor="activeStudent">Yes</label>
        </div>

        <div className="mt-5">
          <label>Is this user an administrator?</label>
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
          />
          <label htmlFor="isAdmin">Yes</label>
        </div>

        <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </>
  );
}
