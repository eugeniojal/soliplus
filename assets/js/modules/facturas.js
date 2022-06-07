// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cOrigen = sessionStorage.getItem("Origen");
var cModulo = sessionStorage.getItem("Modulo");
var cTipoDcto =  sessionStorage.getItem("TipoDcto");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cTitulo = sessionStorage.getItem("Titulo");

var $listaClientes  = $('#input-cliente');
var $listaTipoVenta = $('#input-tipo-venta');
var $listaProductos = $('#input-popup-producto');
var $btAtras = $("#bt-atras");

var cNroDcto, cControlPrecioCarga, cModificaPrecio, cConsecut, cEsManual, cFecha, cTipoVenta, cDatosClente, cTasaCambio, cPlazo, cProceso, cDctoRef, cConsecutCs, cPostTradeCs, cPostMvTradeCs, cPutTradeCxS,
    cDetalleDocumento, cPorDescuento, cFechaInicial, cFechaFinal, cFechaVencimiento, cValidar, cDocumento, cProducto, cCodigoTipoDctoCs, cTipoDctoCs, cPostMvTrade, cPostTrade, 
    cCsNroDcto, cMovimiento, cLinea, cValPostMvTrade, cConsecutCs, cPutTrade;

var cTipoInvSistema, cProductoCxsUs, cProductoCxsBs;
var cVariables = [], cProductos = [], cProductosSistema = [];
var cMovimientoAprobado = [], cMovimientoRechazado = [];





//Variables para el cáculo del pedido basado en el movimiento 


var cTotalMontoBruto, cMontoDescuento, cTotalMontoIva, cTotalMontoReteIva, cTotalMontoReteFuente;       // Variables para almacenar los subtotales del documento en bolívares
var cMontoIvaUs, cMontoReteIvaUs, cMontoReteFuenteUs, cMontoBrutoUs;                                    // Variables para el cálculo del monto de dólares
var cMontoIvaUsBs, cMontoReteIvaUsBs, cMontoReteFuenteUsBs, cMontoBrutoUsBs;                            // Variables para el cálculo del monto de dólares que se pagaran en bolívares
var cMontoIvaBs, cMontoReteIvaBs, cMontoReteFuenteBs, cMontoBrutoBs;                                    // Variables para el cálculo del monto de bolívares
var cMontoTotalNetoUs, cMontoTotalNetoUsBs, cMontoTotalNetoBs, cMontoTotalNeto;                         // Variables para almacenar el valor neto de acuerdo a cada tipo de precio 
var cTotalBruto, cTotalNeto, cTotalPagoBs, cTotalPagoUs;                                                // Variable para almacenar el valor bruto en dólares convertido a bolívares
var cCodigoPlacas, cProductoPlacas, cCantidadPlacas, cPlacas;                                           // Variables para el cálculo de la cantidad de placas



// Variables para el cálculo del costo por servicio

var cPorCostoServicioUs, cMontoCostoServicioUs, cPorIvaCostoServicioUs, cPorReteIvaCostoServicioUs;
var cPorRefuenteCostoServicioUs, cMontoIvaCostoServicioUs, cMontoReteIvaCostoServicioUs;
var cMontoReteFuenteCostoServicioUs, cMontoTotalCostoServicioUs;

var cPorCostoServicioBs, cMontoCostoServicioBs, cPorIvaCostoServicioBs, cPorReteIvaCostoServicioBs;
var cPorRefuenteCostoServicioBs, cMontoIvaCostoServicioBs, cMontoReteIvaCostoServicioBs; 
var cMontoReteFuenteCostoServicioBs, cMontoTotalCostoServicioBs;


// Funciones Comunes

async function setFecha(){

    var cFechaTiempo = new Date();
    cFecha = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);

    $("#input-fecha").val(cFecha);

}

async function setFechaVencimiento(pFecha, pPlazo){

    cFechaInicial = moment(pFecha);    
    cFechaFinal = cFechaInicial.add(pPlazo, 'days'); 
    cFechaVencimiento = cFechaFinal.format().substr(0,10);

    $("#input-fecha-vencimiento").val(cFechaVencimiento);

}

async function getVariables(pEmpresa, pModulo){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        cVariables = await fetch(WebApiServer + "api/Common/GetVariables?Empresa=" + pEmpresa + "&Modulo=" + pModulo, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
   

}

function progressBar(pProgress) {

    $(".progress-bar").css("width", pProgress + "%").text(pProgress + "%");
   
}

function validarEstructuraExcel(pExcelKeys){

    var cValidadorEsctructura = true;

    var cValidKeys = [
        "Codigo",
        "Descripcion",
        "Precio US",
        "Precio US BS",
        "Precio BS",
        "Cantidad"
    ];


    cValidKeys.forEach(element => {

        if($.inArray(element, pExcelKeys) == -1){

            cValidadorEsctructura = false;

        }

    });

    return cValidadorEsctructura;

}







// Funciones para obtener datos

async function getConsecut(pEmpresa, pOrigen, pTipoDcto){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetConsecut = await fetch(WebApiServer + "api/Common/GetConsecut?Empresa="+pEmpresa+"&Origen="+ pOrigen +"&TipoDcto="+pTipoDcto, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    if(pTipoDcto != cTipoDctoCs){
    cConsecut = rGetConsecut[0].CONSECUT;
    cEsManual = rGetConsecut[0].CONSMANUAL;
    } else {

        return rGetConsecut[0].CONSECUT;

    }
}

async function getListaClientes(pEmpresa, pUsuario, pFiltrado){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaClientes = await fetch(WebApiServer + "api/Common/GetListaClientes?Empresa=" + pEmpresa +"&Usuario=" + pUsuario + "&Filtrado=" + pFiltrado, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  
    $listaClientes.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaClientes, async (element) => { 

        $listaClientes.append($('<option />', {
            value: (element.RIF),
            text: (element.NOMBRE)
        }));

    });

    $("#input-cliente").val(undefined);
    $('#input-cliente').select2();

}

async function getCliente(pEmpresa, pCliente){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetCliente = await fetch(WebApiServer + "api/Common/GetCliente?Empresa="+pEmpresa+"&Cliente="+ pCliente, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  
    return rGetCliente[0];
 
}

async function getListaTipoVenta(pEmpresa){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaTipoVenta = await fetch(WebApiServer + "api/Facturas/GetListaTipoVenta?Empresa="+pEmpresa, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    $listaTipoVenta.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaTipoVenta, async (element) => { 

        $listaTipoVenta.append($('<option />', {
            value: (element.TIPOVTA),
            text: (element.NOMBRE)
        }));


    });

    $("#input-tipo-venta").val(undefined);
    $('#input-tipo-venta').select2();

}

async function getTipoVenta(pEmpresa, pTipoVenta){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetTipoVenta = await fetch(WebApiServer + "api/Facturas/GetTipoVenta?Empresa="+pEmpresa+"&TipoVenta="+ pTipoVenta , requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return rGetTipoVenta[0];

}

async function getTasaCambio(pEmpresa, pFecha){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetTasaCambio = await fetch(`${WebApiServer}api/Common/GetTasaCambio?Empresa=${pEmpresa}&Fecha=${pFecha}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    
    if( (cProceso == 1 || cProceso == 2)){

        if(rGetTasaCambio){

            return formatNumber(rGetTasaCambio[0].VALOR);

        }
        

    } else {

        return 0;

    }


}

async function getProductosTipoVenta(pEmpresa, pRif, pTipoVta){

    cProductos = [];

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetProductosTipoVenta = await fetch(`${WebApiServer}api/Common/GetProductosTipoVenta?Empresa=${pEmpresa}&Rif=${pRif}&TipoVta=${pTipoVta}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    $listaProductos.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetProductosTipoVenta, async (element) => { 

        cProductos.push(element);

        $listaProductos.append($('<option />', {
            value: (element.CODIGO),
            text: (`${element.CODIGO} - ${element.DESCRIPCIO}`)
        }));

    });

    $listaProductos.val(undefined).select2();


}

async function getProductosTipoInventario(pEmpresa, pTipoInv){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetProductosTipoInv = await fetch(`${WebApiServer}api/Common/GetProductosTipoInventario?Empresa=${pEmpresa}&TipoInv=${pTipoInv}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return rGetProductosTipoInv;

}

async function getValDctoRef(pEmpresa, pDctoRef){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetValDctoRef = await fetch(WebApiServer + "api/Facturas/GetDctoRef?Empresa="+pEmpresa+"&DctoRef="+pDctoRef, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));


    return rGetValDctoRef[0].Response;

}

async function getTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto){


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetTrade = await fetch(WebApiServer + "api/Facturas/GetTrade?Empresa="+pEmpresa+"&Origen="+pOrigen+"&TipoDcto="+pTipoDcto+"&NroDcto="+pNroDcto, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        return rGetTrade[0];

}

async function getMvTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetMvTrade = await fetch(WebApiServer + "api/Facturas/GetMvTrade?Empresa="+pEmpresa+"&Origen="+pOrigen+"&TipoDcto="+pTipoDcto+"&NroDcto="+pNroDcto, requestOptions)
                                .then(response => response.json())
                                .catch(error => console.log('error', error));

        rGetMvTrade.forEach(element => {

            element.CANTIDAD    =   formatNumber(element.CANTIDAD);
            element.PRECIOUS    =   formatNumber(element.PRECIOUS);
            element.PRECIOUSBS  =   formatNumber(element.PRECIOUSBS);
            element.PRECIOBS    =   formatNumber(element.PRECIOBS);
            element.PRETE       =   formatNumber(element.PRETE);
            element.IVA         =   formatNumber(element.IVA);
            element.PRETIVA     =   formatNumber(element.PRETIVA);
            element.BRUTOUS     =   formatNumber(element.BRUTOUS);
            element.BRUTOUSBS   =   formatNumber(element.BRUTOUSBS);
            element.BRUTOBS     =   formatNumber(element.BRUTOBS);

        });

        return rGetMvTrade;

}

async function getPrecio(pEmpresa, pRif, pProducto){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

    var rGetPrecio = await fetch(WebApiServer + "api/Maestros/GetListaPrecio?Empresa="+pEmpresa+"&Rif="+pRif+"&Producto="+pProducto, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    console.log(rGetPrecio);
    
    return rGetPrecio[0];

}

async function getDetalleDocumento(pEmpresa, pOrigen, pTipoDcto, pNroDcto){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

    var rGetDetalleDocumento = await fetch(`${WebApiServer}api/Facturas/GetDetalleDocumento?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
    
    return rGetDetalleDocumento[0];

}

async function getPlacas(){

    cCodigoPlacas   = await cVariables.find(query => query.CAMPO == 'PRODUCTOPLACAS');
    cProductoPlacas = await cProductos.find(query => query.CODIGO == cCodigoPlacas.VALOR);

}

async function getMaestros(){

    // await getProductos(cEmpresa);
    await getVariables(cEmpresa, cModulo); 
    await getListaClientes(cEmpresa, cUsuario, cFiltrado);
    await getListaTipoVenta(cEmpresa);
    await getTipoDctoCs();

    cTipoInvSistema = cVariables.find(query => query.CAMPO == 'TIPOINVSISTEMA');
    cModificaPrecio = cVariables.find(query => query.CAMPO == 'MODVALORUNIT');
    cControlPrecioCarga = cVariables.find(query => query.CAMPO == 'CTRLPRECIOCARGAR');
    cProductosSistema = await getProductosTipoInventario(cEmpresa, cTipoInvSistema.VALOR);

    

    var cCodProductoCxsUs = cVariables.find(query => query.CAMPO == 'PRODUCTOCXSUS');
    var cCodProductoCxsBs = cVariables.find(query => query.CAMPO == 'PRODUCTOCXSBS');

    cProductoCxsUs = cProductosSistema.find(query => query.CODIGO == cCodProductoCxsUs.VALOR);
    cProductoCxsBs = cProductosSistema.find(query => query.CODIGO == cCodProductoCxsBs.VALOR);
    
}

async function getMvtoGrid(){

    var jsonMovimiento = JSON.stringify($("#jsGridMovimiento").jsGrid("option", "data"));
    rGetMvtoGrid = JSON.parse(jsonMovimiento);
    return rGetMvtoGrid;

}

async function getTradeValidarDocumento(pEmpresa, pOrigen, pTipoDcto, pNroDcto){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetTradeValidarDocumento = await fetch(`${WebApiServer}api/Facturas/GetTradeValidarDocumento?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    console.log(rGetTradeValidarDocumento[0]);
    return rGetTradeValidarDocumento[0];

}

async function getTipoDctoCs(){

    cCodigoTipoDctoCs   = await cVariables.find(query => query.CAMPO == 'TIPODCTOCXS');
    cTipoDctoCs = cCodigoTipoDctoCs.VALOR;

}

function showModalConfirmar(pTitulo, pMensaje){

    cConfirmar = undefined;

    $("#md-confirmar .modal-title").html(pTitulo);
    $("#md-confirmar .modal-body").html(pMensaje);
    $("#md-confirmar").modal("show");


    $('#modal-btn-confirmar').click(async function() {
        // now we grab it from the modal
    
        var rPutAnular = await putAnularPedido(cEmpresa, cTipoDcto, cNroDcto, cUsuario);

        if(rPutAnular == 1){

            clearDatos();
            setBotones("enable");

            $(".movimiento").attr("disabled", true); 
            $("#bt-atras").attr("disabled", true);
            $("#bt-guardar").attr("disabled", true);
            $("#md-confirmar").modal("hide");

            showModal("Mensaje", `Documento anulado correctamente`);

        } else {

            showModal("Error", `No es posible anular el documento, por favor intentelo nuevamente`);


        }


    });
   
}





// Funciones para establecer datos

async function setTitulo(pTitulo){

    $("#lb-titulo").html('INGRESO DE ' + pTitulo);

    //document.title = cOrigen + ' ' + cTitulo;

}

function setBotones(pState){

    $("#label-tipodcto").html(cTipoDcto);

    if(pState == "enable"){

        $("#bt-nuevo").attr("disabled", false);
        $("#bt-nuevo").removeClass('disabled');

        $("#bt-modificar").attr("disabled", false);
        $("#bt-modificar").removeClass('disabled');
       
        $("#bt-consultar").attr("disabled", false);
        $("#bt-consultar").removeClass('disabled');

        $("#bt-anular").attr("disabled", false);
        $("#bt-anular").removeClass('disabled');


    } else if(pState == "disable"){

       $("#bt-nuevo").attr("disabled", true);
       $("#bt-nuevo").addClass('disabled');

       $("#bt-modificar").attr("disabled", true);
       $("#bt-modificar").addClass('disabled');

       $("#bt-consultar").attr("disabled", true);
       $("#bt-consultar").addClass('disabled');

       $("#bt-anular").attr("disabled", true);
       $("#bt-anular").addClass('disabled');

    }

}

async function setConsecut(){

    setBotones("disable");

    $("#bt-atras").attr("disabled", false).removeClass('disabled');

    if(cEsManual == false){

        if(cProceso == 1){

            cNroDcto = cConsecut + 1;

            $("#input-cliente").attr("disabled", false);
            $("#input-cliente").attr("readOnly", false);
            $("#input-cliente").removeClass('disabled');

            $("#input-cliente").select();

        } else if (cProceso != 1) {

            cNroDcto = cConsecut;

            $("#input-nrodcto").attr("disabled", false);
            $("#input-nrodcto").attr("readOnly", false);
            $("#input-nrodcto").removeClass('disabled');

            $("#input-nrodcto").select();

        }
           
        $("#input-nrodcto").val(cNroDcto).select();

    
    } else {

        $("#input-nrodcto").attr("disabled", false);
        $("#input-nrodcto").attr("readOnly", false);
        $("#input-nrodcto").removeClass('disabled');

        $("#input-nrodcto").select();

    }

}

function clearDatos(){

    cMovimientoAprobado = [];

    $(".datos").attr("disabled", true).attr("readOnly", true).val(undefined);
    $(".subtotal").attr("disabled", true).attr("readOnly", true).val(undefined);
    $('#input-cliente').select2();
    $('#input-tipo-venta').select2();

    $("#bt-agregar").attr("disabled", true);
    $("#jsGridMovimiento").jsGrid("loadData");

}

async function valGuardar(){

    var cMovimiento = await getMvtoGrid();

    if(cMovimiento.length > 0){
    
        $("#bt-guardar").attr("disabled", false).removeClass('disabled');

    } else {

        $("#bt-guardar").attr("disabled", true).addClass('disabled');

    }
}

async function postTrade(pEmpresa, pOrigen, pTipoDcto,  pNroDcto,   pPedido, 
                         pDctoRef, pRif,    pFechaDcto, pFechaVcto, pFechaTasaCambio, pPasswordIn, 
                         pTasaCambio, pPorDescuento, pTipoVta, pTasaInt, pPorReteInt, pTasaMora, 
                         pTotalUs, pTotalBs, pMontoUs, pPorIvaUs, pPorRetivaUs, 
                         pPorIslrUs, pMontoUsBs, pPorIvaUsBs, pPorRetivaUsBs, pPorIslrUsBs, 
                         pMontoBs, pPorIvaBs, pPorRetivaBs, pPorIslrBs){
    
    try{

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
          };
                                                     
        var rPostTrade = await fetch(`${WebApiServer}api/Facturas/PostTrade?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Pedido=${pPedido}&DctoRef=${pDctoRef}&Rif=${pRif}&FechaDcto=${pFechaDcto}&FechaVcto=${pFechaVcto}&FechaTasaCambio=${pFechaTasaCambio}&PasswordIn=${pPasswordIn}&TasaCambio=${pTasaCambio}&PorDescuento=${pPorDescuento}&TipoVta=${pTipoVta}&TasaInt=${pTasaInt}&PorReteInt=${pPorReteInt}&TasaMora=${pTasaMora}&TotalUs=${pTotalUs}&TotalBs=${pTotalBs}&mUs=${pMontoUs}&pIvaUs=${pPorIvaUs}&pRetivaUs=${pPorRetivaUs}&pIslrUs=${pPorIslrUs}&mUsBs=${pMontoUsBs}&pIvaUsBs=${pPorIvaUsBs}&pRetivaUsBs=${pPorRetivaUsBs}&pIslrUsBs=${pPorIslrUsBs}&mBs=${pMontoBs}&pIvaBs=${pPorIvaBs}&pRetivaBs=${pPorRetivaBs}&pIslrBs=${pPorIslrBs}`, requestOptions)
                               .then(response => response.json())
                               .catch(error => console.log('error', error));

        return rPostTrade;
    }

    catch(e){

       return e;

    }

}

async function putTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pPedido, 
    pDctoRef, pRif, pFechaDcto, pFechaVcto, pFechaTasaCambio,
    pPasswordMo, pTasaCambio, pTipoCar, pTipoVta, pTasaInt, 
    pPorReteInt, pPorDescuento, pTasaMora, pTotalUs, pTotalBs){

    var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    };

    var rPutTrade = await fetch(
    `${WebApiServer}api/Facturas/PutTrade?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Pedido=${pPedido}&DctoRef=${pDctoRef}&Rif=${pRif}&FechaDcto=${pFechaDcto}&FechaVcto=${pFechaVcto}&FechaTasaCambio=${pFechaTasaCambio}&PasswordMo=${pPasswordMo}&TasaCambio=${pTasaCambio}&TipoCar=${pTipoCar}&TipoVta=${pTipoVta}&TasaInt=${pTasaInt}&PorReteInt=${pPorReteInt}&PorDescuento=${pPorDescuento}&TasaMora=${pTasaMora}&TotalUs=${pTotalUs}&TotalBs=${pTotalBs}`,
    requestOptions
    )

    .then((response) => response.json())
    .catch((error) => console.log("error", error));

return rPutTrade;

}

async function putAnularPedido(pEmpresa, pTipoDcto, pNroDcto, pPasswordMo){

    var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    };

    var rputAnularPedido = await fetch(
    `${WebApiServer}api/Cartera/PutAnularPedido?Empresa=${pEmpresa}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&PasswordMo=${pPasswordMo}`,
    requestOptions
    )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

    return rputAnularPedido;

}


async function putAnularCxS(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pPasswordMo){

    var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    };

    var rPutAnularCxS = await fetch(
    `${WebApiServer}api/Facturas/PutAnularCxS?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&PasswordMo=${pPasswordMo}`,
    requestOptions
    )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

    return rPutAnularCxS;

}

async function postMvTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pRif, pFecha, 
                           pProducto, pNombre, pCodRete, pPrete, pTariva, pIva, pPreteniva, pCodUbica, 
                           pCantidad, pPrecioUs, pPrecioUsBs, pPrecioBs, 
                           pIntegrado, pNorden, pNota, pNrobono, pPasswordin){

    try{

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        var rPostMvTrade = await fetch(`${WebApiServer}api/Facturas/PostMvTrade?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Rif=${pRif}&Fecha=${pFecha}&Producto=${pProducto}&Nombre=${pNombre}&CodRete=${pCodRete}&Prete=${pPrete}&Tariva=${pTariva}&Iva=${pIva}&Preteniva=${pPreteniva}&CodUbica=${pCodUbica}&Cantidad=${pCantidad}&PrecioUs=${pPrecioUs}&PrecioUsBs=${pPrecioUsBs}&PrecioBs=${pPrecioBs}&Integrado=${pIntegrado}&Norden=${pNorden}&Nota=${pNota}&Nrobono=${pNrobono}&Passwordin=${pPasswordin}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
        
        return rPostMvTrade;

    } catch(e){

        return e;

    }

}

async function deleteTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto){

    try{

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${WebApiServer}api/Facturas/DeleteTrade?Empresa=${pEmpresa}&Origen=${pOrigen}&NroDcto=${pNroDcto}&TipoDcto=${pTipoDcto}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    } catch(e){

        console.log(e);

    }

}

async function deleteMvTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto){

    try{

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        var rDeleteMvTrade = await fetch(`${WebApiServer}api/Facturas/DeleteMvTrade?Empresa=${pEmpresa}&Origen=${pOrigen}&NroDcto=${pNroDcto}&TipoDcto=${pTipoDcto}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        return rDeleteMvTrade;

    } catch(e){

        console.log(e);

    }

}

async function guardar(){

    cPostMvTrade = cPostTrade = cCsNroDcto = cMovimiento = cLinea = cConsecutCs = cConsecutCs = cCsNroDcto = cPostTradeCs = cPostMvTradeCs = cPostMvTrade = cPostTrade = cCsNroDcto = cPutTrade = cPutTradeCxS = undefined;

    cValPostMvTrade = 0;
    // Proceso 1 Nuevo Documento 

    if(cProceso == 1){

        if(cEsManual == false){

            await getConsecut(cEmpresa,cOrigen,cTipoDcto);    
            cNroDcto = cConsecut + 1;
            
        } else {

            cNroDcto = $("#input-nrodcto").val();

        }

        cPostTrade = await postTrade( cEmpresa, cOrigen, cTipoDcto, cNroDcto, '0', 
                                      cDctoRef, cDatosCliente.RIF, cFecha, cFechaVencimiento, cFecha, cUsuario, 
                                      cTasaCambio, cPorDescuento, cTipoVenta.TIPOVTA, cTipoVenta.TASA, '0', cTipoVenta.TASAMORA, cTotalPagoUs, cTotalPagoBs, 
                                      '0', '0', '0', '0',
                                      '0', '0', '0', '0',
                                      '0', '0', '0', '0');

        if(cPostTrade == 1){

            cMovimiento = await getMvtoGrid();

            cLinea = 0;
            

            await asyncForEach(cMovimiento, async element => {

                cLinea += 1;

                cPostMvTrade = await postMvTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cDatosCliente.RIF, cFecha, 
                                                 element.PRODUCTO, element.DESCRIPCIO, 
                                                 element.CODRETE, setNumeric(element.PRETE), 
                                                 element.TARIVA, setNumeric(element.IVA), setNumeric(element.PRETIVA), '0', 
                                                 setNumeric(element.CANTIDAD), setNumeric(element.PRECIOUS), setNumeric(element.PRECIOUSBS), setNumeric(element.PRECIOBS), 
                                                 'false', cLinea, cTipoDcto+cNroDcto, '0', cUsuario);
                
                if(cPostMvTrade != 1){

                    cValPostMvTrade = 1;

                }

            });

        


            if(cValPostMvTrade == 0 && (cMontoTotalCostoServicioUs != 0 || cMontoTotalCostoServicioBs != 0)){

                cConsecutCs = await getConsecut(cEmpresa, cOrigen, cTipoDctoCs);
                cCsNroDcto = cConsecutCs + 1;
        
                cPostTradeCs = await postTrade(cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto, cNroDcto, cDctoRef, cDatosCliente.RIF, cFecha, cFechaVencimiento, cFecha, cUsuario,
                    '0', '0', cTipoVenta.TIPOVTA, '0', '0', '0', cMontoTotalCostoServicioUs, '0',
                    '0', '0', '0', '0',
                    '0', '0', '0', '0',
                    '0', '0', '0', '0'
                );
        
                cPostMvTradeCs = await postMvTrade(cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto, cDatosCliente.RIF, cFecha,
                    cProductoCxsUs.CODIGO, cProductoCxsUs.DESCRIPCIO,
                    cProductoCxsUs.CODRETE, setNumeric(cProductoCxsUs.PRETE),
                    cProductoCxsUs.CODTARIVA, setNumeric(cProductoCxsUs.IVA), setNumeric(cDatosCliente.PRETIVA), '0',
                    1, cMontoTotalCostoServicioUs, 0, 0,
                    'false', 1, cTipoDctoCs + cCsNroDcto, '0', cUsuario);
        
        
                if (cPostTradeCs == 1 && cPostMvTradeCs == 1) {
        
                    clearDatos();
                    setBotones("enable");
        
                    $(".movimiento").attr("disabled", true);
                    $("#bt-atras").attr("disabled", true);
                    $("#bt-guardar").attr("disabled", true);
        
                    showModal("Mensaje", `Se grabaron los siguientes documentos: ${cTipoDcto}: ${cNroDcto} - CS: ${cCsNroDcto}`);
        
        
                } else {
        
                    await deleteMvTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
                    await deleteTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
        
        
                    await deleteMvTrade(cEmpresa, cOrigen, 'CS', cCsNroDcto);
                    await deleteTrade(cEmpresa, cOrigen, 'CS', cCsNroDcto);
        
        
                    showModal("Error", 'No es posible grabar el documento, por favor intentelo nuevamente');
        
                }
                            
            } else if (cValPostMvTrade == 1){

                await  deleteMvTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
                await  deleteTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
                

                showModal("Error", 'No es posible grabar el documento, por favor intentelo nuevamente');

            } else {

                clearDatos();
                setBotones("enable");
                
                $(".movimiento").attr("disabled", true); 
                $("#bt-atras").attr("disabled", true);
                $("#bt-guardar").attr("disabled", true);
        
                showModal("Mensaje", `Se grabó el documento ${cTipoDcto}: ${cNroDcto}`);
            }

        } else {

            showModal("Error", 'No es posible grabar el documento, por favor intentelo nuevamente');

        }

       

    } 
    
    // Proceso 2 Modificar

    else if (cProceso == 2){

        // actualizar la tabla trade
        cPutTrade = await putTrade(
          cEmpresa,
          cOrigen,
          cTipoDcto,
          cNroDcto,
          '0',                       //5
          cDctoRef,
          cDatosCliente.RIF,
          cFecha,
          cFechaVencimiento,
          cFecha,                   //10
          cUsuario,
          cTasaCambio,
          cDatosCliente.TIPOCAR,
          cTipoVenta.TIPOVTA,
          cTipoVenta.TASA,          //15
          0, 
          cPorDescuento,
          cTipoVenta.TASAMORA,
          cTotalPagoUs,
          cTotalPagoBs              //20
        );

        // si actualizar trade no da error
        if(cPutTrade == 1){

            // Borrar movimiento
            await deleteMvTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
            
            // Grabar nuevo movimiento
            cMovimiento = await getMvtoGrid();
            cLinea = 0;
                
                await asyncForEach(cMovimiento, async element => {

                    cValPostMvTrade = 0;
                    cLinea += 1;

                    cPostMvTrade = await postMvTrade(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cDatosCliente.RIF, cFecha, 
                                                    element.PRODUCTO, element.DESCRIPCIO, 
                                                    element.CODRETE, setNumeric(element.PRETE), 
                                                    element.TARIVA, setNumeric(element.IVA), setNumeric(element.PRETIVA), '0', 
                                                    setNumeric(element.CANTIDAD), setNumeric(element.PRECIOUS), setNumeric(element.PRECIOUSBS), setNumeric(element.PRECIOBS), 
                                                    'false', cLinea, cTipoDcto+cNroDcto, '0', cUsuario);
                    
                    if(cPostMvTrade != 1){

                        cValPostMvTrade = 1;

                    }

                });


             
            // Si grabar movimiento no devuleve error 
            if(cValPostMvTrade == 0){

                    // Existía CxS y continúa existiendo
                if(cDetalleDocumento.NROCXS != 0 && (cMontoTotalCostoServicioUs != 0 || cMontoTotalCostoServicioBs != 0)){

                    cCsNroDcto = cDetalleDocumento.NROCXS;
                    
                    // Actualizar Trade CxS
                    cPutTradeCxS = await putTrade(cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto, cNroDcto, cDctoRef, cDatosCliente.RIF, cFecha, cFechaVencimiento, cFecha, cUsuario, 
                                                '0', '0', cTipoVenta.TIPOVTA, '0', '0', '0', '0', cMontoTotalCostoServicioUs, '0'); 

                    if(cPutTradeCxS == 1){

                        // Borrar MvTrade
                        await  deleteMvTrade(cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto);

                        // Grabar nuevo Movimiento
                        cPostMvTradeCs = await postMvTrade( cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto, cDatosCliente.RIF, cFecha, 
                                        cProductoCxsUs.CODIGO, cProductoCxsUs.DESCRIPCIO, 
                                        cProductoCxsUs.CODRETE, setNumeric(cProductoCxsUs.PRETE), 
                                        cProductoCxsUs.TARIVA, setNumeric(cProductoCxsUs.IVA), setNumeric(cDatosCliente.PRETIVA), '0', 
                                        1, cMontoTotalCostoServicioUs, 0, 0, 
                                        'false', 1, cTipoDctoCs+cCsNroDcto, '0', cUsuario);                                       
                        

                        if(cPostMvTradeCs == 1){

                        clearDatos();
                        setBotones("enable");

                        $(".movimiento").attr("disabled", true); 
                        $("#bt-atras").attr("disabled", true);
                        $("#bt-guardar").attr("disabled", true);

                        showModal("Mensaje", `Los documentos: ${cTipoDcto}: ${cNroDcto} - CS: ${cCsNroDcto}, fueron actualizados`);

                        } else {

                            showModal("Error", 'No es posible grabar el documento, por favor intentelo nuevamente');

                        }


                    } else {

                        showModal("Error", 'No es posible grabar el documento, por favor intentelo nuevamente');

                    }
                   


                } 

                // No existe CxS y se requiere CxS
                else if(cDetalleDocumento.NROCXS == 0 && (cMontoTotalCostoServicioUs != 0 || cMontoTotalCostoServicioBs != 0)){

                    cConsecutCs = await getConsecut(cEmpresa, cOrigen, cTipoDctoCs);
                    cCsNroDcto = cConsecutCs + 1;
            
                    cPostTradeCs = await postTrade(cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto, cNroDcto, cDctoRef, cDatosCliente.RIF, cFecha, cFechaVencimiento, cFecha, cUsuario,
                        '0', '0', cTipoVenta.TIPOVTA, '0', '0', '0', cMontoTotalCostoServicioUs, '0',
                        '0', '0', '0', '0',
                        '0', '0', '0', '0',
                        '0', '0', '0', '0'
                    );
            
                    cPostMvTradeCs = await postMvTrade(cEmpresa, cOrigen, cTipoDctoCs, cCsNroDcto, cDatosCliente.RIF, cFecha,
                        cProductoCxsUs.CODIGO, cProductoCxsUs.DESCRIPCIO,
                        cProductoCxsUs.CODRETE, setNumeric(cProductoCxsUs.PRETE),
                        cProductoCxsUs.CODTARIVA, setNumeric(cProductoCxsUs.IVA), setNumeric(cDatosCliente.PRETIVA), '0',
                        1, cMontoTotalCostoServicioUs, 0, 0,
                        'false', 1, cTipoDctoCs + cCsNroDcto, '0', cUsuario);
            
            
                    if (cPostTradeCs == 1 && cPostMvTradeCs == 1) {
            
                        clearDatos();
                        setBotones("enable");
            
                        $(".movimiento").attr("disabled", true);
                        $("#bt-atras").attr("disabled", true);
                        $("#bt-guardar").attr("disabled", true);
            
                        showModal("Mensaje", `Se actualizó el documento ${cTipoDcto}: ${cNroDcto} y se grabó CS: ${cCsNroDcto}`);
            
            
                    } else {
            
                        showModal("Error", 'No es posible grabar el documento, por favor intentelo nuevamente');
            
                    }

                }
                
                // Existe CxS y No se requiere CxS
                else if(cDetalleDocumento.NROCXS != 0 && (cMontoTotalCostoServicioUs == 0 || cMontoTotalCostoServicioBs == 0)){

                    var cAnularCxS = await putAnularCxS(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cUsuario);
                    
                    cCsNroDcto = cDetalleDocumento.NROCXS;

                    if(cAnularCxS == 1){

                        clearDatos();
                        setBotones("enable");
      
                        $(".movimiento").attr("disabled", true); 
                        $("#bt-atras").attr("disabled", true);
                        $("#bt-guardar").attr("disabled", true);
    
                        showModal("Mensaje", `El documento ${cTipoDcto}: ${cNroDcto} fue actualizado y el CS: ${cCsNroDcto} fue anulado`);

                    } else {

                        showModal('Error', 'No fue posible actualizar el documento, por favor intene nuevamente');

                    }

                }
                // No existé CxS y no
                else {
                    
                    clearDatos();
                    setBotones("enable");
  
                    $(".movimiento").attr("disabled", true); 
                    $("#bt-atras").attr("disabled", true);
                    $("#bt-guardar").attr("disabled", true);

                    showModal("Mensaje", `El documento: ${cTipoDcto}: ${cNroDcto}, fue actualizado`);
                    

                }

            } else {

                await showModal('Error','No fue posible actualizar el documento, por favor intene nuevamente');

            }

        } else {

            await showModal('Error','No fue posible actualizar el documento, intene nuevamente, si el error persiste cominíquese con el área encargada');

        }

    } 
    
    // Proceso 4 Anular
    
    else if(cProceso == 4){

        // Proceso 4 Anular Documento

        showModalConfirmar("Alerta", "¿Desea anular el documento?");

    }

}

async function setPlacas(){
    
    var cMovimiento = await getMvtoGrid();

    cCantidadPlacas = 0;

    await asyncForEach(cMovimiento, async element => {

        if(element.PLACAS == true){

            cCantidadPlacas += setNumeric(element.CANTIDAD);

        }

    });

    if(cPlacas){

        $("#jsGridMovimiento").jsGrid("deleteItem", cPlacas, confirm);

    }

    if(cCantidadPlacas > 0){

        cPlacas = {

            PRODUCTO:      cProductoPlacas.CODIGO,
            DESCRIPCIO:    cProductoPlacas.DESCRIPCIO,
            PLACAS:        cProductoPlacas.PLACAS,
            CODRETE:       cProductoPlacas.CODRETE,
            CANTIDAD:      formatNumber(cCantidadPlacas),
            PRECIOUS:      formatNumber(cProductoPlacas.PRECIOUS),
            PRECIOUSBS:    formatNumber(cProductoPlacas.PRECIOUSBS),
            PRECIOBS:      formatNumber(cProductoPlacas.PRECIOBS),
            PRETE:         formatNumber(cProductoPlacas.PRETE),
            TARIVA:        cProductoPlacas.CODTARIVA,
            IVA:           formatNumber(cProductoPlacas.IVA),
            PRETIVA:       formatNumber(cDatosCliente.PRETIVA),
            BRUTOUS:       formatNumber(cCantidadPlacas * cProductoPlacas.PRECIOUS),
            BRUTOUSBS:     formatNumber(cCantidadPlacas * cProductoPlacas.PRECIOUSBS),
            BRUTOBS:       formatNumber(cCantidadPlacas * cProductoPlacas.PRECIOBS),
    
        };
        
        await $("#jsGridMovimiento").jsGrid("insertItem", cPlacas);

    }

    await setTotales();

}

async function setTotales(){

    if(cTipoVenta){

        cTasaCambio = setNumeric(cTasaCambio) || 1;

        cMontoBrutoUs   = cMontoDescuentoUs   = cMontoIvaUs   = cMontoReteIvaUs   = cMontoReteFuenteUs   = 0;
        cMontoBrutoUsBs = cMontoDescuentoUsBs = cMontoIvaUsBs = cMontoReteIvaUsBs = cMontoReteFuenteUsBs = 0;
        cMontoBrutoBs   = cMontoDescuentoBs   = cMontoIvaBs   = cMontoReteIvaBs   = cMontoReteFuenteBs   = 0;

        cTotalMontoBruto = cTotalMontoDescuento = cTotalMontoIva = cTotalMontoReteIva = cTotalMontoReteFuente = 0;
        cSubtotal2 = cSubtotal3 = cMontoTotalBs = 0;
        cTotalBruto = cTotalPagoUs = cTotalPagoBs = 0;

        var cMovSetTotales = await getMvtoGrid();

        await asyncForEach(cMovSetTotales, async element => {

            // Cálculo del Valor Neto En Bolívares -- se debe convertir todos lo valores a la moneda local

            if(element.PRODUCTO != 'PLACAS'){
            // Cálculos Monto Bruto en Dólares
            
                cMontoBrutoUs        += setNumeric(element.BRUTOUS);
                cMontoDescuentoUs    += setNumeric(element.BRUTOUS) * (cPorDescuento / 100);
                cMontoIvaUs          += setNumeric(element.BRUTOUS) * (1 - cPorDescuento / 100) * (setNumeric(element.IVA)/100);
                cMontoReteIvaUs      += setNumeric(element.BRUTOUS) * (1 - cPorDescuento / 100) * (setNumeric(element.IVA)/100) * (setNumeric(element.PRETIVA)/100);
                cMontoReteFuenteUs   += setNumeric(element.BRUTOUS) * (1 - cPorDescuento / 100) * (setNumeric(element.PRETE)/100);

                // Cálculos Monto Bruto en Dólares que se pagan en Bolívares
                cMontoBrutoUsBs      += setNumeric(element.BRUTOUSBS);
                cMontoDescuentoUsBs  += setNumeric(element.BRUTOUSBS) * (cPorDescuento / 100);
                cMontoIvaUsBs        += setNumeric(element.BRUTOUSBS) * (1 - cPorDescuento / 100) * (setNumeric(element.IVA)/100);
                cMontoReteIvaUsBs    += setNumeric(element.BRUTOUSBS) * (1 - cPorDescuento / 100) * (setNumeric(element.IVA)/100) * (setNumeric(element.PRETIVA)/100);
                cMontoReteFuenteUsBs += setNumeric(element.BRUTOUSBS) * (1 - cPorDescuento / 100) * (setNumeric(element.PRETE)/100);

                // Cálculos Monto Bruto en Bolívares
                cMontoBrutoBs        += setNumeric(element.BRUTOBS);
                cMontoDescuentoBs    += setNumeric(element.BRUTOBS) * (cPorDescuento / 100);
                cMontoIvaBs          += setNumeric(element.BRUTOBS) * (1 - cPorDescuento / 100) * (setNumeric(element.IVA)/100);
                cMontoReteIvaBs      += setNumeric(element.BRUTOBS) * (1 - cPorDescuento / 100) * (setNumeric(element.IVA)/100) * (setNumeric(element.PRETIVA)/100);
                cMontoReteFuenteBs   += setNumeric(element.BRUTOBS) * (1 - cPorDescuento / 100) * (setNumeric(element.PRETE)/100);

            } else {

                cMontoBrutoUs        += setNumeric(element.BRUTOUS);
                cMontoIvaUs          += setNumeric(element.BRUTOUS) * (setNumeric(element.IVA)/100);
                cMontoReteIvaUs      += setNumeric(element.BRUTOUS) * (setNumeric(element.IVA)/100) * (setNumeric(element.PRETIVA)/100);
                cMontoReteFuenteUs   += setNumeric(element.BRUTOUS) * (setNumeric(element.PRETE)/100);

                // Cálculos Monto Bruto en Dólares que se pagan en Bolívares
                cMontoBrutoUsBs      += setNumeric(element.BRUTOUSBS);
                cMontoIvaUsBs        += setNumeric(element.BRUTOUSBS) * (setNumeric(element.IVA)/100);
                cMontoReteIvaUsBs    += setNumeric(element.BRUTOUSBS) * (setNumeric(element.IVA)/100) * (setNumeric(element.PRETIVA)/100);
                cMontoReteFuenteUsBs += setNumeric(element.BRUTOUSBS) * (setNumeric(element.PRETE)/100);

                // Cálculos Monto Bruto en Bolívares
                cMontoBrutoBs        += setNumeric(element.BRUTOBS);
                cMontoIvaBs          += setNumeric(element.BRUTOBS) * (setNumeric(element.IVA)/100);
                cMontoReteIvaBs      += setNumeric(element.BRUTOBS) * (setNumeric(element.IVA)/100) * (setNumeric(element.PRETIVA)/100);
                cMontoReteFuenteBs   += setNumeric(element.BRUTOBS) * (setNumeric(element.PRETE)/100);

            }

        });


        // Calculos para el total de documento en bolívares

        cTotalMontoBruto      = ((cMontoBrutoUs * cTasaCambio) + (cMontoBrutoUsBs * cTasaCambio) + cMontoBrutoBs);
        cTotalMontoDescuento  = ((cMontoDescuentoUs * cTasaCambio) +  (cMontoDescuentoUsBs * cTasaCambio) + cMontoDescuentoBs);
        cTotalMontoIva        = ((cMontoIvaUs * cTasaCambio) + (cMontoIvaUsBs * cTasaCambio) + cMontoIvaBs);
        cTotalMontoReteIva    = ((cMontoReteIvaUs * cTasaCambio) + (cMontoReteIvaUsBs * cTasaCambio) + cMontoReteIvaBs);
        cTotalMontoReteFuente = ((cMontoReteFuenteUs * cTasaCambio) + (cMontoReteFuenteUsBs * cTasaCambio) + cMontoReteFuenteBs);

        cSubtotal2 = cTotalMontoBruto - cTotalMontoDescuento;
        cSubtotal3 = cSubtotal2 + cTotalMontoIva - cTotalMontoReteIva;
        cMontoTotalBs = cSubtotal3 - cTotalMontoReteFuente;

        cTotalBruto  = (cMontoBrutoUs - cMontoDescuentoUs) * cTasaCambio;
        cTotalPagoUs = (cMontoBrutoUs - cMontoDescuentoUs).toFixed(2);
        cTotalPagoBs = (cMontoTotalBs - cTotalBruto).toFixed(2);

        $("#total-monto-bruto").val(formatNumber(cTotalMontoBruto));
        $("#total-monto-descuento").val(formatNumber(cTotalMontoDescuento));
        $("#subtotal-2").val(formatNumber(cSubtotal2));
        $("#total-monto-iva").val(formatNumber(cTotalMontoIva));
        $("#total-monto-reteiva").val(formatNumber(cTotalMontoReteIva));
        $("#subtotal-3").val(formatNumber(cSubtotal3));
        $("#total-monto-retefuente").val(formatNumber(cTotalMontoReteFuente));
        $("#total-monto-bs").val(formatNumber(cMontoTotalBs));

        $("#monto-tasa-cambio").val(formatNumber(cTasaCambio));
        $("#monto-total-us-bs").val(formatNumber(cTotalBruto));
        $("#total-cobro-us").val(formatNumber(cTotalPagoUs));
        $("#total-cobro-bs").val(formatNumber(cTotalPagoBs));

        /*

        // Subtotal Monto Cuota Inicial
        var cPorCuotaInicial = (parseFloat(cTipoVenta.INICIAL / 100) || 0);
        var cValCuotaIncial = (parseFloat(cSubtotalUS * cPorCuotaInicial) || 0);

        $("#cuota-inicial-us").val(formatNumber(cValCuotaIncial));
        $("#cuota-inicial-us").mask("#,##0.00", {reverse: true});


        // Subtotal Monto Intereses
        var cTasaInteres = (parseFloat(cTipoVenta.TASA) || 0);
        var cValInteres = (parseFloat(((cTasaInteres/100)/12)*(cSubtotalUS-cValCuotaIncial)) || 0);

        $("#intereses-us").val(formatNumber(cValInteres));
        $("#intereses-us").mask("#,##0.00", {reverse: true});

        */
        
        

        cPorCostoServicioUs = cMontoCostoServicioUs = cPorIvaCostoServicioUs = cPorReteIvaCostoServicioUs = 0;
        cPorRefuenteCostoServicioUs = cMontoIvaCostoServicioUs = cMontoReteIvaCostoServicioUs = 0;
        cMontoReteFuenteCostoServicioUs = cMontoTotalCostoServicioUs = 0;

        cPorCostoServicioBs = cMontoCostoServicioBs = cPorIvaCostoServicioBs = cPorReteIvaCostoServicioBs = 0;
        cPorRefuenteCostoServicioBs = cMontoIvaCostoServicioBs = cMontoReteIvaCostoServicioBs = 0; 
        cMontoReteFuenteCostoServicioBs = cMontoTotalCostoServicioBs = 0;


        // Monto Costo x Servicio Dólares
        cPorCostoServicioUs = cTipoVenta.PCOSTSERUS / 100;
        cMontoCostoServicioUs = cTotalPagoUs * cPorCostoServicioUs; 

        $("#monto-costo-servicio-us").val(formatNumber(cMontoCostoServicioUs)).mask("#,##0.00", {reverse: true});


        cPorIvaCostoServicioUs = cProductoCxsUs.IVA/100;
        cPorReteIvaCostoServicioUs = cDatosCliente.PRETIVA/100;
        cPorRefuenteCostoServicioUs = cProductoCxsUs.PRETE/100;

        cMontoIvaCostoServicioUs = cMontoCostoServicioUs * cPorIvaCostoServicioUs;
        cMontoReteIvaCostoServicioUs = cMontoIvaCostoServicioUs * cPorReteIvaCostoServicioUs; 
        cMontoReteFuenteCostoServicioUs = cMontoCostoServicioUs * cPorRefuenteCostoServicioUs;

        cMontoTotalCostoServicioUs = (cMontoCostoServicioUs + cMontoIvaCostoServicioUs - cMontoReteIvaCostoServicioUs - cMontoReteFuenteCostoServicioUs).toFixed(2);

        $("#monto-iva-costo-servicio-us").val(formatNumber(cMontoIvaCostoServicioUs)).mask("#,##0.00", {reverse: true});
        $("#monto-reteiva-costo-servicio-us").val(formatNumber(cMontoReteIvaCostoServicioUs)).mask("#,##0.00", {reverse: true});
        $("#subtotal-2-costo-servicio-us").val(formatNumber(cMontoCostoServicioUs + cMontoIvaCostoServicioUs - cMontoReteIvaCostoServicioUs)).mask("#,##0.00", {reverse: true});
        $("#monto-retencion-islr-costo-servicio-us").val(formatNumber(cMontoReteFuenteCostoServicioUs)).mask("#,##0.00", {reverse: true});
        $("#total-costo-servicio-us").val(formatNumber(cMontoTotalCostoServicioUs)).mask("#,##0.00", {reverse: true});

        if(cProceso != 3){

            valGuardar(cTotalPagoUs, cTotalPagoBs);

        }

    }

}

// Funciones JsGrid

// Movimiento
$(function() {

    $("#jsGridMovimiento").jsGrid({       
        height: "auto",
        width: "100%",
        autoload: true,
        responsive: true,
        paging: false,
        confirmDeleting: false,
        noDataContent: '',
        controller: {
            loadData: function() {
                return cMovimientoAprobado;
            }
        },
        rowClick: async function(args) {
            if(cProceso == 1 || cProceso == 2){
                showDetailsDialog("Edit", args.item);
            }
        },
        onItemInserted: async function(args){

            if(args.item.PRODUCTO != cProductoPlacas.CODIGO){
                await setPlacas();
            }

        },
        onItemUpdated: async function(args){

            if(args.item.PRODUCTO != cProductoPlacas.CODIGO){
                await setPlacas();
            }

        },
        onItemDeleted: async function(args){

            if(args.item.PRODUCTO != cProductoPlacas.CODIGO){
                await setPlacas();
            }

        },
        onDataLoaded: async function() {

            await setTotales();

        },   
        fields: [ 
            { name: "PRODUCTO",    type: "text",   title: "PRODUCTO",     width: "10%",  headercss: "text-center text-primary", align: "left"  },
            { name: "DESCRIPCIO",  type: "text",   title: "DESCRIPCION",  width: "15%",  headercss: "text-center text-primary", align: "left"  },
            { name: "CANTIDAD",    type: "number", title: "CANTIDAD",     width: "6%",   headercss: "text-center text-primary", align: "right" },
            { name: "PRETE",       type: "number", title: "ISLR",         width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "IVA",         type: "number", title: "IVA",          width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "PRETIVA",     type: "number", title: "RETEIVA",      width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "PRECIOUS",    type: "number", title: "PRECIO US",    width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "PRECIOUSBS",  type: "number", title: "PRECIO US BS", width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "PRECIOBS",    type: "number", title: "PRECIO BS",    width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "BRUTOUS",     type: "number", title: "BRUTO US",     width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "BRUTOUSBS",   type: "number", title: "BRUTO US BS",  width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "BRUTOBS",     type: "number", title: "BRUTO BS",     width: "7%",   headercss: "text-center text-primary", align: "right" },
            { name: "PLACAS",      type: "text",   visible: false },
            { name: "CODRETE",     type: "text",   visible: false },
            { name: "TARIVA",      type: "text",   visible: false },
            {
                type: "control",
                width: "6%",
                editButton: false,
                headerTemplate: function() {
    
                    return $("<button>").attr("id", "bt-agregar").attr("type", "button").attr("class", "btn btn-primary btn-sm disabled").attr("style", "font-size: 10px").text("Agregar")
                    .on("click", async function () {  
    
                            $("#input-popup-producto").val(null);
                            showDetailsDialog("Add", {});

                    });
                }
            }
        ]

    });
    
    $("#detailsDialog").dialog({
        autoOpen: false,
        width: 700,
        close: function() {
            $("#detailsForm").validate().resetForm();
            $("#detailsForm").find(".error").removeClass("error");
        }
    });
    
    $("#detailsForm").validate({
        rules: {

            "input-popup-producto": "required",
            "input-popup-descripcion": "required",
            "input-popup-cantidad": setNumeric({ required: true, min: 1 })
        },
        messages: {
            
            "input-popup-producto": "Seleccione un producto",
            "input-popup-descripcion": "Ingrese una descripción",
            "input-popup-cantidad": "Ingrese una cantidad mayor a cero"

        },
        submitHandler: function() {
            formSubmitHandler();
        }
    });
    
    var showDetailsDialog = async function(dialogType, record) {
       
        if(cModificaPrecio.VALOR == '1'){

            $('.precio-unitario').attr('disabled', false);

        } else if(cProceso == 1 || cProceso == 2){

            cProducto = await cProductos.find(query => query.CODIGO ==  record.PRODUCTO);

            $("#input-popup-producto").val(record.PRODUCTO).select2();
            $("#input-popup-descripcion").val(record.DESCRIPCIO);
            $("#input-popup-cantidad").val(record.CANTIDAD).mask("#,##0.00", {reverse: true});
            $("#input-popup-precio-us").val(record.PRECIOUS).mask("#,##0.00", {reverse: true});
            $("#input-popup-precio-usbs").val(record.PRECIOUSBS).mask("#,##0.00", {reverse: true});
            $("#input-popup-precio-bs").val(record.PRECIOBS).mask("#,##0.00", {reverse: true});
            $("#input-popup-islr").val(record.PRETE).mask("#,##0.00", {reverse: true});
            $("#input-popup-iva").val(record.IVA).mask("#,##0.00", {reverse: true});
            $("#input-popup-retiva").val(record.PRETIVA).mask("#,##0.00", {reverse: true});
            $("#input-popup-bruto-us").val(record.BRUTOUS).mask("#,##0.00", {reverse: true});
            $("#input-popup-bruto-usbs").val(record.BRUTOUSBS).mask("#,##0.00", {reverse: true});
            $("#input-popup-bruto-bs").val(record.BRUTOBS).mask("#,##0.00", {reverse: true});

            formSubmitHandler = async function() {
                saveRecord(record, dialogType === "Add");
            };
        
            $("#detailsDialog").dialog("option", "title", "Detalle Movimiento").dialog("open");
        
        }
    };
    
    var saveRecord = async function(record, isNew) {

        $.extend(record, {
            PRODUCTO:      $("#input-popup-producto").val(),
            DESCRIPCIO:    $("#input-popup-descripcion").val(),
            PLACAS:        cProducto.PLACAS,
            CANTIDAD:      formatNumber($("#input-popup-cantidad").val()),
            PRECIOUS:      $("#input-popup-precio-us").val(),
            PRECIOUSBS:    $("#input-popup-precio-usbs").val(),
            PRECIOBS:      $("#input-popup-precio-bs").val(),
            CODRETE:       cProducto.CODRETE,
            PRETE:         $("#input-popup-islr").val(),
            TARIVA:        cProducto.CODTARIVA,
            IVA:           $("#input-popup-iva").val(),
            PRETIVA:       $("#input-popup-retiva").val(),
            BRUTOUS:       $("#input-popup-bruto-us").val(),
            BRUTOUSBS:     $("#input-popup-bruto-usbs").val(),
            BRUTOBS:       $("#input-popup-bruto-bs").val()
        });

        $("#jsGridMovimiento").jsGrid(isNew ? "insertItem" : "updateItem", record);
            
        $("#detailsDialog").dialog("close");
       
    }; 

});

jsGrid.setDefaults("control", {
    _createDeleteButton: function (item) {
        if (cProceso == 3 || cProceso == 4) return;

         return this._createGridButton(this.deleteButtonClass, this.deleteButtonTooltip, function (grid, e) {
            grid.deleteItem(item);
            e.stopPropagation();
        });
    }
});

// Rechazados
$(function() {
    $("#jsGridRechazados").jsGrid({       
        height: "auto",
        width: "100%",
        autoload: true,
        sorting: true,
        responsive: true,
        noDataContent: '',
        controller: {
            loadData: function() {
                return cMovimientoRechazado;
            }
        },
        fields: [ 
            { name: "ID",           type: "number", title: "ID",            width: "10%",   headercss: "text-center text-primary",  align: "center"  },
            { name: "PRODUCTO",     type: "text",   title: "PRODUCTO",      width: "10%",   headercss: "text-center text-primary",  align: "left"    },
            { name: "DESCRIPCIO",   type: "text",   title: "DESCRIPCION",   width: "20%",   headercss: "text-center text-primary",  align: "left"    },
            { name: "CANTIDAD",     type: "number", title: "CANTIDAD",      width: "10%",   headercss: "text-center text-primary",  align: "right"   },
            { name: "PRECIOUS",     type: "number", title: "PRECIO US",     width: "10%",   headercss: "text-center text-primary",  align: "right"   },
            { name: "PRECIOUSBS",   type: "number", title: "PRECIO USBS",   width: "10%",   headercss: "text-center text-primary",  align: "right"   },
            { name: "ERROR",        type: "text",   title: "ERROR",         width: "30%",   headercss: "text-center text-primary",  align: "left"    },
        ]

    });

    $("#rechazados").removeClass("visually-hidden");

});


$(document).ready(function(){
    
    cInicio = 0;
    setTitulo(cTitulo);
    setBotones("enable");
    getMaestros();

});





// Comportamiento de los botones encabezado documento

$("#bt-nuevo").click(async function () {

    cProceso = 1;
    await getConsecut(cEmpresa, cOrigen,cTipoDcto);
    await setConsecut();
    setBotones("disable");

});


$("#bt-modificar").click(async function () {

    cProceso = 2;

    await getConsecut(cEmpresa,cOrigen,cTipoDcto);
    await setConsecut();

});


$("#bt-consultar").click(async function () {

    cProceso = 3;

    await getConsecut(cEmpresa,cOrigen,cTipoDcto);
    await setConsecut();


});


$("#bt-anular").click(async function () {

    cProceso = 4;

    await getConsecut(cEmpresa,cOrigen,cTipoDcto);
    await setConsecut();

    $("#bt-guardar").addClass("btn btn-danger");
 
});


$("#bt-atras").click(async function () {

    clearDatos();
    setBotones("enable");
 
    $(".movimiento").attr("disabled", true); 
    $("#bt-atras").attr("disabled", true);
    $("#bt-guardar").attr("disabled", true);
    $("#bt-guardar").removeClass("btn btn-danger").addClass("btn btn-primary disabled").attr("disabled", true);


});


$("#bt-guardar").click(async function (){
    
    await guardar(); 
    
});






// Comportamiento Campos Encabezado

$("#input-nrodcto").blur(async function(event){

    cDetalleDocumento = undefined;

    if($btAtras[0] !== event.relatedTarget) { 

        if(cProceso != 1){

            cNroDcto = this.value;

            if(cNroDcto != 0){

                cDocumento = await getTrade(cEmpresa, cOrigen, cTipoDcto, this.value);

                if(cDocumento){
                
                    cDetalleDocumento = await getDetalleDocumento(cEmpresa, cOrigen, cTipoDcto, this.value);

                    if(cDetalleDocumento.CANTABONOS == 0 || cProceso == 3){

                        if(cDocumento.ANULADO == 0 || cProceso == 3){

                            cMovimientoAprobado = await getMvTrade(cEmpresa, cOrigen, cTipoDcto, this.value);

                            cDatosCliente = await getCliente(cEmpresa, cDocumento.RIF);
                            cTipoVenta = await getTipoVenta(cEmpresa, cDocumento.TIPOVTA);
                            
                            await getProductosTipoVenta(cEmpresa, cDatosCliente.RIF, cDocumento.TIPOVTA);
                            await getPlacas();
                            
                            cTasaCambio = cDocumento.TCAMBIO;
                            cFecha = cDocumento.FECHA.substr(0,10);
                            cFechaVencimiento = cDocumento.FECHA1.substr(0,10);
                            cPorDescuento = cDocumento.PORDESC;
                            
                            cPlacas =  await cMovimientoAprobado.find(query => query.PRODUCTO == cProductoPlacas.CODIGO);
        
                            $(this).attr("disabled", true);
        
                    
                            if(cProceso == '2'){
        
                                $(".encabezado").attr("disabled", false).attr("readOnly", false);
                                $(".movimiento").attr("disabled", false).removeClass('disabled');
                                //$(".nomodificar").attr("disabled", true).attr("readOnly", true);
        
                            }
                            
                            
                            $("#input-cliente").val(cDocumento.RIF).select2();
                            $("#input-documento-referencia").val(cDocumento.DCTOREF).focus();
                            $("#input-fecha").val(cFecha);
                            $("#input-fecha-vencimiento").val(cFechaVencimiento);
                            $("#input-tipo-venta").val(cDocumento.TIPOVTA).select2();
                            $("#input-tasa-cambio").val(formatNumber(cDocumento.TCAMBIO)).mask("#,##0.00", {reverse: true});
                            $("#input-tasa-descuento").val(formatNumber(cPorDescuento)).mask("#,##0.00", {reverse: true});
        
                            await $("#jsGridMovimiento").jsGrid("loadData");
        
                        } else {

                            showModal("Alerta", "El documento está anulado");

                        }

                    } else {

                        showModal("Alerta", "El documento tiene abonos");

                    }
                
                }  else {

                    showModal("Alerta", "El documento ingresado no existe");
                
                }

            } else {

                showModal("Alerta", "No existen documentos asociados al tipo de documento seleccionado");
                
            }

        } else if (cProceso == 1 && cEsManual == true && this.value){

            var cValDcto = await getTradeValidarDocumento(cEmpresa, cOrigen, cTipoDcto, this.value);

            if(cValDcto.RESPONSE == 0){
            
                $(this).attr("disabled", true).attr("readOnly", true);
                $("#input-cliente").attr("disabled", false).attr("readOnly", false).removeClass('disabled').focus();

            } else {

                showModal("Error", "El documento ingresado ya existe");

            }

        }

    }

});

$("#input-cliente").change(async function(){

    if(cProceso == 1){
        
        await setFecha();

        cFecha  =  $("#input-fecha").val();
        
        cDatosCliente = await getCliente(cEmpresa, this.value);
        cTasaCambio = await getTasaCambio(cEmpresa, cFecha);
        cPorDescuento = 0;

        $("#input-tasa-cambio").val(formatNumber(cTasaCambio)).mask("#,##0.00", {reverse: true});
        $("#input-tasa-descuento").val(formatNumber(cPorDescuento)).mask("#,##0.00", {reverse: true});
        $("#input-documento-referencia").attr("disabled", false).attr("readOnly", false).focus();


    } else if (cProceso == 2){

        cDatosCliente = await getCliente(cEmpresa, this.value);

    }

});

$("#input-documento-referencia").blur(async function(event){

    if($btAtras[0] !== event.relatedTarget) { 

        cDctoRef = this.value;
    
        if(this.value == '' || this.value == undefined){

            showModal("Error", "El documento referencia no puede estar vacio");

        }else if(cProceso == 1 || (cProceso == 2 && cDctoRef != cDocumento.DCTOREF)){

            if(await getValDctoRef(cEmpresa, cDctoRef) == '1'){

                showModal("Error", "El documento referencia ingresado ya existe");
                
            }

            $("#input-tipo-venta").attr("disabled", false).attr("readOnly", false).focus();

        }

    }

});

$("#input-tipo-venta").change(async function(){

    cTipoVenta = await getTipoVenta(cEmpresa, this.value);
    cFecha = $("#input-fecha").val();
    cPlazo = cTipoVenta.PLAZO;
    
    await getProductosTipoVenta(cEmpresa, cDatosCliente.RIF, this.value);
    await setFechaVencimiento(cFecha, cPlazo);
    await getPlacas();  

    if(cProceso == 2){

        var cMovimiento = await getMvtoGrid();

        console.log(cMovimiento);
        
        cMovimientoAprobado = [];

        await asyncForEach(cMovimiento, async element => {

            var cProducto = await cProductos.find(query => query.CODIGO == (element.PRODUCTO));

            if(cProducto && cProducto.CODIGO != cProductoPlacas.CODIGO){

                cMovimientoAprobado.push(element);
            }

        });

        await $("#jsGridMovimiento").jsGrid("loadData");
        
    }

    await setPlacas();
    await setTotales();

    $(".encabezado").attr("disabled", false).removeClass('disabled').attr("readOnly", false);
    $(".movimiento").attr("disabled", false).removeClass('disabled');
    $("#input-fecha").focus();
   
});

$("#input-fecha").change(async function(){

    if(cProceso == 1 || cProceso == 2){

        cTasaCambio = await getTasaCambio(cEmpresa, this.value);
        cFecha = this.value;

        console.log(cTasaCambio, cFecha);

        $("#input-tasa-cambio").val(formatNumber(cTasaCambio)).mask("#,##0.00", {reverse: true});

        await setFechaVencimiento(cFecha, cPlazo);
        await setTotales();
    
    }

});

$("#input-tasa-cambio").blur(async function(){

    cTasaCambio = this.value;
    await setTotales();

});

$("#input-tasa-descuento").blur(async function(){

    cPorDescuento = setNumeric(this.value);

    await setTotales();

});






// Comportamiento botones movimiento

$("#bt-movimiento").click(async function () {

    $(".datos").attr("disabled", true).attr("readOnly", true);
    $("#bt-agregar").attr("disabled", false).removeClass('disabled');
    $("#bt-cargar").attr("disabled", true);
    $(this).attr("disabled", true);
    
});

$("#bt-limpiar").click(async function () {

    cMovimientoRechazado = [];
    cMovimientoAprobado = [];

    $("#bt-agregar").attr("disabled", true);
    $("#bt-cargar").attr("disabled", false);
    $("#bt-movimiento").attr("disabled", false);


    await $("#jsGridRechazados").jsGrid("loadData");
    await $("#jsGridMovimiento").jsGrid("loadData");
    await valGuardar();


});

$("#bt-cargar").click(async function () {

    cMovimientoRechazado = [];
    cMovimientoAprobado = [];

    $(".datos").attr("disabled", true).attr("readOnly", true);
    $("#bt-movimiento").attr("disabled", true);

    await $("#jsGridRechazados").jsGrid("loadData");
    progressBar(0);
    
    $("#alert-carga-excel").css("display","none");
    $("#input-cargar-excel").val(null);
    $("#rechazados").addClass("visually-hidden");    
    $("#md-cargar-excel").modal("show");

});

$("#input-cargar-excel").change(async function (evt) {

    cMovimientoRechazado = [];
    cMovimientoAprobado = [];

    var cLineaExcel, cRechazado, cAprobado, cTotalRegistros, cContador,cProgress;

    selectedFile = evt.target.files[0];    
    reader = new FileReader();

    reader.onload = async function (event) {

        var data = event.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        var cExcelObject = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        var cExcelKeys = Object.keys(cExcelObject[0]);        
        var cValidarEstructura = validarEstructuraExcel(cExcelKeys);
        
        cLineaExcel = 2;
        cTotalRegistros = cContador = cProgress = 0;
        cTotalRegistros = cExcelObject.length;

        if(cValidarEstructura == true){

            await asyncForEach(cExcelObject, async element => {
                
                cContador += 1;

                cProgress = setNumeric(((cContador / cTotalRegistros) * 100).toFixed(2));

                progressBar(cProgress);

                if(element.Descripcion && element.Codigo){

                    var cProducto = await cProductos.find(query => query.CODIGO == (element.Codigo).toString().trim());
                    
                    if(cProducto != undefined){

                        if(cControlPrecioCarga.VALOR == '1' && (element['Precio US'] != cProducto.PRECIOUS || element['Precio US BS'] != cProducto.PRECIOUSBS)){
    
                            cRechazado = {
    
                                ID: cLineaExcel,
                                PRODUCTO: element.Codigo.toString().trim(),
                                DESCRIPCIO: element.Descripcion.trim(),
                                PRECIOUS: formatNumber(element['Precio US']),
                                PRECIOUSBS: formatNumber(element['Precio US BS']),
                                CANTIDAD: formatNumber(element.Cantidad),
                                ERROR: 'Los precios no coinciden'
        
                            };
    
                            cMovimientoRechazado.push(cRechazado);
    
                        } else if (element.Cantidad == 0){
    
                            cRechazado = {
    
                                ID: cLineaExcel,
                                PRODUCTO: element.Codigo.toString().trim(),
                                DESCRIPCIO: element.Descripcion.trim(),
                                PRECIOUS: formatNumber(element['Precio US']),
                                PRECIOUSBS: formatNumber(element['Precio US BS']),
                                CANTIDAD: formatNumber(element.Cantidad),
                                ERROR: 'Cantidad igual a 0'
        
                            };
    
                            cMovimientoRechazado.push(cRechazado);
    
                        } else {
    
                            cAprobado = {
                            
                                PRODUCTO: cProducto.CODIGO,
                                DESCRIPCIO: element.Descripcion.trim(),
                                PLACAS: cProducto.PLACAS,
                                PRECIOUS: formatNumber(element['Precio US']),
                                PRECIOUSBS: formatNumber(element['Precio US BS']),
                                PRECIOBS: formatNumber(element['Precio BS']),
                                CANTIDAD: formatNumber(element.Cantidad),
                                CODRETE: cProducto.CODRETE,
                                PRETE: formatNumber(cProducto.PRETE),
                                TARIVA: cProducto.CODTARIVA,
                                IVA: formatNumber(cProducto.IVA),
                                PRETIVA: formatNumber(cDatosCliente.PRETIVA),
                                BRUTOUS: formatNumber(element.Cantidad * element['Precio US']),
                                BRUTOUSBS: formatNumber(element.Cantidad * element['Precio US BS']),
                                BRUTOBS: formatNumber(element.Cantidad * element['Precio BS'])
    
                            };
    
                            cMovimientoAprobado.push(cAprobado);
    
                        }
    
                    } else {
    
                        cRechazado = {
    
                            ID: cLineaExcel,
                            PRODUCTO: element.Codigo.toString().trim(),
                            DESCRIPCIO: element.Descripcion.trim(),
                            PRECIOUS: formatNumber(element['Precio US']),
                            PRECIOUSBS: formatNumber(element['Precio US BS']),
                            CANTIDAD: formatNumber(element.Cantidad),
                            ERROR: 'El Producto no existe en la base de datos'
    
                        };
    
                        cMovimientoRechazado.push(cRechazado);
    
                    }
    
                    cProducto = undefined;
    
                } 
    
                cLineaExcel += 1;
    
            });   
            
            if(cMovimientoRechazado.length > 0){
    
                $("#lb-resultado-carga-excel").text(`Se rechazaron ${cMovimientoRechazado.length} items`);
                $("#alert-carga-excel").removeClass().addClass('alert-warning fade show').show();
            
    
            } else {
    
                $("#lb-resultado-carga-excel").text('Todos los productos se han agregado correctamente');
                $("#alert-carga-excel").removeClass().addClass('alert-success fade show').show();
    
            }
    
            await $("#jsGridRechazados").jsGrid("loadData");
            await $("#jsGridMovimiento").jsGrid("loadData");
            await setPlacas();

        } else {

            await $("#jsGridRechazados").jsGrid("loadData");
            $("#lb-resultado-carga-excel").text('La estructura del archivo cargado no coincide con la estructura requerida');
            $("#alert-carga-excel").removeClass().addClass('alert-danger fade show').show();

        }

    };

    reader.onerror = function (evt) {

        console.error(
            "No es posible leer del archivo! - Código de Error: " + evt.target.error.code
        );
    };

    reader.readAsBinaryString(selectedFile);

});





// Comportamiento campos popup movimiento

$("#input-popup-producto").on('select2:select', async function () {

    cProducto = await cProductos.find(query => query.CODIGO == this.value);

    $("#input-popup-precio-us").val(formatNumber(cProducto.PRECIOUS)).mask("#,##0.00", {reverse: true});
    $("#input-popup-precio-usbs").val(formatNumber(cProducto.PRECIOUSBS)).mask("#,##0.00", {reverse: true});
    $("#input-popup-precio-bs").val(formatNumber(cProducto.PRECIOBS)).mask("#,##0.00", {reverse: true});
    
    $("#input-popup-islr").val(formatNumber(cProducto.PRETE)).mask("#,##0.00", {reverse: true});
    $("#input-popup-iva").val(formatNumber(cProducto.IVA)).mask("#,##0.00", {reverse: true});
    $("#input-popup-retiva").val(formatNumber(cDatosCliente.PRETIVA)).mask("#,##0.00", {reverse: true});

    $("#input-popup-cantidad").val(formatNumber(0)).mask("#,##0.00", {reverse: true});
    $("#input-popup-descripcion").val(cProducto.DESCRIPCIO).select();
  
});

$(".calcular-precio").blur(function () {

    var cBrutoUs   =   setNumeric($("#input-popup-precio-us").val()) * setNumeric($("#input-popup-cantidad").val());
    var cBrutoUsBs = setNumeric($("#input-popup-precio-usbs").val()) * setNumeric($("#input-popup-cantidad").val());
    var cBrutoBs   =   setNumeric($("#input-popup-precio-bs").val()) * setNumeric($("#input-popup-cantidad").val());

    $("#input-popup-bruto-us").val(formatNumber(cBrutoUs));
    $("#input-popup-bruto-usbs").val(formatNumber(cBrutoUsBs));
    $("#input-popup-bruto-bs").val(formatNumber(cBrutoBs));


});