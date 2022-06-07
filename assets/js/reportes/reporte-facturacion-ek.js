// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");


var detalleCols = [
    {    // 0
        title: "Tipo Dcto",
        data: "TIPODCTO"
    }, { // 1
        title: "Contribuyente",
        data: "CONTRIBUYENTE"
    }, { // 2
        title: "RIF",
        data: "RIF"
    }, { // 3
        title: "Num Dcto",
        data: "NRODCTO"
    }, { // 4
        title: "Anulado",
        data: "ANULADO"
    }, { // 5
        title: "Fecha",
        data: "FECHA",
        render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
    }, { // 6
        title: "Total Bruto",
        data: "TOTALBRUTOBS"
    }, { // 7
        title: "IVA",
        data: "IVABS"
    }, { // 8
        title: "Total Neto",
        data: "TOTALNETOBS"
    }, { // 9
        title: "Tipo Pago",
        data: "TIPOPAGO"
    }, { // 10
        title: "Nota",
        data: "NOTA"
    }, { // 11
        title: "Codigo Prod",
        data: "PRODUCTO"
    }, { // 12
        title: "Nombre Prod",
        data: "NOMBRE"
    }, { // 13
        title: "Cantidad",
        data: "CANTPROD"
    }, { // 14
        title: "Precio Und 1",
        data: "PRECIO1"
    }, { // 15
        title: "Precio Und 2",
        data: "PRECIO2"
    }, { // 16
        title: "Total Neto (Prod)",
        data: "TOTALNETO"
    }, { // 17
        title: "Descuento",
        data: "DESCUENTO"
    }, { // 18
        title: "% Descuento",
        data: "PORDESC"
    }, { // 19
        title: "Documento Afectado",
        data: "DOCAFEC"
    }, { // 20
        title: "Tasa Cambio",
        data: "TCAMBIO"
    }, { // 21
        title: "Serial Motor",
        data: "SERIALMOTOR"
    }, { // 22
        title: "Aprobacion",
        data: "NUMAPROB"
    }
]

async function setFecha(pDias) {

    var cFecha = new Date();
    var cFechaLocal = new Date(cFecha - cFecha.getTimezoneOffset() * 60000).toISOString().substr(0, 10);

    var cFechaInicial = moment(cFechaLocal);
    var cFechaFinal = cFechaInicial.add(pDias, 'days');
    var cFecIni = cFechaFinal.format().substr(0, 10);
    var cFecFin = cFechaLocal;

    $("#input-fecha-inicial").val(cFecIni);
    $("#input-fecha-final").val(cFecFin);

}

async function getReporteFacturacionEK(pEmpresa, pdesde, phasta) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cReporteFacturacionEK = await fetch(`${WebApiServer}api/Integracion/GetReporteEk?Empresa=${pEmpresa}&desde=${pdesde}&hasta=${phasta}&detalle=true`, requestOptions)
        .then(response => response.json())

    await loadTable(cReporteFacturacionEK);

}

async function loadTable(cSource) {

    $('#reportTable').DataTable({
        data: await cSource,
        destroy: true,
        fixedHeader: {
            header: true,
            headerOffset: 64
        },
        language: {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla =(",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "buttons": {
                "copyTitle": 'Datos copiados',
                "copySuccess": {
                    "1": "Se copió una fila",
                    "_": "Se copiaron %d filas"
                },
                "copy": "Copiar",
                "colvis": "Visibilidad"
            },

        },
        searchPanes: {
            cascadePanes: true,
            initCollapsed: true,
            layout: 'columns-3',
            dtOpts: {
                dom: 'tp',
                paging: 'true',
                pagingType: 'numbers'
            },
            i18n: {

                title: {
                    _: 'Filters Selected - %d',
                    0: 'No Filters Selected',
                    1: 'One Filter Selected'
                }
            }

        },
        responsive: true,
        dom: '<"top"P>rtBi<"bottom"lp><"clear">',
        columnDefs: [
            {

                searchPanes: {
                    show: true
                },
                targets: [
                    2,
                    3,
                    5,
                    22

                ]

            }, {
                searchPanes: {
                    show: false
                },
                targets: [
                    0,
                    1,
                    4,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                    21,




                ]
            }
        ],
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> ',
                title: 'Reporte Pedidos por Rango de Fechas',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-success',
                autoFilter: true
            },
            {
                extend: 'pdf',
                messageBottom: null,
                text: '<i class="fas fa-file-pdf"></i>',
                title: 'Reporte Pedidos por Rango de Fechas',
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-danger'
            },
            {
                extend: 'copyHtml5',
                text: '<i class="fas fa-copy"></i>',
                title: 'Reporte Pedidos por Rango de Fechas',
                className: 'btn btn-primary',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            }

        ],
        lengthMenu: [
            [
                100, 200, 300, -1
            ],
            [
                100, 200, 300, "Todos"
            ]
        ],
        order: [[1, "asc"]],
        columns: detalleCols
    });

}

$(document).ready(function () {

    setFecha(-30);

});

$("#bt-home").click(async function () {

    userHome(cInterno);

});

$("#bt-generar").click(async function () {

    cFechaInicial = $("#input-fecha-inicial").val();
    cFechaFinal = $("#input-fecha-final").val();

    await getReporteFacturacionEK(cEmpresa, cFechaInicial, cFechaFinal);

});