document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let timeLeft = 30;
    let gameStarted = false;
    let gameOver = false;
    let bestTime = null;

    // Elements
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const timerBtn = document.getElementById('timer-btn');
    const retryBtn = document.getElementById('retry-btn');
    const messageContainer = document.getElementById('message-container');
    const gameButtons = Array.from(document.querySelectorAll('.game-button'));

    // Show game screen and shuffle buttons
    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        retryBtn.style.display = 'block';
        shuffleButtons();
    });

    // Shuffle buttons randomly
    function shuffleButtons() {
        const shuffledNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        gameButtons.forEach((btn, index) => {
            btn.textContent = shuffledNumbers[index];
        });
    }

    // Start the timer
    function startTimer() {
        if (!gameStarted) {
            gameStarted = true;
            timer = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    gameOver = true;
                    showMessage('Game Over! Time’s up!');
                } else {
                    timeLeft--;
                    updateTimerDisplay();
                }
            }, 1000);
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerBtn.textContent = `Timer: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    // Drag-and-drop functionality
    gameButtons.forEach((button) => {
        button.addEventListener('dragstart', (e) => {
            if (!gameStarted && !gameOver) startTimer();
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.style.opacity = '0.5'; // Reduce opacity while dragging
        });

        button.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1'; // Reset opacity after drop
        });

        button.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
        });

        button.addEventListener('drop', (e) => {
            e.preventDefault();
            if (gameOver) return;

            const draggedValue = e.dataTransfer.getData('text/plain');
            const targetValue = e.target.textContent;

            const draggedButton = gameButtons.find(
                (btn) => btn.textContent === draggedValue
            );

            if (draggedButton && draggedButton !== e.target && isStraightMove(e.target, draggedButton)) {
                // Swap the dragged and target button values
                e.target.textContent = draggedValue;
                draggedButton.textContent = targetValue;

                // Check if the puzzle is solved
                if (checkIfSolved()) {
                    clearInterval(timer);
                    handleWin();
                }
            }
        });
    });

    // Check if two buttons are in a straight horizontal or vertical line
    function isStraightMove(target, draggedButton) {
        const targetIndex = gameButtons.indexOf(target);
        const draggedButtonIndex = gameButtons.indexOf(draggedButton);

        const targetRow = Math.floor(targetIndex / 3);
        const draggedRow = Math.floor(draggedButtonIndex / 3);

        const targetColumn = targetIndex % 3;
        const draggedColumn = draggedButtonIndex % 3;

        // Allow moves within the same row or the same column
        return targetRow === draggedRow || targetColumn === draggedColumn;
    }

    // Check if the puzzle is solved
    function checkIfSolved() {
        return gameButtons.every((btn, index) => btn.textContent == index + 1);
    }

    // Handle win
    function handleWin() {
        const timeTaken = 30 - timeLeft;
        let message = `You Win! Time Taken: ${timeTaken} seconds. `;

        if (bestTime === null || timeTaken < bestTime) {
            bestTime = timeTaken;
            message += `<span style="color: green; font-weight: bold;">New Record!</span>`;
        } else {
            message += `<span style="color: orange;">Best Record: ${bestTime} seconds.</span>`;
        }

        showMessage(message);
        gameOver = true;
    }

    // Show messages with styling
    function showMessage(message) {
        messageContainer.innerHTML = message;
        messageContainer.style.display = 'block';
        messageContainer.style.fontSize = '1.5rem';
        messageContainer.style.marginTop = '20px';
        messageContainer.style.color = 'blue';
    }

    // Add the event listener for "Try Again" button only once
    retryBtn.addEventListener('click', resetGame);

    // Reset the game
    function resetGame() {
        timeLeft = 30;
        gameStarted = false;
        gameOver = false;
        messageContainer.textContent = '';
        messageContainer.style.display = 'none';
        clearInterval(timer);
        updateTimerDisplay();
        shuffleButtons();
    }
});
