import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "@mui/material";

export default function Page() {
  const [video, setVideo] = useState([]);
  const [data, setData] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Update video timestamps
    const updatedVideoTimestamps = [];
    for (let i = 0; i < video.length; i++) {
      const timestamp = event.target[`videoTimestamp${i}`].value;
      updatedVideoTimestamps.push(timestamp);
    }

    // Create the updated document object
    const updatedDocument = {
      name: event.target.videoName.value,
      code: event.target.videoCode.value,
      description: event.target.videoDescription.value,
      videoTimestamps: updatedVideoTimestamps,
    };

    const docToUpdate = doc(db, "videoTest", id);
    await updateDoc(docToUpdate, updatedDocument);

    router.push("/videos");
  };

  const addVideoTimestamp = () => {
    setVideo([...video, ""]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoCollection = collection(db, 'videoTest');
        const documentRef = doc(videoCollection, id);
        const document = await getDoc(documentRef);

        if (!document.exists()) {
          console.error("Document not found");
          return;
        }

        // Set the data if found
        const docData = document.data();
        setData(docData);
        setVideo(docData.videoTimestamps || []); 
      } catch (error) {
        console.error("Error retrieving document ID:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <h1 className="lg-title mb-5">Edit Video</h1>
      <form id="editCourseForm" onSubmit={handleSubmit}>
        <div>
          <p>For video: <strong>{data.videoUrl}</strong></p>
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="videoName"
          >
            Video Title
          </label>{" "}
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="videoName"
            name="videoName"
            required
            defaultValue={data.title}
          />
        </div>

        <div>
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="videoCode"
          >
            Video Code
          </label>
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="videoCode"
            name="videoCode"
            required
            defaultValue={data.code}
          />
        </div>

        <div>
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="videoDescription"
          >
            Video Description
          </label>
          <textarea
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="videoDescription"
            name="videoDescription"
            defaultValue={data.description}
          />
        </div>

        <div>
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="videoTimestamps">
            Video Timestamps:
          </label>
          {video.map((timestamp, index) => (
            <div key={index}>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name={`videoTimestamp${index}`}
                value={timestamp}
                onChange={(e) => {
                  const updatedVideo = [...video];
                  updatedVideo[index] = e.target.value;
                  setVideo(updatedVideo);
                }}
                required
              />
            </div>
          ))}
          <Button type="button" variant="outlined" onClick={addVideoTimestamp}>
            Add Timestamp
          </Button>
        </div>

        <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
