import axios from "https://cdn.skypack.dev/axios"; //https://cdn.skypack.dev/
import { config } from "../config.js";
import getCookie from "../util/cookie.js";

class QuizRepository {
    async loadQuizes(local = true, type = 0) { //TODO error handling in real API
        let quizType 

        if (type == 1) 
            quizType = "cerpen" 
        else 
            quizType = "kalimat-efektif"

        let url = `../data/${quizType}.json`
        if (!local) {
            url = `${config.BASE_URL}wordly/quiz/quizes?quizType=${type}`
        }

        return axios.get(url)
    }

    async loadQuizByTeacherId(local, teacherId) {
        let url = `../data/quizes.json`
        if (!local) {
            url = `${config.BASE_URL}wordly/quiz/my-quiz`
        }

        return axios.get(url, {
            headers: {'Authorization': `Bearer ${getCookie("accessToken")}`}
        })
    }
    
    async getQuizDetail(local, quizId) {
        let url = `../data/quizes.json`
        if (!local) {
            url = `${config.BASE_URL}wordly/quiz/quiz-detail?quizId=${quizId}`
        }

        return axios.get(url, {
            headers: {'Authorization': `Bearer ${getCookie("accessToken")}`}
        }).then(result => {
            if (local === true) 
                return result.data.filter(item => item.id == quizId)[0] || {"id": ""}
            else 
                return result.data || {"id": ""}
        })
    }

    async addQuiz(quiz) {
        let url = `${config.BASE_URL}wordly/quiz/add-quiz`
        return axios.post(url, quiz, {
            headers: {'Authorization': `Bearer ${getCookie("accessToken")}`}
        })
    }
}

export let quizRepository = new QuizRepository() ;