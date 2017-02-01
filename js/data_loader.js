$(document).ready(function() {
	"use strict";
	
	$.ajaxSetup( { "async": false } );
	
	fillMapById(1, 1);
});

var lastSrc;
var sourcesFolder;
var currentId = 1;

function fillMapById(aid, bid) {
	"use strict";
	
	var authors = $.getJSON("./authors/data.json").responseJSON;
	for(var i = 0; i < authors.length; i++) {
		if(authors[i].id === aid) {
			var books = $.getJSON("./authors/" + authors[i].folder + "/data.json").responseJSON;
			for(var j = 0; j < books.length; j++) {
				if(books[j].id === bid) {
					fillMap(authors[i].eng, books[j].eng);
				}
			}
		}
	}
}

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

function replaceAll(str, find, replace) {
	"use strict";
	return str.replace(new RegExp(find, 'g'), replace);
}

function getAuthors() {
	"use strict";
	
	var data = $.getJSON("./authors/data.json");
	console.log(data);
	if(data === undefined) { return undefined; }
	var authors = data.responseJSON;
	
	return authors;
}

function getAuthorSources(author) {
	"use strict";
	var lauthor = author.toLowerCase();
	var authors = getAuthors();
	if(authors === undefined) { return undefined; }	
	
	for(var i = 0; i < authors.length; i++) {
		console.log(authors[i].eng.toLowerCase(), lauthor);
		console.log(authors[i].rus.toLowerCase(), lauthor);
		if(authors[i].eng.toLowerCase() === lauthor || authors[i].rus.toLowerCase() === lauthor) 
		{
			var addr = "./authors/" + authors[i].folder.toString() + "/data.json";
			var data = $.getJSON(addr);
			console.log(data,"data");
			return data.responseJSON;
		}
	}
	
	return undefined;	
}

function getAuthorFolder(author) {
	var authors = $.getJSON("./authors/data.json").responseJSON;
	for(var i = 0; i < authors.length; i++) {
		if(authors[i].eng.toLowerCase() == author.toLowerCase() ||
		  authors[i].rus.toLowerCase() == author.toLowerCase())
			{
				return authors[i].folder;
			}
	}
}

function getSource(author, source) {
	"use strict";
	
	source = source.toLowerCase();
	
	var result = getAuthorSources(author);
	console.log(result, "1");
	if(result === undefined) { return undefined; }
	
	var authorFolder = getAuthorFolder(author);
	
	for(var i = 0; i < result.length; i++) {
		if(result[i].eng.toLowerCase() === source || result[i].rus.toLowerCase() === source) {
			sourcesFolder = "./authors/" + authorFolder + "/" + result[i].folder;
			var src = $.getJSON("./authors/" + authorFolder + "/" + result[i].folder + "/data.json");
			console.log(src, "src");
			return src.responseJSON;
		}
	}
	
	return undefined;
}

function fillMap(author, source) {
	"use strict";
	
	clearMap();
	
	var src = getSource(author, source);
	console.log(src);
	if(src === undefined) { return undefined; }
	lastSrc = src;
	var mapObj = $('#world-map .jvectormap-container').data('mapObject');
	
	var legend = $(".legend");
	var sourceName = $("#source-name");
	sourceName.empty();
	sourceName.append("\"" + source + "\", " + author);	

	for(var i = 0; i < src.length; i++) {
		var place = src[i];
		var selector = "*[data-code=" + place.fillCountry + "]";
		var svgPath = $(selector);
		
		if(place.fillCountry !== undefined) {
			svgPath.css("fill", place.fillColor);
		}
	
		var id = place.n + "_id"; 
		
		var re = /[0-9]+\. (.+)/;
		var legendText = re.exec(place.name);
		if(legendText == null) {
			legendText = place.name;
		} else legendText = legendText[1];
		
		legend.append("<li style='background-color: " + place.fillColor + "; color: " + place.textColor + "'><button id=\"" + id + "\">" + place.n + ". " + legendText + "</button></li>");
		
		$("#" + id).click(function() { changeInfoBlock($(this).attr("id")) });
		svgPath.click(function() { 
			var code = $(this).attr("data-code");
			var id = getIdByCountryCode(code);
			
			changeInfoBlock(id); 
		});
	}
	
	changeInfoBlock(1);
}

function changeInfoBlock(id) {
	if(id.toString().indexOf("_id") !== -1) { id = id.replace("_id", ""); }
	var title = $(".title-container");
	var dataContainer = $(".text-info-container");
	var reg = getRegionById(id);
	
	title.html(reg.title);	
	var data = $.get(sourcesFolder + "/" + reg.source + ".txt").responseText;
	dataContainer.html(data);
}

function changeLanguage(lang) {
	var sn = $("#source-name");
	
	if(lang == 'en') {
		sn
	} else if(lang == 'ru') {
		
	}
}

function nextId() {
	if((currentId + 1 ) < lastSrc.length) {
		changeInfoBlock(++currentId);
	} else if((currentId + 1) >= lastSrc.length) {
		currentId = 1;
		changeInfoBlock(currentId);
	}
}

function prevId() {
	if((currentId - 1) <= 0) {
		currentId = lastSrc.length;
		changeInfoBlock(currentId);
	} else {
		changeInfoBlock(--currentId);
	}
}

function clearMap() {
	"use strict";
	
	currentId = 1;
	var legend = $(".legend");
	legend.empty();
	var sourceName = $("#source-name");
	sourceName.empty();
	$(".title-container").empty();
	
	if(lastSrc !== undefined) {
		for(var i = 0; i < lastSrc.length; i++) {
			var place = lastSrc[i];
			if(place.fillCountry !== undefined) {
				$("*[data-code=" + place.fillCountry + "]").css("fill", "#F1F1F1");
			}
		}
	}
}