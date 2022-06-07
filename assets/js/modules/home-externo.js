
$(document).ready(function(){

    sessionStorage.removeItem("Origen");
    sessionStorage.removeItem("Modulo");
    sessionStorage.removeItem("TipoDcto");
    sessionStorage.removeItem("Titulo");

});


async function setDatosConsecut(pOrigen, pModulo, pTipoDcto, pTitulo){

    sessionStorage.setItem("Origen", pOrigen);
    sessionStorage.setItem("Modulo", pModulo);
    sessionStorage.setItem("TipoDcto", pTipoDcto);
    sessionStorage.setItem("Titulo", pTitulo);

}

$("#bt-pedidos-documentos-facturas").click(function(){

    setDatosConsecut("FAC", "FACTURAS", "FV", "FACTURAS");

});


$("#bt-pedidos-documentos-pedidos").click(function(){

    setDatosConsecut("FAC", "FACTURAS", "PD", "PEDIDOS");

});


$("#bt-pedidos-documentos-notas-credito").click(function(){

    setDatosConsecut("FAC", "FACTURAS", "NC", "NOTAS CRÉDITO");
    
});


$("#bt-pedidos-documentos-notas-debito").click(function(){

    setDatosConsecut("FAC", "FACTURAS", "ND", "NOTAS DÉBITO");

});


$("#bt-pedidos-documentos-anticipos").click(function(){

    setDatosConsecut("FAC", "FACTURAS", "AN", "ANTICIPOS");

});



$("#bt-cartera-documentos-abonos").click(function(){

    setDatosConsecut("CAR", "CARTERA", "RC", "ABONOS");
    
});