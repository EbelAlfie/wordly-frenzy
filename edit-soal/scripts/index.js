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

function setupAsEditQuiz() {
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
        if (item === undefined || item === null) {
            if (local == true) return
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

    let choiceA = document.getElementById('choiceA').textContent
    if (choiceA === undefined || choiceA === "") return 

    let choiceB = document.getElementById('choiceB').textContent
    if (choiceB === undefined || choiceB === "") return 

    let choiceC = document.getElementById('choiceC').textContent
    if (choiceC === undefined || choiceC === "") return 

    let choiceD = document.getElementById('choiceD').textContent
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

    let addButton = document.getElementById('btnAdd') ;
    addButton.onClick = () => {
        updateQuiz()
    }
}

main()