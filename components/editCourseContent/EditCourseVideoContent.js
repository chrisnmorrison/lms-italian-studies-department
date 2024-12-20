import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { v4 } from "uuid";
import { collection, doc, getDoc } from "firebase/firestore";

const AddCourseVideoContent = ({ onSubmit, documentId, courseCode, type }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [videoUpload, setVideoUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [docToUpdateId, setDocToUpdateId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formDataCollection = collection(db, "courseContent");
        const docRef = doc(formDataCollection, documentId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setFormData(docSnapshot.data());
          setDocToUpdateId(docSnapshot.id);
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error retrieving course content:", error);
      }
    };
    fetchData();
  }, [documentId]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (e, questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = e.target.checked ? index : null;
    setQuestions(updatedQuestions);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    let videoUrl = formData.videoUrl;

    if (videoUpload) {
      const storageRef = ref(storage, `videos/${v4() + videoUpload.name}`);
      setUploading(true);

      try {
        await uploadBytes(storageRef, videoUpload);
        videoUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setUploading(false);
      }
    }

    const updatedFormData = {
      ...formData,
      videoUrl: videoUrl,
    };
    onSubmit(updatedFormData, docToUpdateId);
    router.push(`/courseContent/${formData.courseDocId}`);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <form className="form-lg" onSubmit={handleFormSubmit}>
      <label htmlFor="title">Title</label>
      <input
        defaultValue={formData.title}
        onChange={handleInputChange}
        type="text"
        id="title"
        name="title"
        required
      />
      <label className="mr-2 flex" htmlFor="contentOrder">
        Chapter{" "}
        <InfoIcon
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        />
      </label>
      <input
        defaultValue={formData.contentOrder}
        onChange={handleInputChange}
        type="text"
        id="contentOrder"
        name="contentOrder"
        required
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <p>
            The numerical order that content is displayed in the app, similar to
            book chapters.
          </p>
          <p>
            For example, these numberings would be displayed in order from
            smallest to largest:
          </p>
          <p>1.0, 1.1, 1.2, 2.0, 3.0, 3.1, etc.</p>
        </Typography>
      </Popover>

      <label htmlFor="due">Due Date/Time</label>
      <input
        defaultValue={formData.due}
        onChange={handleInputChange}
        type="datetime-local"
        name="due"
      />
      <label htmlFor="open">
        App Users can see this content at the following date and time:
      </label>
      <input
        defaultValue={formData.open}
        onChange={handleInputChange}
        type="datetime-local"
        name="open"
      />
      <label htmlFor="close">
        At the following date and time, app users will no longer have access to
        this content:
      </label>
      <input
        defaultValue={formData.close}
        onChange={handleInputChange}
        type="datetime-local"
        name="close"
      />

      <label htmlFor="file" className="mt-10">
        Video URL
      </label>
      <p className="text-gray-700">{formData.videoUrl}</p>
      <input
        type="file"
        name="file"
        id="file"
        className="sr-only"
        onChange={(e) => setVideoUpload(e.target.files[0])}
      />
      <label
        htmlFor="file"
        className="relative flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-4 text-center"
      >
        <div>
          <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
            Browse
          </span>
          {videoUpload && <p className="text-black">{videoUpload.name}</p>}
        </div>
      </label>
      {uploading && (
        <span className="ml-2 text-black">
          Video is uploading,{" "}
          <strong>please do not navigate away from this page.</strong>
        </span>
      )}
      <p className="text-gray-700">
        <strong>
          * Note: Adding a new video DOES NOT delete the old video from storage!
        </strong>
      </p>

      <div className="mt-5">
        <Button className="btn" variant="contained" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddCourseVideoContent;
