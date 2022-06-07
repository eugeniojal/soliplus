// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cOrigen = sessionStorage.getItem("Origen");
var cTipoDcto =  sessionStorage.getItem("TipoDcto");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cTitulo = sessionStorage.getItem("Titulo");



var elementoRechazado;
var elementoAprobado = [];
var resultado;
var excelObject;
var table;

//Funcion post a la base de datos
async function postTrade(pEmpresa, pOrigen, pTipoDcto, pNroDcto, pPedido, pDctoRef, pRif, pFechaDcto, pFechaVcto, pPasswordIn, pTasaCambio, pTipoVta, pTasaInt, pPorReteInt, pTasaMora,  
                         pTotalUs, pTotalBs, 
                         pMontoUs, pPorIvaUs, pPorRetivaUs, pPorIslrUs, 
                         pMontoUsBs, pPorIvaUsBs, pPorRetivaUsBs, pPorIslrUsBs, 
                         pMontoBs, pPorIvaBs, pPorRetivaBs, pPorIslrBs){

    resultado = undefined;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Access-Control-Allow-Private-Network", true);
    myHeaders.append("Cors", true);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
        };

        WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";
        
    await fetch(WebApiServer + "api/Facturas/PostTrade?Empresa="+pEmpresa+"&Origen="+pOrigen+"&TipoDcto="+pTipoDcto+"&NroDcto="+pNroDcto+"&Pedido="+pPedido+"&DctoRef="+pDctoRef+"&Rif="+pRif+
                         "&FechaDcto="+pFechaDcto+"&FechaVcto="+pFechaVcto+"&PasswordIn="+pPasswordIn+"&TasaCambio="+pTasaCambio+
                         "&TipoVta="+pTipoVta+"&TasaInt="+pTasaInt+"&PorReteInt="+pPorReteInt+"&TasaMora="+pTasaMora+
                         "&TotalUs="+pTotalUs+"&TotalBs="+pTotalBs+
                         "&mUs="+pMontoUs+"&pIvaUs="+pPorIvaUs+"&pRetivaUs="+pPorRetivaUs+"&pIslrUs="+pPorIslrUs+
                         "&mUsBs="+pMontoUsBs+"&pIvaUsBs="+pPorIvaUsBs+"&pRetivaUsBs="+pPorRetivaUsBs+"&pIslrUsBs="+pPorIslrUsBs+
                         "&mBs="+pMontoBs+"&pIvaBs="+pPorIvaBs+"&pRetivaBs="+pPorRetivaBs+"&pIslrBs="+pPorIslrBs, requestOptions)

    .then(response => response.text())
    .then(result => {
        console.log(result);
        resultado = result;
    })
    .catch(error => console.log('error', error));

}

//Funcion que revisa si hay alguna casilla con un problema. Crea detalle y estado del elemento dado el caso. 
async function RevisarElemento(pElement){

    var respuesta = true;
    var elementosFaltan = [];

    keys.forEach((key) => {

        if(pElement[key] === "" && key != "Pedido"){
            elementoRechazado.push(pElement);
            elementosFaltan.push(key);
            console.log(`Falta un dato en ${elementosFaltan}`);
            pElement.Detalle = "Data incompleta";
            pElement.Estado = "Rechazado";

            //Guardar esto en una variable y pasarle el key el cual esta vacia para ubicarlo mas facilmente
            document.getElementById('comentario').innerHTML = `Elemento vacio en ${elementosFaltan}`;
            showModal("Alerta", `Elemento vacio en ${elementosFaltan}`);
            respuesta = false;
            $("#fileUploader").val('');
        }
    });
    return respuesta;
}

//Revisar si los titulos o indices del documento excel son los correctos (Y que no falte ninguno)
async function VerIndices(pexcelObject){
    keys = Object.keys(pexcelObject[0]);

    if(keys[0] != "Origen" && keys[1] != "TipoDcto" && keys[2] != "NroDcto" && keys[3] != "Pedido" && keys[4] != "DctoRef" && keys[5] != "Rif" && keys[6] != "FechaDcto" && 
    keys[7] != "FechaVcto" && keys[8] != "PasswordIn" && keys[9] != "TasaCambio" && keys[10] != "TipoVta" && keys[11] != "TasaInt" && keys[12] != "PorReteInt" && 
    keys[13] != "TasaMora" && keys[14] != "TotalUs" && keys[15] != "TotalBs" && keys[16] != "MontoUs" && keys[17] != "PorIvaUs" && keys[18] != "PorRetivaUs" && 
    keys[19] != "PorIslrUs" && keys[20] != "MontoUsBs" && keys[21] != "PorIvaUsBs" && keys[22] != "PorRetivaUsBs" && keys[23] != "PorIslrUsBs" && 
    keys[24] != "MontoBs" && keys[25] != "PorIvaBs" && keys[26] != "PorRetivaBs" && keys[27] != "PorIslrBs"){

        document.getElementById('comentario').innerHTML = "El formato del excel no es el correcto";
        showModal("Alerta", "El formato de excel no es el correcto");
        console.log("Plantilla incorrecta");
        return false;
    }
    else{
        console.log("Plantilla correcta");
        return true;
    }
   
}

//Convierte el elemento de fecha a formato para MySQL
async function ConvFecha(pElement){
    pElement.FechaDcto = pElement.FechaDcto.toJSON().slice(0,10);
    pElement.FechaVcto = pElement.FechaVcto.toJSON().slice(0,10);
}


function FilaRepetida(aprobado, ele){

    respuesta = true;
    
    for(let i = 0; i < aprobado.length; i++){

        if(aprobado[i].Origen === ele.Origen && aprobado[i].TipoDcto === ele.TipoDcto && aprobado[i].NroDcto === ele.NroDcto){
            elementoRechazado.push(ele);
            document.getElementById('comentario').innerHTML = "Dos filas no pueden tener el mismo campo en Origen, TipoDcto y Nro Dcto";
            showModal("Alerta", "Dos filas no pueden tener el mismo campo en Origen, TipoDcto y Nro Dcto");
            respuesta = false;
        }
    }
    return respuesta;
}

//Funcion para mostrar el Modal
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
}

//Aqui se verifica que el excel cargado este listo para guardar en base de datos.
async function loadingExcel(pExcelObject) {

    var botonGuardar = true;

    //Verificamos si los indices son correctos (solo neceitamos el primer objeto para esto)

    if(await VerIndices(pExcelObject)){

        await asyncForEach(pExcelObject, async (elemento) => {
            //Verificamos que no haya Origen/TipoDcto/NorDcto repetido en el documento
    
            if(FilaRepetida(elementoAprobado, elemento)){
                if(await RevisarElemento(elemento)){
                    //Convertimos la fecha a AAAA-MM-DD
                    await ConvFecha(elemento);
                    elementoAprobado.push(elemento);
                }
                else{
                    botonGuardar = false;
                }
            }
            else{
                botonGuardar = false;
            }
           

            //Revisamos que no hayan filas vacias donde no deberian haber 
            
            
        }); 
        
        if(botonGuardar){
            document.getElementById('bt-save').disabled = false;
            console.log("Habilitamos el boton de guardar");
        }
        
        //Imprimimos los elementos rechazados en la tabla
        if(elementoRechazado.length > 0){
            loadTable(elementoRechazado);
        }
    }
}

//Cargamos el archivo excel
$("#fileUploader").change(async function (evt) {


    document.getElementById('comentario').innerHTML = "";

    elementoRechazado = [];

    selectedFile = evt
        .target
        .files[0];
    reader = new FileReader();

    reader.onload = async function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {type: 'binary', cellDates: true});

        workbook.SheetNames.forEach(function (sheetName) {
           
            if(sheetName != "Trade"){
                console.log("Error de nombre de pagina");
            }  
            else{
              console.log("Nombre de pagina correcto");
              excelObject = XLSX.utils.sheet_to_json(workbook.Sheets["Trade"],{defval: "", raw: true});

            }

            });

        // await getTipoDcto();
        await loadingExcel(excelObject);

    };

    reader.onerror = function (event) {

        console.error(
            "No es posible leer del archivo! - Código de Error: " + event.target.error.code
        );
    };

    reader.readAsBinaryString(selectedFile);
});

//Guardamos
$("#bt-save").click(async function () {

    document.getElementById('bt-save').disabled = true;

    await asyncForEach(excelObject, async (fila) => {

        await postTrade( cEmpresa, fila.Origen, fila.TipoDcto, fila.NroDcto, fila.Pedido, fila.DctoRef, fila.Rif, fila.FechaDcto, fila.FechaVcto, 
                        fila.PasswordIn,  fila.TasaCambio,  fila.TipoVta,  fila.TasaInt,  fila.PorReteInt,  fila.TasaMora,  
                        fila.TotalUs,  fila.TotalBs, fila.MontoUs,  fila.PorIvaUs,  fila.PorRetivaUs,  fila.PorIslrUs, 
                        fila.MontoUsBs,  fila.PorIvaUsBs,  fila.PorRetivaUsBs,  fila.PorIslrUsBs, fila.MontoBs,  fila.PorIvaBs,  
                        fila.PorRetivaBs,  fila.PorIslrBs);

        if(resultado != '"1"'){
            // resultado.toString().slice(0,10);
            // console.log(typeof(resultado));
            console.log("Error de base de datos");
            document.getElementById('comentario').innerHTML = "Error de base de datos";
            showModal("Alerta", "Error de base de datos");
        }
        else{
            console.log("Excel cargado a la base de datos");
           //  alert('Los datos fueron guardados satisfactoriamente');
        }
    });


    showModal("Mensaje", "Proceso finalizado");

    $("#fileUploader").val('');

    document
        .getElementById('fileUploader')
        .disabled = false;
});

//Cargar la tabla
async function loadTable(cSource) {


        table = $('#reportTable').DataTable({
        data: await cSource,
        destroy: true,
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
        responsive: true,
        dom: '<"top"P>rtBif<"bottom"lp><"clear">',
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
                10, 20, 50, -1
            ],
            [
                10, 20, 50, "All"
            ]
        ],
        columns: [
               { // 0
                title: "Origen",
                data: "Origen"
            }, { // 1
                title: "TipoDcto",
                data: "TipoDcto"
            }, { // 2
                title: "NroDcto",
                data: "NroDcto"
            }, { // 3
                title: "Pedido",
                data: "Pedido",
            }, { // 4
                title: "DctoRef",
                data: "DctoRef"
            }, { // 5
                title: "Rif",
                data: "Rif"
            }, { // 6
                title: "FechaDcto",
                data: "FechaDcto",
                type: "date"
            }, { // 7
                title: "FechaVcto",
                data: "FechaVcto",
                type: "date"
            }, { // 8
                title: "PasswordIn",
                data: "PasswordIn"
            }, { // 9
                title: "TasaCambio",
                data: "TasaCambio"
            }, { // 10
                title: "TipoVta",
                data: "TipoVta"
            }, { // 11
                title: "TasaInt",
                data: "TasaInt"
            }, { // 12
                title: "PorReteInt",
                data: "PorReteInt"
            }, { // 13
                title: "TasaMora",
                data: "TasaMora"
            }, { // 14
                title: "TotalUs",
                data: "TotalUs"
            }, { // 15
                title: "TotalBs",
                data: "TotalBs"
            }, { // 16
                title: "MontoUs",
                data: "MontoUs"
            }, { // 17
                title: "PorIvaUs",
                data: "PorIvaUs"
            }, { // 18
                title: "PorRetivaUs",
                data: "PorRetivaUs"
            }, { // 19
                title: "PorIslrUs",
                data: "PorIslrUs"
            }, { // 20
                title: "MontoUsBs",
                data: "MontoUsBs"
            }, { // 21
                title: "PorIvaUsBs",
                data: "PorIvaUsBs"
            }, { // 22
                title: "PorRetivaUsBs",
                data: "PorRetivaUsBs"
            }, { // 23
                title: "PorIslrUsBs",
                data: "PorIslrUsBs"
            }, { // 24
                title: "MontoBs",
                data: "MontoBs"
            },{ // 25
                title: "PorIvaBs",
                data: "PorIvaBs"
            }, { // 26
                title: "PorRetivaBs",
                data: "PorRetivaBs"
            }, { // 27
                title: "PorIslrBs",
                data: "PorIslrBs"
            },
        ] 
    });
}