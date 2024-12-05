// script.js

// Välj DOM-element
const mainMenu = document.getElementById("main-menu");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const resultText = document.getElementById("result-text");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

// Hämtar frågor från API
async function fetchQuestions(amount, category, difficulty) {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// Starta quizet
async function startQuiz() {
    const numQuestions = document.getElementById("num-questions").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;

    questions = await fetchQuestions(numQuestions, category, difficulty);
    currentQuestionIndex = 0;
    correctAnswers = 0;

    // Visa quiz och dölj andra sektioner
    mainMenu.classList.add("hidden");
    resultContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    showQuestion();
}

// Visa en fråga
function showQuestion() {
    resetState();
    const question = questions[currentQuestionIndex];
    questionText.innerHTML = question.question;

    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, answer === question.correct_answer));
        answerButtons.appendChild(button);
    });
}

// Hantera svar från användaren
function selectAnswer(button, isCorrect) {
    if (isCorrect) {
        button.classList.add("correct");
        correctAnswers++;
    } else {
        button.classList.add("wrong");
    }

    // Markera alla svarsalternativ
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
        if (button.innerText === questions[currentQuestionIndex].correct_answer) {
            button.classList.add("correct");
        }
    });

    nextButton.classList.remove("hidden");
}

// Visa nästa fråga eller resultat
function showNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Visa resultat
function showResults() {
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    resultText.innerText = `You answered correctly on ${correctAnswers} out of ${questions.length} questions!`;
}

// Starta om quizet
function restartQuiz() {
    // Återställ state och visa huvudmenyn
    mainMenu.classList.remove("hidden");
    resultContainer.classList.add("hidden");
    quizContainer.classList.add("hidden");
    resetState();
}

// Nollställ state för ny fråga
function resetState() {
    nextButton.classList.add("hidden");
    answerButtons.innerHTML = "";
}

// Slumpa svarsalternativ
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", showNext);
restartButton.addEventListener("click", restartQuiz);
