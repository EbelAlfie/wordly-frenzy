import { quizRepository } from "../../data/quiz_repository.js"

function main() {
    setupPage()
}

function setupPage() {
    const queryString = window.location.search
    console.log(queryString)
    let params = new URLSearchParams(queryString) 
    console.log(params.get("mode"))

    let mode = params.get("mode") || 0 //1 edit quiz, 0 new
    if (mode == 1) setupAsEditPage()
    else setupAsAddQuiz() 
}

function setupAsAddQuiz() {
    let addButton = document.getElementById('btnAdd') ;
    addButton.onClick = () => {
        addQuiz()
    }
}

function setupAsEditPage() {
    loadQuizById()
}

function loadQuizById() {
    const queryString = window.location.search
    console.log(queryString)
    let quizId = new URLSearchParams(queryString) 
    console.log(quizId.get("quizId"))

    getQuizById(false, quizId)
}

function getQuizById(local, quizId) {
    quizRepository.getQuizDetail(local, quizId.get("quizId"))
    .then(item => {
        console.log(item)
        if (item["id"] === "") {
            if (local === true) return
            getQuizById(true, quizId)
            return 
        }
        setDefaultData(item)
    })
    .catch(error => {
        console.log(error)
    })
}

function addQuiz() {
    let quiz = validateForm() 
    if (!quiz) return 
    quizRepository.addQuiz(quiz)
}

async function updateQuiz(quiz) {
    quizRepository.updateQuiz(quiz)
}

function validateForm() {
    let quiz = document.getElementById('questionField').textContent
    if (quiz === undefined) return

    let choiceA = document.getElementById('choiceA').value
    if (choiceA === undefined || choiceA === "") return 

    let choiceB = document.getElementById('choiceB').value
    if (choiceB === undefined || choiceB === "") return 

    let choiceC = document.getElementById('choiceC').value
    if (choiceC === undefined || choiceC === "") return 

    let choiceD = document.getElementById('choiceD').value
    if (choiceD === undefined || choiceD === "") return 

    let hint = document.getElementById('hint').textContent
    if (hint === undefined || hint === "") return

    let correctAnswer = document.querySelector('input[name="options-outlined"]:checked').value;
    console.log(correctAnswer) ;

    return {
        quiz: quiz,
        choices: Array(choiceA, choiceB, choiceC, choiceD),
        hint: hint
    }
}

function setDefaultData(quizItem) {
    console.log(quizItem) ;
    let choices = quizItem["choice"]
    let correctAnswer = choices.findIndex(item => item === quizItem["correctAnswer"])

    let question = document.getElementById("questionField")
    question.textContent = quizItem["question"] 

    let choiceA = document.getElementById("choiceA")
    choiceA.value = choices[0]

    let choiceB = document.getElementById("choiceB")
    choiceB.value = choices[1]

    let choiceC = document.getElementById("choiceC")
    choiceC.value = choices[2]

    let choiceD = document.getElementById("choiceD")
    choiceD.value = choices[3]

    switch (correctAnswer) {
        case 1: document.getElementById("optionB").checked = true; break;
        case 2: document.getElementById("optionC").checked = true; break;
        case 3: document.getElementById("optionD").checked = true; break;
        default: document.getElementById("optionA").checked = true
    }

    let hint = document.getElementById("quizHint")
    hint.textContent = quizItem["hint"]

    let addButton = document.getElementById('btnAdd') ;
    addButton.onClick = () => {
        updateQuiz()
    }
}

main()