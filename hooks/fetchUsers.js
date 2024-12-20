import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import useSWR from 'swr'

const fetchUsers = async () => {
  const usersCollection = collection(db, 'users')
  const usersSnapshot = await getDocs(usersCollection)
  const userData = [];
  usersSnapshot.forEach((doc) => {
    const user = { id: doc.id, ...doc.data() };

      userData.push(user);
    
  });
    return userData
}

export default function useFetchUsers() {
  const { currentUser } = useAuth()
  const { data: users, error } = useSWR(currentUser ? 'users' : null, fetchUsers)
  return {
    users: users || [],
    isLoading: !error && !users,
    isError: error,
  }
}
