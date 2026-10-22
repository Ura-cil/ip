
let currentQuestion = 0;
let score = 0;
let selectedCategory = "HTML";
let questions = [];
let timeLeft = 30;
let timer;
let answered = false;

const QUESTIONS_PER_QUIZ = 5;

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const questionNumber = document.getElementById("questionNumber");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startBtn");

if (startBtn) {
    startBtn.addEventListener("click", function() {
        window.location.href = "categories.html";
    });
}

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(function(card) {
    card.addEventListener("click", function() {
        selectedCategory = card.getAttribute("data-category");
        localStorage.setItem("selectedCategory", selectedCategory);
        window.location.href = "quiz.html";
    });
});

function getRandomQuestions(category) {
    const topicQuestions = questionBank[category] || [];
    const shuffledQuestions = [...topicQuestions];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    return shuffledQuestions.slice(0, QUESTIONS_PER_QUIZ);
}

function loadQuestion() {
    if (!questions[currentQuestion]) {
        showResult();
        return;
    }

    answered = false;

    const current = questions[currentQuestion];

    questionElement.textContent = current.question;
    questionNumber.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;

    const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
    progress.style.width = progressPercentage + "%";

    optionsContainer.innerHTML = "";

    current.options.forEach(function(option, index) {
        const button = document.createElement("button");
        button.classList.add("option");
        button.textContent = option;

        button.addEventListener("click", function() {
            selectAnswer(index);
        });

        optionsContainer.appendChild(button);
    });

    if (nextBtn) {
        nextBtn.disabled = true;
    }

    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;

    const timerElement = document.getElementById("timer");

    if (!timerElement) return;

    timerElement.textContent = timeLeft + "s";

    timer = setInterval(function() {
        timeLeft--;
        timerElement.textContent = timeLeft + "s";

        if (timeLeft <= 0) {
            clearInterval(timer);
            answered = true;

            document.querySelectorAll(".option").forEach(function(option) {
                option.disabled = true;
            });

            if (nextBtn) {
                nextBtn.disabled = false;
            } else {
                moveToNextQuestion();
            }
        }
    }, 1000);
}

function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;
    clearInterval(timer);

    const current = questions[currentQuestion];
    const allOptions = document.querySelectorAll(".option");

    allOptions.forEach(function(option) {
        option.disabled = true;
    });

    if (selectedIndex === current.answer) {
        allOptions[selectedIndex].style.borderColor = "#22c55e";
        allOptions[selectedIndex].style.background = "#14532d";
        score++;
    } else {
        allOptions[selectedIndex].style.borderColor = "#ef4444";
        allOptions[selectedIndex].style.background = "#7f1d1d";

        if (allOptions[current.answer]) {
            allOptions[current.answer].style.borderColor = "#22c55e";
            allOptions[current.answer].style.background = "#14532d";
        }
    }

    if (nextBtn) {
        nextBtn.disabled = false;
    } else {
        setTimeout(moveToNextQuestion, 1000);
    }
}

function moveToNextQuestion() {
    clearInterval(timer);
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

if (nextBtn) {
    nextBtn.addEventListener("click", function() {
        if (!answered) return;
        moveToNextQuestion();
    });
}

function showResult() {
    clearInterval(timer);

    localStorage.setItem("interviewXScore", score);
    localStorage.setItem("interviewXTotal", questions.length);
    localStorage.setItem("interviewXCategory", selectedCategory);

    const history = JSON.parse(localStorage.getItem("interviewXHistory") || "[]");

    history.push({
        category: selectedCategory,
        score: score,
        total: questions.length,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("interviewXHistory", JSON.stringify(history));

    window.location.href = "result.html";
}

if (questionElement) {
    selectedCategory = localStorage.getItem("selectedCategory") || "HTML";

    const categoryName = document.getElementById("categoryName");

    if (categoryName) {
        categoryName.textContent = selectedCategory;
    }

    if (typeof questionBank === "undefined" || !questionBank[selectedCategory]) {
        questionElement.textContent = "Questions could not be loaded. Please check your question bank.";
    } else {
        questions = getRandomQuestions(selectedCategory);
        currentQuestion = 0;
        score = 0;

        if (questions.length === 0) {
            questionElement.textContent = "No questions available for this topic yet.";
        } else {
            loadQuestion();
        }
    }
}
