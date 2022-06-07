var cUsuario, cPassword, cEmpresa, rLogin;

var $listaEmpresas = $('#input-empresa');

async function postLogin(pUsuario, pPassword){

    sessionStorage.removeItem("Estatus");
    sessionStorage.removeItem("Nombre");
    sessionStorage.removeItem("Correo");
    sessionStorage.removeItem("Empresa");
    sessionStorage.removeItem("Usuario");
    sessionStorage.removeItem("Filtrado");
    sessionStorage.removeItem("Interno");
    sessionStorage.removeItem("Rif");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    
   
   var rPostValUsuario = await fetch( WebApiServer + "api/LoginUsuarios/PostValUsuario?Usuario="+ pUsuario +"&Password=" + pPassword, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  
   return rPostValUsuario[0];
     
}


$("#input-password").blur(async function () {

  cElemento = $("#input-usuario");

  cUsuario = $("#input-usuario").val().toUpperCase();
  cPassword = this.value;  
  rLogin = await postLogin(cUsuario, cPassword);

  console.log(rLogin);

  var jsonEmpresas = JSON.parse(rLogin.Empresas);

  $listaEmpresas.html('<optgroup label="Seleccione una Empresa"></optgroup>');
  
  if(rLogin.Response == '1'){
  
    jsonEmpresas.forEach(element => {
  
      $listaEmpresas.append($('<option />', {

        value: (element.CODEMPRESA),
        text: (element.CODEMPRESA)

      }));
  
    });
  
    $listaEmpresas.val(undefined);

    $("#input-empresa").attr("disabled", false).removeClass('disabled').attr("readOnly", false);


  } else {

    $("#input-empresa").attr("disabled", true).addClass('disabled').attr("readOnly", true);
    showModal('Mesaje', 'El nombre de usuario o contraseña es incorrecto, por favor verifique');

  }


});




$("#input-empresa").change(async function () {

  cEmpresa = this.value;
  $("#bt-login").attr("disabled", false).removeClass('disabled').attr("readOnly", false);

});


$("#bt-login").click(async function () {

  sessionStorage.setItem("Estatus", "True");
  sessionStorage.setItem("Nombre", rLogin.Nombre);
  sessionStorage.setItem("Correo", rLogin.Empresa);
  sessionStorage.setItem("Empresa", cEmpresa);
  sessionStorage.setItem("Usuario", cUsuario);
  sessionStorage.setItem("Filtrado", rLogin.Filtrado);
  sessionStorage.setItem("Interno", rLogin.Interno);
  sessionStorage.setItem("Rif", rLogin.Rif);


  if(rLogin.Avatar == ''){
  
    sessionStorage.setItem("Avatar", '../avatars/user.png');

  } else {

    sessionStorage.setItem("Avatar", rLogin.Avatar);

  }


  if(rLogin.Interno == '1'){

    window.location.href = "home.html";

  } else {

    window.location.href = "home-clientes.html";

  }


});

