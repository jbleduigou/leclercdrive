function getPrice(text) {
   if (text.trim() === '') {
     return Number('9999.99');
   }   
   return Number(text);
}


function sortItems() {
   $('.ulProdListe > div').sort(function(a,b) {
     return getPrice($(a).find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,'')) - getPrice($(b).find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,''));
   }).appendTo('.ulProdListe');
}


