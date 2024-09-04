import { quizRepository } from "../../data/quiz_repository.js"

function main() {
    setupPage()
}

function setupPage() {
    const queryString = window.location.search
    let params = new URLSearchParams(queryString) 

    let btnKembali = document.getElementById('btnReturn')
    btnKembali.onclick = () => {
        window.history.back()
    }

    let mode = params.get("mode") || 0 //1 edit quiz, 0 new
    if (mode == 1) setupAsEditPage()
    else setupAsAddQuiz() 
}

function setupAsAddQuiz() {
    let addButton = document.getElementById('btnAdd') ;
    addButton.onclick = () => {
        addQuiz()
    }
}

function setupAsEditPage() {
    showLoading(true)
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
        showLoading(false)
        setDefaultData(item)
    })
    .catch(error => {
        console.log(error)
    })
}

function addQuiz() {
    let quiz = validateForm() 
    if (quiz === undefined) return 
    quizRepository.addQuiz(quiz)
    .then(result => {
        clearForm()
        onAddQuizSuccess()
    })
}

function onAddQuizSuccess() {
    let modal = document.getElementById("alertModal")
    let title = document.getElementById("modalTitle")
    title.innerHTML = "Success"
    let message = document.getElementById("modalMessage")
    message.innerHTML = "Horee! Berhasil menambahkan quiz"
    new bootstrap.Modal(modal).show()
}

async function updateQuiz(quiz) {
    quizRepository.updateQuiz(quiz)
    .then(result => {
        //window.history.back()
    })
}

function validateForm(quizId, choiceId) {
    let question = document.getElementById('questionField').value
    if (question === undefined || question === "") return

    let choiceA = document.getElementById('choiceA').value
    if (choiceA === undefined || choiceA === "") return 

    let choiceB = document.getElementById('choiceB').value
    if (choiceB === undefined || choiceB === "") return 

    let choiceC = document.getElementById('choiceC').value
    if (choiceC === undefined || choiceC === "") return 

    let choiceD = document.getElementById('choiceD').value
    if (choiceD === undefined || choiceD === "") return 

    let hint = document.getElementById('quizHint').value
    if (hint === undefined || hint === "") return

    let checked = document.querySelector('input[name="options-outlined"]:checked').id;
    let correctAnswer 
    switch (checked) {
        case "optionB":
            correctAnswer = choiceB; break;
        case "optionC":
            correctAnswer = choiceC; break;
        case "optionD":
            correctAnswer = choiceD; break;
        default :
            correctAnswer = choiceA; break;           
    }

    let type = document.getElementById("category")
    let selectedType = type.options[type.selectedIndex].text
    let typeId 
    if (selectedType === "cerpen")
        typeId = 1
    else 
        typeId = 2

    return {
        quizId: quizId,
        question: question,
        choiceId: choiceId,
        choices: Array(choiceA, choiceB, choiceC, choiceD),
        score: 1,
        correctAnswer: correctAnswer,
        hint: hint,
        type: typeId
    }
}

function setDefaultData(quizItem) {
    let choices = quizItem["choices"]
    let correctAnswer = choices.findIndex(item => item === quizItem["correctAnswer"])

    let question = document.getElementById("questionField")
    question.value = quizItem["question"] 

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
    hint.value = quizItem["hint"]

    let option = document.getElementById("category")
    option.options[quizItem["type"]-1].selected = 'selected';

    let addButton = document.getElementById('btnAdd') ;
    addButton.onclick = () => {
        update(quizItem["id"], quizItem["choiceId"])
    }
}

function update(quizId, choiceId) {
    let quiz = validateForm(quizId, choiceId) 
    if (quiz === undefined) return 
    updateQuiz(quiz)
}

function clearForm() {
    let question = document.getElementById("questionField")
    question.value = ''

    let choiceA = document.getElementById("choiceA")
    choiceA.value = ''

    let choiceB = document.getElementById("choiceB")
    choiceB.value = ''

    let choiceC = document.getElementById("choiceC")
    choiceC.value = ''

    let choiceD = document.getElementById("choiceD")
    choiceD.value = ''

    document.getElementById("optionA").checked = true

    let hint = document.getElementById("quizHint")
    hint.value = ''
}

function showLoading(show) {
    let question = document.getElementById("questionField")
    if (show) question.className = `${question.className} placeholder`
    else question.className = "form-control"

    let choiceA = document.getElementById("choiceA")
    if (show) choiceA.className = `${choiceA.className} placeholder`
    else choiceA.className = "col form-control"

    let choiceB = document.getElementById("choiceB")
    if (show) choiceB.className = `${choiceB.className} placeholder`
    else choiceB.className = "col form-control"

    let choiceC = document.getElementById("choiceC")
    if (show) choiceC.className = `${choiceC.className} placeholder`
    else choiceC.className = "col form-control"

    let choiceD = document.getElementById("choiceD")
    if (show) choiceD.className = `${choiceD.className} placeholder`
    else choiceD.className = "col form-control"

    document.getElementById("optionA").checked = true

    let hint = document.getElementById("quizHint")
    if (show) hint.className = `${hint.className} placeholder`
    else hint.className = "form-control"
}

main()