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