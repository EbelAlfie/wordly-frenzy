import { quizRepository } from "../../../data/quiz_repository.js";

export class QuizController {
    score = 0;
    soalBenar = 0 ;

    quizes = null

    currentQuiz = 0 ;
    choosenQuiz = {
        soal: "Seandainya aku tidak mencintaimu, tidak akan terbit rindu sewaktu berpisah. Tak ingin menulis surat atau meneleponmu. Tidak memberimu bunga saat ulang tahun. Tidak memandang matamu, menyentuh tanganmu, dan sesekali mencium. (Cerpen “Hari Terakhir Mencintaimu”, karya Kurnia Efendi)",
        jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
        score: 100,
        jawabanBenar: 0 
    }

    isCorrect = false ;
    isFirstWrong = false ;

    async loadQuizes(local = true, type = 0) { //TODO error handling in real API
        return quizRepository.loadQuizes(local, type)
        .then(response => {
            this.quizes = response.data ;
        }) 
        .catch((error) => {
            this.loadQuizes(true, type)
        })
    }

    queryQuiz() {
        return new Promise((resolve, reject) => {
            this.choosenQuiz = this.getQuiz() ;
            this.isFirstWrong = false ;
            resolve(this.choosenQuiz)
            // if (this.currentQuiz != null) {
            //     resolve(this.currentQuiz)
            // } else {
            //     reject() 
            // }
        })
    }

    reset() {
        this.isCorrect = false ;
        this.score = 0;
        this.currentQuiz = 0 ;
    }

    getQuiz() {
        if (this.currentQuiz > this.quizes.length) return null 
        else return this.quizes[this.currentQuiz] ;
    }
    
    postAnswer(answer) {
        if (answer != this.choosenQuiz.correctAnswer) {
            this.isCorrect = false ;
            this.isFirstWrong = true ;
        } else {
            this.onFinalAnswer() ;
            this.isCorrect = true ;
        }
        return this.isCorrect ;
    }

    onFinalAnswer() {
        this.toNextQuiz() ;
        this.calculateScore() ;
    }

    calculateScore() {
        if (!this.isFirstWrong) {
            this.soalBenar++ ;
            this.score += this.choosenQuiz.score ;
        }
    }

    toNextQuiz() {
        this.currentQuiz++ ; 
    }

    getFinalScore() {
        console.log(`${((this.score / this.getTotalQuestion()) * 100).toFixed(0)} ${this.score} ${this.getTotalQuestion()}`) ;
        return ((this.score / this.getTotalQuestion()) * 100).toFixed(0);
    }

    getTotalCorrect() {
        console.log(this.soalBenar) ;
        return this.soalBenar ;
    }

    getCurrentQuizIndex() {
        return this.currentQuiz ;
    }

    getTotalQuestion() {
        return this.quizes.length || 0;
    }

    getHint() {
        console.log(this.choosenQuiz.hint) ;
        return this.choosenQuiz.hint || "" ;
    }
}