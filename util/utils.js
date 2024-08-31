export function dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
}

export function showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
}