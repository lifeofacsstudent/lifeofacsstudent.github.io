
function goBack() {
	location.href = "/index.html";
}

var col="";

function byFive(colour) {
	col=colour;

	var things=collectByColor();

	//hide everything
	for(var i=0;i<document.getElementsByClassName("article").length;i++) {
			document.getElementsByClassName("article")[i].style.display="none";
	}

	if(things.length>5) {
		document.getElementsByClassName("more")[0].style.display="block";
		//show 5
		for(var i=0;i<5;i++) {
			things[i].style.display="flex";
		}
	} else {
		document.getElementsByClassName("more")[0].style.display="none";
		//show all (less than 5)
		for(var i=0;i<things.length;i++) {
			things[i].style.display="flex";
		}
	}
}

function fiveMore() {
	document.getElementsByClassName("more")[0].style.display="none";

	var things=collectByColor();

	var toShow=[]; //the ones that are not showed yet
	for(var i=0;i<things.length;i++) {
		if(things[i].style.display=="none") {
			toShow.push(things[i]);
		}
	}

	if(toShow.length>5) {
		document.getElementsByClassName("more")[0].style.display="block";
		for(var i=0;i<5;i++) {
			toShow[i].style.display="flex";
		}
	} else {
		document.getElementsByClassName("more")[0].style.display="none";
		for(var i=0;i<toShow.length;i++) {
			toShow[i].style.display="flex";
		}
	}
}

function collectByColor() {
	var thing=document.getElementsByClassName("article");
	var things=[];
	if(col=='') {
		things=thing;
	} else {
		for(var i=0;i<thing.length;i++) {
			if(thing[i].id.substring(thing[i].id.length-1,thing[i].id.length)==col.substring(0,1)) {
				things.push(thing[i]);
			}
		}
	}
	return things;
}
