const questions = {
    1: [
        { q: "The unit of resistance is ___.", a: "ohm", clue: "Resistor" },
        { q: "An LED emits ___ when current flows through it.", a: "light", clue: "LED" },
        { q: "A capacitor stores ___ energy.", a: "electrical", clue: "Capacitor" }
    ],
    2: [
        { q: "A diode allows current in ___ direction.", a: "one", clue: "Diode" },
        { q: "The SI unit of capacitance is ___.", a: "farad", clue: "Capacitor" },
        { q: "The device used to measure current is called ___.", a: "ammeter", clue: "Ammeter" }
    ],
    3: [
        { q: "The transistor is used for ___.", a: "amplification", clue: "Transistor" },
        { q: "The voltage regulator IC is ___.", a: "7805", clue: "Voltage Regulator" },
        { q: "A fuse is used for ___.", a: "protection", clue: "Fuse" }
    ],
    4: [
        { q: "A Zener diode is used for ___.", a: "voltage regulation", clue: "Zener Diode" },
        { q: "A photodiode detects ___.", a: "light", clue: "Photodiode" },
        { q: "A potentiometer is used to vary ___.", a: "resistance", clue: "Potentiometer" }
    ],
    5: [
        { q: "The basic unit of inductance is ___.", a: "henry", clue: "Inductor" },
        { q: "A rectifier converts AC to ___.", a: "dc", clue: "Rectifier" },
        { q: "A relay is used for ___.", a: "switching", clue: "Relay" }
    ],
    6: [
        { q: "An oscilloscope is used to measure ___.", a: "waveform", clue: "Oscilloscope" },
        { q: "A thermistor is used to measure ___.", a: "temperature", clue: "Thermistor" },
        { q: "The SI unit of frequency is ___.", a: "hertz", clue: "Oscillator" }
    ],
    7: [
        { q: "A microphone converts sound into ___.", a: "electric signal", clue: "Microphone" },
        { q: "The device that stores charge is called a ___.", a: "capacitor", clue: "Capacitor" },
        { q: "A transformer is used to change ___.", a: "voltage", clue: "Transformer" }
    ],
    8: [
        { q: "An LDR changes resistance with ___.", a: "light", clue: "LDR" },
        { q: "The device used to amplify signals is ___.", a: "transistor", clue: "Transistor" },
        { q: "A motor converts electrical energy to ___.", a: "mechanical energy", clue: "Motor" }
    ],
    9: [
        { q: "An operational amplifier is used for ___.", a: "signal processing", clue: "Op-Amp" },
        { q: "A piezoelectric sensor detects ___.", a: "pressure", clue: "Piezoelectric Sensor" },
        { q: "A solar panel converts ___.", a: "light into electricity", clue: "Solar Panel" }
    ],
    10: [
        { q: "A push-button is a type of ___.", a: "switch", clue: "Push-Button" },
        { q: "A buzzer produces ___.", a: "sound", clue: "Buzzer" },
        { q: "An antenna is used for ___.", a: "signal transmission", clue: "Antenna" }
    ]
};



const componentLocations = {
    "Resistor": "Room 101",
    "LED": "Room 102",
    "Capacitor": "Room 103",
    "Diode": "Room 104",
    "Farad": "Room 105",
    "Ammeter": "Room 106",
    "Transistor": "Room 107",
    "Voltage Regulator": "Room 108",
    "Fuse": "Room 109",
    "Zener Diode": "Room 110"
};


let currentTeam = null;
let currentQuestions = [];
let attemptCounts = {};
let timerInterval;
let timeRemaining = 180; // 3 minutes
let foundClues = [];

// Function to start the quiz
function startQuiz() {
    const teamNumber = parseInt(document.getElementById("teamNumber").value);
    if (teamNumber < 1 || teamNumber > 10 || isNaN(teamNumber)) {
        alert("Please enter a valid team number between 1 and 10.");
        return;
    }

    // Check if this team has already attempted
    let attemptedTeams = JSON.parse(localStorage.getItem("attemptedTeams")) || [];
    if (attemptedTeams.includes(teamNumber)) {
        alert("You have already attempted the quiz!");
        return;
    }

    localStorage.setItem("currentTeam", teamNumber);
    localStorage.setItem("timeRemaining", 180);
    localStorage.setItem("foundClues", JSON.stringify([]));
    localStorage.setItem("quizCompleted", "false");

    currentTeam = teamNumber;
    currentQuestions = questions[teamNumber];

    attemptCounts = {};
    currentQuestions.forEach((_, index) => {
        attemptCounts[index] = 0;
    });
    localStorage.setItem("attemptCounts", JSON.stringify(attemptCounts));

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";
    document.getElementById("teamInfo").innerText = `Team ${currentTeam}, answer the questions below:`;

    loadQuestions();
    startTimer();
}

// Function to load questions dynamically
function loadQuestions() {
    if (localStorage.getItem("quizCompleted") === "true") {
        showFinalSubmissionScreen();
        return;
    }

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = "";

    currentQuestions.forEach((q, index) => {
        questionContainer.innerHTML += `
            <div class="question">
                <p>${q.q}</p>
                <input type="text" id="answer${index}" placeholder="Your Answer">
                <button onclick="checkAnswer(${index})">Submit</button>
                <p id="clue${index}" class="clue-message"></p>
            </div>
        `;
    });

    questionContainer.innerHTML += `
        <button id="finalSubmit" onclick="finalSubmit()">Final Submit</button>
    `;
}

// Function to check answers
function checkAnswer(index) {
    attemptCounts = JSON.parse(localStorage.getItem("attemptCounts")) || {};

    attemptCounts[index] = (attemptCounts[index] || 0) + 1;

    const answer = document.getElementById(`answer${index}`).value.trim().toLowerCase();
    const correctAnswer = currentQuestions[index].a.toLowerCase();
    const clueMessage = document.getElementById(`clue${index}`);

    if (answer === correctAnswer) {
        clueMessage.innerText = `Correct! Clue: ${currentQuestions[index].clue}`;
        clueMessage.style.color = "green";

        let foundClues = JSON.parse(localStorage.getItem("foundClues")) || [];
        if (!foundClues.includes(currentQuestions[index].clue)) {
            foundClues.push(currentQuestions[index].clue);
            localStorage.setItem("foundClues", JSON.stringify(foundClues));
        }
    } else {
        clueMessage.innerText = "Incorrect! Try again.";
        clueMessage.style.color = "red";
    }

    localStorage.setItem("attemptCounts", JSON.stringify(attemptCounts));
}

// Function to start/resume timer
function startTimer() {
    let savedTime = localStorage.getItem("timeRemaining");
    timeRemaining = savedTime ? parseInt(savedTime) : 180;

    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            localStorage.setItem("timeRemaining", timeRemaining);
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            alert("Time's up! Submitting your answers.");
            finalSubmit();
        }
    }, 1000);
}

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("timerDisplay").innerText = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Function to submit answers
function finalSubmit() {
    clearInterval(timerInterval);

    // Mark the quiz as completed
    localStorage.setItem("quizCompleted", "true");

    // Save this team as attempted
    let attemptedTeams = JSON.parse(localStorage.getItem("attemptedTeams")) || [];
    attemptedTeams.push(currentTeam);
    localStorage.setItem("attemptedTeams", JSON.stringify(attemptedTeams));

    showFinalSubmissionScreen();
}

// Function to show the final submission screen
function showFinalSubmissionScreen() {
    const foundClues = JSON.parse(localStorage.getItem("foundClues")) || [];
    let locationInfo = "<h3>Component Locations:</h3><ul>";

    foundClues.forEach((clue) => {
        const location = componentLocations[clue] || "Unknown Location";
        locationInfo += `<li>${clue} → ${location}</li>`;
    });

    locationInfo += "</ul>";

    document.getElementById("quizPage").innerHTML = `
        <h2>Team ${currentTeam}, your answers have been submitted!</h2>
        ${locationInfo}
    `;
}

// Function to handle page reload and keep quiz active
window.onload = function () {
    if (localStorage.getItem("quizCompleted") === "true") {
        showFinalSubmissionScreen();
        return;
    }

    const savedTeam = localStorage.getItem("currentTeam");
    if (savedTeam) {
        currentTeam = parseInt(savedTeam);
        currentQuestions = questions[currentTeam];

        attemptCounts = JSON.parse(localStorage.getItem("attemptCounts")) || {};

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("quizPage").style.display = "block";
        document.getElementById("teamInfo").innerText = `Team ${currentTeam}, answer the questions below:`;

        loadQuestions();
        startTimer();
    }
};