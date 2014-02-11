function endsWith(text, pattern) {
    var difference = text.length - pattern.length;
    return difference >= 0 && text.lastIndexOf(pattern) === difference;
};

function getPrice(text) {
   if (text.trim() === '') {
     return Number('9999.99');
   }   
   //cas du prix par piece
   if (endsWith(text, '.')) {
     return Number(text.substring(0, text.length-1)) * 100;
   }
   return Number(text);
}


function sortItems() {
   $('.ulProdListe > div').sort(function(a,b) {
     return getPrice($(a).find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,'')) - getPrice($(b).find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,''));
   }).appendTo('.ulProdListe');
}
