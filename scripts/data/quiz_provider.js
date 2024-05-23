export class QuizModule {
    score = 0;

    currentQuiz = 0 ;
    quizes = [
        {
            soal: "Seandainya aku tidak mencintaimu, tidak akan terbit rindu sewaktu berpisah. Tak ingin menulis surat atau meneleponmu. Tidak memberimu bunga saat ulang tahun. Tidak memandang matamu, menyentuh tanganmu, dan sesekali mencium. (Cerpen “Hari Terakhir Mencintaimu”, karya Kurnia Efendi)",
            jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
            score: 100,
            jawabanBenar: 0 
        },
        {
            soal: "Seandainya rbit ri ingin menulis surat atau meneleponmu. Tidak memberimu bunga saat ulang tahun. Tidak memandang matamu, menyentuh tanganmu, dan sesekali mencium. (Cerpen “Hari Terakhir Mencintaimu”, karya Kurnia Efendi)",
            jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
            score: 100,
            jawabanBenar: 0 
        },
        {
            soal: "Seandainya ",
            jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
            score: 100,
            jawabanBenar: 0 
        }
    ] 

    choosenQuiz = {
        soal: "Seandainya aku tidak mencintaimu, tidak akan terbit rindu sewaktu berpisah. Tak ingin menulis surat atau meneleponmu. Tidak memberimu bunga saat ulang tahun. Tidak memandang matamu, menyentuh tanganmu, dan sesekali mencium. (Cerpen “Hari Terakhir Mencintaimu”, karya Kurnia Efendi)",
        jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
        score: 100,
        jawabanBenar: 0 
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

    getQuiz() {
        if (this.currentQuiz > this.quizes.length) return null 
        else return this.quizes[this.currentQuiz] ;
    }
    
    postAnswer(answer) {
        console.log("QUIZZ" + this.choosenQuiz) ;
        if (answer != this.choosenQuiz.jawaban[this.choosenQuiz.jawabanBenar]) {
            if (this.score > 0) this.score -= this.choosenQuiz.score ;
        } else {
            this.score += this.choosenQuiz.score ;
        }
        //update id soal benar/ salah, update point user
        this.currentQuiz++ ; 
    }
    
    postResult() {        
    }
}