import axios from "https://cdn.skypack.dev/axios";
import { config } from "../config.js";

class QuizRepository {
    async loadQuizes(local = true, type = 0) { //TODO error handling in real API
        let url = 'scripts/config/quizes.json'
        if (!local) {
            url = `${config.BASE_URL}quizes?quizType=${type}`
        }

        return axios.get(url)
    }
}

export let quizRepository = new QuizRepository() ;