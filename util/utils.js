export function dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
}

export function showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
}

export function showError(
    titleText, 
    messageText, 
    buttonLabel,
    onClick
) {
    document.cookie = ''
    let modal = document.getElementById("errorModal")
    let title = document.getElementById("errorTitle")
    title.innerHTML = titleText
    let message = document.getElementById("errorMessage")
    message.innerHTML = messageText

    let button = document.getElementById("errorButton")
    button.innerText = buttonLabel
    button.onclick = () => {
        onClick()
    }

    new bootstrap.Modal(modal).show()
}

export function showUnauthorized() {
    showError(
        "Warning",
        "Sesi kamu telah habis",
        "Kembali",
        () => {
            window.location.replace("../index.html")
        }
    )
}

export function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}