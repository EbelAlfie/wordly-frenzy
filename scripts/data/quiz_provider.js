export class QuizModule {
    score = 0;

    currentQuiz = {
        soal: "Seandainya aku tidak mencintaimu, tidak akan terbit rindu sewaktu berpisah. Tak ingin menulis surat atau meneleponmu. Tidak memberimu bunga saat ulang tahun. Tidak memandang matamu, menyentuh tanganmu, dan sesekali mencium. (Cerpen “Hari Terakhir Mencintaimu”, karya Kurnia Efendi)",
        jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
        score: 100,
        jawabanBenar: 0 
    }

    queryQuiz(type) {
        currentQuiz =  {
            soal: "Hai",
            jawaban: ["aku", "bukan", "akus"],
            score: 100,
            jawabanBenar: 0 
        }    
    }
    
    postAnswer(answer) {
        if (answer != this.currentQuiz.jawaban[this.currentQuiz.jawabanBenar]) {
            score -= this.currentQuiz.score ;
        } else {
            score += this.currentQuiz.score ;
        }
        //update id soal benar/ salah, update point user
    }
    
    postResult() {        
    }
}