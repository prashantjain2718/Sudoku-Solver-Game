# Sudoku Solver & Game (PBL Project)

A web-based application that combines a fully playable Sudoku game with a smart, visualizing solver algorithm. This project demonstrates the implementation of the **Backtracking Algorithm** for solving constraint satisfaction problems, wrapped in a modern, responsive user interface.

## 🌐 Live Demo
You can play the game online here: **[https://sudoku-solver-game-nu.vercel.app/](https://sudoku-solver-game-nu.vercel.app/)**

## 📋 Project Overview

* **Project Type:** Problem Based Learning (PBL)
* **Department:** Computer Science and Engineering
* **Institution:** Arya College of Engineering and IT
* **Submitted To:** Er. Manish Dwivedi, Associate Professor

## ✨ Key Features

### 🎮 Game Mode
* **User System:** Local-storage based login to track individual progress.
* **Difficulty Levels:** Generate unique puzzles for Easy, Medium, and Hard difficulties.
* **Timer & Scoring:** Tracks solving time and saves the "Best Time" for each difficulty level per user.
* **Validation:** Real-time input validation prevents entering non-numeric characters.
* **Win State:** Confetti celebration upon successfully completing a puzzle manually.

### 🤖 Smart Solver
* **Visual Backtracking:** Watch the algorithm solve the puzzle step-by-step in real-time (Depth-First Search).
* **Speed Control:** Adjust the visualization speed (Slow, Normal, Fast).
* **Instant Solve:** "Skip Visualization" option to solve the board immediately.
* **Error Detection:** highlights invalid board configurations before attempting to solve.

### 🎨 User Interface
* **Responsive Design:** Fully functional on Desktop (Grid Layout) and Mobile (Flex Layout).
* **Theme System:** Toggle between **Light Mode** (Modern Blue) and **Dark Mode**.
* **Interactive Sidebar:** Centralized control panel for game settings and stats.

## 🛠️ Tech Stack

* **HTML5:** Structure and layout.
* **CSS3:** Custom styling, Grid/Flexbox layouts, CSS Variables for theming.
* **JavaScript (ES6+):** Game logic, Backtracking algorithm, DOM manipulation, LocalStorage management.
* **No External Libraries:** Built entirely with vanilla technologies for maximum performance and learning demonstration.

## 🚀 How to Run Locally

1.  Download the `index.html` file.
2.  Open the file in any modern web browser (Chrome, Edge, Firefox, Safari).
3.  **Login:** Enter your name in the modal to begin.
4.  **Play:** Select difficulty and click "Generate Puzzle".

## 👥 Team Members

| Sr. No. | Name | RTU Roll No. |
| :--- | :--- | :--- |
| 1 | Mayank Jangid | 24EARAD097 |
| 2 | Mohit Kumar Sharma | 24EARAD103 |
| 3 | Palak Agarwal | 24EARAD115 |
| 4 | Prabhash Kumar Choudhary | 24EARAD121 |
| 5 | Prashant Jain | 24EARAD124 |

## 🧠 Algorithm Used

The solver utilizes a **Recursive Backtracking** algorithm:
1.  Find an empty cell.
2.  Try numbers 1-9.
3.  Check if the number is valid (row, column, and 3x3 box constraints).
4.  If valid, place the number and recursively try to fill the rest of the board.
5.  If the recursion fails, reset the cell (backtrack) and try the next number.
