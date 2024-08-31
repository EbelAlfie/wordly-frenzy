import axios from "https://cdn.skypack.dev/axios";
import { config } from "../config.js";

class QuizRepository {
    async loadQuizes(local = true, type = 0) { //TODO error handling in real API
        let quizType 

        if (type == 1) 
            quizType = "cerpen" 
        else 
            quizType = "kalimat-efektif"

        let url = `scripts/config/${quizType}`
        if (!local) {
            url = `${config.BASE_URL}quizes?quizType=${type}`
        }

        return axios.get(url)
    }

    
}

export let quizRepository = new QuizRepository() ;