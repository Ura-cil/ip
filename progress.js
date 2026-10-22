
const historyContainer = document.getElementById("history");
const attemptedElement = document.getElementById("attempted");
const correctElement = document.getElementById("correct");
const accuracyElement = document.getElementById("accuracy");
const bestScoreElement = document.getElementById("bestScore");
const resetButton = document.getElementById("resetProgress");

function getHistory() {
    return JSON.parse(localStorage.getItem("interviewXHistory") || "[]");
}

function renderProgress() {
    const history = getHistory();

    const totalAttempted = history.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const totalCorrect = history.reduce(
        (sum, item) => sum + item.score,
        0
    );

    const accuracy = totalAttempted
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;

    const bestScore = history.length
        ? Math.max(...history.map(item =>
            item.total ? Math.round((item.score / item.total) * 100) : 0
        ))
        : 0;

    attemptedElement.textContent = totalAttempted;
    correctElement.textContent = totalCorrect;
    accuracyElement.textContent = accuracy + "%";
    bestScoreElement.textContent = bestScore + "%";

    historyContainer.innerHTML = "";

    if (!history.length) {
        historyContainer.textContent =
            "No practice history yet. Start a quiz!";
        return;
    }

    history.slice().reverse().forEach(function (item) {
        const entry = document.createElement("div");
        entry.classList.add("history-item");

        const category = document.createElement("strong");
        category.textContent = item.category;

        const result = document.createElement("span");
        result.textContent =
            `${item.score}/${item.total} correct (${item.total ? Math.round(item.score / item.total * 100) : 0}%)`;

        const date = document.createElement("small");
        date.textContent = item.date;

        entry.append(category, result, date);
        historyContainer.appendChild(entry);
    });
}

if (resetButton) {
    resetButton.addEventListener("click", function () {
        if (confirm("Are you sure you want to reset all practice progress?")) {
            localStorage.removeItem("interviewXHistory");
            renderProgress();
        }
    });
}

renderProgress();
