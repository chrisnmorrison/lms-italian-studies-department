import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, collection, getDocs, getDoc, query, where, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Button, Snackbar } from "@mui/material";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    department: "",
    program: "",
    studentNumber: "",
    enrollmentDate: "",
    activeStudent: false,
    isAdmin: false,
  });
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "users");
        const documentRef = doc(usersCollection, id);
        const document = await getDoc(documentRef);

        if (!document.exists()) {
          setErrorMessage("User not found.");
          setLoading(false);
          return;
        }

        const coursesCollection = collection(db, "courses");
        const activeCoursesQuery = query(coursesCollection, where("activeCourse", "==", true));
        const coursesSnapshot = await getDocs(activeCoursesQuery);

        const courseData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setActiveCourses(courseData);
        setFormData(document.data());
        setRegisteredCourses(document.data()?.registeredCourses || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedFormData = { ...formData, registeredCourses };
      const docToUpdate = doc(db, "users", id);
      await updateDoc(docToUpdate, updatedFormData);

      setSuccessMessage("Data saved successfully!");
      setTimeout(() => {
        router.push("/users");
      }, 3000);
    } catch (error) {
      console.error("Error updating data:", error);
      setErrorMessage("Failed to save data. Please try again.");
    }
  };

  const handleRegisteredCourseChange = (event) => {
    const courseId = event.target.value;
    setRegisteredCourses((prevCourses) =>
      event.target.checked
        ? [...new Set([...prevCourses, courseId])]
        : prevCourses.filter((course) => course !== courseId)
    );
  };

  const handleSnackbarClose = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  if (isLoading) return <p>Loading...</p>;
  if (!formData) return <p>No profile data found.</p>;

  return (
    <>
      <h1 className="lg-title mb-5">Edit User</h1>
      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          onClose={handleSnackbarClose}
          message={errorMessage}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      )}
      {successMessage && (
        <Snackbar
          open={!!successMessage}
          onClose={handleSnackbarClose}
          message={successMessage}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      )}
      <h2 className="md-title">
        User: <strong>{formData.firstName} {formData.lastName} ({formData.email})</strong>
      </h2>
      <form className="form-lg" id="editCourseForm" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <label htmlFor="first">First Name</label>
        <input
          type="text"
          id="first"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />

        <label htmlFor="last">Last Name</label>
        <input
          type="text"
          id="last"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <label htmlFor="department">Department</label>
        <input
          type="text"
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />

        <label htmlFor="program">Program</label>
        <input
          type="text"
          id="program"
          value={formData.program}
          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
        />

        <label htmlFor="studentNumber">Student Number</label>
        <input
          type="number"
          id="studentNumber"
          value={formData.studentNumber}
          onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
        />

        <label htmlFor="enrollmentDate">Enrollment Date</label>
        <input
          type="date"
          id="enrollmentDate"
          value={formData.enrollmentDate}
          onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
        />

        <div>
          <label>Courses Registration</label>
          {activeCourses.map((course) => (
            <div key={course.id}>
              <input
                type="checkbox"
                value={course.id}
                checked={registeredCourses.includes(course.id)}
                onChange={handleRegisteredCourseChange}
              />
              <label>{course.courseCode} {course.section} - {course.name}</label>
            </div>
          ))}
        </div>

        <div>
          <label>Active Student?</label>
          <input
            type="checkbox"
            checked={formData.activeStudent}
            onChange={(e) => setFormData({ ...formData, activeStudent: e.target.checked })}
          />
        </div>

        <div>
          <label>Administrator?</label>
          <input
            type="checkbox"
            checked={formData.isAdmin}
            onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
          />
        </div>

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
