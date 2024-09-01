import axios from "https://cdn.skypack.dev/axios";
import { config } from "../config.js";

class QuizRepository {
    async loadQuizes(local = true, type = 0) { //TODO error handling in real API
        let quizType 

        if (type == 1) 
            quizType = "cerpen" 
        else 
            quizType = "kalimat-efektif"

        let url = `../data/${quizType}.json`
        if (!local) {
            url = `${config.BASE_URL}quizes?quizType=${type}`
        }

        return axios.get(url)
        // .then(response => {
        //     if (local) {
        //         response.filter(quiz => quiz["type"] == quizType)
        //     }
        // })
    }

    async loadQuizByTeacherId(local, teacherId) {
        let url = `../data/quizes.json`
        if (!local) {
            url = `${config.BASE_URL}quizes?quizType=0`
        }

        return axios.get(url)
    }
    
    async getQuizDetail(local, quizId) {
        let url = `../data/quizes.json`
        if (!local) {
            url = `${config.BASE_URL}quizDetail?quizId=${quizId}`
        }

        return axios.get(url)
    }
}

export let quizRepository = new QuizRepository() ;