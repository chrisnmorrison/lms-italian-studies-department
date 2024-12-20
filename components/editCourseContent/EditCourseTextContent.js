"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddCourseTextContent = ({ onSubmit, documentId, courseCode, type }) => {
  const [formData, setFormData] = useState({});
  const [textContent, setTextContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [docToUpdateId, setDocToUpdateId] = useState(null);
  const editorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "courseContent", documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          setFormData(docData);
          setTextContent(docData.textContent || "");
          setDocToUpdateId(docSnap.id);
        } else {
          console.log("No such document!");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error retrieving document:", error);
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

  const handleTextContentChange = (value) => {
    setTextContent(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData, docToUpdateId);
    setFormData({});
    router.push(`/courseContent/${formData.courseDocId}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const quill = (
    <ReactQuill
      ref={editorRef}
      theme="snow"
      value={textContent}
      onChange={handleTextContentChange}
    />
  );

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="form-lg" onSubmit={handleFormSubmit}>
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            type="text"
            id="title"
            name="title"
            required
            value={formData.title || ""}
          />
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="contentOrder">
            Chapter
          </label>
          <input
            onChange={(e) => setFormData({ ...formData, contentOrder: e.target.value })}
            type="text"
            id="contentOrder"
            name="contentOrder"
            required
            value={formData.contentOrder || ""}
          />
          <InfoIcon className="ml-2" aria-describedby={id} onClick={handleClick} />
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
                The numerical order that content is displayed in the app, similar to book chapters.
              </p>
              <p>For example, these numberings would be displayed in order from smallest to largest: 1.0, 1.1, 1.2, 2.0, 3.0, etc.</p>
            </Typography>
          </Popover>
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="due">
            Due Date/Time
          </label>
          <input
            onChange={(e) => setFormData({ ...formData, due: e.target.value })}
            type="datetime-local"
            name="due"
            value={formData.due || ""}
          />
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="open">
            App Users can see this content at the following date and time:
          </label>
          <input
            onChange={(e) => setFormData({ ...formData, open: e.target.value })}
            type="datetime-local"
            name="open"
            value={formData.open || ""}
          />
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="close">
            At the following date and time, app users will no longer have access to this content:
          </label>
          <input
            onChange={(e) => setFormData({ ...formData, close: e.target.value })}
            type="datetime-local"
            name="close"
            value={formData.close || ""}
          />
          <label className="block text-white-700 text-lg font-bold mb-2" htmlFor="textContent">
            Text Content
          </label>
          {quill}
          <div className="mt-10">
            <Button variant="contained" type="submit" className="btn">
              Submit
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default AddCourseTextContent;
