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

async function getReporteSaldoPorDocumento(pEmpresa, pCliente){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetReporteSaldoConsolidado = await fetch(WebApiServer + "api/Cartera/GetReporteSaldoPorDocumento?Empresa=" + pEmpresa +"&Cliente=" + pCliente, requestOptions)
        .then(response => response.json());

        await loadTable(rGetReporteSaldoConsolidado);

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
                }
    
            },
            responsive: true,
            dom: '<"top"P>rtBi<"bottom"lpF><"clear">',
            columnDefs: [
                {
    
                    searchPanes: {
                        show: true
                    },
                    targets: [
                       1,
                       2,
                       3
                    ]
    
                }, {
                    searchPanes: {
                        show: false
                    },
                    targets: [
                        0,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10,
                        11
                    ]
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    title: 'Reporte Saldo Consolidado',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    autoFilter: true
                },
                {
                    extend: 'pdf',
                    messageBottom: null,
                    text: '<i class="fas fa-file-pdf"></i>',
                    title: 'Reporte Saldo Consolidado',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fas fa-copy"></i>',
                    title: 'Reporte Saldo Consolidado',
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
            order: [[ 1, "asc" ]],
            columns: [
                {   // 0
                    title: "Cliente",
                    data: "NOMBRE_CLIENTE"
                }, { // 1
                    title: "TipoDcto",
                    data: "TIPODCTO"
                }, { // 2
                    title: "ID",
                    data: "NRODCTO"
                }, { // 3
                    title: "Pedido",
                    data: "DCTOREF"
                }, { // 4
                    title: "Fecha",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 5
                    title: "Monto US",
                    data: "MONTO_US",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2)

                }, { // 6
                    title: "Pagado US",
                    data: "PAGADO_US",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2)
                }, { // 7
                    title: "Saldo US",
                    data: "SALDO_US",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2)
                }, { // 8
                    title: "Monto BS",
                    data: "MONTO_BS",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2)
                }, { // 9
                    title: "Pagado BS",
                    data: "PAGADO_BS",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2)
                }, { // 10
                    title: "Saldo BS",
                    data: "SALDO_BS",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2)
                }, { // 11
                    title: "Tipo Venta",
                    data: "TIPOVENTA"
                }

            ],
            footerCallback: function (row, data, start, end, display) {
                
                console.log(row, data, start, end, display);
            
                var api = this.api();
     
        
                // converting to interger to find total
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
     
                // computing column Total of the complete result 
                var cSaldoTotalUs = api
                    .column(7)
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );
                    
                var cSaldoTotalBs = api
                    .column(10)
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );
                                  
                
                // Update footer by showing the total with the reference of the column index 

                $( api.column(7).footer() ).html(formatNumber(cSaldoTotalUs));
                $( api.column(10).footer() ).html(formatNumber(cSaldoTotalBs));


            }
        });


        $('#reportTable thead th').css('background-color', 'white').css('background-color', 'white');
            
    
      
    
}




$(document).ready(function(){

    getListaClientes(cEmpresa, cUsuario, cFiltrado);

});


$("#input-cliente").change(async function(){

    cCliente = this.value;

});

$("#bt-home").click(async function () {
    userHome(cInterno);
});

$("#bt-generar").click(async function (){

    await getReporteSaldoPorDocumento(cEmpresa, cCliente);

});
