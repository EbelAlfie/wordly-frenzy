import axios from "axios";
import { configDotenv } from "dotenv";

function onLoginSubmitted() {
    let nameText = document.getElementById("emailTextInput") ;
    let passText = document.getElementById("passwordTextInput") ;
    if (!checkUserName(nameText.innerHTML)) return;
    if (!checkPassword(passText.innerHTML)) return; //TODO Error handling
    doLogin(nameText.innerHTML, passText.innerHTML)
}

function isUserNameValid(userName) {
    if (userName === "") {
        return false
    }
    return true
}

function isPasswordValid(userName) {
    if (userName === "") {
        return false
    }
    return true
}

function doLogin(userName, password) {
    configDotenv({
        path:'.env' 
    });

    axios.post(`${process.env.BASE_URL}wordly/user/login`, {
        userName: userName,
        password: password
    }).then((result) => {
        if (result === true) {
            document.cookie=`accessToken=${result}`
            window.location.href = "../home/index.html"
        }
    }).catch((error) => {

    })
}

function redirectToHomePage() {
    window.location.href = './home/index.html';
}

function main() {
    document.getElementById("buttonPlayNow").onclick = redirectToHomePage() ;
    document.getElementById("buttonLogin").onclick = onLoginSubmitted() ;
}

main()