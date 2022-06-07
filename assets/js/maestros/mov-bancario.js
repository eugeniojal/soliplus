
//Variables globales
filter = '';
var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");

window.alert = async function() {};

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";

//GET Inventario
async function getTipoMovBancario(pEmpresa){

    var rMovBancario;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetTipoMovBancario?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rMovBancario = result;
    })
    .catch(error => console.log('error', error));

    rMovBancario.forEach(element => {
        if(element.ENTRADA == "S"){
            element.ENTRADA = true;
        }
        else{
            element.ENTRADA = false;
        }
    });

    return rMovBancario;
}

//POST Tipo de Inventario
async function postTipoMovBancario(pEmpresa, pCodigo, pDescripcion, pEntrada){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch("http://soliplus.consolidez.com/ApiRestSoliPlus/api/Maestros/PostTipoMovBancario?Empresa="+pEmpresa+"&Codigo="+pCodigo+"&Descripcion="+pDescripcion+"&Entrada="+pEntrada, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//DELETE Tipo de Inventario
async function deleteTipoMovBancario(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    fetch(WebApiServer + "api/Maestros/deleteTipoMovBancario?Empresa="+pEmpresa+"&Codigo="+pCodigo, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if(result != '"1"'){
                alert("No se pudo borrar el elemento");
            }
        })
        .catch(error => console.log('error', error));
}

//UPDATE Tipo de Inventario
async function updateTipoMovBancario(pEmpresa, pCodigo, pDescripcion, pEntrada){

    console.log("PASANDO");
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      await fetch(WebApiServer + "api/Maestros/PutTipoMovBancario?Empresa="+pEmpresa+"&Codigo="+pCodigo+"&Descripcion="+pDescripcion+"&Entrada="+pEntrada, requestOptions)        
        .then(response => response.text())
        .then(result =>{
            console.log(result);
            if(result !== '"1"'){
                alert("No se pudo cambiar el elemento");
            }
        })
        .catch(error => console.log('error', error));
}


//Modal de Errores
async function showModal(pTitulo, pMensaje){
    
    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
    
    $("#btn-modal").click(function(){

        location.reload();
    });
}

async function verificarInsertar(pRepetido, pInsertingItem){
    // Si no hay un elemento repetido guardamos en la base de datos

    if(pRepetido){
        await showModal("Alerta", "TIPOMTVO repetido, por favor usar otro TIPOMTVO");
    }
    else if(pInsertingItem.TIPOMTVO == ""){
        await showModal("Alerta", "Debe colocar un TIPOMTVO");
    }
    else if(pInsertingItem.DESCRIPCIO == ""){
        await showModal("Alerta", "Debe colocar un DESCRIPCIO");
    }
    else{

        if(pInsertingItem.ENTRADA == true){
            pInsertingItem.ENTRADA = "S";
        }
        else{
            pInsertingItem.ENTRADA = "N";
        }

        console.log(pInsertingItem);

        await postTipoMovBancario(cEmpresa, pInsertingItem.TIPOMTVO, pInsertingItem.DESCRIPCIO, pInsertingItem.ENTRADA);
    }
}

$("#bt-home").click(async function () {
    userHome(cInterno);
});


//Crear tabla
async function setTabla() {

$("#jsGrid").jsGrid({
    height: "auto",
    width: "100%",

    editing: true,
    filtering: true,
    inserting: true,
    sorting: true,
    paging: true,

    pageSize: 15,
    pageButtonCount: 5,

    deleteConfirm: "Seguro que desea borrar el cliente?",

    autoload: true,
    controller: {
        
        loadData: function(filter) {

            return $.grep(database, function (group) { 
                if(filter.DESCRIPCIO !== undefined){
                    return group.DESCRIPCIO.toLowerCase().indexOf(filter.DESCRIPCIO) != -1;
                }
                else{
                    return filter.DESCRIPCIO;
                }
                
            }); 

        },
        insertItem: async function(insertingItem){
            repetido = false;

            var inventario = await getTipoMovBancario(cEmpresa);

            inventario.forEach(element => {
                if(element.TIPOMTVO == insertingItem.TIPOMTVO){
                    repetido = true;
                }
            });

            await verificarInsertar(repetido, insertingItem);
        },
        //Borramos
        deleteItem: async function(deletingItem) {

            if(deletingItem.ENTRADA == true){
                deletingItem.ENTRADA = "S";
            }
            else{
                deletingItem.ENTRADA = "N";
            }

            console.log(deletingItem); 

            await deleteTipoMovBancario(cEmpresa, deletingItem.TIPOMTVO);

            var cMovBancario = await getTipoMovBancario(cEmpresa);
            database = cMovBancario;
            await setTabla();           
        },
        //Guardamos los cambios
        updateItem: async function(updatingItem) {

            if(updatingItem.ENTRADA == true){
                updatingItem.ENTRADA = "S";
            }
            else{
                updatingItem.ENTRADA = "N";
            }

            console.log(updatingItem);
            await updateTipoMovBancario(cEmpresa, updatingItem.TIPOMTVO, updatingItem.DESCRIPCIO, updatingItem.ENTRADA);
            var cMovBancario = await getTipoMovBancario(cEmpresa);
            database = cMovBancario;
            await setTabla(); 
        }
    },
    
    fields: [
        { name: "TIPOMTVO", type: "text", title: "Tipo Mvto", width: 50, validate: [
            "required",
            { validator: "range", param: [0, 99999] },
        ], filtering: false },
        { name: "DESCRIPCIO", type: "text", title: "Descripcion",width: 150, validate: "required"},
        { name: "ENTRADA", type: "checkbox", title: "Entrada",width: 50, validate: "required", filtering: false},
        { 
            type: "control",
            editButton: false
         }
    ]
});

}
//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {
    filter.TIPOMTVO = 123;

    var cMovBancario = await getTipoMovBancario(cEmpresa);
    database = cMovBancario;
    setTabla();
  });
