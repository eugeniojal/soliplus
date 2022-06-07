
//Variables globales
codigo = undefined;
nombre = undefined;
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");

window.alert = async function() {};

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";


//GET Inventario
async function getClas1(pEmpresa){

    var rClas1;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetClas1?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rClas1 = result;
    })
    .catch(error => console.log('error', error));

    return rClas1;
}

//POST Tipo de Inventario
async function postClas1(pEmpresa, pCodigo, pNombre){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(WebApiServer+ "api/Maestros/PostClas1?Empresa="+pEmpresa+"&Codigo="+pCodigo+"&Nombre="+pNombre, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//DELETE Tipo de Inventario
async function deleteClas1(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    fetch(WebApiServer + "api/Maestros/deleteClas1?Empresa="+pEmpresa+"&Codigo="+pCodigo, requestOptions)
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
async function updateClas1(pEmpresa, pCodigo, pNombre){
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch(WebApiServer + "api/Maestros/PutClas1?Empresa="+pEmpresa+"&Codigo="+pCodigo+"&Nombre="+ pNombre, requestOptions)
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
    //Si no hay un elemento repetido guardamos en la base de datos
    if(pRepetido){
        if(pInsertingItem.CODIGO != ""){
            if(pInsertingItem.NOMBRE != ""){
                await postClas1(cEmpresa, pInsertingItem.CODIGO, pInsertingItem.NOMBRE);
            }
            else{
                showModal("Alerta", "Debe colocar un NOMBRE");
            }
        }
        else{
            showModal("Alerta", "Debe colocar un CODIGO");
        }
       
    }
    else{
        showModal("Alerta", "Codigo repetido, por favor usar otro codigo");
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

    deleteConfirm: "Do you really want to delete the client?",

    autoload: true,
    controller: {
        
        loadData: function(filter) {

            return $.grep(database, function (group) { 
                if(filter.NOMBRE !== undefined){
                    return group.NOMBRE.toLowerCase().indexOf(filter.NOMBRE) != -1;
                }
                else{
                    return filter.NOMBRE;
                }
                
            }); 

        },
        insertItem: async function(insertingItem){
            repetido = true;
            console.log(insertingItem);

            var inventario = await getClas1(cEmpresa);

            inventario.forEach(element => {
                if(element.CODIGO == insertingItem.CODIGO){
                    repetido = false;
                }
            });
        
            await verificarInsertar(repetido, insertingItem);

        },
        //Borramos
        deleteItem: async function(deletingItem) {
            console.log(deletingItem); 
            await deleteClas1(cEmpresa, deletingItem.CODIGO);

            var cClas1 = await getClas1(cEmpresa);
            database = cClas1;
            await setTabla();           
        },
        //Guardamos los cambios
        updateItem: async function(updatingItem) {
            console.log(updatingItem);
            await updateClas1(cEmpresa, updatingItem.CODIGO, updatingItem.NOMBRE);

            var cClas1 = await getClas1(cEmpresa);
            database = cClas1;
            await setTabla(); 
        }
    },
    
    fields: [
        { name: "CODIGO", type: "text", title: "Codigo",  width: 50, validate: [
            "required",
            { validator: "range", param: [0, 99999] },
        ], filtering: false },
        { name: "NOMBRE", type: "text", title: "Nombre", width: 150, validate: "required"},
        { 
            type: "control",
            editButton: false
        }
    ]
});

}
//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {
    filter.CODIGO = 123;

    var cClas1 = await getClas1(cEmpresa);
    database = cClas1;
    setTabla();
  });
