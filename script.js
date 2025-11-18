 const GRID = document.getElementById("grid"),
        cells = [],
        speedMap = { slow: 300, normal: 80, fast: 20 };
      let stopViz = false,
        original = Array.from({ length: 9 }, () => Array(9).fill(false));

      let toastTimeout = null;

      let currentUser = null;
      let allUsers = {};
      let userData = { bestTimes: { easy: null, medium: null, hard: null } };
      let timerInterval = null;
      let secondsElapsed = 0;
      let currentDifficulty = "medium";

      for (let i = 0; i < 81; i++) {
        const inp = document.createElement("input");
        inp.className = "cell";
        inp.maxLength = 1;
        inp.inputMode = "numeric";

        const r = Math.floor(i / 9);
        const c = i % 9;

        inp.addEventListener("input", () => {
          inp.value = inp.value.replace(/[^1-9]/g, "");
          checkManualWin();
        });

        inp.addEventListener("focus", () => {
          highlightPeers(r, c);
        });
        inp.addEventListener("blur", () => {
          highlightPeers(-1, -1);
        });

        GRID.appendChild(inp);
        cells.push(inp);
      }

      function deepCopy(b) {
        return b.map((r) => r.slice());
      }
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

      function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");

        if (toastTimeout) clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
          toast.classList.remove("show");
          toastTimeout = null;
        }, 3000);
      }

      function validPlacement(b, r, c, n) {
        for (let i = 0; i < 9; i++)
          if ((b[r][i] === n && i !== c) || (b[i][c] === n && i !== r))
            return false;
        const sr = r - (r % 3),
          sc = c - (c % 3);
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 3; j++)
            if (b[sr + i][sc + j] === n && (sr + i !== r || sc + j !== c))
              return false;
        return true;
      }
       
      function solveRandomized(board) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
              for (let i = nums.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nums[i], nums[j]] = [nums[j], nums[i]];
              }
              for (const n of nums) {
                if (validPlacement(board, r, c, n)) {
                  board[r][c] = n;
                  if (solveRandomized(board)) return true;
                  board[r][c] = 0;
                }
              }
              return false;
            }
          }
        }
        return true;
      }

      function countSolutions(board, limit = 2) {
        let count = 0;
        function solve() {
          if (count >= limit) return;
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (board[r][c] === 0) {
                for (let n = 1; n <= 9; n++) {
                  if (validPlacement(board, r, c, n)) {
                    board[r][c] = n;
                    solve();
                    board[r][c] = 0;
                    if (count >= limit) return;
                  }
                }
                return;
              }
            }
          }
          count++;
        }
        solve();
        return count;
      }

      async function generatePuzzle(diff) {
        const removeCount = diff === "easy" ? 36 : diff === "medium" ? 46 : 54;
        let board = Array.from({ length: 9 }, () => Array(9).fill(0));
        solveRandomized(board);
        const positions = Array.from({ length: 81 }, (_, i) => i);
        for (let i = positions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        let removed = 0;
        for (const pos of positions) {
          if (removed >= removeCount) break;
          const r = Math.floor(pos / 9);
          const c = pos % 9;
          const backup = board[r][c];
          board[r][c] = 0;
          const solutions = countSolutions(deepCopy(board), 2);
          if (solutions === 1) {
            removed++;
          } else {
            board[r][c] = backup;
          }
        }
        return board;
      }

      function readUI() {
        const b = Array.from({ length: 9 }, () => Array(9).fill(0));
        for (let r = 0; r < 9; r++)
          for (let c = 0; c < 9; c++) {
            const v = cells[r * 9 + c].value;
            b[r][c] = v ? +v : 0;
          }
        return b;
      }

      function loadUI(b) {
        stopTimer(); 
        document.getElementById("timerDisplay").textContent = "00:00"; 
        if (!b || b.length === 0) {
          for (const el of cells) {
            el.value = "";
            el.className = "cell";
            el.readOnly = false;
          }
          original = Array.from({ length: 9 }, () => Array(9).fill(false));
          return;
        }
        for (let r = 0; r < 9; r++)
          for (let c = 0; c < 9; c++) {
            const v = b[r][c],
              el = cells[r * 9 + c];
            el.value = v || "";
            original[r][c] = !!v;
            el.className = "cell" + (v ? " original" : "");
            el.readOnly = !!v;
          }
      }

      function clearMarks() {
        for (const el of cells)
          el.classList.remove("trying", "backtrack", "invalid");
      }

      function validate(b) {
        clearMarks();
        let ok = true;
        for (let r = 0; r < 9; r++)
          for (let c = 0; c < 9; c++)
            if (b[r][c] && !validPlacement(b, r, c, b[r][c])) {
              cells[r * 9 + c].classList.add("invalid");
              ok = false;
            }
        if (!ok) showToast("Invalid Sudoku: Check red cells.");
        return ok;
      }
      
      function isBoardValidAndFull(b) {
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
             if (b[r][c] === 0) return false;
             if (!validPlacement(b, r, c, b[r][c])) return false;
          }
        }
        return true;
      }


      function highlightPeers(r, c) {
        cells.forEach((el) =>
          el.classList.remove("highlight-active", "highlight-peer")
        );
        if (r === -1) return;

        cells[r * 9 + c].classList.add("highlight-active");

        for (let i = 0; i < 9; i++) {
          cells[r * 9 + i].classList.add("highlight-peer");
          cells[i * 9 + c].classList.add("highlight-peer");
        }
        const sr = r - (r % 3),
          sc = c - (c % 3);
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 3; j++) {
            cells[(sr + i) * 9 + (sc + j)].classList.add("highlight-peer");
          }
      }

      function highlight(r, c, cls, val) {
        const el = cells[r * 9 + c];
        el.value = val;
        el.classList.remove("trying", "backtrack");
        if (cls) el.classList.add(cls);
      }

      function setControlsDisabled(disabled) {
        document.getElementById("generateBtn").disabled = disabled;
        document.getElementById("solveBtn").disabled = disabled;
        document.getElementById("skipBtn").disabled = disabled;
        document.getElementById("resetBtn").disabled = disabled;
      }
      
      function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const secs = (totalSeconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
      }
      
      function startTimer() {
        stopTimer(); 
        secondsElapsed = 0;
        const timerDisplay = document.getElementById("timerDisplay");
        timerDisplay.textContent = "00:00";
        
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = formatTime(secondsElapsed);
        }, 1000);
      }
      
      function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
      }
      
      function checkManualWin() {
        const b = readUI();
        if (isBoardValidAndFull(b)) {
            stopTimer();
            triggerConfetti();
            
            const oldBest = userData.bestTimes[currentDifficulty];
            if (!oldBest || secondsElapsed < oldBest) {
                userData.bestTimes[currentDifficulty] = secondsElapsed;
                saveUserData();
                updateStatsDisplay();
                showToast(`New best time for ${currentDifficulty}: ${formatTime(secondsElapsed)}!`);
            } else {
                showToast(`Solved in ${formatTime(secondsElapsed)}!`);
            }
        }
      }
      
      function saveUserData() {
        allUsers[currentUser] = userData;
        localStorage.setItem("sudoku_users", JSON.stringify(allUsers));
      }
      
      function updateStatsDisplay() {
        document.getElementById("bestEasy").textContent = userData.bestTimes.easy 
            ? formatTime(userData.bestTimes.easy) : "N/A";
        document.getElementById("bestMedium").textContent = userData.bestTimes.medium 
            ? formatTime(userData.bestTimes.medium) : "N/A";
        document.getElementById("bestHard").textContent = userData.bestTimes.hard 
            ? formatTime(userData.bestTimes.hard) : "N/A";
      }

      async function visualizeSolve(board) {
        const b = deepCopy(board);
        stopViz = false;

        async function dfs() {
          if (stopViz) return false;
          for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
              if (!original[r][c] && b[r][c] === 0) {
                for (let n = 1; n <= 9; n++) {
                  if (stopViz) return false;
                  if (validPlacement(b, r, c, n)) {
                    b[r][c] = n;
                    highlight(r, c, "trying", n);
                    await sleep(
                      speedMap[document.getElementById("speed").value]
                    );
                    if (await dfs()) return true;
                    if (stopViz) return false;
                    b[r][c] = 0;
                    highlight(r, c, "backtrack", "");
                    await sleep(
                      speedMap[document.getElementById("speed").value]
                    );
                  }
                }
                return false;
              }
        return true;
        }
        
        stopTimer(); 
        setControlsDisabled(true);
        const done = await dfs();
        if (done) {
          triggerConfetti();
        } else if (!stopViz) {
          showToast("No valid solution found for this board configuration.");
        }
        setControlsDisabled(false);
      }

      function solveFast(board) {
        const b = deepCopy(board);

        function solveWithOriginal(b) {
          for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
              if (!original[r][c] && b[r][c] === 0) {
                for (let n = 1; n <= 9; n++)
                  if (validPlacement(b, r, c, n)) {
                    b[r][c] = n;
                    if (solveWithOriginal(b)) return true;
                    b[r][c] = 0;
                  }
                return false;
              }
          return true;
        }

        stopTimer(); 
        setControlsDisabled(true);
        const ok = solveWithOriginal(b);
        if (ok) {
          for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
              if (!original[r][c]) {
                cells[r * 9 + c].value = b[r][c];
                cells[r * 9 + c].classList.add("solved");
              }
          triggerConfetti();
        } else {
          showToast("No valid solution found.");
        }
        setControlsDisabled(false);
      }

      function triggerConfetti() {
        const cv = document.getElementById("confetti"),
          ctx = cv.getContext("2d");
        cv.width = innerWidth;
        cv.height = innerHeight;
        let pcs = [];
        const colors = [
          "#007bff", "#0059b3", "#1e88e5", "#00acc1",
          "#43a047", "#fdd835", "#fb8c00", "#f4511e", "#e53935", "#d81b60",
        ];
        for (let i = 0; i < 150; i++) {
          pcs.push({
            x: Math.random() * cv.width,
            y: -Math.random() * cv.height,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 6 + 2,
            size: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            alpha: 1,
          });
        }
        function draw() {
          ctx.clearRect(0, 0, cv.width, cv.height);
          for (const p of pcs) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.rot += 5;
            p.alpha -= 0.004;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.globalAlpha = Math.max(p.alpha, 0);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
          }
          pcs = pcs.filter((p) => p.alpha > 0);
          if (pcs.length) requestAnimationFrame(draw);
        }
        draw();
      }

      document.getElementById("generateBtn").onclick = async () => {
        setControlsDisabled(true);
        loadUI([]);
        clearMarks();
        currentDifficulty = document.getElementById("difficulty").value; 
        const btn = document.getElementById("generateBtn");
        const oldText = btn.textContent;
        btn.textContent = "Generating...";
        await new Promise((resolve) =>
          setTimeout(async () => {
            const p = await generatePuzzle(currentDifficulty);
            loadUI(p);
            resolve();
          }, 10)
        );
        btn.textContent = oldText;
        setControlsDisabled(false);
        startTimer(); 
      };

      document.getElementById("solveBtn").onclick = async () => {
        const b = readUI();
        if (!validate(b)) return;
        await visualizeSolve(b);
      };

      document.getElementById("skipBtn").onclick = () => {
        const b = readUI();
        if (!validate(b)) return;
        solveFast(b);
      };

      document.getElementById("resetBtn").onclick = () => {
        loadUI([]);
        clearMarks();
        stopTimer(); 
        document.getElementById("timerDisplay").textContent = "00:00"; 
      };

      document.getElementById("stopBtn").onclick = () => {
        stopViz = true;
        setControlsDisabled(false);
      };

      const THEME_KEY = "sudoku_theme";
      const themeBtn = document.getElementById("themeBtn");
      
      function loadTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "dark") document.body.classList.add("dark");
        themeBtn.textContent = document.body.classList.contains("dark")
          ? "☀️"
          : "🌙";
      }

      themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
        themeBtn.textContent = isDark ? "☀️" : "🌙";
      });
      
      // --- App Initialization & Login ---
      
      function showApp(username) {
        currentUser = username;
        localStorage.setItem("sudoku_currentUser", currentUser);
        
        allUsers = JSON.parse(localStorage.getItem("sudoku_users") || "{}");
        userData = allUsers[currentUser] || { bestTimes: { easy: null, medium: null, hard: null } };
        
        document.body.classList.add("loggedIn");
        document.getElementById("userInfo").style.display = "flex";
        document.getElementById("themeBtn").style.display = "block";
        document.getElementById("welcomeMsg").textContent = `Welcome, ${currentUser}!`;
        
        loadTheme();
        updateStatsDisplay();
      }
      
      document.getElementById("loginBtn").addEventListener("click", () => {
        const username = document.getElementById("usernameInput").value.trim();
        if (username) {
            showApp(username);
        } else {
            showToast("Please enter a name.");
        }
      });
      
      // === NEW: Added Enter key listener ===
      document.getElementById("usernameInput").addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          document.getElementById("loginBtn").click();
        }
      });
      
      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("sudoku_currentUser");
        location.reload();
      });
      
      window.addEventListener("DOMContentLoaded", () => {
        const savedUser = localStorage.getItem("sudoku_currentUser");
        if (savedUser) {
            showApp(savedUser);
        }
      });
      