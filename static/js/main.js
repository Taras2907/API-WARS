import { dom } from "/static/js/dom.js";
import { animation } from "/static/js/animation.js";



function init(url){
    dom.loadPage(url);
    dom.addListenerToNextPreviousButton("next");
    dom.addListenerToNextPreviousButton('previous')
}

$( document ).ready(function() {
    init('https://swapi.co/api/planets/?page=1');

});


