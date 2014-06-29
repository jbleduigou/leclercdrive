function endsWith(text, pattern) {
    var difference = text.length - pattern.length;
    return difference >= 0 && text.lastIndexOf(pattern) === difference;
};

function getPrice(text, pricePerItemFactor) {
   if (text.trim() === '') {
     return Number('9999.99');
   }   
   //cas du prix par piece
   if (endsWith(text, '.')) {
     return Number(text.substring(0, text.length-1)) * pricePerItemFactor;
   }
   return Number(text);
}

function getCorrectedPrice(price, item) {
   if (isPercentageDiscount(item)) {
	  var libelleTicketLeclerc = item.find('.divLibelleTELProduit').text();
      var reduction = Number('0.' + libelleTicketLeclerc.substring(libelleTicketLeclerc.indexOf('Recevez') + 8, libelleTicketLeclerc.indexOf('en Ticket E.Leclerc') - 2 ));
      return price * (1 - reduction);
   }
   if (isFixedAmountDiscount(item)) {
	  var libelleTicketLeclerc = item.find('.divLibelleTELProduit').text();
      var reduction = Number(libelleTicketLeclerc.substring(libelleTicketLeclerc.indexOf('Recevez') + 8, libelleTicketLeclerc.indexOf('en Ticket E.Leclerc') - 2 ));
      return price - reduction;
   }
   return price;
}

function isPercentageDiscount(item) {
    if (item.find('.divLibelleTELProduit').text()) {	
	   if (item.find('.divLibelleTELProduit').text().indexOf('%') > -1) {
	     return true;
	   }
	}
	return false;
}

function isFixedAmountDiscount(item) {
    if (item.find('.divLibelleTELProduit').text()) {	
	   if (!item.find('.divLibelleTELProduit').text().indexOf('%') > -1) {
	     return true;
	   }
	}
	return false;
}

function updatePriceWithPromotion(item) {
    if (item.find('.divLibelleTELProduit').text()) {	
	   var originalText = item.find('.spanPrixUniteMesure').text();
	   if (!endsWith(originalText, ')')) {
	     var originalPrice = getPrice(item.find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,''), 1);
	     var correctedPrice = getCorrectedPrice(originalPrice, item);	  	   
	     var correctedText = correctedPrice.toFixed(2) + originalText.substring(originalText.indexOf('/') - 2, originalText.length);
		 var element = '<span class="spanPrixReduitUniteMesure" style="font-size: 10px;float:right;margin-top: 11px;margin-right: 5px;line-height: 11px;">(' + correctedText.trim() + ')</span>';
		 if (!item.find('.spanPrixReduitUniteMesure').text()) {
     		 $(element).insertBefore(item.find('.spanPrixUniteMesure'));
		 }
	   }	
	}
}

function sortItems() {
   $('.ulProdListe > div').sort(function(a,b) {
     var priceDifference = getCorrectedPrice(getPrice($(a).find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,''), 10000), $(a)) - getCorrectedPrice(getPrice($(b).find('.spanPrixUniteMesure').text().replace(/[^0-9\.]+/g,''), 1000), $(b));
	 if (priceDifference == 0.0 || priceDifference == 0) {
	    var libelleA = $(a).find('.divLibelle1').text() + $(a).find('.divLibelle2').text() + $(a).find('.divPrdContaineur').attr('idprod');
	    var libelleB = $(b).find('.divLibelle1').text() + $(b).find('.divLibelle2').text() + $(b).find('.divPrdContaineur').attr('idprod');
	    return libelleA.localeCompare(libelleB);
	 }
     return priceDifference;
   }).appendTo('.ulProdListe');
   $.each($('.ulProdListe > div'),function(index,value) {
     updatePriceWithPromotion($(value));
   })
}
