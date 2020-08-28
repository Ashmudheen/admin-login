var login = false
var signup = false

var overlay_signup = document.getElementById('signup_overlay')
var overlay_login = document.getElementById('login_overlay')

function on_login()
{
  login = true
  signup = false
  toggle_classes()
}
function on_signup()
{
  login = false
  signup = true
  toggle_classes()
}

function toggle_classes()
{
  if (login)
  {
    overlay_login.classList.add('card_gone')
    overlay_signup.classList.remove('card_gone')
  } 
  if (signup){
    overlay_login.classList.remove('card_gone')
    overlay_signup.classList.add('card_gone')    
  }
}

var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;