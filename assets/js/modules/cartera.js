// Variables
var cEmpresa = sessionStorage.getItem("Empresa");
var cOrigen = sessionStorage.getItem("Origen");
var cModulo = sessionStorage.getItem("Modulo");
var cTipoDcto =  sessionStorage.getItem("TipoDcto");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cTitulo = sessionStorage.getItem("Titulo");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var $listaReferencia = $('#input-referencia');
var $listaBancos = $('#input-banco');
var $listaFormaPago = $('#input-forma-pago');
var $listaConceptos = $('#input-popup-concepto');
var $listaDocumentos = $('#input-popup-documento');
var $listaTipoAbono = $('#input-popup-tipo-pago');

var $btAtras = $("#bt-atras");
var $btInicio = $("#bt-home");

var cNroDcto, cConsecut, cEsManual, cProceso, cDatosCliente, cDatosBanco, cFecha, cBanco, cFormaPago, cTasaCambio, cReferencia, cValorDeposito, cSaldoDeposito;
var cTipoDctoCa, cFactura, cDctoRef, cValFacturaUs, cValFacturaBs, cValAnulado, cValCruzado;
var cMoneda, cEsEfectivo, cEsValor, cValorComision, cValorComisionUs, cValorComisionBs, cValorGastoUs, cValorGastoBs, cMvTasaCambio, cMvConcepto, cConsAnticipo, cCalcularComision;

var cSaldoUs, cSaldoBs, cSaldoInteres, cSaldoIntMora;
var cBancos = [], cConceptos = [], cSaldoDetallado = [], cVariables = [], cMvGrid = [], cTotalesMovimiento = [], cMvAbono = [];

var cValorAbonadoUs = 0;
var cValorAbonadoBs = 0;

var cAbonoBs, cAbonoUs, cAbono;


// Funciones Comunes    

async function setFecha(){

    var cFechaTiempo = new Date();
    
    cFecha = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    
    $("#input-fecha").attr("max", cFecha);

}




// Funciones para obtener datos

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

async function getConsecut(pEmpresa, pOrigen, pTipoDcto){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetConsecut = await fetch(WebApiServer + "api/Common/GetConsecut?Empresa="+pEmpresa+"&Origen="+ pOrigen +"&TipoDcto="+pTipoDcto, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    cConsecut = rGetConsecut[0].CONSECUT;
    cEsManual = rGetConsecut[0].CONSMANUAL;

}

async function getConsecutAnticipo(pEmpresa){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetConsecut = await fetch(WebApiServer + "api/Common/GetConsecut?Empresa="+pEmpresa+"&Origen=FAC&TipoDcto=AN", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return setNumeric(rGetConsecut[0].CONSECUT) + 1;

}

async function getDocumentosVencidos(pEmpresa, pRif, pFecha){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var rGetDocumentosVencidos = await fetch(WebApiServer + "api/Cartera/GetDocumentosVencidos?Empresa="+ pEmpresa +"&Rif="+ pRif +"&Fecha="+ pFecha, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        return rGetDocumentosVencidos;

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

    $("#input-cliente").val(undefined).select2();

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

async function getListaReferencia(pEmpresa, pRif){
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
      
    var rGetListaReferencia = await fetch(WebApiServer + "api/Certificados/GetCertificaRifAbono?Empresa=" + pEmpresa+"&Rif=" + pRif, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    console.log(rGetListaReferencia);

    $listaReferencia.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaReferencia, async (element) => { 
    
        $listaReferencia.append($('<option />', {
            value: (element.ID),
            text: (element.NROCOMPROB)
        }));
    });

    $listaReferencia.val(undefined).select2();
}

async function getListaBancos(pEmpresa){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaBancos = await fetch(WebApiServer + "api/Cartera/GetListaBancos?Empresa="+pEmpresa, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    $listaBancos.html('<optgroup label="Seleccione"></optgroup>');

        await asyncForEach(rGetListaBancos, async (element) => { 

            cBancos.push(element);
    
            $listaBancos.append($('<option />', {
                value: (element.CODIGOCTA),
                text: (element.MONEDA + " - " + element.NOMBRE + " - " + element.NROCTA)
            }));

        });

    $listaBancos.val(undefined).select2();

}

async function getListaFormaPago(pEmpresa,pBanco){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaFormaPago = await fetch(`${WebApiServer}api/Cartera/GetListaFormaPago?Empresa=${pEmpresa}&Banco=${pBanco}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    $listaFormaPago.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaFormaPago, async (element) => {

        $listaFormaPago.append($('<option />', {
            value: (element.CODIGO),
            text: (element.NOMBRE)
        }));


    });

    $listaFormaPago.val(undefined).select2();

}

async function getValorDeposito(pEmpresa, pTipoDcto, pDcto){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetValorDeposito = await fetch(`${WebApiServer}api/Cartera/GetValorDeposito?Empresa=${pEmpresa}&TipoDcto=${pTipoDcto}&Dcto=${pDcto}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));


    return formatNumber(rGetValorDeposito[0].VALOR);

}

async function getComision(pEmpresa, pFormaPago){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetComision = await fetch(WebApiServer + "api/Cartera/GetComision?Empresa="+pEmpresa+"&FormaPago="+ pFormaPago, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));


    return rGetComision[0] || 0;    

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

async function getGastoEfectivo(pEmpresa, pTipoDctoCa, pFactura, pAbono, pPorLimite, pPorGasto){


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetGastoEfectivo = await fetch(WebApiServer + "api/Cartera/GetGastoEfectivo?Empresa=" + pEmpresa + "&TipoDcto=" + pTipoDctoCa + "&NroDcto=" + pFactura + "&Abono=" + pAbono + "&PorLimite=" + pPorLimite + "&PorGasto=" + pPorGasto, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
        return rGetGastoEfectivo[0].VALOR;


}

async function getSaldoDetallado(pEmpresa, pRif, pFecha){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetSaldoDetallado = await fetch(WebApiServer + "api/Cartera/GetSaldoDetallado?Empresa="+pEmpresa+"&Rif="+pRif+"&Fecha="+pFecha, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        var cReporteSaldoDetallado = [];

        rGetSaldoDetallado.map(item =>{

            cReporteSaldoDetallado.push({
                'ID': item.ID,
                'TIPODCTO': item.TIPODCTO,
                'NRODCTO': item.NRODCTO,
                'DCTOREF': item.DCTOREF,
                'TIPO': item.TIPO,
                "FECHA_FACTURA": item.FECHA_FACTURA ,
                "FECHA_VENCIMIENTO": item.FECHA_VENCIMIENTO,
                "SALDO_US": formatNumber(item.SALDO_US),
                "SALDO_BS": formatNumber(item.SALDO_BS),
                "TCAMBIO":  formatNumber(item.TCAMBIO),
                "INTERESES": formatNumber(item.INTERESES),
                "INTERESES_MORA": formatNumber(item.INTERESES_MORA)
            });

        });

    return cReporteSaldoDetallado;

}

async function getTasaCambio(pEmpresa, pFecha){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetTasaCambio = await fetch(WebApiServer + "api/Common/GetTasaCambio?Empresa="+pEmpresa+"&Fecha="+ pFecha, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return formatNumber(rGetTasaCambio[0].VALOR);

}

async function getConceptos(pEmpresa, pOrigen){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetConceptos = await fetch(WebApiServer + "api/Cartera/GetListaConceptos?Empresa="+pEmpresa+"&Origen="+pOrigen, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    cConceptos = [];

    $listaConceptos.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetConceptos, async (element) => { 

        cConceptos.push(element);

        $listaConceptos.append($('<option />', {
            value: (element.TIPOCPTO),
            text: (element.DESCRIPCIO)
        }));


    });

    $listaConceptos.val(undefined);



}

async function getMvtoGrid(){

    var JsonMovimiento = JSON.stringify($("#jsGridAbonos").jsGrid("option", "data"));
    rGetMvtoGrid = JSON.parse(JsonMovimiento);
    return rGetMvtoGrid;

}






// Funciones para actualizar información 

async function putConsecut(pEmpresa, pOrigen, pTipoDcto, pConsecut){

    var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rPutConsecut = await fetch(WebApiServer + "api/Common/PutConsecut?Empresa="+pEmpresa+"&Origen="+pOrigen+"&TipoDcto="+pTipoDcto+"&Consecut="+pConsecut, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return rPutConsecut;

}

async function putAnularPedido (pEmpresa, pNroDcto, pUsuario, pTipoDcto){

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var rPutAnularPedido = await fetch(WebApiServer+"api/Cartera/PutAnularPedido?Empresa="+pEmpresa+"&NroDcto="+pNroDcto+"&PasswordMo="+pUsuario+"&TipoDcto="+pTipoDcto, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        return rPutAnularPedido;

}




// Funciones para establecer datos

async function setTitulo(pTitulo){

    $("#lb-titulo").html('INGRESO DE ' + pTitulo);
    document.title = 'SoliPlus - ' + cTitulo;

}

async function setBotones(pState){

    $("#label-tipodcto").html(cTipoDcto);

    if(pState == "enable"){

        $(".crud").attr("disabled", false).removeClass('disabled');


    } else if(pState == "disable"){

       $(".crud").attr("disabled", true).addClass('disabled');

    }

}

async function setConsecut(){

    await setBotones("disable");

    $("#bt-atras").attr("disabled", false).removeClass('disabled');

    if(cEsManual == false){

        if(cProceso == 1){

            cNroDcto = cConsecut + 1;

            $("#input-cliente").attr("disabled", false);
            $("#input-cliente").attr("readOnly", false);
            $("#input-cliente").removeClass('disabled');

            $("#input-cliente").focus();
            $("#input-cliente").select();

        } else {

            cNroDcto = cConsecut;

            $("#input-nrodcto").attr("disabled", false);
            $("#input-nrodcto").attr("readOnly", false);
            $("#input-nrodcto").removeClass('disabled');

            $("#input-nrodcto").focus();
            $("#input-nrodcto").select();

        }
           
        $("#input-nrodcto").val(cNroDcto);

    
    } else {

        $("#input-nrodcto").attr("disabled", false);
        $("#input-nrodcto").attr("readOnly", false);
        $("#input-nrodcto").removeClass('disabled');

        $("#input-nrodcto").focus();
        $("#input-nrodcto").select();

    }

}

async function clearDatos(){

    cBancos = cConceptos = cSaldoDetallado = cVariables = cMvGrid = cTotalesMovimiento = cMvAbono = [];
    
    cNroDcto = cConsecut = cEsManual = cProceso = cDatosCliente = cDatosBanco = cFecha = cBanco = cFormaPago = cTasaCambio = 
    cReferencia = cValorDeposito = cSaldoDeposito = cTipoDctoCa = cFactura = cDctoRef = cValFacturaUs = cValFacturaBs = cValAnulado = 
    cValCruzado  = cMoneda = cEsEfectivo = cEsValor = cValorComision = cValorComisionUs = cValorComisionBs = cValorGastoUs = cValorGastoBs = 
    cMvTasaCambio = cMvConcepto = cConsAnticipo = cCalcularComision = cSaldoUs = cSaldoBs = cSaldoInteres = cSaldoIntMora = cValorAbonadoUs = 
    cValorAbonadoBs = cAbonoBs = cAbonoUs = cAbono = cProceso = cDatosCliente = cDatosBanco = cFecha = cBanco = cReferencia = cValorDeposito = undefined;
      

    $(".saldos").html("0,00");
    $(".datos").attr("disabled", true).attr("readOnly", true).addClass('disabled').val(undefined);
    $(".popup").attr("disabled", true).attr("readOnly", true).addClass('disabled').val(undefined);
    
    await $("#jsGridAbonos").jsGrid("option", "data", []);

}

async function setComision(pEmpresa, pBanco, pFormaPago, pValorDeposito){

    cValorComision = cValorComisionBs = cValorComisionUs = 0;

        if(pEmpresa != undefined && pBanco != undefined && pFormaPago != undefined && pValorDeposito != undefined){

            var cDatosComision = await getComision(cEmpresa, cFormaPago);
    
            if(cDatosComision != 0){

                if(cDatosComision.ESVALOR == true){
            
                    // console.log('1', cDatosComision.ESVALOR);
                    cValorComision = setNumeric(cDatosComision.VALOR);
            
            
                } else if (cDatosComision.ESVALOR == false){
            
                    // console.log('2', cDatosComision.ESVALOR);
                    cValorComision = pValorDeposito * (setNumeric(cDatosComision.VALOR)/100);
            
                } else {
            
                    // console.log('3', cDatosComision.ESVALOR);
                    cValorComision = 0;
                }
            
                if(cMoneda == 'USD'){
            
                    cValorComisionUs = cValorComision;
            
                } else if(cMoneda == 'VES'){
            
                    cValorComisionBs = cValorComision;
            
                }
            
            }

        } 

    // console.log(cValorComision);

    $("#input-valor-comision").val(formatNumber(cValorComision));

}

async function Saldos(){
    
    cSaldoDetallado = [];

    if(cProceso != 1){

        cDatosCliente = await getCliente(cEmpresa, cDocumento[0].RIF);

    }

    var cValReferencia = await getValReferencia(cEmpresa, cBanco, cReferencia);

    if(!cFecha){

        showModal("Alerta", "Para continuar debe indicar una fecha");
        $("#input-banco").focus();

    } else if(!cBanco){

        showModal("Alerta", "Para continuar debe seleccionar un Banco");
        $("#input-banco").focus();

    } else if(!cReferencia || cReferencia == "0") {

        showModal("Alerta", "El número de referencia no puede ser 0 o estar en blanco");
        $("#input-referencia").select();

    } else if(cValReferencia.Response == 1 && cProceso == 1){

        showModal("Alerta", "El número de referencia " + cReferencia +" ya se encuentra registrado en la base de datos");
        $("#input-referencia").select();

    } else {

        cSaldoUs = cSaldoBs = cSaldoInteres = cSaldoIntMora = 0;

        cSaldoDetallado = await getSaldoDetallado(cEmpresa, cDatosCliente.RIF, cFecha);
            
        $listaDocumentos.html('<optgroup label="Seleccione"></optgroup>');
        
        await asyncForEach(cSaldoDetallado, async function(element){

            cSaldoUs += setNumeric(element.SALDO_US);
            cSaldoBs += setNumeric(element.SALDO_BS);
            cSaldoInteres += setNumeric(element.INTERESES);
            cSaldoIntMora += setNumeric(element.INTERESES_MORA);
            
            $listaDocumentos.append($('<option />', {
                value: (element.ID),
                text:  (element.TIPODCTO + ' - ' + element.NRODCTO + ' - ' + element.DCTOREF)
            }));
    
        });
        
        //database.detalle = cSaldoDetallado;
        
        $listaDocumentos.append($('<option />', {
            value: ("999"),
            text: ('ANTICIPOS')
        })).val(undefined);
        


        $("#lb-saldo-us").html(formatNumber(cSaldoUs));
        $("#lb-saldo-bs").html(formatNumber(cSaldoBs));
        $("#lb-saldo-intereses").html(formatNumber(cSaldoInteres));
        $("#lb-saldo-mora").html(formatNumber(cSaldoIntMora));
        $(".encabezado").attr("disabled", true).attr("readOnly", true);

        $("#bt-guardar").attr("disabled", false).removeClass('disabled');
        $("#bt-movimiento").attr("disabled", true).addClass('disabled');


        //await $("#jsGridDetalle").jsGrid("loadData");
        // await $("#jsGridAbonos").jsGrid("loadData");
        
        $("#bt-agregar").attr("disabled", false).removeClass('disabled');

    }

}







// Validaciones

async function getValVariables(){

    if(!cEmpresa || !cOrigen || !cModulo || !cTipoDcto || !cUsuario || !cFiltrado || !cTitulo ){

        window.location.href = "../home.html";

    }


}

async function getTotalDocumento(){

    var cAbonos = await getMvtoGrid();

    cSaldoDeposito = cValorAbonadoBs = cValorAbonadoUs = 0;

    await asyncForEach(cAbonos, async element => { 

        cMvConcepto = cConceptos.find(query => query.TIPOCPTO == element.CONCEPTO);

        if(cMvConcepto.SUMA == true || cMvConcepto.ESCRUCE == true){

            if(cMoneda == 'USD'){

                cValorAbonadoUs += setNumeric(element.VALORUS);
                cValorAbonadoBs += setNumeric(element.VALORBS) / setNumeric(element.TCAMBIO);

            } else {
            
                cValorAbonadoUs += setNumeric(element.VALORUS) * setNumeric(element.TCAMBIO);
                cValorAbonadoBs += setNumeric(element.VALORBS);
            
            }

        }

    });

    cSaldoDeposito = setNumeric((setNumeric(cValorDeposito) - setNumeric(cValorAbonadoUs) - setNumeric(cValorAbonadoBs)).toFixed(2));

    $("#input-popup-saldo-abono").val(formatNumber(cSaldoDeposito));

    return  setNumeric((cValorAbonadoUs + cValorAbonadoBs).toFixed(2));

}

async function getValGuardar(){

    var cTotalDocumento =  await getTotalDocumento();
    var cTotalDeposito = setNumeric($("#input-valor-deposito").val());


    if(cTotalDocumento == cTotalDeposito){

        return 1;

    } else {

        return 0;

    }
   



}

async function getValMvto(){


    let cTasaMvto = setNumeric($("#input-popup-tasa-cambio").val());
    let cSaldoAbono = setNumeric($("#input-popup-saldo-abono").val());
    let cValorUsMvto = setNumeric($("#input-popup-valor-us").val());
    let cValorBsMvto = setNumeric($("#input-popup-valor-bs").val());

    let cValorMvto = ((cValorUsMvto * cTasaMvto) + (cValorBsMvto / cTasaMvto)).toFixed(2);
        
    

        if(cValorMvto <= cSaldoAbono || cMvConcepto.SUMA == false){

            $('#bt-popup-guardar').attr("disabled", false).removeClass('disabled');
    
        } else {
    
            $('#bt-popup-guardar').attr('disabled', true);
            showModal('Mensaje', 'Verifique los montos ingresados');
    
        }



}







// Crud Documento


async function getAbonos(pEmpresa, pTipoDcto, pDcto){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetAbonos = await fetch(WebApiServer + "api/Cartera/GetAbonos?Empresa="+pEmpresa+"&TipoDcto="+pTipoDcto+"&Dcto="+pDcto, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        return rGetAbonos;

}


async function postAbonos(pEmpresa, pBanco, pFormaPago, pConcepto, pDcto, pOrigen, pDepoCons, pFactura, pFecha, pRif, pNItem, pNota, pPasswordIn, pTasaCambio, pTipoDcto, pTipoDctoCa, pTotItem, pValorUs, pValorBs){
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rPostAbonos = await fetch(WebApiServer + "api/Cartera/postAbonos?Empresa="+pEmpresa+"&pBanco="+pBanco+"&pFormaPago="+pFormaPago+"&pConcepto="+pConcepto+"&pDcto="+pDcto+"&pOrigen="+pOrigen+"&pDepoCons="+pDepoCons+"&pFactura="+pFactura+"&pFecha="+pFecha+"&pRif="+pRif+"&pNItem="+pNItem+"&pNota="+pNota+"&pPasswordIn="+pPasswordIn+"&pTasaCambio="+pTasaCambio+"&pTipoDcto="+pTipoDcto+"&pTipoDctoCa="+pTipoDctoCa+"&pTotItem="+pTotItem+"&pValorUs="+pValorUs+"&pValorBs="+pValorBs, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
        
        return rPostAbonos;

}


async function deleteAbonos(pEmpresa, pOrigen, pTipoDcto, pDcto){

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };
    
    var rDeleteAbonos = await fetch(WebApiServer + "api/Cartera/DeleteAbonos?Empresa="+pEmpresa+"&Origen="+pOrigen+"&TipoDcto="+pTipoDcto+"&Dcto="+pDcto, requestOptions)
                            .then(response => response.json())
                            .catch(error => console.log('error', error));

    return rDeleteAbonos;

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
    
    } catch(e){

        return e;

    }

}



async function putAnularAbonos(pEmpresa, pTipoDcto, pDcto){

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rPutAnularAbonos = await fetch(WebApiServer + "/api/Cartera/AnularAbonos?Empresa="+pEmpresa+"&TipoDcto="+pTipoDcto+"&Dcto="+pDcto, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
        return rPutAnularAbonos;


}


async function postMvBancos(pEmpresa, pCodigoCta, pDcto, pDetalle, pFecha, pRif, pPasswordIn, pTipoDcto, pValor, pTipoMvto){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
        };

        return await fetch(`${WebApiServer}api/Cartera/PostMvBancos?Empresa=${pEmpresa}&CodigoCta=${pCodigoCta}&Dcto=${pDcto}&Detalle=${pDetalle}&Fecha=${pFecha}&Rif=${pRif}&Passwordin=${pPasswordIn}&Tipodcto=${pTipoDcto}&Valor=${pValor}&TipoMvto=${pTipoMvto}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));            

}




async function setTotales(){

    cTotalesMovimiento = [];

    var array = [], result = [];

    array =  await getMvtoGrid();
    result = [];

    array.reduce(function(res, value) {

        var cMvConcepto = cConceptos.find(query => query.TIPOCPTO == value.CONCEPTO);

        
        if(cMvConcepto.FACTURA == true){

            if (!res[value.ID]) {

                res[value.ID] = { ID: value.ID, VALORUS: 0, VALORBS: 0 };
                result.push(res[value.ID]);

            }

            res[value.ID].VALORUS += setNumeric(value.VALORUS);
            res[value.ID].VALORBS += setNumeric(value.VALORBS);

        }

        return res;

    }, {});

    cTotalesMovimiento = result;

    await getTotalDocumento();

}
  




// funciones JsGird

/*
$(function() {

    $("#jsGridDetalle").jsGrid({
        
        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        controller: {
            loadData: function() {
                return database.detalle;
            }
        },

        fields: [ 
            { name: "TIPODCTO",          type: "text",   title: "Tipo Dcto",   width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "NRODCTO",           type: "text",   title: "Dcto",        width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "DCTOREF",           type: "text",   title: "Dcto Ref",    width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "TIPO",              type: "text",   title: "Tipo",        width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "FECHA_FACTURA",     type: "date",   title: "Fecha",       width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "FECHA_VENCIMIENTO", type: "date",   title: "Fecha Vto",   width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "SALDO_US",          type: "number", title: "Saldo US",    width: "5%",  headercss: "text-center text-primary", align: "right"  },
            { name: "SALDO_BS",          type: "number", title: "Saldo Bs",    width: "5%",  headercss: "text-center text-primary", align: "right"  },
            { name: "TCAMBIO",           type: "number", title: "Tasa Cambio", width: "5%",  headercss: "text-center text-primary", align: "right"  },
            { name: "INTERESES",         type: "number", title: "Intereses",   width: "5%",  headercss: "text-center text-primary", align: "right"  },
            { name: "INTERESES_MORA",    type: "number", title: "Int. Mora",   width: "5%",  headercss: "text-center text-primary", align: "right"  },
        ]

    }); 

    $("#grid").jsGrid("sort", { field: "FECHA_FACTURA", order: "desc" });
  
});
*/


$(function() {

    $("#jsGridAbonos").jsGrid({       
        height: "auto",
        width: "100%",
        autoload: true,
        responsive: true,
        paging: false,
        confirmDeleting: false,
        noDataContent: '',
        controller: {
            loadData: function() {
                return cMvAbono;
            }
        },
        deleteConfirm: function(item) {
            return "El abono por " + item.CONCEPTO + " será eliminado. ¿Desea continuar?";
        },
        rowClick: function(args) {
            showDetailsDialog("Edit", args.item);
        },
        onItemInserted: async function(){

            await setTotales();

        },
        onItemUpdated: async function(){

            await setTotales();

        },
        onItemDeleted: async function(){

            await setTotales();

        },
        fields: [ 
            { name: "TIPODCTOCA",     type: "text",   title: "Tipo Dcto",   width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "FACTURA",        type: "text",   title: "Dcto",        width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "DCTOREF",        type: "text",   title: "Dcto Ref",    width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "CONCEPTO",       type: "text",   title: "Concepto",    width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "DETALLE",        type: "text",   title: "Detalle",     width: "15%", headercss: "text-center text-primary", align: "left"   },
            { name: "VALORUS",        type: "number", title: "Valor US",    width: "5%",  headercss: "text-center text-primary", align: "right"  },
            { name: "VALORBS",        type: "number", title: "Valor Bs",    width: "5%",  headercss: "text-center text-primary", align: "right"  }, 
            { name: "TCAMBIO",        type: "number", title: "Tasa Cambio", width: "5%",  headercss: "text-center text-primary", align: "right"  }, 
            { name: "NOTA",           type: "number", title: "Nota",        width: "20%", headercss: "text-center text-primary", align: "left"   },
            { name: "ID",             type: "text",   visible: false },
            { name: "SALDO_US",       type: "text",   visible: false },
            { name: "SALDO_BS",       type: "text",   visible: false },
            { name: "INTERESES",      type: "text",   visible: false },
            { name: "INTERESES_MORA", type: "text",   visible: false }, 
            { name: "TIPO_PAGO",      type: "text",   visible: false },
            { name: "PORCENTAJE_US",  type: "text",   visible: false },
            { name: "PORCENTAJE_BS",  type: "text",   visible: false },
            {
                type: "control",
                width: "5%",
                modeSwitchButton: false,
                editButton: false,
                headerTemplate: function() {
                    return $("<button>").attr("id", "bt-agregar").attr("type", "button").attr("class", "btn btn-primary btn-sm disabled").text("Agregar")
                    .on("click", async function () {  

                        await getTotalDocumento();

                        $("#input-popup-documento").val(null);
                        $("#input-popup-concepto").val(null);
                        showDetailsDialog("Add", { });
                     
                    });
                }
            }
        ]

    });
    
    $("#detailsDialog").dialog({
        autoOpen: false,
        width: 600,
        close: function() {
            $("#detailsForm").validate().resetForm();
            $("#detailsForm").find(".error").removeClass("error");
        }
    });

   $("#detailsForm").validate({
        rules: {
            "input-popup-documento" : "required",
            "input-popup-concepto"  : "required",
            "input-popup-valor-us"  : "required",
            "input-popup-valor-bs"  : "required"
        },
        messages: {
            "input-popup-documento": "Por favor ingrese un valor",
            "input-popup-concepto" : "Por favor ingrese un valor",
            "input-popup-valor-us" : "Por favor verifique el monto ingresado",
            "input-popup-valor-bs" : "Por favor verifique el monto ingresado"
        },
        submitHandler: function() {
            formSubmitHandler();
        }
    });

    var showDetailsDialog = function(dialogType, record) {
        
        $("#input-popup-documento").val(record.ID).select2();
        $("#input-popup-saldo-documento-us").val(record.SALDO_US);
        $("#input-popup-saldo-documento-bs").val(record.SALDO_BS);
        $("#input-popup-saldo-documento-intereses").val(record.INTERESES);
        $("#input-popup-saldo-documento-mora").val(record.INTERESES_MORA);
        $("#input-popup-concepto").val(record.CONCEPTO).select2().attr('disabled', true);
        $("#input-popup-tipo-pago").val(record.TIPO_PAGO);
        $("#input-popup-porcentaje-us").val(record.PORCENTAJE_US);
        $("#input-popup-porcentaje-bs").val(record.PORCENTAJE_BS);
        $("#input-popup-tasa-cambio").val(record.TCAMBIO);
        $("#input-popup-valor-us").val(record.VALORUS);
        $("#input-popup-valor-bs").val(record.VALORBS);
        $("#input-popup-nota").val(record.NOTA);

        formSubmitHandler = async function() {

            saveRecord(record, dialogType === "Add");
            
        };
       
        $("#detailsDialog").dialog("option", "title", "Detalle Abonos")
            .dialog("open");
            
    };
    
    var saveRecord = async function(record, isNew) {

        $.extend(record, {
                ID:           $("#input-popup-documento").val(),
                TIPODCTOCA:     cTipoDctoCa,
                FACTURA:        cFactura,
                DCTOREF:        cDctoRef,
                VALORUS:        formatNumber($("#input-popup-valor-us").val()),
                VALORBS:        formatNumber($("#input-popup-valor-bs").val()),
                SALDO_US:       $("#input-popup-saldo-documento-us").val(),
                SALDO_BS:       $("#input-popup-saldo-documento-bs").val(),
                TCAMBIO:        $("#input-popup-tasa-cambio").val(),
                INTERESES:      $("#input-popup-saldo-documento-intereses").val(),
                INTERESES_MORA: $("#input-popup-saldo-documento-mora").val(),
                CONCEPTO:       $("#input-popup-concepto").val(),
                DETALLE:        $("#input-popup-concepto option:selected").html(),
                TIPO_PAGO:      $("#input-popup-tipo-pago").val(),
                PORCENTAJE_US:  $("#input-popup-porcentaje-us").val(),
                PORCENTAJE_BS:  $("#input-popup-porcentaje-bs").val(),
                NOTA:           $("#input-popup-nota").val()
            });

       
        $("#jsGridAbonos").jsGrid(isNew ? "insertItem" : "updateItem", record);
            
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







// Comportamiento Front

$(document).ready(function(){
    
    setTitulo(cTitulo);
    setBotones("enable");

});


$("#bt-nuevo").click(async function () {

    cProceso = 1;
    cAbono = cAbonoUs = cAbonoUs = 0;
    cMvAbono = [];

    await setBotones("disable");
    await setFecha();
    await getVariables(cEmpresa, cModulo);
    await getConsecut(cEmpresa, cOrigen,cTipoDcto);
    await getListaClientes(cEmpresa, cUsuario, cFiltrado);
    await getListaBancos(cEmpresa);
    await setConsecut();

    $("#input-cliente").focus();


});


$("#bt-modificar").click(async function () {

    cProceso = 2;

    await setBotones("disable");
    await getVariables(cEmpresa, cModulo);
    await getConsecut(cEmpresa,cOrigen,cTipoDcto);
    await setConsecut();

});


$("#bt-consultar").click(async function () {

    cProceso = 3;

    await setBotones("disable");
    await getVariables(cEmpresa, cModulo);
    await getConsecut(cEmpresa,cOrigen,cTipoDcto);
    await setConsecut();
  

});


$("#bt-anular").click(async function () {

    cProceso = 3;
    
    await setBotones("disable");
    await getVariables(cEmpresa, cModulo);
    await getConsecut(cEmpresa,cOrigen,cTipoDcto);
    await setConsecut();

    $("#bt-guardar").addClass("btn btn-danger");
 
});


$("#bt-atras").click(async function () {

    setBotones("enable");
    clearDatos();

    $(this).attr("disabled", true);
    $("#bt-guardar").removeClass("btn btn-danger").addClass("btn btn-primary disabled").attr("disabled", true);
    
});


$("#bt-guardar").click(async function (){

    cConsAnticipo = undefined;

    $("#bt-atras").attr("disabled", true);
    
    $("#bt-guardar").attr("disabled", true);
    $("#ic-guardar").addClass("visually-hidden");
    $("#sp-guardar").removeClass("visually-hidden");

    if(cProceso == 1){

        cMvGrid = await getMvtoGrid();

        if(cMvGrid.length > 0){
        
            var cPostAbonos, cPostTrade;
            
            await getConsecut(cEmpresa,cOrigen,cTipoDcto);

            var rValGuardar = await getValGuardar();

            if(rValGuardar == 1){
            
                if(cProceso == 1){

                    cNroDcto = cConsecut + 1;

                }
                
                var rValPostAbonos = 1;
                var cMvItem = 0;
                var cTotalItems = cMvGrid.length;


                await asyncForEach(cMvGrid, async (element) => {

                    var cMvBanco = cBanco;
                    var cMvFormaPago = cFormaPago;
                    var cMvConcepto = element.CONCEPTO;
                    var cMvDcto = cNroDcto;
                    var cMvReferencia = cReferencia;
                    var cMvFactura = element.FACTURA;
                    var cMvFecha = cFecha;
                    var cMvRif =  cDatosCliente.RIF;
                    var cMvTipoDctoCa = element.TIPODCTOCA;
                    cMvItem += 1;
                    var cMvTCambio = element.TCAMBIO;
                    var cMvNota = element.NOTA;
                    var cMvValorUs = setNumeric(element.VALORUS);
                    var cMvValorBs = setNumeric(element.VALORBS);

                

                    if(cMvConcepto == '199'){

                        cConsAnticipo = await getConsecutAnticipo(cEmpresa);
            
                        cPostTrade = await await postTrade( cEmpresa, 'FAC', 'AN', cConsAnticipo, '0', 
                                                            '0', cMvRif, cMvFecha, cMvFecha, cMvFecha, cUsuario, 
                                                            cMvTCambio, '0', '0', '0', '0', '0', -cMvValorUs, -cMvValorBs, 
                                                            '0', '0', '0', '0',
                                                            '0', '0', '0', '0',
                                                            '0', '0', '0', '0');

                        if(cPostTrade == 1){

                            cPostAbonos = await postAbonos(cEmpresa, cMvBanco, cMvFormaPago, cMvConcepto, cMvDcto, cOrigen, cMvReferencia, cMvFactura, cMvFecha, cMvRif, cMvItem, cMvNota, cUsuario, cMvTCambio, cTipoDcto, cMvTipoDctoCa, cTotalItems, cMvValorUs, cMvValorBs);

                        } else {

                            rValPostAbonos = 0;

                        }


                    } else {

                        cPostAbonos = await postAbonos(cEmpresa, cMvBanco, cMvFormaPago, cMvConcepto, cMvDcto, cOrigen, cMvReferencia, cMvFactura, cMvFecha, cMvRif, cMvItem, cMvNota, cUsuario, cMvTCambio, cTipoDcto, cMvTipoDctoCa, cTotalItems, cMvValorUs, cMvValorBs);
                        
                    }
                    

                    if(cPostAbonos != 1){

                        rValPostAbonos = 0;
                    } 

                });


                if(rValPostAbonos == 1){

                    if(cValorDeposito > 0){

                        await postMvBancos(cEmpresa, cBanco, cNroDcto, cReferencia, cFecha.replaceAll("-",""), cDatosCliente.RIF, cUsuario, cTipoDcto, cValorDeposito,  '101');

                    }
                    
                    await putConsecut(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
                    
                    if(cConsAnticipo){

                        showModal("Mensaje", `Se guardaron los documentos: AN ${cConsAnticipo} - ${cTipoDcto} ${cNroDcto}`);

                    } else {

                        showModal("Mensaje", `El documento fue guardado satisfactoriamente: ${cTipoDcto} ${cNroDcto}`);
                        
                    }

                    await clearDatos();
                    await setBotones("enable");


                } else {

                    await deleteAbonos(cEmpresa, cOrigen, cTipoDcto, cNroDcto);
                    await showModal("Error", "Se presentó un error al guardar el documento, por favor intente de nuevo, si el error persiste por favor comuníquese con el área encargada");

                    $("#bt-atras").attr("disabled", false);
                    $("#bt-guardar").attr("disabled", false);

                }

            } else {

                await showModal("Error", "La sumatoria de valores del movimiento no conincide con el valor del deposito, por favor verifique");
                
                $("#bt-atras").attr("disabled", false);

                $("#bt-guardar").attr("disabled", false);
                $("#ic-guardar").removeClass("visually-hidden");
                $("#sp-guardar").addClass("visually-hidden");

            }

        } else {

            await showModal("Error", "El documento no tiene movimiento a guardar");
            
            $("#bt-atras").attr("disabled", false);
            
            $("#bt-guardar").attr("disabled", false);
            $("#ic-guardar").removeClass("visually-hidden");
            $("#sp-guardar").addClass("visually-hidden");
    
        }

    } else if(cProceso == 3){

        var cDctoNull = $("#input-nrodcto").val();

        if(!confirm(`¿Desea anular el documento ${cTipoDcto} ${cDctoNull}?`))
        return;

        await putAnularAbonos(cEmpresa, cTipoDcto, cDctoNull);

        await clearDatos();
        await setBotones("enable");
    
        $("#bt-movimiento").attr("disabled", true); 
        $("#bt-atras").attr("disabled", true);
        $("#bt-guardar").removeClass("btn btn-danger").addClass("btn btn-primary disabled").attr("disabled", true);

    }


});


$("#bt-home").click(async function () {
    userHome(cInterno);
});






$("#input-nrodcto").blur(async function(event){

    
    if($btAtras[0] !== event.relatedTarget){ 

        cValAnulado = cValCruzado  = cValFacturado = 0; 
        cMvAbono = [];
        
        cElemento = $(this);
        cNroDcto = this.value;

        if(cNroDcto <= cConsecut){

            if(cNroDcto != 0){

                cDocumento = await getAbonos(cEmpresa, cTipoDcto, this.value);

                await asyncForEach(cDocumento, async (element) => { 
                    
                    if(element.CONCEPTO == '999'){

                        cValAnulado = 1;

                    } else if (element.CRUZADO == '1'){

                        cValCruzado = 1;

                    } else if (element.FACTURADO == '1'){

                        cValFacturado = 1;

                    }
            
                });

                if(cValAnulado == 0 && cValCruzado == 0 && cValFacturado == 0){

                    await getListaClientes(cEmpresa, cUsuario, cFiltrado);
                    await getListaBancos(cEmpresa);
                    
                    
                    cDatosBanco = cBancos.find(query => query.CODIGOCTA == cDocumento[0].BANCO);
                    cValorDeposito = await getValorDeposito(cEmpresa, cTipoDcto, cNroDcto);
                    await getListaFormaPago(cEmpresa, cDocumento[0].BANCO);  
                    
                    cFecha = cDocumento[0].FECHA.substr(0,10);
                    cTasaCambio = cDocumento[0].TCAMBIO;
                    cMoneda = cDatosBanco.MONEDA;
                    cReferencia = cDocumento[0].DEPOCONS;
                    cFormaPago = cDocumento[0].FORMAPAGO;
                    cBanco = cDocumento[0].BANCO;

                    cMvAbono = cDocumento;

                    await setComision(cEmpresa, cDocumento[0].BANCO, cDocumento[0].FORMAPAGO, cValorDeposito);

                    $("#input-cliente").val(cDocumento[0].RIF).select2();
                    $("#input-banco").val(cDocumento[0].BANCO).select2();
                    $("#input-forma-pago").val(cFormaPago).select2();
                    $("#input-fecha").val(cFecha);        
                    $("#input-moneda").val(cMoneda);
                    $("#input-valor-comision").val(cValorComision);
                    $("#input-referencia").val(cReferencia);
                    $("#input-valor-deposito").val(cValorDeposito).mask("#,##0.00", {reverse: true});
                    $("#input-nrodcto").addClass('disabled').attr("disabled", true);

                    await $("#jsGridAbonos").jsGrid("loadData");
                    

                    if(cProceso != 3){

                        $(".encabezado").attr("disabled", false).removeClass('disabled').removeAttr("readonly");

                    } else {

                        $("#bt-guardar").attr("disabled", false).removeClass('disabled').removeAttr("readonly");

                    }

                } else if(cValAnulado == 1){

                    showModal("Alerta", "El documento seleccionado se encuentra anulado");
                
                    
                } else if(cValCruzado == 1){

                    showModal("Alerta", "El documento seleccionado ya fue conciliado");

                } else if(cValFacturado == 1){

                    showModal("Alerta", "El documento seleccionado contiene gasto administrativo ya facturado");

                }

            
            } else {

                showModal("Alerta", "No existen documentos asociados al tipo de documento seleccionado");
                
                
            }

        } else {

            showModal("Alerta", "El documento ingresado no existe");
            
        }

    }
    
});


$("#input-cliente").on('select2:select', async function () {

    

    cDatosCliente = await getCliente(cEmpresa, this.value);

    $("#input-valor-deposito").mask("#,##0.00", {reverse: true});
    $("#input-fecha").attr("disabled", false).attr("readonly", false).removeClass('disabled').val(cFecha).focus();
    

});


$("#input-fecha").blur(async function(){

    
    if(this.value > cFecha){

        
        $(".fecha").val(undefined).attr("disabled", true).attr("readonly", true);
        $(".valfecha").select2().attr("disabled", true).attr("readonly", true);
        $("#bt-movimiento").attr("disabled", true).attr("readonly", true);
        $("#input-cliente").focus();

        showModal("Error", "Fecha incorrecta");

    } else {

        cFecha = this.value;
        $("#input-banco").attr("disabled", false).attr("readonly", false).removeClass('disabled').focus();
        
    
    }
    
});


$("#input-banco").change(async function(){

    
    cBanco = this.value;
    await getListaFormaPago(cEmpresa, cBanco);
    await setComision(cEmpresa, cBanco, cFormaPago, cValorDeposito);

    cDatosBanco = cBancos.find(query => query.CODIGOCTA == cBanco);
    cMoneda = cDatosBanco.MONEDA;

    $("#input-moneda").val(cMoneda);
    $("#input-forma-pago").val(undefined).select2();
    $(".encabezado").attr("disabled", false).removeClass('disabled').removeAttr("readonly");

    var cControlReferencia = parseFloat((cVariables.find(query => query.CAMPO == 'CONTROLREFERENCIA').VALOR)); 

    if(cControlReferencia == 1){

        if(cBanco == '301' || cBanco == '302' || cBanco == '303'){
            
            cReferencia = cNroDcto;

            if(cBanco != '301'){

                $("#input-valor-deposito").attr("disabled", true).attr("readOnly", true).addClass('disabled').val(0);

            }

            $listaReferencia.html('<optgroup label="Seleccione"></optgroup>');

            $listaReferencia.append($('<option />', {
                value: (cReferencia),
                text: (cReferencia)
            }));

            $("#input-forma-pago").select2().focus();

        } else {

            await getListaReferencia(cEmpresa, cDatosCliente.RIF);
            
            await $("#input-referencia").addClass('select').focus();

        }   

    } else {

        await $("#input-referencia-texto").removeClass("visually-hidden");
        await $("#input-referencia").addClass("visually-hidden");

        if(cBanco == '301' || cBanco == '302' || cBanco == '303'){

            cReferencia = cNroDcto;
            $("#input-referencia-texto").attr("disabled", true).attr("readOnly", true).addClass('disabled').val(cReferencia);

        } else {

            $("#input-referencia-texto").val(undefined).focus();

        }
    }
    
});


$("#input-referencia").change(async function (){

    cReferencia = $.trim(this.value);
    $(".encabezado").attr("disabled", false).removeClass('disabled').removeAttr("readonly");
    $("#input-forma-pago").focus();

});


$("#input-referencia-texto").blur(async function (){

    
    cReferencia = $.trim(this.value);
    $(".encabezado").attr("disabled", false).removeClass('disabled').removeAttr("readonly");
    

});


$("#input-forma-pago").change(async function (){

    
    cFormaPago = this.value;

    await setComision(cEmpresa, cBanco, cFormaPago, cValorDeposito);
    $("#input-valor-deposito").focus();
    $(".encabezado").attr("disabled", false).removeClass('disabled').removeAttr("readonly");
    $("#input-valor-deposito").focus();
    
            
}); 


$("#input-valor-deposito").blur(async function (){

    
    cValorDeposito = setNumeric(this.value);

    if (cValorDeposito == undefined || isNaN(cValorDeposito)){

        showModal("Alerta", "El valor del deposito no puede estar en blanco");
        $("#input-forma-pago").focus();

    } else {

        $(".encabezado").attr("disabled", false).removeClass('disabled').removeAttr("readonly");
        
        await setComision(cEmpresa, cBanco, cFormaPago, cValorDeposito);
        await Saldos();
        
        cMvTasaCambio = await getTasaCambio(cEmpresa, cFecha);

    }

    

});




// Formulario de Detalle

$("#input-popup-documento").change(async function (){

    cTipoDctoCa = cFactura = cFechaFactura = cFechaVencimientoFactura = cDctoRef = cValFacturaInt = cValFacturaMora = cValFacturaUs = cValFacturaBs = 0;

    await getConceptos(cEmpresa, cOrigen);

    $("#input-popup-concepto").attr("disabled", false).attr("readOnly", false);

    if(this.value != '999'){

        var cTotalAbonoMovimiento = cTotalesMovimiento.find(query => query.ID == this.value);
        var cDocumento = cSaldoDetallado.find(query => query.ID == this.value);

        if(cDocumento.TIPODCTO == 'AN'){

            $('#input-popup-concepto option[value="101"]').remove();
            $('#input-popup-concepto option[value="102"]').remove();
            $('#input-popup-concepto option[value="103"]').remove();
            $('#input-popup-concepto option[value="104"]').remove();
            $('#input-popup-concepto option[value="105"]').remove();
            $('#input-popup-concepto option[value="108"]').remove();
            $('#input-popup-concepto option[value="109"]').remove();
            $('#input-popup-concepto option[value="110"]').remove();
            $('#input-popup-concepto option[value="111"]').remove();
            $('#input-popup-concepto option[value="199"]').remove();
            $('#input-popup-concepto option[value="202"]').remove();

            $listaConceptos.val(undefined);
    
        } else if(cDocumento.TIPODCTO == 'CS' || cTipoDcto.TIPODCTO == 'KS'){

            $('#input-popup-concepto option[value="101"]').remove();
            $('#input-popup-concepto option[value="102"]').remove();
            $('#input-popup-concepto option[value="103"]').remove();
            $('#input-popup-concepto option[value="104"]').remove();
            $('#input-popup-concepto option[value="105"]').remove();
            $('#input-popup-concepto option[value="106"]').remove();
            $('#input-popup-concepto option[value="107"]').remove();
            $('#input-popup-concepto option[value="108"]').remove();
            $('#input-popup-concepto option[value="109"]').remove();
            $('#input-popup-concepto option[value="110"]').remove();
            $('#input-popup-concepto option[value="111"]').remove();
            $('#input-popup-concepto option[value="199"]').remove();

            $listaConceptos.val(undefined);
    
        } else if (setNumeric(cDocumento.SALDO_US) < 0 || setNumeric(cDocumento.SALDO_BS) < 0) { 
        
            $('#input-popup-concepto option[value="199"]').remove();
            $listaConceptos.val(undefined);
        
        } else {

            $('#input-popup-concepto option[value="106"]').remove();
            $('#input-popup-concepto option[value="107"]').remove();
            $('#input-popup-concepto option[value="199"]').remove();
            $listaConceptos.val(undefined);
    
        }
        

        if(cTotalAbonoMovimiento){

            cValFacturaUs = setNumeric(cDocumento.SALDO_US) - setNumeric(cTotalAbonoMovimiento.VALORUS);
            cValFacturaBs = setNumeric(cDocumento.SALDO_BS) - setNumeric(cTotalAbonoMovimiento.VALORBS);
    
        } else {
    
            cValFacturaUs = setNumeric(cDocumento.SALDO_US);
            cValFacturaBs = setNumeric(cDocumento.SALDO_BS);
    
        }
    

        cTipoDctoCa = cDocumento.TIPODCTO;
        cFactura = cDocumento.NRODCTO;
        cFechaFactura = cDocumento.FECHA_FACTURA;
        cFechaVencimientoFactura = cDocumento.FECHA_VENCIMIENTO;
        cDctoRef = cDocumento.DCTOREF;
        cValFacturaInt = cDocumento.INTERESES;
        cValFacturaMora = cDocumento.INTERESES_MORA;
       

    } else {

        $('#input-popup-concepto option[value="101"]').remove();
        $('#input-popup-concepto option[value="102"]').remove();
        $('#input-popup-concepto option[value="103"]').remove();
        $('#input-popup-concepto option[value="104"]').remove();
        $('#input-popup-concepto option[value="105"]').remove();
        $('#input-popup-concepto option[value="106"]').remove();
        $('#input-popup-concepto option[value="107"]').remove();
        $('#input-popup-concepto option[value="108"]').remove();
        $('#input-popup-concepto option[value="109"]').remove();
        $('#input-popup-concepto option[value="110"]').remove();
        $('#input-popup-concepto option[value="202"]').remove();
        
        $listaConceptos.val(undefined);
        

        cConsAnticipo = await getConsecutAnticipo(cEmpresa);

        cTipoDctoCa = 'AN';
        cFactura = cConsAnticipo;
        cFechaFactura = cFecha;
        cFechaVencimientoFactura = cFecha;
        cDctoRef = 0;
        cValFacturaInt = 0;
        cValFacturaMora = 0;
        cValFacturaUs = 0;
        cValFacturaBs = 0;

    }
    
    $("#input-popup-saldo-documento-us").val(formatNumber(cValFacturaUs));
    $("#input-popup-saldo-documento-bs").val(formatNumber(cValFacturaBs));
    $("#input-popup-saldo-documento-intereses").val(formatNumber(cValFacturaInt));
    $("#input-popup-saldo-documento-mora").val(formatNumber(cValFacturaMora));

    $("#input-popup-valor-us").mask("000,000,000.00", {reverse: true, translation: { '0': { pattern: /-|\d/, recursive: true }}, onChange: function(value, e) {e.target.value = value.replace(/^-\./, '-').replace(/^-,/, '-').replace(/(?!^)-/g, '');}});
    $("#input-popup-valor-bs").mask("000,000,000.00", {reverse: true, translation: { '0': { pattern: /-|\d/, recursive: true }}, onChange: function(value, e) {e.target.value = value.replace(/^-\./, '-').replace(/^-,/, '-').replace(/(?!^)-/g, '');}});


});


$("#input-popup-concepto").on('select2:select', async function () {
 
    cMvConcepto = cConceptos.find(query => query.TIPOCPTO == this.value);

    $("#input-popup-tasa-cambio").val(formatNumber(1)).mask("#,##0.00", {reverse: true});
    $(".val").val('0.00').attr("disabled", false).attr("readOnly", false).removeClass('disabled');
    $("#input-popup-valor-us").select();


    /*
    if(cMoneda == 'VES'){

        $(".val").val('0.00').attr("disabled", false).attr("readOnly", false).removeClass('disabled');

    } else if (cMoneda == 'USD' && cMvConcepto.ESCRUCE == true){

        $("#input-popup-valor-bs").val('0.00');
        $("#input-popup-valor-us").attr("disabled", false).attr("readOnly", false).removeClass('disabled').val(undefined).focus();
        
    } else if (cMoneda == 'USD' && cMvConcepto.ESCRUCE == false){

        $(".val").attr("disabled", false).attr("readOnly", false).removeClass('disabled').val(undefined);

    }
    */    

});


$("#input-popup-valor-us").blur(async function (){

    if( cMoneda == 'VES' && setNumeric(this.value) != 0){

        $("#input-popup-tasa-cambio").val(cMvTasaCambio);
        $("#input-popup-valor-bs").val(formatNumber(0));    

    } else if (cMoneda == 'USD' && setNumeric(this.value) != 0){

        $("#input-popup-tasa-cambio").val(formatNumber(1));
        $("#input-popup-valor-bs").val(formatNumber(0));

    }
    
    getValMvto();

});


$("#input-popup-valor-bs").blur(async function (){

    if( cMoneda == 'USD' && setNumeric(this.value) != 0){

        $("#input-popup-tasa-cambio").val(cMvTasaCambio);
        $("#input-popup-valor-us").val(formatNumber(0));
        
    }  else if (cMoneda == 'VES' && setNumeric(this.value) != 0){

        $("#input-popup-tasa-cambio").val(formatNumber(1));
        $("#input-popup-valor-us").val(formatNumber(0));

    }
    
    getValMvto();

});