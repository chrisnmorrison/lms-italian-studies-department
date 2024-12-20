import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "./CourseCard";
import {
  doc,
  setDoc,
  deleteField,
  addDoc,
  collection,
} from "firebase/firestore";
import { db , storage} from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";
import { useRouter } from "next/router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function UserDashboard() {
  const router = useRouter();
  const { userInfo, currentUser } = useAuth();
  const [bannerUpload, setBannerUpload] = useState(null);
  const [course, setCourse] = useState({
    activeCourse: true,
  });


  //console.log(courses)

  // useEffect(() => {
  //     if (!userInfo || Object.keys(userInfo).length === 0) {
  //         setAddCourse(true)
  //     }
  // }, [userInfo])

  async function handleAddCourse(event) {
    event.preventDefault(); // Prevent form submission refresh
  
    if (!course.name || !course.courseCode) {
      alert("Please fill in all required fields.");
      return;
    }
  
    let storageRef;
    let bannerUrl = '';
  
    // Handle banner upload if any
    if (bannerUpload) {
      storageRef = ref(storage, `images/${v4() + bannerUpload.name}`);
      await uploadBytes(storageRef, bannerUpload);
      bannerUrl = await getDownloadURL(storageRef);
    }
  
    // Prepare course data
    const updatedCourse = {
      ...course,
      bannerUrl: bannerUrl,
    };
  
    try {
      await addDoc(collection(db, "courses"), updatedCourse);
      setCourse({
        name: '',
        courseCode: '',
        section: '',
        year: '',
        semester: '',
        isVirtual: false,
        activeCourse: true,
        location: '',
        dayOfWeek: '',
        time: '',
        description: ''
      });
      router.push("/courses");
    } catch (error) {
      console.error("Error adding course: ", error);
      alert("There was an issue adding the course. Please try again.");
    }
  }
  

  return (
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
      
        <div className="w-full">  <h2 className="mb-8 text-3xl text-center">Add New Course</h2>
          <form className="form-lg">
           
              <label className="">
                Course Name
              </label>
              <input
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="Course Name"
                required
              />
           
              <label className="">
                Course Code
              </label>
              <input
                value={course.courseCode}
                onChange={(e) => setCourse({ ...course, courseCode: e.target.value.replace(/\s/g, '') })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="e.g. ITAL1000"
                required
              />
              <label className="mt-10" htmlFor="file">Banner Picture Upload</label>
     <input
              
              type="file"
              name="file"
              id="file"
              className="sr-only"
              onChange={(e) => {
                setBannerUpload(e.target.files[0]);
              }}
            />
            <label
              htmlFor="file"
              id="videoFile"
              name="videoFile"
              className="relative flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-4 text-center"
            >
              <div>
              
                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  Browse
                </span>
                {bannerUpload && 
                <p className="text-black">{bannerUpload.name}</p>}
              </div>
            </label>
               <label className="">
                Course Section
              </label>
              <input
                value={course.section}
                onChange={(e) => setCourse({ ...course, section: e.target.value.replace(/\s/g, '') })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="e.g. A"
                required
              />
                <label className="">
                Year
              </label>
              <input
                value={course.year}
                onChange={(e) => setCourse({ ...course, year: e.target.value.replace(/\s/g, '') })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="e.g. 2023"
                required
              />
           
              <label className="">
                Semester
              </label>
              <select
    value={course.semester}
    onChange={(e) => setCourse({ ...course, semester: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="courseName"
    required
  >
      <option value=""></option>
    <option value="winter">Winter</option>
    <option value="spring">Spring</option>
    <option value="summer">Summer</option>
    <option value="fall">Fall</option>
  </select>
           
  <label className="">
    Is this class virtual?
  </label>
  <input
    checked={course.isVirtual}
    onChange={(e) => setCourse({ ...course, isVirtual: e.target.checked })}
    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    type="checkbox"
    id="virtualClass"
    required
  />

<label className="">
    Is this class actively running? (inactive classes will not be shown to students)
  </label>
  <input

    checked={course.activeCourse}
    onChange={(e) => setCourse({ ...course, activeCourse: e.target.checked })}
    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    type="checkbox"
    id="virtualClass"
    required
  />
        
  <label className="">
    Building & Location
  </label>
  <input
    value={course.location}
    onChange={(e) => setCourse({ ...course, location: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="courseName"
    type="text"
    placeholder="e.g. River Building, 2200 (optional, leave blank if class is virtual)"  />

  <label className="">
    Day
  </label>
  <select
    value={course.dayOfWeek}
    onChange={(e) => setCourse({ ...course, dayOfWeek: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="location"
  >
    <option value=""></option>
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
    <option value="Saturday">Saturday</option>
    <option value="Sunday">Sunday</option>
  </select>

  <label className="">
    Time
  </label>
  <input
    value={course.time}
    onChange={(e) => setCourse({ ...course, time: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="courseName"
    type="time"
  />

              <label className="">
                Course Description
              </label>
              <textarea
              required
                rows="5"
                value={course.description}
                onChange={(e) =>
                  setCourse({ ...course, description: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="Course Description"
       />
              <button
                onClick={handleAddCourse}
                className="btn"
                type="button"
              >
                Submit
              </button>
            
          </form>
        </div>
        {/* <input type='text' placeholder="Enter course" value={course} onChange={(e) => setCourse(e.target.value)} className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1" />
                <button onClick={handleAddCourse} className='w-fit px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-40'>ADD</button>
          */}{" "}
      </div>
    </div>
  );
}

export const GetServerSideProps = () => {};
