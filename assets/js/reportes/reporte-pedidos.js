// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;
    
//GETS


async function getPedidos(pEmpresa, pFecha1, pFecha2){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var rGetPedidos = await fetch(WebApiServer + "api/Cartera/GetPedidos?Empresa="+pEmpresa+"&Fecha1="+pFecha1+"&Fecha2="+pFecha2, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        console.log(rGetPedidos);

        await loadTable(rGetPedidos);
                    
}

Date.prototype.toDateInputValue = (async function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});


async function showModal(pTitulo, pMensaje){
    
    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
    
}

//TABLA
async function loadTable(cSource) {

    var table = $('#reportTable').DataTable({
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
            responsive: true,
            dom: '<"top"P>rtBi<"bottom"lp><"clear">',
            columnDefs: [
                {
                    searchPanes: {
                        show: true
                    },
                    targets: [
                       0,
                       1,
                    ]
    
                }
            ],
            buttons: [
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
                {    // 0
                    title: "Concesionario",
                    data: "NOMBRE"
                },
                {    // 1
                    title: "Pedido",
                    data: "NRODCTO"
                },
                {    // 2
                    title: "Referencia",
                    data: "DCTOREF"
                }, { // 3
                    title: "Fecha Ven",
                    data: "FECHA1",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 4
                    title: "Fecha",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 5
                    title: "Valor US",
                    data: "VALORUS"
                }, { // 6
                    title: "Valor BS",
                    data: "VALORBS"
                }, { // 7
                    title: "Tasa",
                    data: "TCAMBIO"
                }, { // 8
                    title: "# Aprobacion",
                    data: "NUMAPROB"
                }
            ]
        });
    
}


$(document).ready(async function(){

    $('#input-fecha-inicial').val(new Date().toDateInputValue());
    $('#input-fecha-final').val(new Date().toDateInputValue());



});


$("#bt-home").click(async function () {
    userHome(cInterno);
});

$("#bt-generar").click(async function (){

    cFechaInicial = $("#input-fecha-inicial").val();
    cFechaFinal   = $("#input-fecha-final").val();

    await getPedidos(cEmpresa, cFechaInicial, cFechaFinal);

});









