import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { db } from "../../firebase";

const QuizQuestionsComponent = ({ documentId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: null,
  });
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const quizzesCollection = collection(db, "quizzes");
        const querySnapshot = await getDocs(
          query(quizzesCollection, where("contentId", "==", documentId))
        );

        const questionsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            setCurrentDocId(doc.id);
            const videoQuestion = doc.data().questions;
            questionsData.push(videoQuestion);
          }
        });
        const loadedQuestions = [].concat(...questionsData);

        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Error retrieving video questions:", error);
      }
    };

    fetchQuestions();
  }, [documentId]);

  const handleDeleteQuestion = async (index) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this question?"
      );

      if (confirmation) {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);

        const docRef = doc(db, "quizzes", currentDocId);
        await updateDoc(docRef, { questions: updatedQuestions });
      }
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };

  const handleChange = (e, index, field, type = "question") => {
    const updatedQuestions = [...questions];
    if (type === "question") {
      updatedQuestions[index].question = e.target.value;
    } else if (type === "answer") {
      updatedQuestions[index].answers[field] = e.target.value;
    } else if (type === "correctAnswer") {
      updatedQuestions[index].correctAnswer = field;
    }
    setQuestions(updatedQuestions);
  };

  const handleAddNewQuestion = async () => {
    const updatedQuestions = [...questions, { ...newQuestion }];

    try {
      const quizzesCollection = collection(db, "quizzes");
      const querySnapshot = await getDocs(
        query(quizzesCollection, where("contentId", "==", documentId))
      );

      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;
        const docSnapshot = await getDoc(docRef);
        const existingData = docSnapshot.data();
        const mergedData = {
          ...existingData,
          questions: updatedQuestions,
        };
        await setDoc(docRef, mergedData);
      } else {
        const newDocRef = await addDoc(collection(db, "quizzes"), {
          questions: updatedQuestions,
          contentId: documentId,
        });
      }

      setQuestions(updatedQuestions);
      setNewQuestion({
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: null,
      });
    } catch (error) {
      console.error("Error updating/creating document: ", error);
    }
  };

  const handleNewQuestionChange = (e) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      question: e.target.value,
    }));
  };

  const handleNewAnswerChange = (e, index) => {
    setNewQuestion((prevQuestion) => {
      const updatedAnswers = [...prevQuestion.answers];
      updatedAnswers[index] = e.target.value;

      return {
        ...prevQuestion,
        answers: updatedAnswers,
      };
    });
  };

  const handleNewCorrectAnswerChange = (e, value) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      correctAnswer: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can implement final submission logic here if needed
  };

  return (
    <>
      <form className="form-lg pb-10" onSubmit={handleSubmit}>
        <div>
          {questions.map((question, index) => (
            <div className="existing-q-wrapper pb-10" key={index}>
              <label>Question {index + 1}</label>
              <div className="flex flex-col">
                <label className="sm">Question: </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleChange(e, index, null, "question")}
                />
              </div>
              <div className="flex flex-row mt-5 gap-x-5">
                {question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex flex-col">
                    <label className="sm mr-2">Option {answerIndex + 1}</label>
                    <input
                      className="w-40"
                      type="text"
                      placeholder={`Option ${answerIndex + 1}`}
                      value={answer}
                      onChange={(e) =>
                        handleChange(e, index, answerIndex, "answer")
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <label>Correct Option</label>
                <div className="flex flex-row justify-evenly">
                  {question.answers.map((_, optionIndex) => (
                    <div key={optionIndex}>
                      <label className="sm">
                        <input
                          type="radio"
                          name={`correctAnswer-${index}`}
                          value={optionIndex}
                          checked={question.correctAnswer === optionIndex}
                          onChange={(e) =>
                            handleChange(e, index, optionIndex, "correctAnswer")
                          }
                        />{" "}
                        Option {optionIndex + 1}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                className="btn"
                variant="contained"
                onClick={() => handleAddNewQuestion()}
              >
                Edit Question
              </Button>
              <Button
                style={{ marginLeft: "1rem" }}
                className="btn"
                variant="contained"
                onClick={() => handleDeleteQuestion(index)}
              >
                Delete Question
              </Button>
            </div>
          ))}
        </div>
        <div className="new-q-wrapper">
          <label>New Question</label>
          <div className="flex flex-col">
            <label className="sm">Question: </label>
            <input
              type="text"
              value={newQuestion.question}
              onChange={handleNewQuestionChange}
            />
          </div>
          <div className="flex flex-row mt-5 gap-x-5">
            {newQuestion.answers.map((answer, index) => (
              <div key={index} className="flex flex-col">
                <label className="sm mr-2">Option {index + 1}</label>
                <input
                  className="w-40"
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={answer}
                  onChange={(e) => handleNewAnswerChange(e, index)}
                />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <label>Correct Option</label>
            <div className="flex flex-row justify-evenly">
              {newQuestion.answers.map((_, index) => (
                <div key={index}>
                  <label className="sm">
                    <input
                      type="radio"
                      name="newCorrectAnswer"
                      value={index}
                      onChange={(e) => handleNewCorrectAnswerChange(e, index)}
                    />{" "}
                    Option {index + 1}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <Button
              className="btn"
              variant="contained"
              onClick={handleAddNewQuestion}
            >
              Add New Question
            </Button>
          </div>
        </div>
        <Button
          className="btn"
          variant="contained"
          color="success"
          type="submit"
        >
          Submit All Questions
        </Button>
      </form>
    </>
  );
};

export default QuizQuestionsComponent;
