import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { v4 } from "uuid";

const AddCourseVideoContent = ({ onSubmit, documentId, type }) => {
  const [formData, setFormData] = useState({
    courseDocId: documentId,
    type: "video",
    contentOrder: "",
    due: "",
    open: "",
    close: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [videoUpload, setVideoUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseDocId: documentId,
      type: "video",
    }));
  }, [documentId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (videoUpload === null) {
      alert("Please select a video to upload.");
      return;
    }

    const storageRef = ref(storage, `videos/${v4() + videoUpload.name}`);
    setUploading(true);

    try {
      await uploadBytes(storageRef, videoUpload);
      const videoUrl = await getDownloadURL(storageRef);
      const updatedFormData = {
        ...formData,
        videoUrl: videoUrl,
      };
      onSubmit(updatedFormData);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("There was an issue uploading the video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }
    setVideoUpload(file);
  };

  return (
    <form className="form-lg" onSubmit={handleFormSubmit}>
      <label className="" htmlFor="title">
        Title
      </label>
      <input
        value={formData.title}
        onChange={handleInputChange}
        className=""
        type="text"
        id="title"
        name="title"
        required
      />
      <label className="mr-2 flex" htmlFor="contentOrder">
        Chapter{" "}
        <InfoIcon
          className="ml-2 text-grey-700"
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        />
      </label>

      <input
        value={formData.contentOrder}
        onChange={handleInputChange}
        className=""
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
      <label className="" htmlFor="due">
        Due Date/Time
      </label>
      <input
        value={formData.due}
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="due"
      />
      <label className="" htmlFor="open">
        App Users can see this content at the following date and time:
      </label>
      <input
        value={formData.open}
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="open"
      />
      <label className="" htmlFor="close">
        At the following date and time, app users will no longer have access to
        this content:
      </label>
      <input
        value={formData.close}
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="close"
      />

      <label className="mt-10" htmlFor="file">
        Video Upload
      </label>
      <input
        type="file"
        name="file"
        id="file"
        className="sr-only"
        onChange={handleVideoUpload}
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
          {videoUpload && <p className="text-black">{videoUpload.name}</p>}
        </div>
      </label>
      <div className="mt-5">
        <p className="text-black">
          *Once a video is uploaded, you can optionally edit the video timestamp by navigating to Courses, Edit Content, then Edit Quiz Questions.
        </p>
      </div>
      <div className="mt-5">
        <Button
          variant="contained"
          type="submit"
          className="btn"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </Button>
        {uploading && (
          <span className="ml-2 text-black">
            Video is uploading, <strong>please do not navigate away from this page.</strong>
          </span>
        )}
      </div>
    </form>
  );
};

export default AddCourseVideoContent;
