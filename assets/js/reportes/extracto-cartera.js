// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;

async function getListaClientes(pEmpresa, pUsuario, pFiltrado){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaClientes = await fetch(WebApiServer + "api/Common/GetListaClientes?Empresa=" + pEmpresa +"&Usuario=" + pUsuario + "&Filtrado=" + pFiltrado, requestOptions)
    .then(response => response.json());
  
    $listaClientes.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaClientes, async (element) => { 

        $listaClientes.append($('<option />', {
            value: (element.RIF),
            text: (element.NOMBRE)
        }));


    });

    $("#input-cliente").val(undefined).select2();

}


$(document).ready(function(){

    getListaClientes(cEmpresa, cUsuario, cFiltrado);

});


async function getReporteExtractoCartera(pEmpresa, pCliente){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetReporteExtractoCartera = await fetch(WebApiServer + "api/Cartera/GetReporteExtractoCartera?Empresa=" + pEmpresa +"&Cliente=" + pCliente, requestOptions)
        .then(response => response.json());

        return rGetReporteExtractoCartera;

}


async function loadTable(cSource) {

    $('#reportTable').DataTable({
        data: await cSource,
        destroy: true,
        responsive: true,
        dom: '<"top"P>rtBif<"bottom"lp><"clear">',
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
            }    
        },
        searchPanes: {
            cascadePanes: true,
            initCollapsed: true,
            layout: 'columns-3',
            dtOpts: {
                dom: 'tp',
                paging: 'true',
                pagingType: 'numbers'
            }

        },
        columnDefs: [
            {
                searchPanes: {
                    show: true
                },
                targets: [
                    0,
                    1,
                    5,
                    6,
                    2,
                    15
                ]

            }, {
                searchPanes: {
                    show: false
                },
                targets: [
                    3,
                    4,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14
                ]
            }

        ],
        buttons: [ 
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> ',
                title: 'Extracto de Cartera',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-success',
                autoFilter: true
            },
            {
                extend: 'pdf',
                messageBottom: null,
                text: '<i class="fas fa-file-pdf"></i>',
                title: 'Extracto de Cartera',
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-danger'
            },
            {
                extend: 'copyHtml5',
                text: '<i class="fas fa-copy"></i>',
                title: 'Extracto de Cartera',
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
                "Todos", 100, 200, 300
            ]
        ],
        order: [[ 0, "asc"],[ 1, "asc"],[ 3, "asc"], [6, "asc"]],
        columns: [
               { // 0
                title: "Tipo Dcto",
                data: "TIPODCTOCA"
            }, { // 1
                title: "Nro Dcto",
                data: "FACTURA"
            }, { // 2
                title: "Pedido",
                data: "DCTOREF"
            }, { // 3
                title: "Fecha",
                data: "FECHA",
                render: DataTable.render.moment( 'YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
            }, { // 4
                title: "Nombre Concepto",
                data: "NOMBRE_CONCEPTO"
            }, { // 5
                title: "Tipo Abono",
                data: "TIPODCTO"
            }, { // 6
                title: "Abono",
                data: "NRODCTO"
            }, { // 7
                title: "Tasa Cambio",
                data: "TCAMBIO",
                className: 'dt-body-right',
                render: DataTable.render.number( ',', '.', 2)
            }, { // 8 
                title: "Valor BS",
                data: "VALORBS",
                className: 'dt-body-right',
                render: DataTable.render.number( ',', '.', 2 )
            }, { // 9
                title: "Saldo BS",
                data: "SALDO_BS",
                className: 'dt-body-right',
                render: DataTable.render.number( ',', '.', 2 )
            }, { // 10
                title: "Valor US",
                data: "VALORUS",
                className: 'dt-body-right',
                render: DataTable.render.number( ',', '.', 2)
            }, { // 11
                title: "Saldo US",
                data: "SALDO_US",
                className: 'dt-body-right',
                render: DataTable.render.number( ',', '.', 2)
            }, { // 12
                title: "Tipo Venta",
                data: "NOMBRE_TIPO_VENTA"
            }, { // 13
                title: "Nombre Cliente",
                data: "NOMBRE"
            }, { // 14
                title: "Nombre Banco",
                data: "BANCO"
            }, { // 15
                title: "Referencia Bancaria",
                data: "REFERENCIA_BANCARIA"
            }, { // 16
                title: "Monto Pago",
                data: "VALOR_PAGO",
                render: DataTable.render.number( ',', '.', 2)
            }, { // 17
                title: "Moneda Pago",
                data: "MONEDA_PAGO"
            }, { // 18
                title: "Forma Pago",
                data: "FORMA_PAGO"
            }, { // 19
                title: "Nota",
                data: "NOTA"
            }
        ]
    });

}


$("#input-cliente").change(async function(){

    cCliente = this.value;

});

$("#bt-home").click(async function () {
    userHome(cInterno);
});

$("#bt-generar").click(async function (){

    await loadTable(await getReporteExtractoCartera(cEmpresa, cCliente));

});
