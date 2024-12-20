"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  deleteField,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

const AddCourseVideoContent = ({ onSubmit, documentIdOfVideo, courseCode }) => {
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [videoUpload, setVideoUpload] = useState(null);
  const [courseContent, setCourseContent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({});
  const [newQuestionAnswers, setNewQuestionAnswers] = useState([]);
  const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] =
    useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const router = useRouter();
  documentIdOfVideo = router.query.docId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoQuestionsCollection = collection(db, "videoQuestions");
        const querySnapshot = await getDocs(
          query(
            videoQuestionsCollection,
            where("contentId", "==", documentIdOfVideo)
          )
        );

        const videoQuestionsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const videoQuestion = doc.data();
            videoQuestion.currentDocId = doc.id;
            videoQuestionsData.push(videoQuestion);
          }
        });

        setQuestions(videoQuestionsData);
      } catch (error) {
        console.error("Error retrieving video questions:", error);
      }
    };

    fetchData();
  }, [documentIdOfVideo]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTimestamp = async (index, docId) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this question?"
      );

      if (confirmation) {
        await deleteDoc(doc(db, "videoQuestions", docId));
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", answers: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleEditQuestion = async (index, docId, event) => {
    event.preventDefault();

    const questionToEdit = questions[index];
    const { currentDocId, ...questionWithoutDocId } = questionToEdit;

    try {
      await updateDoc(
        doc(db, "videoQuestions", currentDocId),
        questionWithoutDocId
      );
      alert("Successfully updated question!");
    } catch (error) {
      console.error("Error updating question: ", error);
    }
  };

  const handleNewQuestionChange = (e) => {
    setNewQuestion((prev) => ({
      ...prev,
      question: e.target.value,
    }));
  };

  const handleNewAnswerChange = (e, questionIndex) => {
    const updatedAnswers = [...newQuestionAnswers];
    updatedAnswers[questionIndex] = e.target.value;
    setNewQuestionAnswers(updatedAnswers);
  };

  const handleNewCorrectAnswerChange = (e, index) => {
    const updatedCorrectAnswer = e.target.checked ? index : null;
    setNewQuestionCorrectAnswer(updatedCorrectAnswer);
  };

  const handleAddNewQuestion = async (event) => {
    event.preventDefault();

    const updatedQuestion = {
      ...newQuestion,
      answers: newQuestionAnswers,
      correctAnswer: newQuestionCorrectAnswer,
      contentId: documentIdOfVideo,
    };

    try {
      const docRef = await addDoc(
        collection(db, "videoQuestions"),
        updatedQuestion
      );
      setQuestions((prevQuestions) => [...prevQuestions, updatedQuestion]);
      setNewQuestionAnswers([]);
      setNewQuestion({});
      setNewQuestionCorrectAnswer(null);
    } catch (error) {
      console.error("Error adding new question: ", error);
    }
  };

  return (
    <>
      <div>
        {questions.map((question, index) => (
          <form
            key={index}
            className="form-lg"
            onSubmit={(event) =>
              handleEditQuestion(index, question.currentDocId, event)
            }
          >
            <div className="existing-q-wrapper">
              <label>Question {index + 1}</label>
              <div className="flex flex-col">
                <label className="sm">Hours : Minutes : Seconds</label>
                <div className="flex align-center">
                  <input
                    onChange={(e) => handleHourChange(e, index)}
                    type="number"
                    name="minutes"
                    min="0"
                    max="10"
                    defaultValue={question.hour}
                    required
                    className="w-[5rem] inline"
                  />
                  <p
                    style={{
                      fontSize: "24px",
                      marginLeft: ".5rem",
                      marginRight: ".5rem",
                    }}
                    className="text-black"
                  >
                    {" "}
                    :{" "}
                  </p>
                  <input
                    onChange={(e) => handleMinuteChange(e, index)}
                    type="number"
                    name="minutes"
                    min="0"
                    max="59"
                    defaultValue={question.minute}
                    required
                    className="w-[5rem] inline"
                  />
                  <p
                    style={{
                      fontSize: "24px",
                      marginLeft: ".5rem",
                      marginRight: ".5rem",
                    }}
                    className="text-black"
                  >
                    {" "}
                    :{" "}
                  </p>
                  <input
                    onChange={(e) => handleSecondChange(e, index)}
                    type="number"
                    name="seconds"
                    min="0"
                    max="59"
                    defaultValue={question.second}
                    required
                    className="w-[5rem] inline"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="sm">Question: </label>
                <input
                  type="text"
                  defaultValue={question.question}
                  onChange={(e) => handleQuestionChange(e, index)}
                ></input>
              </div>
              <div className="flex flex-row mt-5 gap-x-5">
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 1</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 1"
                    defaultValue={question.answers[0]}
                    onChange={(e) => handleAnswerChange(e, index, 0)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 2</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 2"
                    defaultValue={question.answers[1]}
                    onChange={(e) => handleAnswerChange(e, index, 1)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 3</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 3"
                    defaultValue={question.answers[2]}
                    onChange={(e) => handleAnswerChange(e, index, 2)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="sm mr-2">Option 4</label>
                  <input
                    className="w-40"
                    type="text"
                    placeholder="Option 4"
                    defaultValue={question.answers[3]}
                    onChange={(e) => handleAnswerChange(e, index, 3)}
                  />
                </div>
              </div>
              <div className="mt-5">
                <label>Correct Option</label>
                <div className="flex gap-5">
                  {question.answers.map((answer, idx) => (
                    <div key={idx}>
                      <input
                        type="radio"
                        name={`correct-answer-${index}`}
                        value={idx}
                        checked={question.correctAnswer === idx}
                        onChange={(e) => handleCorrectAnswerChange(e, index)}
                      />
                      <span>{answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-x-4 mt-3">
              <button className="btn btn-primary text-white">Update</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  handleDeleteTimestamp(index, question.currentDocId)
                }
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        <div className="w-full flex justify-end">
          <Button
            sx={{
              background: "green",
              color: "#ffffff",
            }}
            variant="contained"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddCourseVideoContent;
