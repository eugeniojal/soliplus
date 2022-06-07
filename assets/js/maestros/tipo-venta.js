
//Variables globales
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");

window.alert = async function() {};

var $listaRetencion = $('#select-retencion');

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";

//GET Inventario
async function getTipoVenta(pEmpresa){

    var rTipoVenta;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetTipoVenta?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rTipoVenta = result;
    })
    .catch(error => console.log('error', error));

    return rTipoVenta;
}

//GET Codigo de Retencion
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

//GET Lista de Codigso de Retencion
async function getListaTipoVenta(pEmpresa){

    var rListaCodigos;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetListaTipoVenta?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rListaCodigos = result;
    })
    .catch(error => console.log('error', error));

    return rListaCodigos;
}

//POST Tipo de Inventario
async function postTipoVenta(pEmpresa, pCodigo, pNombre, pPlazo, pTasa, pCSUS, pCSBS, pMora, pInicial, pHabilitado, pRetencion, pEfectivo){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    var rPostTipo = await fetch("http://soliplus.consolidez.com/ApiRestSoliPlus/api/Maestros/PostTipoVenta?Empresa="+pEmpresa+"&TipoVta="+pCodigo+"&Nombre="+pNombre+"&Plazo="+pPlazo+"&Tasa="+pTasa+"&CostosUSD="+pCSUS+"&CostoBS="+pCSBS+"&Tasamora="+pMora+"&Inicial="+pInicial+"&Habilitado="+pHabilitado+"&CodReteInteres="+pRetencion+"&GastoEfectivo="+pEfectivo, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
    return rPostTipo;
}

//DELETE Tipo de Inventario
async function deleteTipoVenta(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    var rDeleteTipo = await fetch(WebApiServer + "api/Maestros/DeleteTipoVenta?Empresa="+pEmpresa+"&Codigo="+pCodigo, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rDeleteTipo;
}

//UPDATE Tipo de Inventario
async function updateTipoVenta(pEmpresa, pCodigo, pNombre, pPlazo, pTasa, pCSUS, pCSBS, pMora, pInicial, pHabilitar, pRetencion, pEfectivo){

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
    var rUpdateTipo = await fetch(WebApiServer + "api/Maestros/PutTipoVenta?Empresa="+pEmpresa+"&TipoVta="+pCodigo+"&Nombre="+pNombre+"&Plazo="+pPlazo+"&Tasa="+pTasa+"&CostosUSD="+pCSUS+"&CostoBS="+pCSBS+"&Tasamora="+pMora+"&Inicial="+pInicial+"&Habilitado="+pHabilitar+"&CodReteInteres="+pRetencion+"&GastoEfectivo="+pEfectivo, requestOptions)        
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rUpdateTipo;
}

async function setListaCodigos(){

    var $listaCodigos = $('#select-codigo');

    elemento = await getListaTipoVenta(cEmpresa);

    $listaCodigos.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaCodigos.append($('<option />', {
            value: (element.TIPOVTA),
            text: (element.NOMBRE +" - "+  element.TIPOVTA)
        }));
    });
    // $listaCodigos.val(undefined).select2();
}

async function setReteIva(){

    elemento = await getReteIva(cEmpresa);

    $listaRetencion.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaRetencion.append($('<option />', {
            value: (element.CODRETE),
            text: (element.DESCRIPCIO + " (" + element.PRETE + "%)")
        }));
    });
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

    productos = await getTipoVenta(cEmpresa);


    productos.forEach(element => {
        if(element.TIPOVTA == codigoActual){
            codElegido = element;
        }
    });

    return codElegido;
}

async function cambiarDatos(elemento){

    $("#select-retencion option["+elemento.CODRETE+"]").attr('selected', 'selected');

    if(elemento.HABILITADO == true){
        $("#check-habilitar").prop('checked', true);
    }
    else{
        $("#check-habilitar").prop('checked', false);
    }

    if(elemento.GASTOEFECTIVO == true){
        $("#check-efectivo").prop('checked', true);
    }
    else{
        $("#check-efectivo").prop('checked', false);
    }

    $("#input-nombre").val(elemento.NOMBRE);
    $("#input-plazo").val(elemento.PLAZO);
    $("#input-inicial").val(elemento.INICIAL);
    $("#input-csus").val(elemento.PCOSTSERUS);
    $("#input-csbs").val(elemento.PCOSTSERBS);
    $("#input-tasa").val(elemento.TASA);
    $("#input-mora").val(elemento.TASAMORA);
}

$("#bt-home").click(async function () {
    userHome(cInterno);
});


//Crear tabla
async function setTabla() {

    $("#jsGrid").jsGrid({
        height: "auto",
        width: "100%",

        filtering: true,
        sorting: true,
        paging: true,

        pageSize: 15,
        pageButtonCount: 5,

        deleteConfirm: "Seguro que desea borrar el cliente?",

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
            //Borramos
            deleteItem: async function(deletingItem) {

                console.log(deletingItem); 

                await deleteTipoVenta(cEmpresa, deletingItem.TIPOVTA);

                var cTipoVenta = await getTipoVenta(cEmpresa);
                database = cTipoVenta;
                await setTabla();           
            },
        },
        
        fields: [
            { name: "TIPOVTA", type: "text", title: "Tipo", width: 40, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "NOMBRE", type: "text", title: "Nombre", width: 100, validate: "required"},
            { name: "PLAZO", type: "text", width: 50, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "TASA", type: "text", title: "Tasa",  width: 33, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "PCOSTSERUS", type: "text", title: "% Servicio US", width: 50, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "PCOSTSERBS", type: "text", title: "% Servicio Bs", width: 50, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "TASAMORA", type: "text", title: "Tasa Mora", width: 33, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "INICIAL", type: "text", title: "Inicial", width: 40, validate: [
                "required",
                { validator: "range", param: [0, 99999] },
            ], filtering: false  },
            { name: "HABILITADO", type: "checkbox", title: "Habilitado", width: 60, validate: "required", filtering: false },
            { name: "CODRETEINT", type: "text", title: "Codigo Retencion", width: 60, validate: "required", filtering: false },
            { name: "GASTOEFECTIVO", type: "checkbox", title: "Efectivo", width: 50, validate: "required", filtering: false },
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
    document.getElementById('input-plazo').disabled = false;
    document.getElementById('input-inicial').disabled = false;
    document.getElementById('input-csus').disabled = false;
    document.getElementById('input-csbs').disabled = false;
    document.getElementById('input-tasa').disabled = false;
    document.getElementById('input-mora').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('check-efectivo').disabled = false;
    document.getElementById('check-habilitar').disabled = false;
    
    $("input-codigo").val(undefined).mask("#,##0.00", {reverse: true});
    $("input-nombre").val(undefined); 
    $("input-plazo").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-inicial").val(undefined).mask("#,##0.00", {reverse: true});
    $("input-csus").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-csbs").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-tasa").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-mora").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("select-retencion").val(undefined); 
    
    $("#input-codigo").focus();

    $("#titulo-venta").replaceWith(
        "<h4 id='titulo-venta' class='text-center' style='margin-bottom: 35px;'>Crear Tipo de Venta</h4>"
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

    await setReteIva();

});

$(document).on("click", "#bt-guardar", async function() {

    guardar = true;

    var cCodigo = $("#input-codigo").val();
    var cNombre = $("#input-nombre").val();
    var cPlazo = $("#input-plazo").val();
    var cInicial = $("#input-inicial").val();
    var cCSUS = $("#input-csus").val();
    var cCSBS = $("#input-csbs").val();
    var cTasa = $("#input-tasa").val();
    var cMora = $("#input-mora").val();
    var cRetencion = $("#select-retencion").val();
    var cEfectivo =  $("input[type='checkbox'][name='efectivo']:checked").val();
    var cHabilitar =  $("input[type='checkbox'][name='habilitar']:checked").val();

    cRetencion = cRetencion.toString();
    cPlazo = Number(cPlazo);
    cInicial = Number(cInicial);
    cCSUS = Number(cCSUS);
    cCSBS = Number(cCSBS);
    cTasa = Number(cTasa);
    cMora = Number(cMora);
    
    if(cHabilitar == undefined){
        cHabilitar = true;
    }
    else{
        cHabilitar = false;
    }

    if(cEfectivo == undefined){
        cEfectivo = true;
    }
    else{
        cEfectivo = false;
    }

    if(cCodigo.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un codigo");
        guardar = false;
    }
    else if(cNombre.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre");
        guardar = false;
    }
    else if(cPlazo.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Plazo");
        guardar = false;
    }
    else if(cInicial.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Inicial");
        guardar = false;
    }
    else if(cCSUS.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Costo por Servicio en US");
        guardar = false;
    }
    else if(cCSBS.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Costo por Servicio en Bs");
        guardar = false;
    }
    else if(cTasa.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Tasa");
        guardar = false;
    }
    else if(cMora.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Mora");
        guardar = false;
    }
    else if(cRetencion == undefined){
        showModal("Error de ingreso de datos", "Debe ingresar un Retencion");
        guardar = false;
    }

    if(isNaN(cCodigo)){
        showModal("Error de ingreso de datos", "El codigo debe ser un numero");
        guardar = false;
    }
    if(isNaN(cPlazo)){
        showModal("Error de ingreso de datos", "El Plazo debe ser un numero");
        guardar = false;
    }
    if(isNaN(cTasa)){
        showModal("Error de ingreso de datos", "La Tasa debe ser un numero");
        guardar = false;
    }
    if(isNaN(cCSUS)){
        showModal("Error de ingreso de datos", "El costo por servicio debe ser un numero");
        guardar = false;
    }
    if(isNaN(cCSBS)){
        showModal("Error de ingreso de datos", "El costo por servicio debe ser un numero");
        guardar = false;
    }
    if(isNaN(cMora)){
        showModal("Error de ingreso de datos", "La Mora debe ser un numero");
        guardar = false;
    }
    if(isNaN(cInicial)){
        showModal("Error de ingreso de datos", "El Incial debe ser un numero");
        guardar = false;
    }

    if(cPlazo > 100){
        showModal("Error de ingreso de datos", "El Plazo debe ser menor a 100");
        guardar = false;
    }

    if(cInicial > 100){
        showModal("Error de ingreso de datos", "El Incial debe ser menor  a 100");
        guardar = false;
    }

    if(cCSUS > 100){
        showModal("Error de ingreso de datos", "El Costo por Servicio debe ser menor a 100");
        guardar = false;
    }

    if(cCSBS > 100){
        showModal("Error de ingreso de datos", "El Costo por Servicio debe ser menor a 100");
        guardar = false;
    }

    if(cTasa > 100){
        showModal("Error de ingreso de datos", "La tasa debe ser menor a 100");
        guardar = false;
    }

    if(cMora > 100){
        showModal("Error de ingreso de datos", "La mora debe ser menor a 100");
        guardar = false;
    }

    if(guardar == true){
        resp_post = await postTipoVenta(cEmpresa, cCodigo, cNombre, cPlazo, cTasa, cCSUS, cCSBS, cMora, cInicial, cHabilitar, cRetencion, cEfectivo);

        if(resp_post == '1'){
            showModal("Mensaje", "Tipo de Venta creado correctamente");
        }
        else{
            showModal("Error BD", "Error creando tipo de venta");

        }
    }

});

$(document).on("click", "#bt-modificar", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-plazo').disabled = false;
    document.getElementById('input-inicial').disabled = false;
    document.getElementById('input-csus').disabled = false;
    document.getElementById('input-csbs').disabled = false;
    document.getElementById('input-tasa').disabled = false;
    document.getElementById('input-mora').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('check-efectivo').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("#titulo-venta").replaceWith(
        "<h4 id='titulo-venta' class='text-center' style='margin-bottom: 35px;'>Modificar Tipo de Venta</h4>"
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

    $("input-nombre").val(undefined); 
    $("input-plazo").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-inicial").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-csus").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-csbs").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-tasa").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-mora").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("select-retencion").val(undefined); 
    
    await setListaCodigos();

    var selectCodigo = $("#select-codigo").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));


});

$(document).on("click", "#bt-cambiar", async function() {

    guardar = true;

    var cCodigo = $("#select-codigo").val();
    var cNombre = $("#input-nombre").val();
    var cPlazo = $("#input-plazo").val();
    var cInicial = $("#input-inicial").val();
    var cCSUS = $("#input-csus").val();
    var cCSBS = $("#input-csbs").val();
    var cTasa = $("#input-tasa").val();
    var cMora = $("#input-mora").val();
    var cRetencion = $("#select-retencion").val();
    var cEfectivo =  $("input[type='checkbox'][name='efectivo']:checked").val();
    var cHabilitar =  $("input[type='checkbox'][name='habilitar']:checked").val();

    cRetencion = cRetencion.toString();
    cPlazo = Number(cPlazo);
    cInicial = Number(cInicial);
    cCSUS = Number(cCSUS);
    cCSBS = Number(cCSBS);
    cTasa = Number(cTasa);
    cMora = Number(cMora);
    
    if(cHabilitar == undefined){
        cHabilitar = true;
    }
    else{
        cHabilitar = false;
    }

    if(cEfectivo == undefined){
        cEfectivo = true;
    }
    else{
        cEfectivo = false;
    }

    if(cNombre.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre");
        guardar = false;
    }
    else if(cPlazo.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Plazo");
        guardar = false;
    }
    else if(cInicial.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Inicial");
        guardar = false;
    }
    else if(cCSUS.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Costo por Servicio en US");
        guardar = false;
    }
    else if(cCSBS.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Costo por Servicio en Bs");
        guardar = false;
    }
    else if(cTasa.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Tasa");
        guardar = false;
    }
    else if(cMora.length == 0){
        showModal("Error de ingreso de datos", "Debe ingresar un Mora");
        guardar = false;
    }
    else if(cRetencion == undefined){
        showModal("Error de ingreso de datos", "Debe ingresar un Retencion");
        guardar = false;
    }

    if(isNaN(cCodigo)){
        showModal("Error de ingreso de datos", "El codigo debe ser un numero");
        guardar = false;
    }
    if(isNaN(cPlazo)){
        showModal("Error de ingreso de datos", "El Plazo debe ser un numero");
        guardar = false;
    }
    if(isNaN(cTasa)){
        showModal("Error de ingreso de datos", "La Tasa debe ser un numero");
        guardar = false;
    }
    if(isNaN(cCSUS)){
        showModal("Error de ingreso de datos", "El costo por servicio debe ser un numero");
        guardar = false;
    }
    if(isNaN(cCSBS)){
        showModal("Error de ingreso de datos", "El costo por servicio debe ser un numero");
        guardar = false;
    }
    if(isNaN(cMora)){
        showModal("Error de ingreso de datos", "La Mora debe ser un numero");
        guardar = false;
    }
    if(isNaN(cInicial)){
        showModal("Error de ingreso de datos", "El Incial debe ser un numero");
        guardar = false;
    }

    if(cPlazo > 100){
        showModal("Error de ingreso de datos", "El Plazo debe ser menor a 100");
        guardar = false;
    }

    if(cInicial > 100){
        showModal("Error de ingreso de datos", "El Incial debe ser menor  a 100");
        guardar = false;
    }

    if(cCSUS > 100){
        showModal("Error de ingreso de datos", "El Costo por Servicio debe ser menor a 100");
        guardar = false;
    }

    if(cCSBS > 100){
        showModal("Error de ingreso de datos", "El Costo por Servicio debe ser menor a 100");
        guardar = false;
    }

    if(cTasa > 100){
        showModal("Error de ingreso de datos", "La tasa debe ser menor a 100");
        guardar = false;
    }

    if(cMora > 100){
        showModal("Error de ingreso de datos", "La mora debe ser menor a 100");
        guardar = false;
    }

    if(guardar == true){
        resp_update = await updateTipoVenta(cEmpresa, cCodigo, cNombre, cPlazo, cTasa, cCSUS, cCSBS, cMora, cInicial, cHabilitar, cRetencion, cEfectivo);
        
        if(resp_update == '1'){
            showModal("Mensaje", "Tipo de Venta actualizado correctamente");
        }
        else{
            showModal("Error BD", "Error actulizando tipo de venta");

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

    $("input-codigo").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-nombre").val(undefined); 
    $("input-plazo").val(undefined).mask("#,##0.00", {reverse: true});
    $("input-inicial").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-csus").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-csbs").val(undefined).mask("#,##0.00", {reverse: true}); 
    $("input-tasa").val(undefined).mask("#,##0.00", {reverse: true});
    $("input-mora").val(undefined).mask("#,##0.00", {reverse: true});
    $("select-retencion").val(undefined); 

    $("#titulo-venta").replaceWith(
        "<h4 id='titulo-venta' class='text-center' style='margin-bottom: 35px;'>Borrar Tipo de Venta</h4>"
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
    document.getElementById('input-plazo').disabled = true;
    document.getElementById('input-inicial').disabled = true;
    document.getElementById('input-csus').disabled = true;
    document.getElementById('input-csbs').disabled = true;
    document.getElementById('input-tasa').disabled = true;
    document.getElementById('input-mora').disabled = true;
    document.getElementById('select-retencion').disabled = true;
    document.getElementById('check-efectivo').disabled = true;
    document.getElementById('check-habilitar').disabled = true;


    var selectCodigo = $("#select-codigo").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));
    await setReteIva();

});

$(document).on("click", "#bt-borrar2", async function() {

    var cCodigo = $("#select-codigo").val();

    resp_delete = await deleteTipoVenta(cEmpresa, cCodigo);
    if(resp_delete == '1'){
        showModal("Mensaje", "Tipo de Venta eliminado correctamente");
    }
    else{
        showModal("Error BD", "Error eliminado tipo de venta");

    }

    await setReteIva();
    await setListaCodigos();

});




//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {

    await setReteIva();

    $("#input-codigo").focus();

    var cTipoVenta = await getTipoVenta(cEmpresa);
    database = cTipoVenta;
    setTabla();
  });
