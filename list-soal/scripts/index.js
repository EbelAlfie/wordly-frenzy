import { quizRepository } from "../../data/quiz_repository.js"
import { dismissLoading } from "../../util/utils.js"

const list = document.getElementById('quizList');
const fragment = document.createDocumentFragment();

function main() {
    //queryMyQuizes()
    Array(1,2,3,4,5,6).forEach(item => {
        addNewItem(true)
    })
    list.appendChild(fragment)
}

async function queryMyQuizes() {
    return quizRepository.loadQuizes()
    .then(result => {
    })
    .catch(error => {
    })
}

function addNewItem(isLoading) {
    let container = document.createElement('li')
    container.className = "card container d-flex flex-column p-0 mt-2 mb-2 ms-0 me-0"

    let header = document.createElement('div')
    header.className = "card-header d-flex flex-row justify-content-between"
    
    let quizTitle = document.createElement('h3')
    quizTitle.className = "align-self-center"
    quizTitle.innerText = "Judul"

    let editBtn = document.createElement('a')
    editBtn.className = "btn btn-outlined-info align-self-center"
    editBtn.innerText = "Edit >"

    header.appendChild(quizTitle)
    header.appendChild(editBtn)

    let quizBody = document.createElement('div')
    quizBody.className = "card-body d-flex flex-row"

    let quizCategory = document.createElement('h4')
    quizCategory.className = "rounded quiz-type p-2 text-white fs-6 text-center"
    quizCategory.innerText = "Cerpen"

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