import { quizRepository } from "../../data/quiz_repository"
import { dismissLoading } from "../../util/utils"

function main() {
    queryMyQuizes()
}

async function queryMyQuizes() {
    return quizRepository.loadQuizes()
    .then(result => {
        dismissLoading()
    })
    .catch(error => {
        dismissLoading()
    })
}

function addNewList() {

}

main()