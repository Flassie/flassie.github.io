$(document).ready(function() {
	var lang = localStorage.getItem("lang");
	if(!lang) {
		localStorage.setItem("lang", "en");
		lang = "en";
	}
	
	tr("./tr/" + lang + ".json", lang);
});

function changeLang(lang) {
	localStorage.setItem("lang", lang);
	tr("./tr/" + lang + ".json", lang);
}

function tr(file, lang) {
	$.getJSON(file, function(data) {
		$.each(data, function(key, value) {
			$("#tr" + key).html(value);	
		});
	});
}