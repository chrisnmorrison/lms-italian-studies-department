import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { v4 } from "uuid";

export default function Page() {
  const [course, setCourse] = useState({
    name: "",
    courseCode: "",
    section: "",
    year: "",
    semester: "",
    isVirtual: false,
    activeCourse: false,
    location: "",
    dayOfWeek: "",
    time: "",
    description: "",
    bannerUrl: "",
  });
  const [bannerUpload, setBannerUpload] = useState(null);

  const router = useRouter();
  const { docId } = router.query;

  const fetchCourseData = async () => {
    if (!docId) return;

    try {
      const docRef = doc(db, "courses", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCourse(docSnap.data());
      } else {
        console.error("Document not found!");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleFileUpload = async (file) => {
    const storageRef = ref(storage, `images/${v4()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const bannerUrl = bannerUpload ? await handleFileUpload(bannerUpload) : course.bannerUrl;

      const updatedCourse = { ...course, bannerUrl };
      const docRef = doc(db, "courses", docId);

      await updateDoc(docRef, updatedCourse);
      console.log("Course updated:", updatedCourse);

      router.push("/courses");
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [docId]);

  return (
    <div>
      <h1 className="lg-title mb-5">Edit Course Information</h1>
      <form className="form-lg" onSubmit={handleSubmit}>
        <label>Course Name</label>
        <input
          value={course.name}
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
          type="text"
          placeholder="Course Name"
          required
        />

        <label>Course Code</label>
        <input
          value={course.courseCode}
          onChange={(e) => setCourse({ ...course, courseCode: e.target.value.replace(/\s/g, "") })}
          type="text"
          placeholder="e.g. ITAL1000"
          required
        />

        <label>Banner Picture Upload</label>
        <input
          type="file"
          onChange={(e) => setBannerUpload(e.target.files[0])}
        />
        {bannerUpload && <p>{bannerUpload.name}</p>}

        <label>Course Section</label>
        <input
          value={course.section}
          onChange={(e) => setCourse({ ...course, section: e.target.value.replace(/\s/g, "") })}
          type="text"
          placeholder="e.g. A"
          required
        />

        <label>Year</label>
        <input
          value={course.year}
          onChange={(e) => setCourse({ ...course, year: e.target.value.replace(/\s/g, "") })}
          type="text"
          placeholder="e.g. 2023"
          required
        />

        <label>Semester</label>
        <select
          value={course.semester}
          onChange={(e) => setCourse({ ...course, semester: e.target.value })}
          required
        >
          <option value="">Select</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
        </select>

        <label>Is this class virtual?</label>
        <input
          type="checkbox"
          checked={course.isVirtual}
          onChange={(e) => setCourse({ ...course, isVirtual: e.target.checked })}
        />

        <label>Is this class actively running?</label>
        <input
          type="checkbox"
          checked={course.activeCourse}
          onChange={(e) => setCourse({ ...course, activeCourse: e.target.checked })}
        />

        <label>Building & Location</label>
        <input
          value={course.location}
          onChange={(e) => setCourse({ ...course, location: e.target.value })}
          type="text"
          placeholder="e.g. River Building, 2200"
        />

        <label>Day</label>
        <select
          value={course.dayOfWeek}
          onChange={(e) => setCourse({ ...course, dayOfWeek: e.target.value })}
        >
          <option value="">Select</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>

        <label>Time</label>
        <input
          value={course.time}
          onChange={(e) => setCourse({ ...course, time: e.target.value })}
          type="time"
        />

        <label>Course Description</label>
        <textarea
          rows="5"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          placeholder="Course Description"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
