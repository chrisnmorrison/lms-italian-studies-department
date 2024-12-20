import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import useSWR from 'swr'

const fetchCourses = async () => {
  const coursesCollection = collection(db, 'courses')
  const coursesSnapshot = await getDocs(coursesCollection)
  const courseData = [];
  coursesSnapshot.forEach((doc) => {
    const course = { id: doc.id, ...doc.data() };

      courseData.push(course);
    
  });
    return courseData
}

export default function useFetchCourses() {
  const { currentUser } = useAuth()
  const { data: courses, error } = useSWR(currentUser ? 'courses' : null, fetchCourses)
  return {
    courses: courses || [],
    isLoading: !error && !courses,
    isError: error,
  }
}
