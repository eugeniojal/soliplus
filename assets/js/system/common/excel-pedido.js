var cEmpresa = sessionStorage.getItem("Empresa");
var elementoRechazado; //--> Para mostrar en la tabla de errores
var excelObject;
let seguir = true;


async function getListaPrecio(pEmpresa, pRif, pProducto){

    var rListPrecio;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch("http://soliplus.consolidez.com/ApiRestSoliPlus/api/Maestros/GetListaPrecio?Empresa="+pEmpresa+"&Rif="+pRif+"&Producto="+pProducto, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        rListPrecio = result;
    })
    .catch(error => console.log('error', error));

    return rListPrecio;
}

//Funcion que revisa si hay alguna casilla con un problema. Crea detalle y estado del elemento dado el caso. 
//Por alguna razon en el json $ Precio tiene un espacio al principio y al final.
async function RevisarElemento(pElement){

    var elementosFaltan = [];

    listaPrecio = await getListaPrecio(cEmpresa, 'J-50044878-3', pElement["Cod. Modelo"]);

    console.log(listaPrecio);

    if(listaPrecio == ""){
        showModal("Error", "El producto " + pElement["Cod. Modelo"] + " no existe en la tabla de productos");
        seguir = false;
    }
    else if(parseFloat(listaPrecio[0].PRECIO) != parseFloat(pElement[" Precio $ "])){
        showModal("Error", "El precio del el producto "  + pElement["Cod. Modelo"] + " no coincide con la tabla de precios")
    }
    else{
        keys.forEach((key) => {

            //Verificamos que no hayan elementos vacios 
            if(pElement[key] == "" && key.toLowerCase() == "cod. modelo"){
                elementosFaltan.push(key);
                $("#fileUploader").val('');
                showModal("Error de datos",`Falta un dato en ${elementosFaltan}`);
                seguir =  false;;
            }
            else if(pElement[key] == "" && key.toLowerCase() == "descripción"){
                elementosFaltan.push(key);
                $("#fileUploader").val('');
                showModal("Error de datos",`Falta un dato en ${elementosFaltan}`);
                seguir =  false;;
            }
            else if(pElement[key] == "" && key.toLowerCase() == "precio $"){
                elementosFaltan.push(key);
                $("#fileUploader").val('');
                showModal("Error de datos",`Falta un dato en ${elementosFaltan}`);
                seguir =  false;;
            }
            else if(pElement[key] == "" && key.toLowerCase() == "cantidad"){
                elementosFaltan.push(key);
                $("#fileUploader").val('');
                showModal("Error de datos",`Falta un dato en ${elementosFaltan}`);
                seguir =  false;;
            }
        });
    }
}

// //Revisar si los titulos o indices del documento excel son los correctos (Y que no falte ninguno)
async function VerIndices(pexcelObject){
    keys = Object.keys(pexcelObject[0]);

    if(keys[0].toLowerCase() != "descripción" && keys[1].toLowerCase() != "cod. modelo" && keys[2].toLowerCase() != "precio $" && keys[3].toLowerCase() != "precio bs. * $" && keys[4].toLowerCase() != "precio bs. s" && keys[5].toLowerCase() != "total" && keys[6].toLowerCase() != "und x $" && 
    keys[7].toLowerCase() != "bs. * $" && keys[8].toLowerCase() != "bs." && keys[9].toLowerCase() != "cantidad" && keys[10].toLowerCase() != "precio total" && keys[11].toLowerCase() != "total bs. s" && keys[12].toLowerCase() != "aplica desc. volumen" && 
    keys[13].toLowerCase() != "total bs. s." && keys[14].toLowerCase() != "modelo"){

        // document.getElementById('comentario').innerHTML = "El formato del excel no es el correcto";
        showModal("Alerta", "El formato de excel no es el correcto");
        return false;
    }
    else{
        console.log("Plantilla correcta");
        return true;
    }
}

//Funcion para mostrar el Modal
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
}

//Aqui se verifica que el excel cargado este listo para guardar en base de datos.
async function loadingExcel(pExcelObject) {


    //Verificamos si los indices son correctos (solo neceitamos el primer objeto para esto)

    if(await VerIndices(pExcelObject) == false){
        showModal("Error", "Indices incorrectos, por favor corregir la plantilla");
        // return false;
    }
    else{

        await asyncForEach(pExcelObject, async (elemento) => {

            if(seguir){
                console.log("Pasando!!")
            
                //Borramos las columnas innecesarias del excel
                delete elemento["Aplica Desc. Volumen"];
                delete elemento["Bs."];
                delete elemento["Bs. * $"];
                delete elemento["Modelo"];
                delete elemento["Precio Bs. * $"];
                delete elemento["Precio Bs. S"];
                delete elemento["Precio total"];
                delete elemento["Total"];
                delete elemento["Total Bs. S"];
                delete elemento["Total Bs. S."];
                delete elemento["Und X $"];

                await RevisarElemento(elemento);
            }
            
        });
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

              excelObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{defval: "", raw: true});

            });

        console.log(excelObject);
        await loadingExcel(excelObject);

    };

    reader.onerror = function (event) {
        showModal("Error al leer el archivo", "Codigo de Error: " + event.target.error.code);
    };

    reader.readAsBinaryString(selectedFile);
});

