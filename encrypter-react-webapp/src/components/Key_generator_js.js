let signInButton = document.getElementById("signInBtn");
let signUpButton = document.getElementById("signUpBtn");
let name_field = document.getElementById("name-field");

function toSignin() {
  document.getElementById("sign-in-up").innerHTML = "SIGN IN";
}

function toSignup() {
  document.getElementById("sign-in-up").innerHTML = "SIGN UP";
}
document.getElementById("signInBtn").onmousedown = () => {
    signInButton.style.backgroundColor = "#416D19";
    signInButton.style.color = "#FFF67E";
    signInButton.style.boxShadow = "none";
    signInButton.style.transition = "all 0.5s";
}
document.getElementById("signInBtn").onmouseover = () => {

    signInButton.style.backgroundColor = "#FFF67E";
    signInButton.style.color = "#416D19";
    signInButton.style.boxShadow = "0 12px 16px 0 #416D19,0 17px 50px 0 #416D19";
    signInButton.style.transition = "all 0.5s";
}
document.getElementById("signInBtn").onmouseup = () => {

    signInButton.style.backgroundColor = "#FFF67E";
    signInButton.style.color = "#416D19";
    signInButton.style.boxShadow = "0 12px 16px 0 #416D19,0 17px 50px 0 #416D19";
    signInButton.style.transition = "all 0.5s";
}
document.getElementById("signInBtn").onmouseout = () => {

    signInButton.style.backgroundColor = "#416D19";
    signInButton.style.color = "#FFF67E";
    signInButton.style.boxShadow = "none";
    signInButton.style.transition = "all 0.5s";
}
document.getElementById("signUpBtn").onmousedown = () => {
    signUpButton.style.backgroundColor = "#416D19";
    signUpButton.style.color = "#FFF67E";
    signUpButton.style.boxShadow = "none";
    signUpButton.style.transition = "all 0.5s";
}
document.getElementById("signUpBtn").onmouseover = () => {

    signUpButton.style.backgroundColor = "#FFF67E";
    signUpButton.style.color = "#416D19";
    signUpButton.style.boxShadow = "0 12px 16px 0 #416D19,0 17px 50px 0 #416D19";
    signUpButton.style.transition = "all 0.5s";
}
document.getElementById("signUpBtn").onmouseup = () => {

    signUpButton.style.backgroundColor = "#FFF67E";
    signUpButton.style.color = "#416D19";
    signUpButton.style.boxShadow = "0 12px 16px 0 #416D19,0 17px 50px 0 #416D19";
    signUpButton.style.transition = "all 0.5s";
}
document.getElementById("signUpBtn").onmouseout = () => {

    signUpButton.style.backgroundColor = "#416D19";
    signUpButton.style.color = "#FFF67E";
    signUpButton.style.boxShadow = "none";
    signUpButton.style.transition = "all 0.5s";
}
signInButton.addEventListener("click", () => {
  name_field.style.maxHeight = "0";
  name_field.style.transition = "0.3s max-height";
  setTimeout(toSignin, 300);
});

signUpButton.addEventListener("click", () => {
  name_field.style.maxHeight = "200px";
  name_field.style.transition = "1s max-height";
  setTimeout(toSignup, 100);
});



