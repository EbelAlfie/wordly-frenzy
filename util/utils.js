export function dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
}

export function showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
}

export function showUnauthorized(modalId) {
    let modal = document.getElementById(modalId)
    let title = document.getElementById("modalTitle")
    title.innerHTML = "Warning"
    let message = document.getElementById("modalMessage")
    message.innerHTML = "Sesi kamu telah habis, silakan login kembali"
    new bootstrap.Modal(modal).show()
    
}