import React, { useState, useEffect, useRef } from 'react'
import { doc, getDoc, getDocs, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

export default function useFetchAnnouncements() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [announcements, setAnnouncements] = useState([])

    useEffect(() => {
        const fetchData = async () => {
          const announcementsCollection = collection(db, 'announcements');
          const announcementsSnapshot = await getDocs(announcementsCollection);
          const announcementsData = announcementsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAnnouncements(announcementsData);
          setLoading(false);
        };
      
        fetchData();
    }, [])

    return { loading, error, announcements, setAnnouncements }
}
