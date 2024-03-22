// Declare global variables
let startTime; // Stores the start time when the game starts
let timerInterval; // Stores the interval ID for updating the timer display
let gameStarted = false; // Flag indicating whether the game has started
let gameEnded = false; // Flag indicating whether the game has ended
let bestScores = {}; // Object to store best scores for each level of decimals
let currentScore; // Stores the current score (elapsed time)
let elapsedTime = 0; // Global variable to store the elapsed time
let decimalsToWin = 5; // Stores the number of decimals required to win
const piValue = '3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254937901'
    .slice(0, 1000).replace('.', ''); // First 1000 digits of Pi

updateBestScoreDisplay(); // Display the best score when the page loads

// Event listener for input changes in the pi input field
document.getElementById('piInput').addEventListener('input', function (event) {
    if (!gameStarted) {
        startTimer(); // Start the timer if the game has not started yet
        gameStarted = true;
    }
    if (gameEnded) return; // Exit if the game has ended
    const inputText = event.target.value;
    if (inputText.length > piValue.length || inputText !== piValue.slice(0, inputText.length)) {
        endGame(); // End the game if the input is incorrect
    } else if (inputText === piValue.slice(0, decimalsToWin)) {
        endGame(true); // End the game if the correct number of decimals is entered
        updateBestScore(); // Update the best score if the player won
    }
});

// Event listener for the restart button
document.getElementById('restartBtn').addEventListener('click', function () {
    resetGame(); // Reload the page to restart the game
});

// Event listener for the button to delete cookies
document.getElementById('deleteCookiesBtn').addEventListener('click', function () {
    if (window.confirm("Are you sure you want to delete all your saves?")) {
        deleteAllCookies(); // Delete all stored cookies
        location.reload(); // Reload window after cookies are deleted
    } else {
        return
    }
});

// Event listener for the button to toggle the number of decimals to win
document.getElementById('toggleDecimalsBtn').addEventListener('click', function () {
    toggleDecimalsToWin(); // Toggle the number of decimals required to win
    updateBestScoreDisplay(); // Update displayed best scores after changing the number of decimals to win
});

// Function to start the timer
function startTimer() {
    startTime = new Date().getTime(); // Get the current time
    timerInterval = setInterval(updateTimer, 1); // Start updating the timer every millisecond
}

// Function to update the timer
function updateTimer() {
    const currentTime = new Date().getTime(); // Get the current time
    elapsedTime = (currentTime - startTime) / 1000; // Calculate the elapsed time in seconds
    currentScore = elapsedTime; // Update the current score to match the elapsed time
    document.getElementById('time').textContent = `${elapsedTime.toFixed(3)}`; // Update the displayed time
}

// Function to end the game
function endGame(win = false) {
    clearInterval(timerInterval); // Stop the timer interval
    gameEnded = true; // Set the game as ended
    document.getElementById('piInput').disabled = true; // Disable the input field
    // Display a message based on whether the player won or lost
    if (win) {
        document.getElementById('piInput').style.backgroundColor = 'green'; // Enable the input field
        document.getElementById('status').textContent = 'Congratulations! You entered Pi correctly.';
        document.getElementById('speed').textContent = (document.getElementById('piInput').value.length / elapsedTime).toFixed(2);
        updateBestScore(); // Update the best score if the player won
    } else {
        document.getElementById('piInput').style.backgroundColor = 'red'; // Enable the input field
        document.getElementById('speed').textContent = (document.getElementById('piInput').value.length / elapsedTime).toFixed(2);
        document.getElementById('status').textContent = 'Oops! Wrong input. Game over.';
    }
}

// Function to parse stored cookies and retrieve best scores
function getBestScores() {
    const cookies = document.cookie.split(';'); // Split all cookies into an array
    const scores = {}; // Initialize an empty object to store best scores
    // Loop through each cookie
    cookies.forEach(cookie => {
        const [key, value] = cookie.trim().split('='); // Split cookie into key and value
        scores[key] = parseFloat(value); // Parse the value as a float and store it in the scores object
    });
    return scores; // Return the scores object
}

// Function to update the displayed best scores
function updateBestScoreDisplay() {
    bestScores = getBestScores(); // Get the best scores from stored cookies
    const cookieName = `bestScore-${decimalsToWin}`; // Construct the cookie name for the current number of decimals
    const bestScore = bestScores[cookieName]; // Get the best score for the current number of decimals
    if (bestScore !== undefined) {
        document.getElementById('bestScore').textContent = `${bestScore}`; // Update the displayed best score if it exists
    }
}

// Function to update the best score
function updateBestScore() {
    const cookieName = `bestScore-${decimalsToWin}`; // Construct the cookie name for the current number of decimals
    const currentBestScore = bestScores[cookieName] || Infinity; // Get the current best score or set it to Infinity if it doesn't exist
    // If the current score is better than the best score, update the best score and store it in a cookie
    if (elapsedTime < currentBestScore) {
        bestScores[cookieName] = elapsedTime; // Update the best score to the elapsed time
        document.cookie = `${cookieName}=${elapsedTime};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`; // Store the best score in a cookie
        updateBestScoreDisplay(); // Update the displayed best scores after updating the cookie
    }
}

// Function to delete all stored cookies
function deleteAllCookies() {
    Object.keys(bestScores).forEach(key => {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`; // Set expiry date to delete the cookie
    });
    bestScores = {}; // Clear the best scores object
}

// Function to toggle the number of decimals required to win
function toggleDecimalsToWin() {
    const decimalsValues = [5, 10, 20, 30, 50, 100, 500, 1000]; // Array of possible values for decimals to win
    const currentIndex = decimalsValues.indexOf(decimalsToWin); // Get the index of the current value
    decimalsToWin = decimalsValues[(currentIndex + 1) % decimalsValues.length]; // Set the next value in the array
    document.getElementById('toggleDecimalsBtn').textContent = `${decimalsToWin} Decimals`; // Update the button text to reflect the new number of decimals required to win
    document.getElementById('piInput').placeholder = `Type the first ${decimalsToWin} decimals as fast as possible!`; // Update the input field to show the number of decimals required to win

    if (gameEnded) {
        resetGame(); // Reset the game if it has ended
    }
}

// Function to reset the game state
function resetGame() {
    gameStarted = false; // Reset gameStarted flag
    gameEnded = false; // Reset gameEnded flag
    document.getElementById('piInput').value = ''; // Clear the input field
    document.getElementById('piInput').disabled = false; // Enable the input field
    document.getElementById('piInput').style.backgroundColor = 'white'; // Enable the input field
    document.getElementById('status').textContent = 'Start with 314159...'; // Display initial status message
    document.getElementById('speed').textContent = 0;
    clearInterval(timerInterval); // Stop the timer interval
}

