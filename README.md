# Lift Logger Workout Tracking App

A React and Firebase-based web application for tracking workouts and monitoring weightlifting progress.

## Features
- Workout Logging
- Exercise Library
- 1RM Calculator

## Project Structure
📦 lift-logger
┣ 📂 public
┃ ┣ 📜 index.html
┃ ┣ 📜 favicon.ico
┃ ┣ 📜 manifest.json
┃ ┗ 📜 logo192.png
┣ 📂 src
┃ ┣ 📂 components
┃ ┃ ┣ 📂 Calculators
┃ ┃ ┃ ┗ 📜 OneRepMaxCalculator.jsx
┃ ┃ ┣ 📂 Dashboard
┃ ┃ ┃ ┗ 📜 Dashboard.jsx
┃ ┃ ┣ 📂 ExerciseLibrary
┃ ┃ ┃ ┣ 📜 ExerciseLibrary.jsx
┃ ┃ ┃ ┗ 📜 ExerciseCard.jsx
┃ ┃ ┣ 📂 ProgressTracking
┃ ┃ ┃ ┣ 📜 ProgressTracking.jsx
┃ ┃ ┃ ┣ 📜 ProgressChart.jsx
┃ ┃ ┃ ┣ 📜 VolumeAnalysis.jsx
┃ ┃ ┃ ┗ 📜 PersonalRecords.jsx
┃ ┃ ┗ 📂 WorkoutLogger
┃ ┃   ┣ 📜 WorkoutLogger.jsx
┃ ┃   ┣ 📜 WorkoutForm.jsx
┃ ┃   ┗ 📜 SetInput.jsx
┃ ┣ 📂 context
┃ ┃ ┗ 📜 WorkoutContext.jsx
┃ ┣ 📂 firebase (mock implementations)
┃ ┃ ┣ 📜 firebase.js
┃ ┃ ┗ 📜 firestore.js
┃ ┣ 📂 hooks
┃ ┃ ┣ 📜 useFirestore.js
┃ ┃ ┗ 📜 useOneRepMax.js
┃ ┣ 📂 pages
┃ ┃ ┣ 📜 Login.jsx
┃ ┃ ┗ 📜 Register.jsx
┃ ┣ 📂 services
┃ ┃ ┗ 📜 mockFirebase.js
┃ ┣ 📂 utils
┃ ┃ ┣ 📜 calculations.js
┃ ┃ ┣ 📜 initializeDatabase.js
┃ ┃ ┣ 📜 performanceDataGenerator.js
┃ ┃ ┗ 📜 sampleExerciseData.js
┃ ┣ 📜 App.jsx
┃ ┣ 📜 index.js
┃ ┣ 📜 index.css
┃ ┗ 📜 reportWebVitals.js
┣ 📜 package.json
┗ 📜 README.md

## Dependencies to Install
- React
- React Router
- Firebase/Firestore
- TailwindCSS (optional)

## CI/CD Test
This is a test commit to verify our CI/CD pipeline is working correctly with automerge and deploy-after-merge workflows.
