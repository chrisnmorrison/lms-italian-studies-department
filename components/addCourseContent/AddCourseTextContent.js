"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

let textAreaValue = "";

const AddCourseTextContent = ({ onSubmit, documentId, type }) => {
  const [formData, setFormData] = useState({});
  const [textContent, setTextContent] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const editorRef = useRef(null);
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseDocId: documentId,
      type: "text",
    }));
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleTextContentChange = (value) => {
    textAreaValue = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: value,
    }));
    const editorElement = document.querySelector(".ql-editor");
    const htmlContent = editorElement.innerHTML;
    setTextContent(htmlContent);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const editorElement = document.querySelector(".ql-editor");
    const htmlContent = editorElement.innerHTML;
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: htmlContent,
    }));
    const jsonData = JSON.stringify(formData);

    onSubmit(formData);
    setFormData("");
  };

  const handleInputChange = (event) => {
    const editorElement = document.querySelector(".ql-editor");
    const htmlContent = editorElement.innerHTML;
    setTextContent(htmlContent);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const quill = React.useMemo(
    () => (
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={textContent}
        onChange={handleTextContentChange}
      />
    ),
    []
  );

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
        className=""
        type="datetime-local"
        name="close"
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="textContent"
      >
        Text Content
      </label>

      {quill}
      <div className="mt-5">
        <Button variant="contained" type="submit" className="btn">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddCourseTextContent;
