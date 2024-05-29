export class QuizModule {
    score = 0;
    soalBenar = 0 ;

    currentQuiz = 0 ;
    quizes = [
        {
            soal: `Seandainya aku tidak mencintaimu, tidak akan terbit rindu sewaktu 
            berpisah. Tak ingin menulis surat atau meneleponmu. Tidak memberimu 
            bunga saat ulang tahun. Tidak memandang matamu, menyentuh 
            tanganmu, dan sesekali mencium.
            (Cerpen “Hari Terakhir Mencintaimu”, karya Kurnia Efendi)
            Tema dari cuplikan cerpen diatas adalah:`,
            jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
            score: 100,
            jawabanBenar: 0 
        },
        {
            soal: `
            Pak, pohon pepaya di pekaranganku telah dirobohkan dengan tak 
            semena-mena, tidaklah sepatutnya hal itu kulaporkan? Itu benar, tapi 
            jangan melebih-lebihkan. Ingat, yang harus diutamakan ialah kerukunan 
            kampung. Soal kecil yang dibesar-besarkan bisa mengakibatkan 
            kericuhan dalam kampung. Setiap soal mesti diselesaikan dengan sebaikbaiknya. Tidak boleh main seruduk. Masih ingatkah kau pada peristiwa 
            Dullah dan Bidin tempo hari? Hanya karena soal dua kilo beras, seorang 
            kehilangan nyawa dan yang lain meringkuk di penjara.
            (Cerpen “Gerhana”, Muhammad Ali)

            Apa yang penggalan cerpen diatas ingin ungkapkan kepada pembaca?
            `,
            jawaban: ["Misteri", "Fantasi", "Konflik", "Cinta"],
            score: 100,
            jawabanBenar: 3 
        },
        {
            soal: `Pernahkah kau merasakan sesuatu yang biasa hadir mengisi hariharimu, tiba-tiba lenyap begitu saja. Hari-harimu pasti berubah jadi 
            pucat pasi tanpa gairah. Saat kau hendak mengembalikan sesuatu yang 
            hilang itu dengan sekuat daya, namun tak kunjung tergapai. Kau pasti 
            jadi kecewa seraya menengadahkan tangan penuh harap lewat kalimat 
            doa yang tak putus-putusnya.
            (Cerpen “Matahari Tak Terbit Pagi Ini”, Fakhrunnas M.A Jabar)
            
            Nilai dari penggalan cerpen diatas yang bisa kita petik adalah:`,
            jawaban: ["Jangan menyerah", "Selalu membantu yang memerlukan", "Hargai waktumu bersama orang terdekat", "Awali hari dengan berdoa"],
            score: 100,
            jawabanBenar: 2
        },
        {
            soal: `
            Lelaki tua itu selalu suka mengenakan lencana merah putih yang disematkan di bajunya. Di mana saja berada, lencana merah putih 
selalu menghiasi penampilannya. Ia memang seorang pejuang yang pernah berperang bersama 
para pahlawan di masa penjajahan sebelum bangsa dan negara ini 
merdeka. Kini semua teman seperjuangannya telah tiada. Sering 
ia bersyukur karena mendapat karunia umur panjang. Ia bisa 
menyaksikan rakyat hidup dalam kedamaian.
(Cerpen: “Pejuang” oleh Maria Maghdalena Bhoernomo dengan beberapa perubahan)

Cuplikan cerpen diatas menggambarkan bahwa tokoh "Lelaki tua" itu dulunmbong", "Menghemat", "Sayangya adalah seorang:`,
            jawaban: ["Dokter", "Kasir", "Tentara", "Guru"],
            score: 100,
            jawabanBenar: 2
        },
        {
            soal: `Merah di langit barat telah lenyap ketika kita sampai di resto yang kaupilih sebagai tempat pertemuan. 
            Cuma kita berdua dan karena itu kita pilih meja-kursi terpojok. Jauh dari panggung musik yang terlampau berisik.
            Jauh dari orang-orang yang makan sambil tertawa-tawa riang. Di mataku, terus terang, mereka adalah sekelompok manusia tanpa persoalan tanpa beban. Tidak seperti aku. Tidak seperti kamu. Tidak seperti kita. Paling tidak, pada malam itu. Kaupesan mi sea food yang entah bernama apa.`,
            jawaban: ["Rumah Sakit", "Restoran", "Rumah", "Jalan Raya"],
            score: 100,
            jawabanBenar: 1
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

    reset() {
        this.score = 0;
        this.currentQuiz = 0 ;
    }

    getQuiz() {
        if (this.currentQuiz > this.quizes.length) return null 
        else return this.quizes[this.currentQuiz] ;
    }
    
    postAnswer(answer) {
        console.log("QUIZZ" + this.choosenQuiz) ;
        if (answer != this.choosenQuiz.jawaban[this.choosenQuiz.jawabanBenar]) {
            if (this.score > 0) this.score -= this.choosenQuiz.score ;
            return false ;
        } else {
            this.onCorrectAnswer() ;
            return true ;
        }
        //update id soal benar/ salah, update point user
    }

    onCorrectAnswer() {
        this.nextQuiz() ;
        this.score += this.choosenQuiz.score ;
        this.soalBenar++ ; 
    }

    nextQuiz() {
        this.currentQuiz++ ; 
    }
    
    postResult() {        
    }
}