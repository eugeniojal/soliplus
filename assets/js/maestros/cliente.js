
//Variables globales
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");

window.alert = async function() {};

var $listaVendedores = $('#select-vendedor');
var $listaCiudades = $('#select-ciudad');
var $listaPrecio = $("#select-codigoPrecio");
var $listaTipoCliente = $("#select-tipoCliente");
var $listaRetencion = $("#select-retencion");


myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";

//GETS
async function getCliente(pEmpresa){

    var rClientes;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetCliente?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rClientes = result;
    })
    .catch(error => console.log('error', error));

    return rClientes;
}

async function getReteIva(pEmpresa){

    var rRetencion;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetTopedeRetencion?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rRetencion = result;
    })
    .catch(error => console.log('error', error));

    return rRetencion;
}

async function getListaVendedores(pEmpresa){

    var rListaVendedores;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetListaVendedores?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rListaVendedores = result;
    })
    .catch(error => console.log('error', error));

    return rListaVendedores;
}

async function getCiudad(pEmpresa){

    var rCiudades;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetCiudad?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rCiudades = result;
    })
    .catch(error => console.log('error', error));

    return rCiudades;
}

async function getPrecio(pEmpresa){

    var rPrecio;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetPrecio?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rPrecio = result;
    })
    .catch(error => console.log('error', error));

    return rPrecio;
}

async function getTipoCliente(pEmpresa){

    var rTipoCliente;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetTipoCliente?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rTipoCliente = result;
    })
    .catch(error => console.log('error', error));

    return rTipoCliente;
}

async function getRetencion(pEmpresa){

    var rRetencion;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetTopedeRetencion?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rRetencion = result;
    })
    .catch(error => console.log('error', error));

    return rRetencion;
}

async function getClienteParticular(pEmpresa, pRif){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
     rGetClienteParticular =  await fetch(WebApiServer + "api/Maestros/GetClienteParticular?Empresa="+pEmpresa+"&Rif="+pRif, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    console.log(rGetClienteParticular);
}

//POST
async function postCliente(pEmpresa, pCiudad, pCodalterno, pCodpostal, pCodPrecio, pCodrete, pComentario, pContacto, pCupocr, pDireccion, pEmail, pEmailcar, pExentoiva, pHabilitado, pIntcar, pNdriagracia, pRif, pNombre, pPaginaWeb, pPais, pPassword, pPlazo, pPretiva, pSucursal, pTel1, pTel2, pTipocar, pTipocli, pVendedor){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    var rPostCliente = await fetch(WebApiServer + "api/Maestros/PostCliente?Empresa="+pEmpresa+"&Ciudad="+pCiudad+"&Codalterno="+pCodalterno+"&Codpostal="+pCodpostal+"&CodPrecio="+pCodPrecio+"&Codrete="+pCodrete+"&Comentario="+pComentario+"&Contacto="+pContacto+"&Cupocr="+pCupocr+"&Direccion="+pDireccion+"&Email="+pEmail+"&Emailcar="+pEmailcar+"&Exentoiva="+pExentoiva+"&Habilitado="+pHabilitado+"&Intcar="+pIntcar+"&Ndiagracia="+pNdriagracia+"&Rif="+pRif+"&Nombre="+pNombre+"&PaginaWeb="+pPaginaWeb+"&Pais="+pPais+"&Passwordin="+pPassword+"&Plazo="+pPlazo+"&Pretiva="+pPretiva+"&Sucursal="+pSucursal+"&Tel1="+pTel1+"&Tel2="+pTel2+"&Tipocar="+pTipocar+"&Tipocli="+pTipocli+"&Vendedor="+pVendedor, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rPostCliente;
    }

//DELETE
async function deleteCliente(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    var rDeleteCliente = await fetch(WebApiServer + "api/Maestros/DeleteCliente?Empresa="+pEmpresa+"&Codigo="+pCodigo, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rDeleteCliente;
}

//UPDATE
async function updateCliente(pEmpresa, pCiudad, pCodalterno, pCodpostal, pCodPrecio, pCodrete, pComentario, pContacto, pCupocr, pDireccion, pEmail, pEmailcar, pExentoiva, pHabilitado, pIntcar, pNdriagracia, pRif, pNombre, pPaginaWeb, pPais, pPassword, pPlazo, pPretiva, pSucursal, pTel1, pTel2, pTipocar, pTipocli, pVendedor){

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
    var rPutCliente = await fetch(WebApiServer + "api/Maestros/PutCliente?Empresa="+pEmpresa+"&Ciudad="+pCiudad+"&Codalterno="+pCodalterno+"&Codpostal="+pCodpostal+"&CodPrecio="+pCodPrecio+"&Codrete="+pCodrete+"&Comentario="+pComentario+"&Contacto="+pContacto+"&Cupocr="+pCupocr+"&Direccion="+pDireccion+"&Email="+pEmail+"&Emailcar="+pEmailcar+"&Exentoiva="+pExentoiva+"&Habilitado="+pHabilitado+"&Intcar="+pIntcar+"&Ndiagracia="+pNdriagracia+"&Rif="+pRif+"&Nombre="+pNombre+"&PaginaWeb="+pPaginaWeb+"&Pais="+pPais+"&Passwordmo="+pPassword+"&Plazo="+pPlazo+"&Pretiva="+pPretiva+"&Sucursal="+pSucursal+"&Tel1="+pTel1+"&Tel2="+pTel2+"&Tipocar="+pTipocar+"&Tipocli="+pTipocli+"&Vendedor="+pVendedor, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rPutCliente;
}

//SET LISTAS DE SELECT
async function setListaCodigos(){

    var $listaCodigos = $('#select-rif');

    elemento = await getCliente(cEmpresa);

    $listaCodigos.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaCodigos.append($('<option />', {
            value: (element.RIF),
            text: (element.RIF + " - " +  element.NOMBRE)
        }));
    });
    // $listaCodigos.val(undefined).select2();
}

async function setVendedores(){

    elemento = await getListaVendedores(cEmpresa);

    $listaVendedores.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaVendedores.append($('<option />', {
            value: (element.VENDEDOR),
            text: (element.NOMBRE)
        }));
    });
}

async function setCiudad(){

    elemento = await getCiudad(cEmpresa);

    $listaCiudades.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaCiudades.append($('<option />', {
            value: (element.CODCIUDAD),
            text: (element.NOMBRE)
        }));
    });
}

async function setPrecio(){

    elemento = await getPrecio(cEmpresa);

    $listaPrecio.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaPrecio.append($('<option />', {
            value: (element.CODPRECIO),
            text: (element.TITULO)
        }));
    });
}

async function setTipoCliente(){

    elemento = await getTipoCliente(cEmpresa);

    $listaTipoCliente.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaTipoCliente.append($('<option />', {
            value: (element.CODTIPOCL),
            text: (element.NOMBRE)
        }));
    });
}

async function setRetencion(){

    elemento = await getRetencion(cEmpresa);

    $listaRetencion.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaRetencion.append($('<option />', {
            value: (element.CODRETE),
            text: (element.DESCRIPCIO + "-" + element.PRETE)
        }));
    });
}

//MODAL
async function showModal(pTitulo, pMensaje){
    
    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
    
    $(document).on("click", "#btn-modal", function() {
        location.reload();
    });
}

//PARA ACTUALIZAR SELECTS
async function escogerCodigo(codigoActual){

    console.log(codigoActual);
    var cliente = await getClienteParticular(cEmpresa, codigoActual);

    console.log(cliente);
    return cliente;
}

async function cambiarDatos(elemento){

    console.log(elemento.VENDEDOR);
    console.log(elemento.RIF);


    $("#select-retencion option["+elemento.CODRETE+"]").attr('selected', 'selected');
    $("#select-vendedor option["+elemento.VENDEDOR+"]").attr('selected', 'selected');
    $("#select-ciudad option["+elemento.CODCIUDAD+"]").attr('selected', 'selected');
    $("#select-codigoPrecio option["+elemento.CODPRECIO+"]").attr('selected', 'selected');
    $("#select-tipoCliente option["+elemento.TIPOCLI+"]").attr('selected', 'selected');


    if(elemento.HABILITADO == true){
        $("#check-habilitar").prop('checked', true);
    }
    else{
        $("#check-habilitar").prop('checked', false);
    }

    if(elemento.SUCURSAL == true){
        $("#check-sucursal").prop('checked', true);
    }
    else{
        $("#check-sucursal").prop('checked', false);
    }

    $("#input-rif").val(elemento.RIF);
    $("#input-nombre").val(elemento.NOMBRE);
    $("#input-codigoAlterno").val(elemento.CODALTERNO);
    $("#input-email").val(elemento.EMAIL);
    $("#input-direccion").val(elemento.DIRECCION);
    $("#input-emailCar").val(elemento.EMAILCAR);
    $("#input-tlf1").val(elemento.TEL1);
    $("#input-tlf2").val(elemento.TEL2);
    $("#input-pais").val(elemento.PAIS);
    $("#input-contacto").val(elemento.CONTACTO);
    $("#input-codigoPostal").val(elemento.CODPOSTAL);
    $("#input-diasGracia").val(elemento.NDIAGRACIA);
    $("#input-credito").val(elemento.CUPOCR);
    $("#input-exento").val(elemento.EXENTOIVA);
    $("#input-plazo").val(elemento.PLAZO);
    $("#input-paginaWeb").val(elemento.PAGINAWEB);
    $("#input-comentario").val(elemento.COMENTARIO);
}

//TABLA
async function setTabla() {

    $("#jsGrid").jsGrid({
        height: "auto",
        width: "100%",

        filtering: true,
        sorting: true,
        paging: true,

        pageSize: 8,
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
            { name: "RIF", type: "text", width: 120, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false },
            { name: "NOMBRE", type: "text",  title: "Nombre", width: 100, validate: "required"},
            { name: "CODALTERNO", type: "text", title: "Codigo Alt", width: 100, filtering: false },
            { name: "EMAIL", type: "text",  title: "Email",width: 100, filtering: false },
            { name: "EMAILCAR", type: "text",  title: "Email Cart",width: 100, filtering: false },
            { name: "TEL1", type: "text",  title: "Telefono 1",width: 100, filtering: false },
            { name: "TEL2", type: "text",  title: "Telefono 2",width: 100, filtering: false },
            { name: "CONTACTO", type: "text",  title: "Contacto",width: 100, filtering: false },
            { name: "VENDEDOR", type: "text", title: "Vendedor", width: 100, filtering: false },
            { name: "CUPOCR", type: "text",  title: "Cupo Credito",width: 100, filtering: false },
            { name: "CIUDAD", type: "text",  title: "Ciudad", width: 100, filtering: false },
            { name: "CODPOSTAL", type: "text",  title: "Codigo Postak",width: 100, filtering: false },
            { name: "PAIS", type: "text",  title: "Pais", width: 100, filtering: false },
            { name: "CODPRECIO", type: "text", title: "CodPrecio", width: 100, filtering: false },
            { name: "NDIAGRACIA", type: "text",  title: "Dias de Gracia",width: 100, filtering: false },
            { name: "CODRETE", type: "text",  title: "CodRetencion",width: 100, filtering: false },
            { name: "EXENTOIVA", type: "text",  title: "Excento IVA",width: 100, filtering: false },
            { name: "PRETIVA", type: "text",  title: "% RETEIVA",width: 100, filtering: false },
            { name: "PLAZO", type: "text",  title: "Plazo",width: 100, filtering: false },
            { name: "PAGINAWEB", type: "text",  title: "Pagina Web",width: 100, filtering: false },
            { name: "TIPOCLI", type: "text",  title: "Tipo Cliente",width: 100, filtering: false },
            { name: "TIPOCAR", type: "text",  title: "Tipo Cartera",width: 100, filtering: false },
            { name: "COMENTARIO", type: "text",  title: "Comentario",width: 100, filtering: false },
            { name: "SUCURSAL", type: "checkbox",  title: "Sucursal",width: 60, filtering: false },
            { name: "INTCAR", type: "checkbox",  title: "Int Car",width: 60, filtering: false },
            { name: "HABILITADO", type: "checkbox",  title: "Habilitado",width: 60, validate: "required", filtering: false },
            { 
                type: "control",
                editButton: false,
                deleteButton: false
            }
        ]
    });
}

//BOTONES Y FUNCIONALIDES

$("#bt-home").click(async function () {
    userHome(cInterno);
});

$(document).on("click", "#bt-nuevo", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-codigoAlterno').disabled = false;
    document.getElementById('input-direccion').disabled = false;
    document.getElementById('input-email').disabled = false;
    document.getElementById('input-emailCar').disabled = false;
    document.getElementById('input-tlf1').disabled = false;
    document.getElementById('input-tlf2').disabled = false;
    document.getElementById('select-vendedor').disabled = false;
    document.getElementById('input-contacto').disabled = false;
    document.getElementById('input-pais').disabled = false;
    document.getElementById('input-codigoPostal').disabled = false;
    document.getElementById('select-ciudad').disabled = false;
    document.getElementById('select-codigoPrecio').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('input-paginaWeb').disabled = false;
    document.getElementById('input-comentario').disabled = false;
    document.getElementById('check-sucursal').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("#input-rif").val(undefined);
    $("#input-nombre").val(undefined);
    $("#input-codigoAlterno").val(undefined);
    $("#input-email").val(undefined);
    $("#input-direccion").val(undefined);
    $("#input-emailCar").val(undefined);
    $("#input-tlf1").val(undefined);
    $("#input-tlf2").val(undefined);
    $("#input-pais").val(undefined);
    $("#select-vendedor").val(undefined);
    $("#input-contacto").val(undefined);
    $("#input-codigoPostal").val(undefined);
    $("#select-ciudad").val(undefined);
    $("#select-codigoPrecio").val(undefined);
    $("#input-diasGracia").val(undefined);
    $("#select-retencion").val(undefined);
    $("#input-credito").val(undefined);
    $("#input-exento").val(undefined);
    $("#input-plazo").val(undefined);
    $("#input-paginaWeb").val(undefined);
    $("#select-tipoCliente").val(undefined);
    $("#input-comentario").val(undefined);
    $("#check-sucursal").val(undefined);
    $("#check-habilitar").val(undefined);
    
    $("#input-rif").focus();

    $("#titulo-cliente").replaceWith(
        "<h4 id='titulo-cliente' class='text-center' style='margin-bottom: 35px;'>Nuevo Cliente</h4>"
    );
    $("#select-rif").replaceWith(
        "<input id='input-rif' class='form-control' type='text'/>"
    );
    $("#bt-cambiar").replaceWith(
        "<button id='bt-guardar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );
    $("#bt-borrar2").replaceWith(
        "<button id='bt-guardar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );

    await setPrecio();
    await setCiudad();
    await setVendedores();
    await setTipoCliente();
    await setRetencion();

});

$(document).on("click", "#bt-guardar", async function() {

    guardar = true;

    var cRif = undefined;
    var cNombreCliente = undefined;
    var cAlterno = undefined;
    var cEmail = undefined;
    var cDireccion = undefined;
    var cEmailCar = undefined;
    var cTlf1 = undefined;
    var cTlf2 = undefined;
    var cVendedor = undefined;
    var cContacto = undefined;
    var cPostal = undefined;
    var cPais = undefined;
    var cCiudad = undefined;
    var cPrecio = undefined;
    var cGracia = undefined;
    var cPlazo = undefined;
    var cRetencion = undefined;
    var cCredito = undefined;
    var cExento = undefined;
    var cPagina = undefined;
    var cTipoCliente = undefined;
    var cComentario = undefined;
    // var cIntcar = undefined;
    var cHabilitar =  undefined;
    var cSucursal =  undefined;
    
    cRif = $("#input-rif").val();
    cNombreCliente = $("#input-nombre").val();
    cAlterno = $("#input-codigoAlterno").val();
    cEmail = $("#input-email").val();
    cDireccion = $("#input-direccion").val();
    cEmailCar = $("#input-emailCar").val();
    cTlf1 = $("#input-tlf1").val();
    cTlf2 = $("#input-tlf2").val();
    cVendedor = $("#select-vendedor").val();
    cContacto = $("#input-contacto").val();
    cPostal = $("#input-codigoPostal").val();
    cPais = $("#input-pais").val();
    cCiudad = $("#select-ciudad").val();
    cPrecio = $("#select-codigoPrecio").val();
    cRetencion = $("#select-retencion").val();
    cPagina = $("#input-paginaWeb").val();
    cComentario = $("#input-comentario").val();
    cHabilitar =  $("#input[type='checkbox'][name='habilitar']:checked").val();
    cSucursal =  $("#input[type='checkbox'][name='sucursal']:checked").val();

    
    if(cHabilitar == undefined){
        cHabilitar = true;
    }
    else{
        cHabilitar = false;
    }

    if(cSucursal == undefined){
        cSucursal = true;
    }
    else{
        cSucursal = false;
    }

    if(cRif.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un codigo");
        guardar = false;
    }
    else if(cNombre.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre");
        guardar = false;
    }
    else if(cEmail.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un email");
        guardar = false;
    }
    else if(cEmailCar.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un emailCar");
        guardar = false;
    }
    else if((cTlf1.length == 0) && (cTlf2.length == 0)){
        showModal("Error de ingreso de datos", "Debe ingresar al menos un telefono");
        guardar = false;
    }
    else if(cCiudad.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un ciudad");
        guardar = false;
    }
    else if(cPais.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un pais");
        guardar = false;
    }
    else if(cVendedor.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un vendedor");
        guardar = false;
    }
    else if(cPrecio.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un precio");
        guardar = false;
    }
    else if(cRetencion.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un retencion");
        guardar = false;
    }
    else if(cPagina.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un pagina");
        guardar = false;
    }
    else if(cDireccion.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar una direccion");
        guardar = false;
    }

    if(isNaN(cRetencion)){
        showModal("Error de ingreso de datos", "El cupo de credito debe ser un numero");
        guardar = false;
    }

    if(cPlazo > 100){
        showModal("Error de ingreso de datos", "El Plazo debe ser menor a 100");
        guardar = false;
    }

    if(guardar == true){
        var res_cliente = await postCliente(cEmpresa, cCiudad, cAlterno, cPostal, cPrecio, cRetencion, cComentario, cContacto, cCredito, cDireccion,cEmail, cEmailCar, cExento, cHabilitar, 1, cGracia, cRif, cNombreCliente,  cPagina, cPais, cNombre, cPlazo, cRetencion, cSucursal, cTlf1, cTlf2, "0", cTipoCliente, cVendedor);
         if(res_cliente == '1'){
            showModal("Mensaje", "Fue creado un nuevo cliente");
         }
         else{
            showModal("Error", "El cliente no pudo ser creado");
        }
    }

});

$(document).on("click", "#bt-modificar", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-codigoAlterno').disabled = false;
    document.getElementById('input-direccion').disabled = false;
    document.getElementById('input-email').disabled = false;
    document.getElementById('input-emailCar').disabled = false;
    document.getElementById('input-tlf1').disabled = false;
    document.getElementById('input-tlf2').disabled = false;
    document.getElementById('select-vendedor').disabled = false;
    document.getElementById('input-contacto').disabled = false;
    document.getElementById('input-pais').disabled = false;
    document.getElementById('input-codigoPostal').disabled = false;
    document.getElementById('select-ciudad').disabled = false;
    document.getElementById('select-codigoPrecio').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('input-paginaWeb').disabled = false;
    document.getElementById('input-comentario').disabled = false;
    document.getElementById('check-sucursal').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("#input-rif").focus();

    $("#titulo-cliente").replaceWith(
        "<h4 id='titulo-cliente' class='text-center' style='margin-bottom: 35px;'>Modificar Cliente</h4>"
    );
    $("#input-rif").replaceWith(
        "<select id='select-rif' class='form-select'></select>"
    );
    $("#bt-guardar").replaceWith(
        "<button id='bt-cambiar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Cambiar</button>"
    );
    $("#bt-borrar2").replaceWith(
        "<button id='bt-cambiar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Cambiar</button>"
    );
    await setListaCodigos();

    var selectCodigo = $("#select-rif").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));
});

$(document).on("click", "#bt-cambiar", async function() {

    guardar = true;

    var cRif = $("#select-rif").val();
    var cNombreCliente = $("#input-nombre").val();
    var cAlterno = $("#input-codigoAlterno").val();
    var cEmail = $("#input-email").val();
    var cDireccion = $("#input-direccion").val();
    var cEmailCar = $("#input-emailCar").val();
    var cTlf1 = $("#input-tlf1").val();
    var cTlf2 = $("#input-tlf2").val();
    var cVendedor = $("#select-vendedor").val();
    var cContacto = $("#input-contacto").val();
    var cPostal = $("#input-codigoPostal").val();
    var cPais = $("#input-pais").val();
    var cCiudad = $("#select-ciudad").val();
    var cPrecio = $("#select-codigoPrecio").val();
    var cRetencion = $("#select-retencion").val();
    var cPagina = $("#input-paginaWeb").val();
    var cComentario = $("#input-comentario").val();
    var cHabilitar =  $("#input[type='checkbox'][name='habilitar']:checked").val();
    var cSucursal =  $("#input[type='checkbox'][name='sucursal']:checked").val();
    
    if(cHabilitar == undefined){
        cHabilitar = true;
    }
    else{
        cHabilitar = false;
    }

    if(cSucursal == undefined){
        cSucursal = true;
    }
    else{
        cSucursal = false;
    }

    if(cRif.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un codigo");
        guardar = false;
    }
    else if(cNombre.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre");
        guardar = false;
    }
    else if(cEmail.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un email");
        guardar = false;
    }
    else if(cEmailCar.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un emailCar");
        guardar = false;
    }
    else if((cTlf1.length == 0) && (cTlf2.length == 0)){
        showModal("Error de ingreso de datos", "Debe ingresar al menos un telefono");
        guardar = false;
    }
    else if(cCiudad.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un ciudad");
        guardar = false;
    }
    else if(cVendedor.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un vendedor");
        guardar = false;
    }
    else if(cPrecio.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un precio");
        guardar = false;
    }
    else if(cRetencion.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un retencion");
        guardar = false;
    }
    else if(cDireccion.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar una direccion");
        guardar = false;
    }

    if(isNaN(cRetencion)){
        showModal("Error de ingreso de datos", "El cupo de credito debe ser un numero");
        guardar = false;
    }

    if(guardar == true){
        var res_update = await updateCliente(cEmpresa, cCiudad, cAlterno, cPostal, cPrecio, cRetencion,cComentario, cContacto, cCredito, cDireccion,cEmail, cEmailCar, cExento, cHabilitar, 1, cGracia, cRif, cNombreCliente,  cPagina, cPais, cNombre, cPlazo, cRetencion, cSucursal, cTlf1, cTlf2, "0", cTipoCliente, cVendedor);
        if(res_update == '1'){
            showModal("Mensaje", "Cambio de cliente hecho correctamente");
        }
        else{
            showModal("Error", "El cliente no pudo ser cambiado");
        }
    }
});

$(document).on("change", "#select-rif", async function() {

    var selectCodigo = $("#select-rif").val();
    if(selectCodigo.length != 0){
        await cambiarDatos(await escogerCodigo(selectCodigo));
    }
});

$(document).on("click", "#bt-borrar", async function() {

    $("#titulo-cliente").replaceWith(
        "<h4 id='titulo-cliente' class='text-center' style='margin-bottom: 35px;'>Eliminar Cliente</h4>"
    );
    $("#input-rif").replaceWith(
        "<select id='select-rif' class='form-select'></select>"
    );
    $("#bt-guardar").replaceWith(
        "<button id='bt-borrar2' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-red);border-color: var(--bs-red);'>Borrar</button>"
    );
    $("#bt-cambiar").replaceWith(
        "<button id='bt-borrar2' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-red);border-color: var(--bs-red);'>Borrar</button>"
    );

    await setListaCodigos();
    await setPrecio();
    await setCiudad();
    await setVendedores();
    await setTipoCliente();
    await setRetencion();

    document.getElementById('input-nombre').disabled = true;
    document.getElementById('input-codigoAlterno').disabled = true;
    document.getElementById('input-direccion').disabled = true;
    document.getElementById('input-email').disabled = true;
    document.getElementById('input-emailCar').disabled = true;
    document.getElementById('input-tlf1').disabled = true;
    document.getElementById('input-tlf2').disabled = true;
    document.getElementById('select-vendedor').disabled = true;
    document.getElementById('input-contacto').disabled = true;
    document.getElementById('input-pais').disabled = true;
    document.getElementById('input-codigoPostal').disabled = true;
    document.getElementById('select-ciudad').disabled = true;
    document.getElementById('select-codigoPrecio').disabled = true;
    document.getElementById('input-diasGracia').disabled = true;
    document.getElementById('select-retencion').disabled = true;
    document.getElementById('input-credito').disabled = true;
    document.getElementById('input-exento').disabled = true;
    document.getElementById('input-paginaWeb').disabled = true;
    document.getElementById('input-plazo').disabled = true;
    document.getElementById('select-tipoCliente').disabled = true;
    document.getElementById('input-comentario').disabled = true;
    document.getElementById('check-sucursal').disabled = true;
    document.getElementById('check-habilitar').disabled = true;

    var selectCodigo = $("#select-rif").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));

});

$(document).on("click", "#bt-borrar2", async function() {

    var rifActual = $("#select-rif").val();

    var res_delete = await deleteCliente(cEmpresa, rifActual);
    console.log(res_delete);
    if(res_delete == '1'){
        showModal("Mensaje", "Cliente eliminado correctamente");
    }
    else{
        showModal("Error", "El cliente no pudo ser eliminado");
    }

    await setListaCodigos();

    // location.reload();
});

//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {

    await setVendedores();
    await setCiudad();
    await setPrecio();
    await setTipoCliente();
    await setRetencion();

    $("#input-rif").focus();

    var cTipoVenta = await getCliente(cEmpresa);
    database = cTipoVenta;
    setTabla();
  });
