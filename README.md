# 🧩 Sudoku Solver & Game (PBL Project)

A web-based application that combines a fully playable Sudoku game with a smart, visualizing solver algorithm. This project demonstrates the implementation of the **Backtracking Algorithm** for solving constraint satisfaction problems, wrapped in a modern, responsive user interface.

---

## 🌐 Live Demo
Play the game online: **[https://sudoku-solver-game-nu.vercel.app/](https://sudoku-solver-game-nu.vercel.app/)**

---

## 📋 Project Overview

* **Project Type:** Problem Based Learning (PBL)
* **Department:** Artificial Intelligence & Data Science
* **Institution:** Arya College of Engineering and IT
* **Submitted To:** Er. Manish Dwivedi, Associate Professor

---

## ✨ Key Features

### 🎮 Game Mode
* **User System:** Local-storage based login system tracks individual progress and saves data across sessions.
* **Dynamic Puzzle Generation:** Generates unique puzzles for **Easy**, **Medium**, and **Hard** difficulties.
* **Timer & Scoring:** Tracks solving time and automatically updates the "Best Time" for each difficulty level per user.
* **Input Validation:** Real-time prevention of non-numeric characters and "Invalid Sudoku" detection for conflicting numbers.
* **Celebration:** Confetti animation triggers upon successfully completing a puzzle manually.

### 🤖 Smart Solver (Visualizer)
* **Visual Backtracking:** Watch the Depth-First Search (DFS) algorithm solve the puzzle step-by-step in real-time.
    * **Trying (Blue):** The algorithm testing a number.
    * **Backtracking (Yellow):** The algorithm realizing a path is dead and retreating.
* **Speed Control:** Adjustable visualization speed:
    * **Slow:** Great for understanding the logic.
    * **Normal:** Balanced speed.
    * **Fast:** Quick visualization.
* **Instant Solve:** "Skip Visualization" option to calculate and fill the board immediately.

### 🎨 User Interface
* **Responsive Design:** * **Desktop:** Grid layout with sidebar controls.
    * **Mobile:** Flex layout with controls moved to the top for accessibility.
* **Theme System:** One-click toggle between **Light Mode** (Modern Blue) and **Dark Mode** (High Contrast).
* **Interactive Sidebar:** Centralized control panel for settings, game stats, and solver controls.

---

## 🛠️ Tech Stack

* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom styling, Grid/Flexbox layouts, and CSS Variables for theming.
* **JavaScript (ES6+):** * Game logic and state management.
    * **Recursive Backtracking Algorithm** implementation.
    * DOM manipulation and `LocalStorage` handling.
* **Zero Dependencies:** Built entirely with vanilla technologies for maximum performance and educational value.

---

## 🧠 Algorithm Explanation

The solver utilizes a **Recursive Backtracking** algorithm, a fundamental concept in Artificial Intelligence and Algorithm Design:

1.  **Search:** Find the first empty cell on the grid.
2.  **Attempt:** Try numbers 1 through 9 in that cell.
3.  **Validate:** Check if the number violates Sudoku rules (Row, Column, and 3x3 Box constraints).
4.  **Recurse:** If valid, place the number and move to the next empty cell.
5.  **Backtrack:** If the recursion reaches a dead end (no valid numbers for a subsequent cell), reset the current cell to 0 (empty) and try the next number.

---

## 📖 User Manual

### 1. Getting Started
1.  Open the app (Online or Local).
2.  Enter your name in the **Login Modal**.
3.  Click "Login & Play". Your stats are now tied to this username.

### 2. Playing Manually
1.  **Select Difficulty:** Choose Easy, Medium, or Hard from the sidebar.
2.  **Generate:** Click "Generate Puzzle". The timer will start.
3.  **Play:** Click any empty cell and type a number (1-9).
4.  **Win:** Fill the board correctly to stop the timer and save your high score!

### 3. Using the Auto-Solver
If you are stuck or want to see the AI work:
1.  **Visual Mode:** Select a speed (Slow/Normal/Fast) and click **"Solve (Visual)"**.
2.  **Instant Mode:** Click **"Skip"** to solve it instantly.
3.  **Stop:** Click **"Stop"** at any time to pause the visualization.

### 4. Troubleshooting
* **"Invalid Sudoku" Error:** Appears if you try to solve a board that already has conflicting numbers (e.g., two 5s in the same row). Reset or fix the board to proceed.
* **Mobile Layout:** Controls automatically move above the grid on smaller screens.

---

## 🚀 How to Run Locally

1.  Clone this repository or download the ZIP.
2.  Navigate to the project folder.
3.  Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
    * *No server installation required.*

---

## 👥 Team Members

| Sr. No. | Name | RTU Roll No. |
| :--- | :--- | :--- |
| 1 | Mayank Jangid | 24EARAD097 |
| 2 | Mohit Kumar Sharma | 24EARAD103 |
| 3 | Palak Agarwal | 24EARAD115 |
| 4 | Prabhash Kumar Choudhary | 24EARAD121 |
| 5 | Prashant Jain | 24EARAD124 |

---

<p align="center">
  Developed with ❤️ by the students of Arya College of Engineering and IT
</p>

