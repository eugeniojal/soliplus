var cUsuario = sessionStorage.getItem('usuario');
var cNombres = sessionStorage.getItem('nombres');
var cApellidos = sessionStorage.getItem('apellidos');
var cCorreo = sessionStorage.getItem('correo');
var cAvatar = sessionStorage.getItem('avatar');


document.getElementById("inputUsuario").value = cUsuario
document.getElementById("inputCorreo").value = cCorreo
document.getElementById("inputNombres").value = cNombres
document.getElementById("inputApellidos").value = cApellidos
document.getElementById("userImage").src = cAvatar
 


async function postData(usuario, nombres, apellidos, correo, avatar, password){

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic Vm9veExhYjozOWQwNmY4MC04ZWQwLTQxYmQtOGU2NS04MTMwMzdiYzAzZTg=");
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    
  return await fetch("http://192.168.200.58/ApiRestDashboard/Dashboard/PostUserData?usuario="+ usuario +"&nombres="+ nombres + "&apellidos="+ apellidos + "&correo=" + correo + "&avatar=" + avatar + "&password=" + password, requestOptions);
     
     
};

function submitFrom() {

    $('#userDataForm').off('submit', onSubmitFunction);
    $('#userDataForm').submit();

};

var onSubmitFunction = async function (evt) {

evt.preventDefault(); //The form wouln't be submitted Yet.

var pUsuario = document.getElementById("inputUsuario").value
var pNombres = document.getElementById("inputNombres").value
var pApellidos = document.getElementById("inputApellidos").value
var pCorreo = document.getElementById("inputCorreo").value
var pAvatar = document.getElementById("userImage").src

var passwordUno = document.getElementById("inputPassword").value
var passwordDos = document.getElementById("inputConfirmarPassword").value

    if((passwordUno != '' && passwordDos != '' && passwordUno == passwordDos) || (passwordUno == '' && passwordDos == '')){

        var pPassword = document.getElementById("inputPassword").value

        await postData(pUsuario, pNombres, pApellidos, pCorreo, pAvatar, pPassword)
        
        sessionStorage.setItem("nombre", pNombres + ' ' + pApellidos);
        sessionStorage.setItem("correo", pCorreo)
        sessionStorage.setItem("nombres", pNombres)
        sessionStorage.setItem("apellidos", pApellidos)
        sessionStorage.setItem("avatar", pAvatar)

        alert("Sus datos han sido guardados");
        submitFrom();
            
    } else {
        
        alert("Las contraseñas no coinciden")

    }


};

$('#userDataForm').on('submit', onSubmitFunction);


