var divElement = document.getElementById('viz1626755418380');
var vizElement = divElement.getElementsByTagName('object')[0];

   // document.querySelector("#viz1626755418380 > iframe").style.height = '100%';
    var scriptElement = document.createElement('script');
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
vizElement.parentNode.insertBefore(scriptElement, vizElement);

function reportWindowSize() {
    vizElement.style.width = '100%';
    vizElement.style.height = '100vh';
    document.querySelector("#viz1626755418380 > iframe").style.height = '100%';
}

window.onresize = reportWindowSize;

vizElement.style.width = '100%';
    vizElement.style.height = '100vh';
reportWindowSize()
window.onload = reportWindowSize;