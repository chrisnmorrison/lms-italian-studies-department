# Learning Management System (LMS) for Mobile App

## Overview

This project is a **Learning Management System (LMS)** that I developed as part of my capstone project during the final two semesters of my Computer Engineering Technology / Computing Science studies. It was built for the OttawaU Italian Studies Department.

As the team lead for a group of five students, I was responsible for guiding the design, architecture, and overall direction of the project. Our goal was to build an LMS to serve as the "backend" for a mobile app, providing dynamic course management features.

We successfully delivered a working solution to the client, who had several additional ideas for improvements before releasing it to students. As of now, the LMS is fully operational and deployed on a private website, actively used for managing content that the mobile app pulls in. However, the mobile app itself is still in development.

## License

This LMS was built specifically for one mobile application, and the logic is tightly coupled between the two. Therefore, those code is for showcase only and **I do not deem this code production ready**, I am not liable if you use the code.

The code for the mobile app is still under development and will not be released.

## My Role as Team Lead

As the team lead, my responsibilities included:

- Leading the development team through each phase of the project.
- Designing the LMS architecture to support both the mobile app and the website.
- Ensuring the system was scalable and flexible for future growth.
- Writing comprehensive documentation for the system and its features.
- Overseeing the integration of key functionalities, such as user management, course management, and interactive video-based content.

I worked closely with the student development team to ensure the LMS and mobile app worked well together and were intuitive for both users and teachers/administrators. We spent a lot of time designing the app before coding, ensuring our UI/UX groundwork was built, which made development much easier.

## Features of the LMS

### 1. Admin User Management

The LMS allows admins to manage users and assign them courses. Admins can:

- **View the list of users** in the system
- **Assign courses** to users
- **Update user details**
- **Users can request access to courses through the mobile app**
- **And, administrators can accept or deny the requests in the web app**

This functionality ensures that admins can effectively control the learning environment by granting or restricting access to courses based on user needs.

### 2. Course Management and Structure

Admins can create courses with a course name and course code, and within each course, the admins can add and order course content.

React was a great choice for this since it allowed us to use the same endpoints and dynamically render different forms. For example, the admins would select the type of content, which then renders the form for that type:

```javascript
const renderFormComponent = () => {
  switch (selectedDropdown) {
    case "text":
      return (
        <TextForm onSubmit={handleSubmit} documentId={docId} type="Text" />
      );
    case "video":
      return (
        <VideoForm onSubmit={handleSubmit} documentId={docId} type="Video" />
      );
    case "quiz":
      return (
        <QuizForm onSubmit={handleSubmit} documentId={docId} type="Quiz" />
      );
    default:
      return null;
  }
};
```

Course content was ordered in a structured way similar to how other LMS platforms or textbooks organize content. Every course content entry can be given an ordering, such as:

```
1.0
1.1
2.0
2.2
3.0
```

In the mobile app, content would display in the correct order, making it easy to show lessons in the intended sequence. For example, 1.0 and 1.1 would appear in Week 1, and 2.0 and 2.2 in Week 2, and so on.

### 3. Interactive Video Content

One of our favourite (and most challenging) features of the LMS is its ability to enhance engagement with interactive video content. Admins can upload videos and create multiple-choice questions that appear at specific timestamps during the video. When the video reaches a set timestamp, it pauses, and a multiple-choice question pops up for the user to answer.

This feature was designed to make video content more interactive and increase learner engagement.

When a video is loaded in the mobile app, it also loads timestamps and associated questions. The app checks timestamps regularly, and when it reaches a given timestamp, the video pauses and a question appears.

Here is a simplified pseudocode-like the React Native code used for this feature (a lot more went into this feature, we had to build a custom video player!):

```javascript
// Example of video content with interactive questions
const videoContent = {
  videoUrl: "https://example.com/video.mp4",
  questions: [
    {
      timestamp: "00:05:00", // Video pauses at 5 minutes
      question: "What is the main purpose of variables in programming?",
      options: ["To store values", "To create loops", "To define functions"],
      correctAnswer: "To store values",
    },
  ],
};

// Logic to pause video and show question
function handleVideoProgress(timestamp) {
  const question = videoContent.questions.find(
    (q) => q.timestamp === timestamp
  );
  if (question) {
    // Pause video and show question popup
    videoElement.pause();
    showQuestionPopup(question);
  }
}
```

### 4. Course Access Control

Admins have the ability to control which users have access to which courses. This ensures that only authorized users can view specific course content. By assigning courses to users, admins can manage access dynamically and efficiently.

### 5. User Engagement Metrics

The LMS tracks user progress, including video completion and quiz performance. Admins can monitor how users are engaging with the content and assess learning outcomes based on metrics like video watch time and quiz results.

### 6. Unique Design

Both the LMS and mobile app were designed by working closely with the client. They use some of the client's favourite colours, and since it was built for the OttawaU Italian Studies Department, use the colors of Italy.