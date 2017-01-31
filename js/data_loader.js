$(document).ready(function() {
	"use strict";
	
	$.ajaxSetup( { "async": false } );

	fillMap("Elizabeth Gilbert", "Eat Love Pray");	
});

function replaceAll(str, find, replace) {
	"use strict";
	return str.replace(new RegExp(find, 'g'), replace);
}

function getAuthors() {
	"use strict";
	
	var data = $.getJSON("./authors/data.json");
	var authors = data.responseJSON;
	
	return authors;
}

function getAuthorSources(author) {
	"use strict";
	author = author.replace(' ', '').toLowerCase();
	var authors = getAuthors();
	if(authors.indexOf(author) === -1) {
		return undefined;
	}
		
	var data = $.getJSON("./authors/" + author + "/data.json");
	for(var i = 0; i < data.length; i++) {
		data[i] = data[i].toLowerCase();
	}
	return data.responseJSON;
}

function getSource(author, source) {
	"use strict";

	var folder = source;
	folder = replaceAll(folder, ' ', '');
	
	author = replaceAll(author, ' ', '');
	
	var result = getAuthorSources(author);
	for(var i = 0; i < result.length; i++) {
		result[i] = result[i].toLowerCase();
	}
	
	if(result.indexOf(folder.toLowerCase()) === -1) {
		return undefined;
	}
	
	sourcesFolder = "./authors/" + author + "/" + folder;
	var src = $.getJSON("./authors/" + author + "/" + folder + "/data.json");
	
	return src.responseJSON;
}

var lastSrc;
var sourcesFolder;

function getIdByCountryCode(code) {
	"use strict";
	
	for(var i = 0; i < lastSrc.length; i++) {
		if(lastSrc[i].fillCountry === code) {
			return lastSrc[i].n;
		}
	}
}

function getRegionById(id) {
	"use strict";
	
	for(var i = 0; i < lastSrc.length; i++) {
		if(lastSrc[i].n == id) {
			return lastSrc[i];
		}
	}
}

function fillMap(author, source) {
	"use strict";
	
	clearMap();
	
	var src = getSource(author, source);
	lastSrc = src;
	var mapObj = $('#world-map .jvectormap-container').data('mapObject');
	
	var legend = $(".legend");

	for(var i = 0; i < src.length; i++) {
		var place = src[i];
		var selector = "*[data-code=" + place.fillCountry + "]";
		var svgPath = $(selector);
		
		if(place.fillCountry !== undefined) {
			svgPath.css("fill", place.fillColor);
		}
	
		
		var id = place.n + "_id"; 
		
		legend.append("<li style='background-color: " + place.fillColor + "; color: " + place.textColor + "'><button id=\"" + id + "\">" + place.n + ". " + place.source + "</button></li>");
		
		$("#" + id).click(function() { changeInfoBlock($(this).attr("id")) });
		svgPath.click(function() { 
			var code = $(this).attr("data-code");
			var id = getIdByCountryCode(code);
			
			changeInfoBlock(id); 
		});
	}
}

function changeInfoBlock(id) {
	if(id.toString().indexOf("_id") !== -1) { id = id.replace("_id", ""); }
	var title = $(".title-container");
	var dataContainer = $(".text-info-container");
	var reg = getRegionById(id);
	
	title.html(reg.source);
	var data = $.get(sourcesFolder + "/" + reg.source + "1.txt").responseText;
	dataContainer.html(data);
}

function clearMap() {
	"use strict";
	
	var legend = $(".legend");
	legend.empty();
	
	if(lastSrc !== undefined) {
		for(var i = 0; i < lastSrc.length; i++) {
			var place = lastSrc[i];
			if(place.fillCountry !== undefined) {
				$("*[data-code=" + place.fillCountry + "]").css("fill", "#F1F1F1");
			}
		}
	}
}