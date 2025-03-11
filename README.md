# Trello Clone

## 🚀 Overview

This is a **Trello Clone** built using **Atlassian's Trello API**. It allows users to create and manage boards and tasks efficiently. The app integrates with Trello's official API to provide a seamless task management experience.

## ✨ Features

- 🔹 **Create Boards** – Users can create new Trello boards.
- 🔹 **Remove Boards** – Ability to delete boards when no longer needed.
- 🔹 **Create Tasks** – Add new tasks to boards.
- 🔹 **Remove Tasks** – Delete tasks when completed.
- 🔹 **Real-time Sync** – Data updates instantly using Trello API.

## 🖥️ Live Demo

🔗 [View Live Project](https://trello-clone-six-psi.vercel.app/boards)

## 📸 Screenshots

## 📸 Screenshots

![Screenshot 1](public/Screenshot%20from%202025-03-11%2011-55-34.png)  
![Screenshot 2](public/Screenshot%20from%202025-03-11%2011-55-45.png)  


## 📂 Folder Structure

```
.
├── config.js               # Configuration file
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── public/                 # Public assets
│   ├── Screenshot-1.png    # Project screenshot
│   ├── Screenshot-2.png    # Project screenshot
│   └── vite.svg            # Vite logo
├── README.md               # Documentation
├── src/                    # Source code
│   ├── App.css             # Global styles
│   ├── App.jsx             # Main app component
│   ├── assets/             # Icons and images
│   │   ├── bentoMenu.svg
│   │   ├── checklistIcon.svg
│   │   ├── react.svg
│   │   ├── starIcon.svg
│   │   └── threeDots.svg
│   ├── main.jsx            # Entry point
│   ├── modules/            # Application modules
│   │   ├── boards/         # Boards-related components
│   │   │   ├── Board/
│   │   │   │   ├── Board.css
│   │   │   │   └── Board.jsx
│   │   │   ├── Boards/
│   │   │   │   ├── Boards.css
│   │   │   │   └── Boards.jsx
│   │   ├── boardsDetails/  # Board details components
│   │   │   ├── BoardDetails/
│   │   │   │   ├── BoardDetails.css
│   │   │   │   └── BoardDetails.jsx
│   │   │   ├── BoardList/
│   │   │   │   ├── BoardList.css
│   │   │   │   └── BoardList.jsx
│   │   │   ├── CardChecklist/
│   │   │   │   └── CardChecklist.jsx
│   │   │   ├── CardDetails/
│   │   │   │   └── CardDetails.jsx
│   │   │   ├── CheckItem/
│   │   │   │   └── CheckItem.jsx
│   │   │   ├── ListCard/
│   │   │   │   └── ListCard.jsx
│   │   ├── common/         # Common reusable components
│   │   │   ├── CreateBoardForm/
│   │   │   │   ├── CreateBoardForm.css
│   │   │   │   └── CreateBoardForm.jsx
│   │   │   ├── Header/
│   │   │   │   ├── Header.css
│   │   │   │   └── Header.jsx
│   └── reset.css           # Global reset styles
├── vercel.json             # Vercel configuration
└── vite.config.js          # Vite configuration

```

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/trello-clone.git
cd trello-clone
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```sh
VITE_TRELLO_API_KEY=your-api-key
VITE_TRELLO_SECRET=your-secret-key
VITE_TRELLO_TOKEN=your-auth-token
```

### 4️⃣ Start the Application
```sh
npm run dev
```

## 🚀 Deployment on Vercel

To deploy on **Vercel**, follow these steps:

1. Push the repository to **GitHub**.
2. Go to **Vercel Dashboard** → **New Project**.
3. Import the repository and set up **environment variables**.
4. Deploy the project.

## 📝 API Reference

This app uses the **Atlassian Trello API**. Refer to [Trello API Docs](https://developer.atlassian.com/cloud/trello/) for more details.


