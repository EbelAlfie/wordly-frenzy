export function dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
}

export function showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
}

export function showUnauthorized() {
    document.cookie = ''
    let modal = document.getElementById("errorModal")
    let title = document.getElementById("errorTitle")
    title.innerHTML = "Warning"
    let message = document.getElementById("errorMessage")
    message.innerHTML = "Sesi kamu telah habis, silakan login kembali"

    let button = document.getElementById("errorButton")
    button.onclick = () => {
        window.location.href = "../index.html"
    }

    new bootstrap.Modal(modal).show()
}