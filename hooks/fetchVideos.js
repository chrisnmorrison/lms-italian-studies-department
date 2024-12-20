import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export default function useFetchVideos() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      try {
        const videosCollection = collection(db, "videoTest");
        const videosSnapshot = await getDocs(videosCollection);
        const videosData = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setVideos(videosData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch videos.");
          setLoading(false);
        }
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, error, videos, setVideos };
}
