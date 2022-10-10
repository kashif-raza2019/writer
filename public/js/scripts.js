// Scripts

var showPassFlag = true;
function showPassword(){
    const password = document.querySelector("#typePassword");
    const eye = document.querySelector("#eyeBtn");
    if(showPassFlag){
        password.type = "text";
        eye.innerHTML = "<i class='fa fa-eye-slash'></i>";
        showPassFlag = false;
    }else {
        password.type = "password";
        eye.innerHTML = "<i class='fa fa-eye'></i>";
        showPassFlag = true;
    }
   
}


function checkEqual(){
    const text = document.querySelector("#typePassword").value;
    console.log(text);
    const submitBtn = document.querySelector("#signUpBtn");
    const textPass = document.querySelector("#typePassword2").value;
    const errTxt = document.querySelector("#errorText");
    if(textPass != text){
        submitBtn.disabled = true;
        errTxt.style.display = "block";
    }else{
        submitBtn.disabled = false;
        errTxt.style.display = "none";
    }
}

function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    var crd = pos.coords;
    // crd.longitude
    // crd.accuracy
    alert(crd.latitude);
  };  
  
  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };
  
  // navigator.geolocation.getCurrentPosition(success, error, options);

