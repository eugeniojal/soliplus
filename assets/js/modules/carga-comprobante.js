// Variables
var cEmpresa = sessionStorage.getItem('Empresa');
var cOrigen = sessionStorage.getItem("Origen");
var cModulo = sessionStorage.getItem("Modulo");
var cTipoDcto =  sessionStorage.getItem("TipoDcto");

var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cTitulo = sessionStorage.getItem("Titulo");

var $listaClientes = $('#input-cliente');
var $listaBancos = $('#input-banco');
var $listaTipoImputacion = $('#input-tipo-imputacion');

var cBancos, cBanco, cMoneda, cComprobante, cMonto, cReferencia, cFecha, cFechaLimite, cRif, cUrlComprobante, cMultipago; 
var cDescripcion = 'Certificado Nuevo';



//GETS
async function getConsecut(pEmpresa, pOrigen, pTipoDcto) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rGetConsecut = await fetch(WebApiServer + "api/Common/GetConsecut?Empresa=" + pEmpresa + "&Origen=" + pOrigen + "&TipoDcto=" + pTipoDcto, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return rGetConsecut[0];

  
}

async function getTipoDcto(pEmpresa) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rGetTipoDcto = await fetch(WebApiServer + "api/Certificados/GetTipoCertifica?Empresa=" + pEmpresa, requestOptions)
        .then(response => response.json());


    console.log(rGetTipoDcto);

    return rGetTipoDcto;
}

async function getListaClientes(pEmpresa, pUsuario, pFiltrado) {

    

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rGetListaClientes = await fetch(WebApiServer + "api/Common/GetListaClientes?Empresa=" + pEmpresa + "&Usuario=" + pUsuario + "&Filtrado=" + pFiltrado, requestOptions)
        .then(response => response.json());

    $listaClientes.html('<optgroup label="Seleccione"></optgroup>');

    rGetListaClientes.forEach(element => {

        $listaClientes.append($('<option />', {
            value: (element.RIF),
            text: (element.NOMBRE)
        }));

    });

    $listaClientes.val(undefined);

}

async function getListaBancos(pEmpresa) {

    var cListaBancos = [], cExternos = [], cInternos = [];

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    cBancos = await fetch(WebApiServer + "api/Cartera/GetListaBancosConciliacion?Empresa=" + pEmpresa, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        

    await asyncForEach(cBancos, async (element) => {

        var cElement = {};

        if(element.ESCONSO == true){

            cElement.id = element.CODIGOCTA;
            cElement.text = `${element.MONEDA} - ${element.NOMBRE} - ${element.NROCTA}`;
            cInternos.push(cElement);

        } else {

            cElement.id = element.CODIGOCTA;
            cElement.text = `${element.MONEDA} - ${element.NOMBRE} - ${element.NROCTA}`;
            cExternos.push(cElement);

        }
    

    });

    cListaBancos.push(
        {"id": 0, text: 'Bancos Externos', children: cExternos},
        {"id": 1, text: 'Bancos Consolidez', children: cInternos}
        
    );
    
    $listaBancos.select2({
        data: cListaBancos
      });
            
    $listaBancos.val(undefined).select2();

}

async function getValReferencia(pEmpresa, pBanco, pReferencia, pTipoDcto, pDcto){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetValidarReferencia = await fetch(WebApiServer + "api/Cartera/GetValidarReferencia?Empresa=" + pEmpresa + "&Banco=" + pBanco + "&Referencia=" + pReferencia + "&TipoDcto=" + pTipoDcto + "&Dcto=" + pDcto, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return rGetValidarReferencia[0];

}



//POST de Informacion sobre el certificado
async function PostCertificado(pEmpresa, pCodigo, pFecha, pOrigen, pTipoDcto, pMonto, pNroComprob, pUrl, pRif, pDescripcion, pEstado, pCodigoCta, pMultipago, pPasswordIn) {

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    var rPostCertificado = await fetch(`${WebApiServer}api/Certificados/PostCertifica?Empresa=${pEmpresa}&Codigo=${pCodigo}&Fecha=${pFecha}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&Monto=${pMonto}&NroComprob=${pNroComprob}&UrlComprob=${pUrl}&Rif=${pRif}&Descripcion=${pDescripcion}&Estado=${pEstado}&CodigoCta=${pCodigoCta}&Multipago=${pMultipago}&PasswordIn=${pPasswordIn}`, requestOptions)
        .then(response => response.json());

    return rPostCertificado;
}

//Para montar la imagen en base de datos
async function PostImagen(pEmpresa, pUbicacion, pComprobante) {

    var formdata = new FormData();
    formdata.append("fileUpload", pComprobante.files[0]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    return await fetch(WebApiServer + "api/Upload/PostFile?Empresa=" + pEmpresa + "&Ubicacion=" + pUbicacion, requestOptions)
        .then(response => response.json());
        
}


// Sets

function setButton(pElementId, pState){

    if(pState == 1){

        $('#' + pElementId).attr("disabled", false).attr("readOnly", false).removeClass('disabled');
        
    } else if (pState == 0){

        $('#' + pElementId).attr("disabled", true).attr("readOnly", true).addClass('disabled');

    }


}

function setFecha(){

    var cFechaTiempo = new Date();
    
    var cFechaHoy = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    
    $("#input-fecha").attr("max", cFechaHoy);

    return cFechaHoy;

}

function setTipoImputacion(){

    var cTipoImputacion =   [ 
                                {
                                    "CODIGO": "0",
                                    "NOMBRE": "SIMPLE"
                                },
                                {
                                    "CODIGO": "1",
                                    "NOMBRE": "MÚLTIPLE"
                                }
                            ];

    $listaTipoImputacion.html('<optgroup label="Seleccione"></optgroup>');

    cTipoImputacion.forEach(element => {

        $listaTipoImputacion.append($('<option />', {
            value: (element.CODIGO),
            text: (element.NOMBRE)
        }));
    });

    $listaTipoImputacion.removeClass('disabled').attr("disabled", false).attr("readOnly", false).val(undefined).select2().focus();

}

function clearDatos(){

    cBanco = cMoneda = cComprobante = cMonto = cReferencia = cFecha = cRif = cCodigoCta = undefined;

    $('.datos').attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined);
    $("#input-cliente").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
    $("#input-banco").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
    $("#input-tipo-imputacion").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
    $("#preview-image").attr('src', null);
    $("#bt-guardar").attr("disabled", true).attr("readOnly", true).addClass('disabled');
    $("#bt-atras").attr("disabled", true).attr("readOnly", true).addClass('disabled');


}

function validarGuardar(){

    if(cMonto != '' && cMonto != 0 && cReferencia && cFecha && cRif && cBanco && cMultipago){

        $("#bt-guardar").attr("disabled", false).attr("readOnly", false).removeClass('disabled');

    } else {

        $("#bt-guardar").attr("disabled", true).attr("readOnly", true).addClass('disabled');

    }


}


//Input Form

$("#bt-home").click(async function () {
    userHome(cInterno);
});


$("#input-imagen").change((async function (e) {

    cComprobante = e.target;
    $("#preview-image").attr('src', URL.createObjectURL(e.target.files[0]) );
    $("#input-cliente").removeClass('disabled').attr("disabled", false).attr("readOnly", false).val(undefined).select2().focus();


}));


$("#input-cliente").on('select2:select', function () {

    cRif = this.value;

    $("#input-fecha").attr("disabled", false).attr("readonly", false).removeClass('disabled').val(cFechaLimite).select();
    $("#bt-atras").attr("disabled", false).attr("readOnly", false).removeClass('disabled');
    validarGuardar();
    
});


$("#input-fecha").blur(async function(){

    if(this.value > cFechaLimite){
       
        $("#input-cliente").focus();
        $("#input-banco").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
        $("#input-referencia").attr("disabled", true).attr("readonly", true).addClass('disabled').val(null);
        $("#input-moneda").val(undefined);
        $("#input-monto").attr("disabled", true).attr("readonly", true).addClass('disabled').val(null);
        $("#input-tipo-imputacion").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
        $("#bt-guardar").attr("disabled", true).attr("readOnly", true).addClass('disabled');

        showModal("Error", "Fecha incorrecta");
        validarGuardar();

    } else {

        cFecha = this.value;
        $("#input-banco").attr("disabled", false).attr("readonly", false).removeClass('disabled').focus();
        validarGuardar();
        
    
    }
    
});


$("#input-banco").on('select2:select', async function () {

    cBanco = cBancos.find(query => query.CODIGOCTA == this.value);

    $("#input-moneda").val(cBanco.MONEDA);
    $("#input-referencia").attr("disabled", false).attr("readonly", false).removeClass('disabled').val(undefined).select();
    validarGuardar();
    
});


$("#input-referencia").blur(async function () {

    cReferencia = $.trim(this.value);
    
    var cValReferencia = await getValReferencia(cEmpresa, cBanco, cReferencia);

    if(!cReferencia || cReferencia == "0") {

        showModal("Alerta", "El número de referencia no puede ser 0 o estar en blanco");
        $("#input-banco").select();
        $("#input-referencia").attr("disabled", true).attr("readonly", true).addClass('disabled').val(null);
        $("#input-monto").attr("disabled", true).attr("readonly", true).addClass('disabled').val(null);
        $("#input-tipo-imputacion").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
        $("#bt-guardar").attr("disabled", true).attr("readOnly", true).addClass('disabled');
        validarGuardar();

    }else if(cValReferencia.Response == 1){

        showModal("Alerta", `El número de referencia ${cReferencia} ya se encuentra registrado en la base de datos`);
        $("#input-banco").select();
        $("#input-referencia").attr("disabled", true).attr("readonly", true).addClass('disabled').val(null);
        $("#input-monto").attr("disabled", true).attr("readonly", true).addClass('disabled').val(null);
        $("#input-tipo-imputacion").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();
        $("#bt-guardar").attr("disabled", true).attr("readOnly", true).addClass('disabled');
        validarGuardar();

    } else {

        $("#input-monto").attr("disabled", false).attr("readonly", false).removeClass('disabled').mask("#,##0.00", {reverse: true}).val(0).select();
        validarGuardar();
        
    }
    
});


$("#input-monto").blur(async function () {

    cMonto = setNumeric(this.value);

    if(cMonto > 0){
 
       setTipoImputacion();
       validarGuardar();

    } else {

        showModal("Alerta", `El monto debe ser superior a 0`);
        $("#input-referencia").select();
        $("#input-tipo-imputacion").attr("disabled", true).attr("readonly", true).addClass('disabled').val(undefined).select2();    
        $("#bt-guardar").attr("disabled", true).attr("readOnly", true).addClass('disabled');
        validarGuardar();

    }
    
    
});


$("#input-tipo-imputacion").on('select2:select', async function () {

    if($("input-tipo-imputacion").val() == 1){

        cMultipago = false;

    }else{

        cMultipago = true;

    }

    validarGuardar();

});




//Guardar comprobante
$("#bt-nuevo").click(async function () {

    cFechaLimite = setFecha();

    setButton('bt-nuevo', 0);
    setButton('bt-atras', 1);

    clearDatos();
    
    $("#input-imagen").attr("disabled", false).attr("readOnly", false).removeClass('disabled').val(undefined).focus();
    

});


$("#bt-guardar").click(async function () {

    if(cMonto != '' && cMonto != 0 && cReferencia && cFecha && cRif && cBanco){
    
        var cPostImagen = await PostImagen(cEmpresa, cTitulo, cComprobante);
    
        if(cPostImagen.Response == 1){
    
            cUrlComprobante = cPostImagen.Url.replaceAll(/\\\\/g, '\\');
            
            var cPostCertificado = await PostCertificado(cEmpresa, '01', cFecha, cOrigen, "SP", cMonto, cReferencia, cUrlComprobante, cRif, cDescripcion, '1', cBanco.CODIGOCTA, cMultipago, cUsuario);     
    
            if(cPostCertificado == 1){
    
               clearDatos();
               setButton('bt-nuevo', 1);
               setButton('bt-atras', 0);
    
               showModal('Mensaje', 'El comprobante fue guardado con éxito');
    
    
            } else {
    
                showModal("Error", "Se presentó un error al guardar el comprobante, por favor intente de nuevo");
    
            }
    
        } else {
    
    
            showModal("Error", "Se presentó un error al guardar la imagen, por favor intente de nuevo");
    
            
        }
    
    } else {

        showModal("Error", "Se presentó un error al guardar el comprobante, los datos estan incompletaos, por favor verifique e intente de nuevo");

    }
    
});


$("#bt-atras").click(async function () {

    clearDatos();

    setButton('bt-nuevo', 1);
    setButton('bt-atras', 0);
    
});


$(document).ready(function(){

    $("#bt-nuevo").attr("disabled", false).attr("readOnly", false).removeClass('disabled');
    getListaBancos(cEmpresa);
    getListaClientes(cEmpresa, cUsuario, cFiltrado);
    

});




