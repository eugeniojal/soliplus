//Variables globales
var cEmpresa = sessionStorage.getItem('Empresa');
var cModulo = sessionStorage.getItem("Modulo");

var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cTitulo = sessionStorage.getItem("Titulo");
var cInterno = sessionStorage.getItem("Interno");

var cCertificados = [], selectedItems = [], cCertificadosRechazados = [], certificadosVerificados = [], certificadosPorConciliar = [], cCertificadosConciliados = [], cBancos = [], certificadosVerificados = [], certificadosPorConciliar = [];

var cComprobante, cBanco;

var cOrigen, cTipoDcto, cNroDcto, cFecha, cNroComprob, cMonto, cImagen;

var $listaBancos = $('#input-banco');



//Gets

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

    $listaBancos.attr("disabled", false).attr("readOnly", false).removeClass('disabled').val(undefined).select2();
    $("#bt-generar").attr("disabled", false).attr("readOnly", false).removeClass('disabled');


}

async function getListaMotivosRechazo(pEmpresa) {

    var $listaMotivosRechazo = $('#input-motivo-rechazo');

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rGetMotivosRechazo = await fetch(WebApiServer + "api/Certificados/GetMotivosRechazo?Empresa=" + pEmpresa, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    $listaMotivosRechazo.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetMotivosRechazo, async (element) => {

        $listaMotivosRechazo.append($('<option />', {
            value: (element.CODIGO),
            text: (element.DESCRIPCION)
        }));


    });

    $listaMotivosRechazo.val(undefined).select2({
        dropdownParent: $('#md-rechazar')
    });

}





// Certificados cargado por operadoras
async function getCertificados(pEmpresa, pCodigoCta) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(WebApiServer + "api/Certificados/GetCertifica?Empresa=" + pEmpresa + "&CodigoCta=" + pCodigoCta, requestOptions)
                .then(response => response.json());

}


// Certificados cargados por operadoras dependiendo del estado
async function getCertificaEstado(pEmpresa, pEstado, pCodigoCta) {


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`${WebApiServer}api/Certificados/GetCertificaEstado?Empresa=${pEmpresa}&Estado=${pEstado}&CodigoCta=${pCodigoCta}`, requestOptions)
                .then(response => response.json());

}


async function getCertificadosRechazados(pEmpresa, pCodigoCta) {


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(`${WebApiServer}api/Certificados/GetCertificadosRechazados?Empresa=${pEmpresa}&CodigoCta=${pCodigoCta}`, requestOptions)
                .then(response => response.json());

}


//Sets


function setFecha(pFecha){

    var cFechaTiempo, cFecha;

    if(pFecha){

        cFecha = new Date(pFecha).toISOString(); 

    } else {

        cFechaTiempo = new Date();
        cFecha = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString();

    }

    return cFecha.substr(0, 10);

}


async function setPorConciliar(pDatos){

    await asyncForEach(pDatos, async (element) => {   

        if(element.ESTADO == 2){

            $("#bt-por-conciliar").attr("disabled", false).removeClass('disabled');

        }

    });

}


async function setTables(){

    cCertificados = await getCertificados(cEmpresa, cBanco);
    cCertificadosRechazados = await  getCertificadosRechazados(cEmpresa, cBanco); 
    cCertificadosConciliados = await getCertificaEstado(cEmpresa, '3', cBanco);
    

    await $("#jsGridCertificados").jsGrid("loadData");
    await $("#jsGridRechazados").jsGrid("loadData");
    await $("#jsGridConciliados").jsGrid("loadData");
    



}





//Puts

async function putVerificarCertificado(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pEstado, pPasswordMo) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rPutVerificarCertificado = await fetch(`${WebApiServer}api/Certificados/PutCertificaVerifica?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Estado=${pEstado}&PasswordMo=${pPasswordMo}`, requestOptions)
        .then(response => response.json());
    
        
    return rPutVerificarCertificado[0].Response;

}


async function putRechazarCertificado(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pEstado, pPasswordMo, pDescripcion) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutRechazarCertificado = await fetch(`${WebApiServer}api/Certificados/PutCertificaRechazar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Estado=${pEstado}&PasswordMo=${pPasswordMo}&Descripcion=${pDescripcion}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.error(error));
    
    return cPutRechazarCertificado[0].Response;

}


async function putReiniciarCertificado(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pPasswordMo) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rPutVerificarCertificado = await fetch(`${WebApiServer}api/Certificados/PutCertificaReiniciar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&PasswordMo=${pPasswordMo}`, requestOptions)
        .then(response => response.json());
    
        
    return rPutVerificarCertificado[0].Response;

}


async function putCertifica(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pNroComrob, pPasswordMo, pFecha) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rPutCertifica = await fetch(`${WebApiServer}api/Certificados/PutCertifica?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&NroComrob=${pNroComrob}&PasswordMo=${pPasswordMo}&Fecha=${pFecha}`, requestOptions)
                            .then(response => response.json());


    return rPutCertifica[0].Response;

}


async function putConciliar(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pMonto, pMontoNeto, pComision, pPasswordMo, pCodigoCta) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutConciliar = await fetch(`${WebApiServer}api/Certificados/PutConciliar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Monto=${pMonto}&MontoNeto=${pMontoNeto}&Comision=${pComision}&PasswordMo=${pPasswordMo}&CodigoCta=${pCodigoCta}`, requestOptions)
        .then(response => response.json());


    return cPutConciliar[0].Response;

}


async function putPorConciliar(pEmpresa, pOrigen, pNroDcto, pTipoDcto, pNroComprob, pCodigoCta, pPasswordMo, pFecha) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutPorConciliar = await fetch(`${WebApiServer}api/Certificados/PutPorConciliar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&NroComprob=${pNroComprob}&CodigoCta=${pCodigoCta}&PasswordMo=${pPasswordMo}&Fecha=${pFecha}`, requestOptions)
        .then(response => response.json());

    return cPutPorConciliar[0];


}


async function putConciliarExpress(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pUrlConExpress, pPasswordMo) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutConciliarExpress = await fetch(`${WebApiServer}api/Certificados/PutCertificaExpress?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&UrlConExpress=${pUrlConExpress}&PasswordMo=${pPasswordMo}`, requestOptions)
        .then(response => response.json());

    return cPutConciliarExpress[0].Response;

}


async function putResetCetificado(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pUrlExpress, pPasswordMo){

    console.log(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pUrlExpress, pPasswordMo);

}




//Post imagen certificado express

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





//Modales
function showModalVerificar(pCertificado) {

    //cOrigen = cTipoDcto = cNroDcto = cFecha = cNroComprob = cMonto = cImagen = undefined;
    
    cOrigen     = pCertificado.ORIGEN;
    cTipoDcto   = pCertificado.TIPODCTO;
    cNroDcto    = pCertificado.NRODCTO;
    cFecha      = pCertificado.FECHA.substr(0,10);
    cNroComprob = pCertificado.NROCOMPROB;
    cMonto      = pCertificado.MONTO;
    cImagen     = pCertificado.URLCOMPROB.replace("C:\\inetpub\\wwwroot\\", "http://soliplus.consolidez.com/").replaceAll(/\\/g, '/');

    $("#input-fecha").val(setFecha(cFecha));
    $("#input-referencia").val(cNroComprob);
    $("#input-monto").val(formatNumber(cMonto));
    $("#input-imagen-certificado").attr('src', cImagen);

    // Abrimos el modal
    $("#md-verificar").modal("show");

}


function showModalConciliacionExpress() {

    var cComprobante;

    function clearModalConciliacionExpress(){

        $("#preview-image").attr("src", undefined);
        $("#input-monto-express").val(undefined);
        $("#input-comision-express").val(undefined);
        $("#input-codigo-conciliacion-express").val(undefined);

    }

    clearModalConciliacionExpress();
    
    $("#input-monto-express").val(formatNumber(cMonto)).mask("#,##0.00", {reverse: true});
    $("#input-comision-express").val(formatNumber(0)).mask("#,##0.00", {reverse: true});
    $("#preview-image").attr("src", null);
    
    $("#md-conciliacion-express").modal("show");

    $("#input-imagen-express").change((async function (e) {
    
        cComprobante = e.target;
    
        $("#preview-image").attr('src', URL.createObjectURL(e.target.files[0]) );
        $("#bt-conciliacion-express").attr("disabled", false).attr("readOnly", false).removeClass('disabled');
        
    }));

    // Conciliar Express después de validar los datos
    $("#bt-conciliacion-express").click(async function () {

        var cMontoExpress = setNumeric($("#input-monto-express").val());
        var cMontoComisionExpress = setNumeric($("#input-comision-express").val());
        var cCodigoAprobacion = $("#input-codigo-conciliacion-express").val();
        var cMontoNetoExpress = cMontoExpress - cMontoComisionExpress;

        if (cCodigoAprobacion == '787') {

            // Grabar Imagen en el servidor
            var cPostImagen = await PostImagen(cEmpresa, cTitulo, cComprobante); 

            if(cPostImagen.Response == 1){

                var cUrlComprobante = cPostImagen.Url.replaceAll(/\\\\/g, '\\');

                // Actualizar la URL del Comprobante Express
                var rPutUrlCertificadoExpress = await putConciliarExpress(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cUrlComprobante, cUsuario); 
                
                if(rPutUrlCertificadoExpress == 1){
        
                    var cPutConciliar = await putConciliar(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cMontoExpress, cMontoNetoExpress, cMontoComisionExpress, cUsuario, cBanco);
        
                    if(cPutConciliar == 1){
            
                        await setTables();
                        
                        clearModalConciliacionExpress();
                        $("#md-conciliacion-express").modal("toggle");
            
                    } else {

                        // crear procedimiento que elimine el archivo, y actualice el campo de url express
                        await putResetCetificado(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cUrlExpress, cUsuario);
        
                        clearModalConciliacionExpress();
                        $("#md-conciliacion-express").modal("toggle");

                        showModal("Error", "Se presentó un error al conciliar, por favor intente de nuevo");

                    }

                } else {

                    clearModalConciliacionExpress();
                    $("#md-conciliacion-express").modal("toggle");
        
                    showModal("Error", "Se presentó un error al actualizar los datos del certificado, por favor intente de nuevo");

                }
        
            } else {

                clearModalConciliacionExpress();
                $("#md-conciliacion-express").modal("toggle");

                showModal("Error", "Se presentó un error al guardar la imagen del comprobante, por favor intente de nuevo");
            
            }
            
        

        } else {

            clearModalConciliacionExpress();
            $("#md-conciliacion-express").modal("toggle");
            
            showModal('Error', 'Código Incorrecto');
            
        }
        
    });

}


function showModalporConciliar() {

    $("#md-por-conciliar").modal("show");

    //Boton de conciliar dentro del modal
    $("#bt-conciliar").click(async function () {

        debugger;

        var cConciliados = 0;

        selectedItems.forEach(async function (element) {

            var cPutConciliar = await putConciliar(cEmpresa, element.ORIGEN, element.TIPODCTO, element.NRODCTO, element.MONTO, element.MONTONETO, element.COMISION, cUsuario);

            if(cPutConciliar == true){

                cConciliados += 1;

            } 

        });

        if(cConciliados == selectedItems.length){

            showModal('Mensaje', 'Se conciliaron todos certificados seleccionados');
        

        } else if (cConciliados != 0){

            showModal('Mensaje', `Se conciliaron ${cConciliados} comprobantes de ${selectedItems.length}, por favor verifique`);

        }
        
        setTables();    


    });

}







// Crear tablas

// Verificar Cetificados #jsGridCertificados
$(function() {
    
    $("#jsGridCertificados").jsGrid({
        height: "auto",
        width: "100%",
        autoload: true,
        responsive: true,
        paging: false,
        confirmDeleting: false,
        noDataContent: '',
        controller: {
            loadData: function () {
                return cCertificados;
            },
        },
        onDataLoaded: async function(args){

            await setPorConciliar(args.data);

        },
        rowClick: function (args) {

            showModalVerificar(args.item);

        },
        fields: [
            {   
                
                name: "FECHA",        
                    type: "date", 
                    title: "Fecha", 
                    width: "10%", 
                    headercss: "text-center text-primary", 
                    align: "center",
                itemTemplate: function (value) {
                    return moment(value).locale('es').format('YYYY-MM-DD');
                }, 
            },
            { 
                name: "CLIENTE",
                type: "text",
                title: "Cliente",
                width: "30%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "NROCOMPROB",
                type: "text",
                title: "Referencia",
                width: "20%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "MONTO",
                type: "number",
                title: "Monto",
                width: "15%",
                headercss: "text-center text-primary",
                align: "right",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                }
            },
            { 
                name: "NOBRE_ESTADO", 
                type: "text", 
                title: "Estado", 
                width: "15%", 
                headercss: "text-center text-primary", 
                align: "center" 
            },
            {
                name: 'ESTADO',
                type: 'text', 
                title: 'Estado',
                headercss: "text-center text-primary",
                align: "center",
                width: "10%",
                itemTemplate: function () {
                    
                    return $("<span>")
                        .addClass("btn btn-secondary btn-sm")
                        .html('<i class="fas fa-search"></i>');

                }, 
                headerTemplate: function(){

                    return $("<button>").attr("id", "bt-por-conciliar").attr("type", "button").attr("class", "btn btn-primary btn-sm disabled").text("Por Conciliar") 
                    .on("click", async function () {  

                        certificadosVerificados = certificadosPorConciliar = [];
                    
                        await asyncForEach(cCertificados, async (element) => {
                    
                            console.log(element);

                            if (element.ESTADO == '2') {
                    
                                certificadosPorConciliar = await putPorConciliar(cEmpresa, element.ORIGEN, element.NRODCTO, element.TIPODCTO, element.NROCOMPROB, element.CODIGOCTA, cUsuario, element.FECHA);
                    
                                console.log(certificadosPorConciliar);

                                if (certificadosPorConciliar != undefined) {
                    
                                    certificadosVerificados.push(certificadosPorConciliar);
                    
                                }
                    
                            }
                    
                    
                        });
                    
                    
                        if (certificadosVerificados.length) {
                    
                            await $("#jsGridPorConciliar").jsGrid("loadData");
                    
                        } else {
                    
                            $("#error-por-conciliar").text("No hay certificados por conciliar.");
                            $("#error-por-conciliar").removeClass("visually-hidden");
                    
                        }
                    
                        showModalporConciliar();
                    
                    });
                    
                    
                    
                }

            }

        ]

    });

    $("#jsGrid").jsGrid("sort", { field: "FECHA", order: "desc" });

});


// Certificados con Problemas #jsGridRechazados
$(function(){

    $("#jsGridRechazados").jsGrid({
        height: "auto",
        width: "100%",
        autoload: true,
        responsive: true,
        paging: false,
        confirmDeleting: false,
        noDataContent: '',
        controller: {
            loadData: function () {
                return cCertificadosRechazados;
            }
        },
        fields: [
            {   
                name: "FECHA",        
                type: "date", 
                title: "Fecha", 
                width: "10%", 
                headercss: "text-center text-primary", 
                align: "center",
                itemTemplate: function (value) {
                    return moment(value).locale('es').format('YYYY-MM-DD');
                }, 
            },
            { 
                name: "CLIENTE",
                type: "text",
                title: "Cliente",
                width: "30%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "NROCOMPROB",
                type: "text",
                title: "Referencia",
                width: "20%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "MONTO",
                type: "number",
                title: "Monto",
                width: "15%",
                headercss: "text-center text-primary",
                align: "right",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                }
            },
            { 
                name: "NOBRE_ESTADO", 
                type: "text", 
                title: "Estado", 
                width: "15%", 
                headercss: "text-center text-primary", 
                align: "center" 
            },
            {
                title: "Cambiar Estado",
                width: "10%",
                headercss: "text-center text-primary", 
                align: "center",
                itemTemplate: function (_, item) {

                    return $("<button>")
                        .attr("id", "bt-cambiar-estado")
                        .addClass("btn btn-secondary btn-sm")
                        .html('<i class="fas fa-pen"></i>')
                        .on('click', async function () {

                            var cPutReiniciarCertificado = await putReiniciarCertificado(cEmpresa, item.ORIGEN, item.TIPODCTO, item.NRODCTO, cUsuario);

                            if(cPutReiniciarCertificado == true){

                                showModal("Mensaje", "Estado del certificado cambiado con éxito");
                                await setTables();

                            } else {

                                showModal("Error", "No se ha podido cambiar el estado del certificado, por favor intente nuevamente");

                            }

                        });

                }
            }

        ]

    });

    $("#jsGridRechazados").jsGrid("sort", { field: "ESTADO", order: "desc" });

});


// Certificados Conciliados #jsGridConciliados
$(function(){

    $("#jsGridConciliados").jsGrid({

        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        sorting: true,
        selecting: true,
        noDataContent: '',
        controller: {
            loadData: function () {
                return cCertificadosConciliados;
            }
        },
        fields: [
            {   
                name: "FECHA",        
                type: "date", 
                title: "Fecha", 
                width: "10%", 
                headercss: "text-center text-primary", 
                align: "center",
                itemTemplate: function (value) {
                    return moment(value).locale('es').format('YYYY-MM-DD');
                }, 
            },
            { 
                name: "CLIENTE",
                type: "text",
                title: "Cliente",
                width: "30%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "NROCOMPROB",
                type: "text",
                title: "Referencia",
                width: "20%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "MONTO", 
                type: "number",
                title: "Monto Comrpobante",
                width: "15%",
                headercss: "text-center text-primary",
                align: "right",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                } 
            },
            { 
                name: "MONTONETO", 
                type: "number",
                title: "Monto Conciliado",
                width: "15%",
                headercss: "text-center text-primary",
                align: "right",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                } 
            },
            {
                title: "Desconciliar",
                width: "10%",
                headercss: "text-center text-primary", 
                align: "center",
                itemTemplate: function (item) {

                    return $("<button>")
                    .attr("id", "bt-desconciliar")
                    .addClass("btn btn-secondary btn-sm")
                    .html('<i class="fas fa-backspace"></i>')
                    .on('click', async function (e) {

                        console.log('Desconciliar');
                        e.stopPropagation();

                    });

                }
            }
            
        ]

    });

    // $("#jsGridConciliados").jsGrid("sort", { field: 0 , order: "desc" });

});


// Certificados por Conciliar #jsGridPorConciliar
$(function(){

    $("#jsGridPorConciliar").jsGrid({

        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        noDataContent: '',
        controller: {
            loadData: function () {
                return certificadosVerificados;
            }
        },
        fields: [
            {   
                name: "FECHA",        
                type: "date", 
                title: "Fecha", 
                width: "10%", 
                headercss: "text-center text-primary", 
                align: "center",
                itemTemplate: function (value) {
                    return moment(value).locale('es').format('YYYY-MM-DD');
                }, 
            },
            { 
                name: "CLIENTE",
                type: "text",
                title: "Cliente",
                width: "30%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "REFERENCIA",
                type: "text",
                title: "Referencia",
                width: "20%",
                headercss: "text-center text-primary",
                align: "left" 
            },
            { 
                name: "MONTO",
                type: "number",
                title: "Monto",
                width: "10%",
                headercss: "text-center text-primary",
                align: "center",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                }
            },
            { 
                name: "MONTONETO",
                type: "number",
                title: "Neto",
                width: "10%",
                headercss: "text-center text-primary",
                align: "center",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                }
            },
            { 
                name: "COMISION",
                type: "number",
                title: "Comision",
                width: "10%",
                headercss: "text-center text-primary",
                align: "center",
                itemTemplate: function(value) {
                    return formatNumber(value) ;
                }
            },
            {
                title: "Seleccione",
                align: "center",
                width: "10%",
                itemTemplate: function (_, item) {
                    return $("<input>").attr("type", "checkbox")
                        .prop("checked", $.inArray(item, selectedItems) > -1)
                        .on("change", function () {
                            
                            if ($(this).is(":checked")) {

                                selectItem(item);

                            } else {

                                unselectItem(item);

                            }

                        });
                },
            },
        ]

    });

    var selectItem = function (item) {
        selectedItems.push(item);
    };

    var unselectItem = function (item) {
        selectedItems = $.grep(selectedItems, function (i) {
            return i !== item;
        });
    };

    $("#jsGridPorConciliar").jsGrid("sort", { field: "FECHA", order: "desc" });

});



//Carga todo el documento
$(document).ready(function(){

    getListaBancos(cEmpresa);

});


//Genera certificados a partir del banco escogido
$("#bt-generar").click(async function () {

    await setTables();

});


//Muestra los MVCERTIFICADOS que estan por conciliar y rechaza los que hay que rechazar
$("#bt-por-conciliar").click(async function () {

    debugger;

    certificadosVerificados = certificadosPorConciliar = [];

    await asyncForEach(cCertificados, async (element) => {

        if (element.ESTADO == '2') {

            certificadosPorConciliar = await putPorConciliar(cEmpresa, element.ORIGEN, element.NRODCTO, element.TIPODCTO, element.NROCOMPROB, element.CODIGOCTA, cUsuario, element.FECHA);

            if (certificadosPorConciliar) {

                certificadosVerificados.push(certificadosPorConciliar);

            }

        }


    });

    if (certificadosVerificados.length) {

        setTables();
        

    } else {

        $("#error-por-conciliar").text("No hay certificados por conciliar.");
        $("#error-por-conciliar").removeClass("visually-hidden");

    }

    showModalporConciliar();

});


// Verificar el certificado después de confirmar los datos
$("#bt-verificar").click(async function () {

    var cReferencia = $("#input-referencia").val();
    var cFechaInputVerificar = $("#input-fecha").val();

    var cPutCertifica = await putCertifica(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cReferencia, cUsuario, cFechaInputVerificar);

    if(cPutCertifica == true){

        var cPutVerificarCertificado = await putVerificarCertificado(cEmpresa, cOrigen, cTipoDcto, cNroDcto, '2', cUsuario);

        if(cPutVerificarCertificado == true){

            await setTables();

            $("#md-verificar").modal("toggle");

            showModal("Mensaje", "El certificado ha sido verificado con éxito");

        } else {

            showModal("Error", 'No fue posible actualizar el estado del certificado, por favor intente de nuevo');

        }

    } else {

        showModal("Error", "No fue posible actualizar los datos del certificado,  por favor intente de nuevo");            

    }
    
});




// Mostrar el Modal para la conciliación express
$("#bt-modal-conciliar-express").click(async function () {

    var cReferencia = $("#input-referencia").val();
    var cFechaInputVerificar = $("#input-fecha").val();

    $("#md-verificar").modal("toggle");

    var cPutCertifica = await putCertifica(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cReferencia, cUsuario, cFechaInputVerificar);

    if(cPutCertifica == true){

        showModalConciliacionExpress();

    } else {

        showModal("Error", 'No fue posible actualizar el estado del certificado, por favor intente de nuevo');

    }
    

});


$("#input-banco").change(function () {

    cBanco = this.value;

});




// Rechazar Certificado

 // Mostrar el Modal para rechazar el certificado
 $("#bt-modal-rechazar").click(async function () {

    $("#md-verificar").modal("toggle");

    await getListaMotivosRechazo(cEmpresa);
 
    $("#input-comentario-rechazo").attr("disabled", true).attr("readOnly", true).addClass("disabled");    
    $("#md-rechazar").modal("show");

});


// Input ubicado en el modal para rechazar certificados
$("#input-motivo-rechazo").on('select2:select', function () {

    $("#input-comentario-rechazo").attr("disabled", false).attr("readOnly", false).removeClass("disabled");
    $("#bt-rechazar-certificado").attr("disabled", false).attr("readOnly", false).removeClass("disabled");

});


// Botón ubicado en el modal para rechazar certificados
$("#bt-rechazar-certificado").click(async function () {

    var cEstado = $("#input-motivo-rechazo").val();
    var cComentario = $("#input-comentario-rechazo").val();
    var cPutRechazar = await putRechazarCertificado(cEmpresa, cOrigen, cTipoDcto, cNroDcto, cEstado, cUsuario, cComentario ? cComentario : 'N/A');

        if(cPutRechazar == true){

            $("#md-rechazar").modal("toggle");
            showModal("Mensaje", 'El certificado ha sido rechazado correctamente');
            await setTables();

        } else {

            $("#md-rechazar").modal("toggle");
            showModal("Mensaje", 'No se ha podido rechazar el certificado, por favor intente nuevamente');
            
        }        

    $("#input-motivo-rechazo").val(undefined);
    $("#input-comentario-rechazo").val(undefined);

});