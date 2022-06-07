// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cInterno = sessionStorage.getItem("Interno");

var $listaBancos = $('#input-banco');

var cDatosBanco,  cBanco;

// Bancos con separadores de decimales con coma
var cBancosConComa = [
    '204',  // Banesco $
    '116'
];

var cBancos = [];

var  transaccionesInvalidas;
var  transaccionesValidas;

var resultado;
var excelObject;
var txtObject;


async function getListaBancos(pEmpresa){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaBancos = await fetch(`${WebApiServer}api/Cartera/GetListaBancosConciliacion?Empresa=${pEmpresa}`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    $listaBancos.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaBancos, async (element) => { 

        cBancos.push(element);

        $listaBancos.append($('<option />', {
            value: (element.CODIGOCTA),
            text: (element.NOMBRE + " - " + element.NROCTA)
        }));


    });

    $listaBancos.val(undefined).select2();

}

async function cPostMvExtracto(pEmpresa, pCodigoCta, pReferencia, pFecha, pEsCredito, pMonto, pTipoTransaccion, pUsuario){
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };
      
    var cPostMvExtractocPostMvExtracto = await fetch(WebApiServer + "api/Extractos/PostExtracto?Empresa="+pEmpresa+"&CodigoCta="+pCodigoCta+"&Referencia="+pReferencia+"&Fecha="+pFecha+"&EsCredito="+pEsCredito+"&Monto="+pMonto+"&TipoTransaccion="+pTipoTransaccion+"&PasswordIn="+pUsuario, requestOptions)
                                .then(response => response.json());

    return cPostMvExtractocPostMvExtracto;

}

function revisarExcel(objeto){

    objeto.forEach(async function(element){


        if(element.ESCREDITO == 1){

            element.TIPOTRANSACCION = "101";
            element.ESCREDITO = true;
        }
        else{
            element.TIPOTRANSACCION = "201";
            element.ESCREDITO = false;


        }

        if(element.FECHA == undefined || element.REFERENCIA == undefined || element.MONTO == undefined || element.ESCREDITO == undefined){

            showModal('Error', 'Elemento vacio en el documento');
        }
       

    });


}

async function setFecha(FechaAFormatear){

    if(jQuery.type(FechaAFormatear) === 'date'){

        cFechaNueva = new Date(FechaAFormatear - FechaAFormatear.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    
        return cFechaNueva;

    }

    return FechaAFormatear;

}

//Subir las transacciones por fila a BD
async function subirTransacciones(transacciones){


    await asyncForEach(transacciones, async (element) => { 

        cCodigoCta = $('#input-banco').val();
        cReferencia = element.REFERENCIA;        
        cEsCredito = element.ESCREDITO;


        //Arreglar separadores de miles y decimales
        if(cBancosConComa.includes(cCodigoCta)){

            cMonto = element.MONTO;
            cMonto = cMonto.replace('.', '');
            cMonto = cMonto.replace(',', '.');

        }
        else{
            cMonto = setNumeric(element.MONTO);
        }

        cTipoTransaccion = element.TIPOTRANSACCION;
        cFecha = await setFecha(element.FECHA);

        var respuesta = await cPostMvExtracto(cEmpresa, cCodigoCta, cReferencia, cFecha, cEsCredito, cMonto, cTipoTransaccion, cUsuario);

        if(respuesta != ""){

            transaccionesInvalidas.push(element);
        }

        else{

            transaccionesValidas.push(element);

        }

    });


}

//Subir excel
$("#fileUploader").change(async function (evt) {


	$("#jsGridMovimiento").children().remove();
	$("#jsGridMovimientoError").children().remove();
  
    selectedFile = evt
        .target
        .files[0];
	
    reader = new FileReader();

    reader.onload = async function (event) {
		var extension = selectedFile.name.split('.').pop().toLowerCase();
		
		if (extension == "txt")
		{
			//alert(extension);
			 var viewData = [];
			var lines = event.target.result.split('\n');
			for (var line = 0; line < lines.length; line++) {
				var linea = {
				  line: lines[line]
				};
				viewData.push(linea);
			}
			  
			

			  txtObject = viewData;
		}
		else{
        var data = event.target.result;
        var workbook = await XLSX.read(data, {type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy',raw:true,z: '#.##0_-;-#.##0_-;0;General'});
		excelObject = await XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]],{raw: true, defval: undefined});



        revisarExcel(excelObject);

		}
    };

    reader.onerror = function (event) {

        console.error(
            "No es posible leer del archivo! - Código de Error: " + event.target.error.code
        );
    };

    reader.readAsBinaryString(selectedFile);


});

//Guardamos
$("#bt-movimiento").click(async function () {

    transaccionesInvalidas = [];
    transaccionesValidas = [];

    var numero_cuenta = $('#input-banco').val();

    await showModalTransacciones("Mensaje", "Esta a punto de subir el excel al banco con numero de cuenta " + numero_cuenta + " en el banco correspondiente");

});

$("#bt-home").click(async function () {
    userHome(cInterno);
});


//Funcion para mostrar el Modal
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
}

//Modal para las transacciones
async function showModalTransacciones(pTitulo, pMensaje){

    $("#md-transacciones .modal-title").html(pTitulo);
    $("#md-transacciones .modal-body").html(pMensaje);
    $("#md-transacciones").modal("show");

    $("#btn-proceder").click(async function () {

        await subirTransacciones(excelObject);

        if(transaccionesValidas.length > 0){

            await showModal("Mensaje","Todas las transacciones han subido con éxito");
        }
    
        else{
        
            await loadTable(transaccionesInvalidas);
    
        }

    });

}

async function clearDatos(){

    cDatosBanco = cBanco = undefined;

    document.getElementById('TituloTransaccionInvalida').innerHTML = "";
		
	$("#jsGridMovimiento").children().remove();
	$("#jsGridMovimientoError").children().remove();
   
}


//Cargar la tabla
async function loadTable(tinvalidas) {
 	
	 $("#jsGridMovimientoError").jsGrid({
        
        height: "auto",
        width: "100%",
        autoload: true,
        paging: false,
        responsive: true,
        selecting: true,
        controller: {
            loadData: function() {
                return tinvalidas;
            }
        },	
        fields: [ 
            { name: "FECHA",          type: "date",   format: 'dd/MM/yyyy', title: "Fecha Transacción",   width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "REFERENCIA",           type: "text",   title: "Referencia",        width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "TIPOTRANSACCION",           type: "text",title: "Tipo Operación",    width: "5%",  headercss: "text-center text-primary", align: "center" },
            { name: "MONTO",              type: "number", format: "{0:n2}",  title: "Monto",        width: "5%",  headercss: "text-center text-primary", align: "center" },
        ]

    }); 

    $("#jsGridMovimiento").jsGrid("sort", { field: "FECHA", order: "desc" });
	$("#jsGridMovimientoError").jsGrid("sort", { field: "FECHA", order: "desc" });
	
	document.getElementById('TituloTransaccionInvalida').innerHTML = "Transacciones Inválidas";
	document.getElementById('TituloTransaccionValida').innerHTML = "Transacciones Válidas";
  
}

$("#input-banco").change(async function(){

	clearDatos();
	
    cDatosBanco = cBancos.find(query => query.CODIGOCTA == this.value);
    cBanco = cDatosBanco.CODIGOCTA;
    cMoneda = cDatosBanco.MONEDA;
   
});

$(document).ready(async function () {


	document.getElementById('TituloTransaccionInvalida').innerHTML = "";
    await getListaBancos(cEmpresa);



});
