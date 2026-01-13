<h1 align="center">Mini LMS with Machine Learning</h1>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a8a,100:2563eb&height=180&section=header&text=Mini%20LMS%20with%20ML&fontSize=38&fontColor=ffffff&animation=fadeIn" />
</p>

<p align="center">
  A lightweight Learning Management System with ML-based personalization and performance analytics
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Flask-black" />
  <img src="https://img.shields.io/badge/Database-MongoDB-green" />
  <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange" />
  <img src="https://img.shields.io/badge/Hackathon-Public%20Repo-purple" />
</p>

---

## Overview

This project is a **Learning Management Mini Platform (Mini LMS)** designed to provide a simple, scalable, and intelligent solution for online education. Unlike traditional LMS platforms that are complex and resource-heavy, this system focuses on core learning functionalities while integrating **Machine Learning** to enhance personalization and learning insights.

The platform enables instructors to publish courses, upload learning materials, and track learner progress. Students can enroll in courses, access content across devices, and receive personalized course recommendations based on their learning behavior.

---

## Live Demo => https://firewallforge.vercel.app/  [This is only Ui design]
---

## Problem Statement

Existing Learning Management Systems are often expensive, difficult to customize, and overloaded with unnecessary features. Small institutions, startups, and individual educators require a lightweight, flexible platform that supports digital learning while providing meaningful insights into learner performance.

This project addresses that gap by offering a **minimal yet intelligent LMS** with built-in Machine Learning capabilities.

---

## User Roles

### Admin / Instructor
- Secure authentication using JWT
- Create, update, and delete courses
- Upload learning materials (PDFs, videos, links)
- View enrolled students
- Analyze ML-based engagement and performance trends

### Student
- Secure registration and login
- Browse and enroll in courses
- Access course content
- Track learning progress and completion
- Receive ML-based course recommendations

---

## Machine Learning Features

### Course Recommendation System
- Recommends courses based on:
  - Enrollment history
  - Course categories and tags
  - Completion behavior
- Implemented using content-based or collaborative filtering

### Student Performance Prediction
- Predicts learner performance using:
  - Time spent on lessons
  - Progress percentage
  - Quiz or activity scores (mocked if required)
- Built using Scikit-learn classification or regression models

### Learning Progress Analysis
- Identifies slow learners and high performers
- Generates instructor-friendly insights for early intervention

---

## System Architecture

Frontend (React – Responsive Web & Mobile)
|
| REST APIs
|
Backend (Python Flask)
|
Database (MongoDB)
|
ML Module (Python – Scikit-learn)


Machine Learning logic is modular and accessed via backend APIs.

---

## Technology Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React, HTML, CSS |
| Backend    | Python, Flask |
| Database   | MongoDB |
| ML         | Scikit-learn, Pandas, NumPy |
| Auth       | JWT |

---

## Project Structure

```text
mini-lms-ml-platform/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── ml_api/
│   └── app.py
│
├── ml/
│   ├── dataset/
│   ├── train_model.py
│   ├── predict.py
│   └── model.pkl
│
├── requirements.txt
└── README.md

---

## API Endpoints (Sample)

- POST /api/auth/register
- POST /api/auth/login
- GET /api/courses
- POST /api/courses
- POST /api/enroll
- GET /api/progress/{userId}
- GET /api/ml/recommendations/{userId}
- GET /api/ml/performance/{userId}

---

## Installation and Setup

### Backend Setup

pip install -r requirements.txt
python app.py

### Frontend Setup
npm install
npm start
