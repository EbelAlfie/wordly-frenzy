export class QuizModule {
    score = 0;

    new = 0 ;
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
        if (this.new > this.quizes.length) return null ;
        return this.quizes[this.new] ;
    }
    
    
    postAnswer(answer) {
        console.log("QUIZZ" + this.choosenQuiz) ;
        if (answer != this.choosenQuiz.jawaban[this.choosenQuiz.jawabanBenar]) {
            this.score -= this.choosenQuiz.score ;
        } else {
            this.score += this.choosenQuiz.score ;
        }
        //update id soal benar/ salah, update point user
        this.new++ ; 
    }
    
    postResult() {        
    }
}