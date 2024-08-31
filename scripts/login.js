import axios from "https://cdn.skypack.dev/axios";
import { config } from "../config.js";

function main() {
    document.getElementById("buttonPlayNow").onclick = () => {
        redirectToHomePage() 
    } ;
    document.getElementById("buttonLogin").onclick = () => {
        onLoginSubmitted()
    } ;
}

function onLoginSubmitted() {
    let nameText = document.getElementById("emailTextInput").value ;
    let passText = document.getElementById("passwordTextInput").value ;
    if (!checkUserName(nameText)) return;
    if (!checkPassword(passText)) return; //TODO Error handling
    doLogin(nameText, passText)
}

function checkUserName(userName) {
    if (userName === "") {
        return false
    }
    return true
}

function checkPassword(userName) {
    if (userName === "") {
        return false
    }
    return true
}

function doLogin(userName, password) {
    axios.post(`${config.BASE_URL}wordly/user/login`, {
        userName: userName,
        password: password
    }, {
       headers: {
        "Content-Type": "application/json"
       } 
    }).then((result) => {
        let token = result.data["authToken"] || ""
        if (token !== "") {
            document.cookie=`accessToken=${token}`
            redirectToHomePage()
        }
    }).catch((error) => {

    })
}

function redirectToHomePage() {
    window.location.href = './home/index.html';
}

main()