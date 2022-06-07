
//Variables globales
unidad = undefined;
nombre = undefined;
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");

window.alert = async function() {};

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";

//GET Inventario
async function getVendedores(pEmpresa){

    var rVendedores;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/getVendedores?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rVendedores = result;
    })
    .catch(error => console.log('error', error));

    return rVendedores;
}

async function getListaVendedores(pEmpresa){

    var rListaVendedores;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/getListaVendedores?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rListaVendedores = result;
    })
    .catch(error => console.log('error', error));

    return rListaVendedores;
}

//POST Tipo de Inventario
async function postVendedores(pEmpresa, pCodven, pNombre, pComentario, pEmail, pFHNAC, pTelf, pDireccion, pHabilitado ){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    rPostVende = await fetch("http://soliplus.consolidez.com/ApiRestSoliPlus/api/Maestros/PostVendedores?Empresa="+pEmpresa+"&Codigo="+pCodven+"&Comentario="+pComentario+"&Direccion="+pDireccion+"&Email="+pEmail+"&Fecha_Nacimiento="+pFHNAC+"&Habilitado="+pHabilitado+"&Nombre="+pNombre+"&Tel=" +pTelf, requestOptions)        
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rPostVende;
}

//DELETE Tipo de Inventario
async function deleteVendedores(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    rDeleteVende = await fetch("http://soliplus.consolidez.com/ApiRestSoliPlus/api/Maestros/DeleteVendedores?Empresa="+pEmpresa+"&Codigo="+pCodigo, requestOptions)        
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rDeleteVende;
}

//UPDATE Tipo de Inventario
async function updateVendedores(pEmpresa, pCodven, pNombre, pComentario, pEmail, pFHNAC, pTelf, pDireccion, pHabilitado){
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      rUpdateVende = await fetch(WebApiServer + "api/Maestros/PutVendedores?Empresa="+pEmpresa+"&Codigo="+pCodven+"&Comentario="+pComentario+"&Direccion="+pDireccion+"&Email="+pEmail+"&Fecha_Nacimiento="+pFHNAC+"&Habilitado=" + pHabilitado +"&Nombre=" + pNombre+"&Tel=" + pTelf, requestOptions)        
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
    return rUpdateVende;
}
 
async function setListaCodigos(){

    var $listaCodigos = $('#select-codigo');

    //HACER ESTE GET  ---------------------------------->
    elemento = await getListaVendedores(cEmpresa);

    $listaCodigos.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaCodigos.append($('<option />', {
            value: (element.CODVEN),
            text: (element.NOMBRE +" - "+  element.CODVEN)
        }));
    });
    // $listaCodigos.val(undefined).select2();
}

//Modal de Errores
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");

    $(document).on("click", "#btn-modal", function() {
        location.reload();
    });
}

async function escogerCodigo(codigoActual){

    var codElegido;

    productos = await getVendedores(cEmpresa);


    productos.forEach(element => {
        if(element.CODVEN == codigoActual){
            codElegido = element;
        }
    });

    return codElegido;
}

async function cambiarDatos(elemento){

    if(elemento.HABILITADO == true){
        $("#check-habilitar").prop('checked', true);
    }
    else{
        $("#check-habilitar").prop('checked', false);
    }

    $("#input-nombre").val(elemento.NOMBRE);
    $("#input-email").val(elemento.EMAIL);
    $("#input-tlf").val(elemento.TEL);
    $("#input-direccion").val(elemento.DIRECCION);
    $("#input-comentario").val(elemento.COMENTARIO);
}

$("#bt-home").click(async function () {
    userHome(cInterno);
});


//Crear tabla
async function setTabla() {

$("#jsGrid").jsGrid({
    height: "auto",
    width: "100%",

    sorting: true,
    filtering: true,
    paging: true,

    pageSize: 15,
    pageButtonCount: 5,

    autoload: true,
    controller: {
        
        loadData: function(filter) {

            return $.grep(database, function (group) { 
                if(filter.NOMBRE !== undefined){
                    return group.NOMBRE.toLowerCase().indexOf(filter.NOMBRE) != -1;
                }
                else{
                    return filter.NOMBRE;
                }
                
            }); 

        },
    },
    
    fields: [
        { name: "CODVEN", type: "text", title: "Codigo", width: 100, validate: [
            "required",
        ], filtering: false },
        { name: "NOMBRE", type: "text", title: "Nombre", width: 150, validate: "required"},
        { name: "COMENTARIO", type: "text", title: "Comentario", width: 100, filtering: false },
        { name: "EMAIL", type: "text", title: "Email", width: 170, filtering: false },
        { name: "FHNAC", type: "text", title: "Fecha de Nacimiento", width: 150, filtering: false },
        { name: "TEL", type: "text", title: "Telf",width: 130, filtering: false },
        { name: "DIRECCION", type: "text", title: "Direccion", width: 130, filtering: false },
        { name: "HABILITADO", type: "checkbox", title: "Habilitado", width: 80, validate: "required", filtering: false },
        { 
            type: "control", 
            editButton: false,
            deleteButton: false
        }
    ]
});

}


$(document).on("click", "#bt-nuevo", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-email').disabled = false;
    document.getElementById('input-tlf').disabled = false;
    document.getElementById('input-direccion').disabled = false;
    document.getElementById('input-comentario').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("input-nombre").val(" "); 
    $("input-email").val(" ");
    $("input-tlf").val(" "); 
    $("input-direccion").val(" "); 
    $("input-comentario").val(" "); 
    $("input-fecha").val(" "); 
    
    $("#input-codigo").focus();

    $("#titulo-venta").replaceWith(
        "<h4 id='titulo-venta' class='text-center' style='margin-bottom: 35px;'>Crear Vendedor</h4>"
    );
    $("#select-codigo").replaceWith(
        "<input id='input-codigo' class='form-control' type='text'/>"
    );
    $("#bt-cambiar").replaceWith(
        "<button id='bt-guardar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );
    $("#bt-borrar2").replaceWith(
        "<button id='bt-guardar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );

});


$(document).on("click", "#bt-guardar", async function() {

    guardar = true;

    var cCodigo = $("#input-codigo").val();
    var cNombre = $("#input-nombre").val();
    var cEmail = $("#input-email").val();
    var cTlf = $("#input-tlf").val();
    var cDireccion = $("#input-direccion").val();
    var cComentario = $("#input-comentario").val();
    var cFecha = $("#input-fecha").val();
    var cHabilitar =  $("input[type='checkbox'][name='habilitar']:checked").val();
    
    if(cHabilitar == undefined){
        cHabilitar = true;
    }
    else{
        cHabilitar = false;
    }


    if(cCodigo.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un codigo");
        guardar = false;
    }
    else if(cNombre.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre");
        guardar = false;
    }
    

    if(isNaN(cCodigo)){
        showModal("Error de ingreso de datos", "El codigo debe ser un numero");
        guardar = false;
    }
 

    if(guardar == true){
        
        resp_post = await postVendedores(cEmpresa, cCodigo, cNombre,  cComentario, cEmail, cFecha, cTlf, cDireccion, cHabilitar);
        if(resp_post == '1'){
            showModal("Mensaje","Venedor creado correctamente");
        }
        else{
            showModal("Error BD", "Venedor no pudo ser creado");
        }
    }

});

$(document).on("click", "#bt-modificar", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-email').disabled = false;
    document.getElementById('input-tlf').disabled = false;
    document.getElementById('input-direccion').disabled = false;
    document.getElementById('input-comentario').disabled = false;
    document.getElementById('input-fecha').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("#titulo-venta").replaceWith(
        "<h4 id='titulo-venta' class='text-center' style='margin-bottom: 35px;'>Modificar Vendedores</h4>"
    );
    $("#input-codigo").replaceWith(
        "<select id='select-codigo' class='form-select'></select>"
    );
    $("#bt-guardar").replaceWith(
        "<button id='bt-cambiar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Cambiar</button>"
    );
    $("#bt-borrar2").replaceWith(
        "<button id='bt-modificar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );

    await setListaCodigos();

    var selectCodigo = $("#select-codigo").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));

});


$(document).on("click", "#bt-cambiar", async function() {

    guardar = true;

    var cCodigo = $("#select-codigo").val();
    var cNombre = $("#input-nombre").val();
    var cEmail = $("#input-email").val();
    var cTlf = $("#input-tlf").val();
    var cDireccion = $("#input-direccion").val();
    var cComentario = $("#input-comentario").val();
    var cFecha = $("#input-fecha").val();
    var cHabilitar =  $("input[type='checkbox'][name='habilitar']:checked").val();

    
    if(cHabilitar == undefined){
        cHabilitar = true;
    }
    else{
        cHabilitar = false;
    }

    if(cNombre.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre");
        guardar = false;
    }
    
   
    if(isNaN(cCodigo)){
        showModal("Error de ingreso de datos", "El codigo debe ser un numero");
        guardar = false;
    }
 

    if(guardar == true){
        resp_update = await updateVendedores(cEmpresa, cCodigo, cNombre, cComentario, cEmail, cFecha, cTlf, cDireccion, cHabilitar);
        if(resp_update == '1'){
            showModal("Mensaje", "Vendedor modificado");
        }
        else{
            showModal("Error", "Vendedor no pudo ser modificado");
        }
    }

});

$(document).on("change", "#select-codigo", async function() {


    var selectCodigo = $("#select-codigo").val();
    if(selectCodigo.length != 0){
        await cambiarDatos(await escogerCodigo(selectCodigo));
    }
});

$(document).on("click", "#bt-borrar", async function() {

    $("#titulo-venta").replaceWith(
        "<h4 id='titulo-venta' class='text-center' style='margin-bottom: 35px;'>Borrar Vendedor</h4>"
    );
    $("#input-codigo").replaceWith(
        "<select id='select-codigo' class='form-select'></select>"
    );
    $("#bt-guardar").replaceWith(
        "<button id='bt-borrar2' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-red);border-color: var(--bs-red);'>Borrar</button>"
    );
    $("#bt-cambiar").replaceWith(
        "<button id='bt-borrar2' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-red);border-color: var(--bs-red);'>Borrar</button>"
    );

    await setListaCodigos();

    document.getElementById('input-nombre').disabled = true;
    document.getElementById('input-email').disabled = true;
    document.getElementById('input-tlf').disabled = true;
    document.getElementById('input-direccion').disabled = true;
    document.getElementById('input-comentario').disabled = true;
    document.getElementById('input-fecha').disabled = true;
    document.getElementById('check-habilitar').disabled = true;

    var selectCodigo = $("#select-codigo").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));

});

$(document).on("click", "#bt-borrar2", async function() {

    var cCodigo = $("#select-codigo").val();

    resp_Delete = await deleteVendedores(cEmpresa, cCodigo);

    if(resp_Delete == '1'){
        showModal("Mensaje", "Vendedor eliminado");
    }
    else{
        showModal("Error BD", "Vendedor no pude ser eliminado");
    }

    await setListaCodigos();

});


//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {

    var cVendedores = await getVendedores(cEmpresa);
    
    $("#input-codigo").focus();

    database = cVendedores;
    setTabla();
  });
