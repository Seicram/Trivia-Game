// Global variables
const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple'; // API endpoint to fetch random questions
const triviaContainer = document.getElementById('trivia-container');
let currentQuestionIndex = 0; // Index of the current question
let correctCount = 0; // Number of questions answered correctly
let incorrectCount = 0; // Number of questions answered incorrectly
let questions; // Variable to store fetched questions

// Function to fetch random questions
async function fetchRandomQuestions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log('Error fetching questions:', error);
    return [];
  }
}

// Function to create a random order of answers
function shuffleAnswers(answers) {
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
}

// Function to display the welcome message
function displayWelcomeMessage() {
  const welcomeContainer = document.getElementById('welcome-container');
  welcomeContainer.classList.remove('hidden');
}

// Function to hide the welcome message
function hideWelcomeMessage() {
  const welcomeContainer = document.getElementById('welcome-container');
  welcomeContainer.classList.add('hidden');
}

// Function to display the trivia questions
function displayTriviaQuestions() {
  const questionContainer = document.getElementById('question-container');
  questionContainer.classList.remove('hidden');

  const question = questions[currentQuestionIndex];
  const answers = [...question.incorrect_answers, question.correct_answer];
  shuffleAnswers(answers);

  const questionHtml = `
    <div class="trivia-question">
      <p class="question">${currentQuestionIndex + 1}. ${question.question}</p>
      <ul class="answers">
        ${answers.map((answer, index) => `
          <li>
            <input type="radio" name="answer" id="answer${index}" value="${answer}">
            <label for="answer${index}">${answer}</label>
          </li>
        `).join('')}
      </ul>
      ${currentQuestionIndex < questions.length - 1 ? '<button id="next-btn">Next</button>' : '<button id="submit-btn">Submit</button>'}
    </div>
  `;
  questionContainer.innerHTML = questionHtml;

  // Event listener for the Next button
  const nextButton = document.getElementById('next-btn');
  if (nextButton) {
    nextButton.addEventListener('click', handleNextButtonClick);
  }

  // Event listener for the Submit button
  const submitButton = document.getElementById('submit-btn');
  if (submitButton) {
    submitButton.addEventListener('click', handleSubmitButtonClick);
  }
}

// Function to handle the Next button click
function handleNextButtonClick() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    alert('Please select an answer.');
    return;
  }

  const answerValue = selectedAnswer.value;
  console.log('Selected answer:', answerValue);

  const question = questions[currentQuestionIndex];
  if (answerValue === question.correct_answer) {
    correctCount++;
  } else {
    incorrectCount++;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayTriviaQuestions();
  } else {
    console.log('Quiz completed!');
    showQuizResults();
  }
}

// Function to handle the Submit button click
function handleSubmitButtonClick() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    alert('Please select an answer.');
    return;
  }

  const answerValue = selectedAnswer.value;
  console.log('Selected answer:', answerValue);

  const question = questions[currentQuestionIndex];
  if (answerValue === question.correct_answer) {
    correctCount++;
  } else {
    incorrectCount++;
  }

  console.log('Quiz completed!');
  showQuizResults();
}

// Function to show quiz results in a pop-up
function showQuizResults() {
  const totalQuestions = correctCount + incorrectCount;
  const score = (correctCount / totalQuestions) * 100;

  const message = `Quiz Results:
    Correct Answers: ${correctCount}
    Incorrect Answers: ${incorrectCount}
    Score: ${score.toFixed(2)}%`;

  alert(message);

  // Hide the Submit button
  const submitButton = document.getElementById('submit-btn');
  submitButton.classList.add('hidden');

  // Create the New Game button
  const newGameButton = document.createElement('button');
  newGameButton.id = 'new-game-btn';
  newGameButton.textContent = 'New Game';

  // Event listener for the New Game button
  newGameButton.addEventListener('click', startNewGame);

  // Replace the Submit button with the New Game button
  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = '';
  questionContainer.appendChild(newGameButton);
}

// Function to start a new game
async function startNewGame() {
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  questions = await fetchRandomQuestions();
  displayTriviaQuestions();
  hideWelcomeMessage();
}

// Event listener for the Start Game button
document.getElementById('start-game-btn').addEventListener('click', startNewGame);

// Display the welcome message on page load
displayWelcomeMessage();
