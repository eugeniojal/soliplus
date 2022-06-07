// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");




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

async function getReporteReportePagosYFacturas(pEmpresa, pFechaIni, pFechaFin) {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var cReporteReportePagosYFacturas = await fetch(`${WebApiServer}api/Cartera/GetReportePagosYFacturas?Empresa=${pEmpresa}&FechaIni=${pFechaIni}&FechaFin=${pFechaFin}`, requestOptions)
        .then(response => response.json())

    await loadTable(cReporteReportePagosYFacturas);

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
                    0,
                    2

                ]

            }, {
                searchPanes: {
                    show: false
                },
                targets: [
                    1,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15
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
                -1, 100, 200, 300
            ],
            [
                "Todos", 100, 200, 300,
            ]
        ],
        order: [[1, "asc"]],
        columns: [
            {    // 0
                title: "ID",
                data: "ID"
            }, { // 1
                title: "Codigo",
                data: "CODEXTERNO"
            }, { // 2
                title: "Cliente",
                data: "CLIENTE"
            }, { // 3
                title: "Tipo Venta",
                data: "TIPO_VENTA",
                className: 'dt-body-right'
            }, { // 4
                title: "Tipo Dcto",
                data: "TIPODCTO_SP"
            }, { // 5
                title: "Pedido",
                data: "PEDIDO_SP"
            }, { // 6
                title: "Pedido EK",
                data: "PEDIDO_EK"
            }, { // 7
                title: "Referencia",
                data: "REFERENCIA_BANCARIA"
            }, { // 8
                title: "Fecha Abono",
                data: "FECHA_ABONO",
                render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
            }, { // 9
                title: "Concepto",
                data: "CONCEPTO"
            }, { // 10
                title: "Tasa",
                data: "TCAMBIO_PAGO",
                render: DataTable.render.number(',', '.', 2)
            }, { // 11
                title: "Factura",
                data: "FACTURA_EK"
            }, { // 12
                title: "Aprobacion",
                data: "APROBACION"
            }, { // 13
                title: "Pagado en $",
                data: "PAGADO_US"
            }, { // 14
                title: "Banco",
                data: "BANCO"
            }
            , { // 15
                title: "Deposito",
                data: "VALOR_DEPOSITO"
            }
        ]
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

    await getReporteReportePagosYFacturas(cEmpresa, cFechaInicial, cFechaFinal);

});