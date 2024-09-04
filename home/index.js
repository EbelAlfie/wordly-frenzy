import getCookie from "../util/cookie.js";

function main() {
    let frenzy = document.getElementById("btnFrenzy");
    frenzy.onclick = () => { redirectToWordlyFrenzy() } ;

    let range = document.getElementById("btnRange") ;
    range.onclick = () => { redirectToWordlyRange() } ;

    setupEditButton()
}

function setupEditButton() {
    let accessToken = getCookie("accessToken") 
    if (accessToken !== "") {
        document.getElementById("buttonEditQuiz").className = "row visible" ; //TODO, should show not only by the existence of cookie, right?

        let edit = document.getElementById("btnEdit") ;
        edit.onclick = () => { redirectToEditQuiz() } ;
    }
}

function redirectToWordlyFrenzy() {
    window.location.href = '../wordly-frenzy/wordly-frenzy.html';
}

function redirectToWordlyRange() {
    window.location.href = '../shooting-range/index.html';
}
function redirectToEditQuiz() {
    window.location.href = '../list-soal/list.html';
}

main();