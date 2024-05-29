export class QuizRepository {
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

    isWrong = false ;

    async loadAllQuizes() { //TODO error handling in real API
        return fetch('scripts/config/quizes.json')
        .then(response => response.json())
        .then(json => {
            this.quizes = json ;
        }) 
    }

    queryQuiz(type) {
        return new Promise((resolve, reject) => {
            this.choosenQuiz = this.getQuiz() ;
            resolve(this.choosenQuiz)
            // if (this.currentQuiz != null) {
            //     resolve(this.currentQuiz)
            // } else {
            //     reject() 
            // }
        })
    }

    reset() {
        this.score = 0;
        this.currentQuiz = 0 ;
    }

    getQuiz() {
        if (this.currentQuiz > this.quizes.length) return null 
        else return this.quizes[this.currentQuiz] ;
    }
    
    postAnswer(answer) {
        if (answer != this.choosenQuiz.jawabanBenar) {
            this.isWrong = true ;
        } else {
            this.onFinalAnswer() ;
            this.isWrong = false ;
        }
        return this.isWrong ;
        //update id soal benar/ salah, update point user
    }

    onFinalAnswer() {
        this.toNextQuiz() ;
        this.calculateScore() ;
    }

    calculateScore() {
        if (!this.isWrong) {
            this.soalBenar++ ;
            this.score += this.choosenQuiz.score ;
        }
    }

    toNextQuiz() {
        this.currentQuiz++ ; 
    }

    getFinalScore() {
        return ((this.score / this.getTotalQuestion()) * 100).toFixed(0);
    }

    getTotalCorrect() {
        return this.soalBenar ;
    }

    getTotalQuestion() {
        return this.quizes.length | 0;
    }

    getHint() {
        return this.choosenQuiz.tips | "" ;
    }
}