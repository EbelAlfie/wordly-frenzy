import { quizRepository } from "../../data/quiz_repository.js"

const list = document.getElementById('quizList');
const fragment = document.createDocumentFragment();

function main() {
    showLoading()
    
    queryMyQuizes(false)
    setupNewQuizButton()
    list.appendChild(fragment)
}

async function queryMyQuizes(local) {
    return quizRepository.loadQuizByTeacherId(local, 1)
    .then(result => {
        dismissLoading()
        result.data.forEach(item => {
            addNewItem({
                id: item["id"] || "",
                soal: item["question"] || "",
                category: item["type"] || ""
            }, false
            )
        })
        list.appendChild(fragment)
    })
    .catch(error => {
        console.log(error)
        queryMyQuizes(true)
    })
}

function setupNewQuizButton() {
    let newQuizBtn = document.getElementById("btnNewQuiz") 
    newQuizBtn.onclick = () => {
        window.location.href = `../edit-soal/edit.html?mode=0`
    }
}

function showLoading() {
    addNewItem(null, true)
    addNewItem(null, true)
    addNewItem(null, true)
    addNewItem(null, true)
    addNewItem(null, true)
    addNewItem(null, true)
}

function dismissLoading(data) {
    list.innerHTML = ''
}

function addNewItem(quizModel, isLoading) {
    let container = document.createElement('li')
    container.className = "card container d-flex flex-column p-0 mt-2 mb-2"

    let header = document.createElement('div')
    header.className = "card-header d-flex flex-row justify-content-between"
    
    let quizTitle = document.createElement('h3')
    quizTitle.className = "align-self-center text-truncate"
    quizTitle.innerText = quizModel?.soal || "Judul"

    let editBtn = document.createElement('a')
    editBtn.className = "btn btn-outline-primary align-self-center"
    editBtn.innerText = "Detail"
    if (!isLoading && quizModel.id !== undefined) {
        editBtn.onclick = () => {
            window.location.href = `../edit-soal/edit.html?mode=1&quizId=${quizModel.id}`
        }
    }

    header.appendChild(quizTitle)
    header.appendChild(editBtn)

    let quizBody = document.createElement('div')
    quizBody.className = "card-body d-flex flex-row"

    let quizCategory = document.createElement('h4')
    quizCategory.className = "rounded quiz-type p-2 text-white fs-6 text-center"
    quizCategory.innerText = quizModel?.category || "Cerpen"
    if (!isLoading && quizCategory.innerText == "Kalimat Efektif")
        quizCategory.style = "background-color: #3DB2FF;"
    else if (!isLoading)
        quizCategory.style = "background-color: #00CD2D;"

    quizBody.appendChild(quizCategory)

    container.appendChild(header)
    container.appendChild(quizBody)

    if (isLoading) {
        container.className = `${container.className} placeholder-glow`
        quizTitle.className= "placeholder"
        editBtn.className = "placeholder"
        quizCategory.className = "placeholder"
    }

    fragment.appendChild(container)
}

main()