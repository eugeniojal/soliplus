//Variables globales
var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cUsuario = sessionStorage.getItem("Usuario");

var cCertificados = [];
var revisarVerificar;
var revisarRechazar;

var selectedItems = [];
var selectedFile;

var cBanco;

var cCertifica = [];
var cCertificadosProblemas = [];

var $listaBancos = $('#input-banco');


//Gets y Sets 

//Get certificados cargado por operadoras
async function getCertifica(pEmpresa, pCodigoCta) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rCertifica = await fetch(WebApiServer + "api/Certificados/GetCertifica?Empresa=" + pEmpresa + "&CodigoCta=" + pCodigoCta, requestOptions)
        .then(response => response.json());

    cCertificados = rCertifica;
    console.log(cCertificados);
    return rCertifica;
}

//Get certificados cargado por operadoras dependiendo del estado
async function getCertificaEstado(pEmpresa, pEstado, pCodigoCta) {


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rCertificaEstado = await fetch(`${WebApiServer}api/Certificados/GetCertificaEstado?Empresa=${pEmpresa}&Estado=${pEstado}&CodigoCta=${pCodigoCta}`, requestOptions)
        .then(response => response.json());

    return rCertificaEstado;
}

//GetProblemas
async function getCertificaProblemas(pEmpresa, pCodigoCta) {


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rCertificaProblemas = await fetch(WebApiServer + "api/Certificados/GetCertificaProblemas?Empresa=" + pEmpresa + "&CodigoCta=" + pCodigoCta, requestOptions)
        .then(response => response.json());

    cCertificadosProblemas = rCertificaProblemas;
    console.log(cCertificadosProblemas);
    return rCertificaProblemas;
}

//Get lista de bancos
async function getListaBancos(pEmpresa) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rGetListaBancos = await fetch(WebApiServer + "api/Cartera/GetListaBancos?Empresa=" + pEmpresa, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    $listaBancos.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaBancos, async (element) => {

        $listaBancos.append($('<option />', {
            value: (element.CODIGOCTA),
            text: (element.NOMBRE + " - " + element.NROCTA)
        }));


    });

    $listaBancos.val(undefined).select2();

}

//Puts
async function putVerificarCertificado(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pEstado, pPasswordMo) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutVerificarCertificado = await fetch(`${WebApiServer}api/Certificados/PutCertificaVerifica?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Estado=${pEstado}&PasswordMo=${pPasswordMo}`, requestOptions)
        .then(response => response.json());

    // console.logcPutVerificarCertificado);
    return cPutVerificarCertificado;

}

async function putRechazarCertificado(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pDescripcion, pPasswordMo) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutRechazarCertificado = await fetch(`${WebApiServer}api/Certificados/PutCertificaRechazar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Descripcion=${pDescripcion}&PasswordMo=${pPasswordMo}`, requestOptions)
        .then(response => response.json());

    console.log(cPutRechazarCertificado);
    return cPutRechazarCertificado;

}

async function putCertifica(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pNroComrob, pPasswordMo, pFecha) {
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rPutCertifica = await fetch(`${WebApiServer}api/Certificados/PutCertifica?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&NroComrob=${pNroComrob}&PasswordMo=${pPasswordMo}&Fecha=${pFecha}`, requestOptions)
        .then(response => response.json());


    return rPutCertifica;

}

async function putConciliar(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pMonto, pMontoNeto, pComision, pPasswordMo, pCodigoCta) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutConciliar = await fetch(`${WebApiServer}api/Certificados/PutConciliar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&Monto=${pMonto}&MontoNeto=${pMontoNeto}&Comision=${pComision}&PasswordMo=${pPasswordMo}&CodigoCta=${pCodigoCta}`, requestOptions)
        .then(response => response.json());


    return cPutConciliar;

}

async function putPorConciliar(pEmpresa, pOrigen, pNroDcto, pTipoDcto, pNroComprob, pCodigoCta, pPasswordMo, pFecha) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutPorConciliar = await fetch(`${WebApiServer}api/Certificados/PutPorConciliar?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&NroComprob=${pNroComprob}&CodigoCta=${pCodigoCta}&PasswordMo=${pPasswordMo}&Fecha=${pFecha}`, requestOptions)
        .then(response => response.json())

    return cPutPorConciliar[0];


}

async function PutConciliarExpress(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pUrlConExpress, pPasswordMo) {

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cPutConciliarExpress = fetch(`${WebApiServer}api/Certificados/PutCertificaExpress?Empresa=${pEmpresa}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&UrlConExpress=${pUrlConExpress}&PasswordMo=${pPasswordMo}`, requestOptions)
        .then(response => response.json())

    return cPutConciliarExpress;

}


//Post imagen certificado express
async function PostImagen(pEmpresa, fileInput, pUbicacion) {

    console.log(fileInput.files[0]);

    var formdata = new FormData();
    formdata.append("fileUpload", fileInput.files[0]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Upload/PostFile?Empresa=" + pEmpresa + "&Ubicacion=" + pUbicacion, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            resultado = result;
        })
        .catch(error => console.log('error', error));

    if (resultado.Response != '1') {
        showModal("Error de base de datos", "Mensaje: " + resultado.error);
    }

    return resultado;
}

//Modales
async function showModalRechazar(pNroDcto) {


    $("#md-rechazar").modal("show");

    $("#btn-rechazar").click(async function () {

        cComentarioRechazar = $("#input-rechazar").val();

        await putRechazarCertificado(cEmpresa, 'BAN', 'SP', pNroDcto, cComentarioRechazar, cUsuario);

        await getCertifica(cEmpresa, cBanco);
        await loadTable(cCertificados);

        $("#md-rechazar").modal("toggle");

    });

}

async function showModalporConciliar() {


    $("#md-por-conciliar").modal("show");


}

async function verificarCertificado(pCertificado) {

    $("#input-referencia").val(pCertificado.NROCOMPROB);

    cFechaModal = pCertificado.FECHA;

    cFecha = estandarizarFecha(cFechaModal);

    //Metemos el valor
    $("#input-fecha").val(cFecha);

    cNroDcto = pCertificado.NRODCTO;

    //Editamos el link de la imagen para ser mostrado en el MoDAL
    link_imagen = pCertificado.URLCOMPROB.replace("C:\\inetpub\\wwwroot\\", "http://soliplus.consolidez.com/");
    link_imagen = link_imagen.replaceAll(/\\/g, '/');
    $("#imagen-certificado").attr('src', link_imagen);

    //Abrimos el modal
    $("#md-verificar").modal("show");

    $("#btn-modal-rechazar").click(async function () {

        $("#md-verificar").modal("toggle");

        showModalRechazar(cNroDcto);

    });

    $("#btn-verificar").click(async function () {

        cReferencia = $("#input-referencia").val();
        cFechaInputVerificar = $("#input-fecha").val();

        //AIUDA

        await putCertifica(cEmpresa, 'BAN', 'SP', cNroDcto, cReferencia, cUsuario, cFechaInputVerificar);
        await putVerificarCertificado(cEmpresa, 'BAN', 'SP', cNroDcto, '2', cUsuario);

        await getCertifica(cEmpresa, cBanco);
        await loadTable(cCertificados);

        $("#md-verificar").modal("toggle");

    });

    $("#btn-modal-conciliar-express").click(async function () {

        cReferencia = $("#input-referencia").val();
        cFechaInputVerificar = $("#input-fecha").val();

        $("#md-verificar").modal("toggle");

        await putCertifica(cEmpresa, 'BAN', 'SP', cNroDcto, cReferencia, cUsuario, cFechaInputVerificar);

        showModalConciliacionExpress(pCertificado);

    });

}

async function showModal(pTitulo, pMensaje) {

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
}

function showModalConciliacionExpress(pCertificadoExpress) {

    $("#input-monto-express").val(pCertificadoExpress.MONTO);
    $("#input-comision-express").val(pCertificadoExpress.COMISION)

    console.log(pCertificadoExpress);

    $("#md-conciliacion-express").modal("show");

    $("#btn-conciliacion-express").click(async function () {

        var montoExpress = setNumeric($("#input-monto-express").val());
        var comisionExpress = setNumeric($("#input-comision-express").val());
        var codigoConciliacion = $("#input-conciliacion-express").val();

        var montoNetoExpress = montoExpress - comisionExpress;

        if (codigoConciliacion == '787') {

            var cUbicacion = 'PROTOTIPO';

            await putConciliar(cEmpresa, pCertificadoExpress.ORIGEN, pCertificadoExpress.TIPODCTO, pCertificadoExpress.NRODCTO, montoExpress, montoNetoExpress, comisionExpress, cUsuario, pCertificadoExpress.CODIGOCTA);

            if ($("#fileUpload").val() == '') {

                return showModal("Error", "Tiene que seleccionar un archivo");
            }
            else {

                resultado_post = await PostImagen(cEmpresa, selectedFile, cUbicacion);
                url_imagen = resultado_post.Url;
                url_imagen = url_imagen.replaceAll(/\\\\/g, '\\');

                await PutConciliarExpress(cEmpresa, pCertificadoExpress.ORIGEN, pCertificadoExpress.TIPODCTO, pCertificadoExpress.NRODCTO, url_imagen, cUsuario);

                $("#md-conciliacion-express").modal("toggle");

            }

        }

        else {

            $("#md-conciliacion-express").modal("toggle");
            showModal('Error', 'Codigo Incorrecto');
        }

        var preview = document.getElementById("preview-image");
        preview.src = ' ';

    })


}


//Funciones varias
function estandarizarFecha(FechaInicial) {

    var now = new Date(FechaInicial);
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    return today;

}

//Crear tablas

//Tabla de certificados cargados por verificar/verificados
async function loadTable(datos) {

    $("#jsGrid").jsGrid({

        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        controller: {
            loadData: function () {
                return datos;
            },

        },

        fields: [
            { name: "FECHA", type: "date", format: 'dd/MM/yyyy', title: "Fecha Transacción", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "NROCOMPROB", type: "text", title: "Referencia", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "RIF", type: "text", title: "Tipo Operación", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "MONTO", type: "number", format: "{0:n2}", title: "Monto", width: "5%", headercss: "text-center text-primary", align: "center" },
            {

                name: 'ESTADO', type: 'text', title: 'Estado', headercss: "text-center text-danger",
                itemTemplate: function (value) {

                    var iconClass = "";
                    if (value == 1) {
                        iconClass = "fa fa-times-circle"; //this is my class with an icon
                    }
                    else {
                        iconClass = "fa fa-check-circle"; //this is my class with an icon

                    }
                    return $("<span>").attr("class", iconClass);

                },
                align: "center",
                width: "3%"


            }

        ],

        rowClick: function (args) {

            verificarCertificado(args.item);

        },

    });

    $("#jsGrid").jsGrid("sort", { field: "ESTADO", order: "desc" });

}

async function loadTableProblemas(datos) {

    $("#jsGridProblemas").jsGrid({

        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        controller: {
            loadData: function () {
                return datos;
            }
        },
        fields: [
            { name: "NROCOMPROB", type: "text", title: "Referencia", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "MONTO", type: "number", format: "{0:n2}", title: "Monto", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "ESTADO", type: "text", title: "Descripcion", width: "5%", headercss: "text-center text-primary", align: "center" },
            {
                title: "Cambiar Estado",
                itemTemplate: function (_, item) {

                    var $botonCambiar = $("<button>").attr({ class: "botonCambiar fa fa-plus-square" })
                        .click(async function (e) {

                            // console.logitem);
                            await putVerificarCertificado(cEmpresa, 'BAN', 'SP', item.NRODCTO, '1', cUsuario);

                            await getCertifica(cEmpresa, cBanco);
                            await getCertificaProblemas(cEmpresa, cBanco);

                            await loadTable(cCertificados);
                            await loadTableProblemas(cCertificadosProblemas);
                        });

                    return $("<div>").append($botonCambiar);

                },
                align: "center",
                width: "3%"
            }

        ]

    });

    $("#jsGridProblemas").jsGrid("sort", { field: "ESTADO", order: "desc" });

}

async function loadTableConciliados(datos) {

    $("#jsGridConciliado").jsGrid({

        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        controller: {
            loadData: function () {
                return datos;
            }
        },
        fields: [
            { name: "NROCOMPROB", type: "text", title: "Referencia", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "MONTONETO", type: "number", format: "{0:n2}", title: "Monto Conciliado", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "NOMBRE", type: "text", title: "Concesionario", width: "5%", headercss: "text-center text-primary", align: "center" },

        ]

    });

    $("#jsGridConciliado").jsGrid("sort", { field: "ESTADO", order: "desc" });

}

async function loadTablePorConciliar(datos) {

    $("#jsGridPorConciliar").jsGrid({

        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        controller: {
            loadData: function () {
                return datos;
            }
        },
        fields: [
            { name: "FECHA", type: "date", format: 'dd/MM/yyyy', title: "Fecha Transacción", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "REFERENCIA", type: "text", title: "Referencia", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "MONTO", type: "number", format: "{0:n2}", title: "Monto", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "MONTONETO", type: "number", format: "{0:n2}", title: "Neto", width: "5%", headercss: "text-center text-primary", align: "center" },
            { name: "COMISION", type: "number", format: "{0:n2}", title: "Comision", width: "5%", headercss: "text-center text-primary", align: "center" },
            {
                title: "Seleccione",
                itemTemplate: function (_, item) {
                    return $("<input>").attr("type", "checkbox")
                        .prop("checked", $.inArray(item, selectedItems) > -1)
                        .on("change", function () {
                            if ($(this).is(":checked")) {
                                selectItem(item);
                            }
                            else unselectItem(item);
                        });
                },
                align: "center",
                width: "5%"
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

}


//Botones

//Muestra los MVCERTIFICADOS que estan por conciliar y rechaza los que hay que rechazar
$("#btn-por-conciliar").click(async function () {

    var certificadosVerificados = [];
    var certificadosPorConciliar = [];

    await asyncForEach(cCertificados, async (element) => {

        if (element.ESTADO == '2') {

            certificadosPorConciliar = await putPorConciliar(cEmpresa, element.ORIGEN, element.NRODCTO, element.TIPODCTO, element.NROCOMPROB, element.CODIGOCTA, cUsuario, element.FECHA);

            if (certificadosPorConciliar != undefined) {

                certificadosVerificados.push(certificadosPorConciliar);

            }

        }


    });


    if (certificadosVerificados[0] != undefined) {

        loadTablePorConciliar(certificadosVerificados);

        await getCertifica(cEmpresa, cBanco);
        cCertificadosEstado = await getCertificaEstado(cEmpresa, '3', cBanco);
        await getCertificaProblemas(cEmpresa, cBanco);

        loadTable(cCertificados);
        loadTableConciliados(cCertificadosEstado);
        loadTableProblemas(cCertificadosProblemas);

    }
    else {

        $("#error-por-conciliar").text("No hay certificados por conciliar.");
        $("#error-por-conciliar").removeClass("visually-hidden");



    }

    showModalporConciliar();

});

//Boton de conciliar dentro del modal
$("#btn-conciliar").click(async function () {

    selectedItems.forEach(async function (element) {

        await putConciliar(cEmpresa, element.ORIGEN, element.TIPODCTO, element.NRODCTO, element.MONTO, element.MONTONETO, element.COMISION, cUsuario);


    });

    await getCertifica(cEmpresa, cBanco);
    cCertificadosEstado = await getCertificaEstado(cEmpresa, '3', cBanco);
    await getCertificaProblemas(cEmpresa, cBanco);

    loadTable(cCertificados);
    loadTableConciliados(cCertificadosEstado);
    loadTableProblemas(cCertificadosProblemas);

    $("#md-por-conciliar").modal("toggle");


});

//Genera certificados a partir del banco escogido
$("#bt-generar").click(async function () {

    $("#btn-por-conciliar").removeClass('disabled');
    $("#btn-por-conciliar").removeAttr('disabled');


    await getCertifica(cEmpresa, cBanco);
    cCertificadosEstado = await getCertificaEstado(cEmpresa, '3', cBanco);
    await getCertificaProblemas(cEmpresa, cBanco);

    loadTable(cCertificados);
    loadTableConciliados(cCertificadosEstado);
    loadTableProblemas(cCertificadosProblemas);

});

//Verificar cambios
$("#input-banco").change(function () {

    cBanco = $("#input-banco").val();

});

$("#fileUpload").change((async function (e) {
    selectedFile = e.target;

    var src = URL.createObjectURL(e.target.files[0]);
    var preview = document.getElementById("preview-image");
    preview.src = src;
    preview.style.display = "block";

}));

//Carga todo el documento
document.addEventListener("DOMContentLoaded", async function () {
    cRif = $("#select-cliente").val();
    await getListaBancos(cEmpresa);

    // await getCertificaProblemas(cEmpresa);



});


