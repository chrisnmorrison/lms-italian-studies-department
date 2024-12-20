import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import VideoCard from "./VideoCard";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchVideos from "../hooks/fetchVideos";
import { Link, Button } from "@mui/material";

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [edittedValue, setEdittedValue] = useState("");

  const { videos, setVideos, loading } = useFetchVideos();

  async function handleEditVideo(videoKey) {
    if (!edittedValue) {
      return;
    }

    setVideos({ ...videos, [videoKey]: edittedValue });

    const userRef = doc(db, "videos", currentUser.uid);
    await setDoc(
      userRef,
      {
        videos: {
          [videoKey]: edittedValue,
        },
      },
      { merge: true }
    );

    setEdit(null);
    setEdittedValue("");
  }

  function handleAddEdit(videoKey) {
    return () => {
      setEdit(videoKey);
      setEdittedValue(videos[videoKey]);
    };
  }

  function handleDelete(videoKey) {
    return async () => {
      const tempObj = { ...videos };
      delete tempObj[videoKey];

      setVideos(tempObj);

      const userRef = doc(db, "videos", currentUser.uid);
      await setDoc(
        userRef,
        {
          videos: {
            [videoKey]: deleteField(),
          },
        },
        { merge: true }
      );
    };
  }

  return (
    <div className="w-full text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <h1 className="text-3xl">Video List</h1>
      </div>
      {loading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      <div className="current-videos">
        {!loading && (
          <>
            {Object.entries(videos).map(([videoKey, video], i) => (
              <VideoCard
                handleEditVideo={() => handleEditVideo(videoKey)}
                key={i}
                handleAddEdit={handleAddEdit}
                edit={edit}
                videoKey={videoKey}
                edittedValue={edittedValue}
                setEdittedValue={setEdittedValue}
                handleDelete={handleDelete}
              >
                <h2 style={{ fontSize: "200%", marginBottom: ".5rem" }}>
                  {video.title}
                </h2>
                <p>{video.id}</p>
              </VideoCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export const GetServerSideProps = () => {};
