"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
//import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";

let textAreaValue = "";

const EditCourseQuizContent = ({
  onSubmit,
  documentId,
  type,
  getDocumentData,
}) => {
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [docToUpdateId, setDocToUpdateId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "courseContent", documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
          setDocToUpdateId(docSnap.id);
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error retrieving document ID:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData, docToUpdateId);
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
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="title"
      >
        Title
      </label>
      <input
        onChange={handleInputChange}
        value={formData.title || ""}
        className=""
        type="text"
        id="title"
        name="title"
        required
      />
      
      <label
        className="block text-white-700 text-lg font-bold mb-2 mr-2 flex"
        htmlFor="contentOrder"
      >
        Chapter{" "}
        <InfoIcon
          className="ml-2 text-grey-700"
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        />
      </label>

      <input
        onChange={handleInputChange}
        value={formData.contentOrder || ""}
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
          </p>{" "}
          <p>
            For example, these numberings would be displayed in order from
            smallest to largest:
          </p>{" "}
          <p>1.0, 1.1, 1.2, 2.0, 3.0, 3.1, etc.</p>
        </Typography>
      </Popover>

      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="due"
      >
        Due Date/Time
      </label>
      <input
        onChange={handleInputChange}
        value={formData.due || ""}
        className=""
        type="datetime-local"
        name="due"
      />
      
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="open"
      >
        App Users can see this content at the following date and time:
      </label>
      <input
        onChange={handleInputChange}
        value={formData.open || ""}
        className=""
        type="datetime-local"
        name="open"
      />
      
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="close"
      >
        At the following date and time, app users will no longer have access to
        this content:
      </label>
      <input
        onChange={handleInputChange}
        value={formData.close || ""}
        className=""
        type="datetime-local"
        name="close"
      />

      <div className="mt-5">
        <Button variant="contained" type="submit" className="btn">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default EditCourseQuizContent;
