
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
