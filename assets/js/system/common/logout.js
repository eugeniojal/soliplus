async function valLogin() {

    var cEstatus  = sessionStorage.getItem('Estatus');
    var cNombre  = sessionStorage.getItem('Nombre');
    var cAvatar  = sessionStorage.getItem('Avatar');
    var cEmpresa = sessionStorage.getItem('Empresa');


    if (cEstatus != "True") {

        window.location.href = "index.html";

    } else {

        document.getElementById("userName").innerHTML = cNombre;
        document.getElementById("company").innerHTML = cEmpresa;
        //document.getElementById("profileImage").src = cAvatar

    }

}


$("#btn-logout").click(function () {
    
    sessionStorage.removeItem("Estatus");
    sessionStorage.removeItem("Nombre");
    sessionStorage.removeItem("Avatar");
    sessionStorage.removeItem("Empresa");
    sessionStorage.removeItem("Filtrado");
    window.location.href = "../index.html";

});



async function setCopyright(){


    var today = new Date();
    var year = today.getFullYear();
    var copyright = 'Copyright © ' + year + ' - Equipo Gerencial ConSolidez GCS, C.A - Todos los Derechos Reservados';

    document
    .getElementById("copyright")
    .innerHTML = copyright;

}



$(document).ready(async function () {

    await valLogin();
    await setCopyright();

});

