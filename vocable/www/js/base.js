var dicOneTwo;
var dicThree;
var dicFour;
var dicFive;
var dicSix;
var dicSeven;
var dicEight;
var dicNine;
var dicTen;
var dic;

var selectedWord;
var selectedNode;
var addedWords=[];

var notified=false;

var isSoundOn=true;

var nodes;
var edges;

//TODO
/*
* cleanup code
*/

function changePages(num) {
	var startPage=document.getElementById("startPage");
	var gamePage=document.getElementById("gamePage");
	var d=document.getElementsByClassName("animClass");
	var header=document.getElementsByClassName("header")[0];
	
	if(startPage.style.display=="") {
		startPage.style.display="table";
	}
	if(gamePage.style.display=="") {
		gamePage.style.display="none";
	}
	if(startPage.style.display=="table") {
		//changing type of animation
		
		//changing menu items
		for(var i=0;i<d.length;i++) {
			d[i].className = d[i].className.replace( 'fadeInLeft', 'fadeOutRight' );
			var newMenuItem = d[i].cloneNode(true);
			d[i].parentNode.replaceChild(newMenuItem, d[i]);
		}
		//changing header
		header.className = header.className.replace('slideInDown','slideOutUp');
		var newHeader = header.cloneNode(true);
		header.parentNode.replaceChild(newHeader, header);
		//waiting while animating, then switch them
		setTimeout(function() {
			startPage.style.display="none";
			gamePage.style.display="block";
			if(num==0) {
				startGame();
			} else {
				loadGame();
			}
		},1000);
		
		//changing header
		var header=document.getElementsByClassName("header")[1];
		header.className = header.className.replace('header','header animated slideInDown');
		var newHeader = header.cloneNode(true);
		header.parentNode.replaceChild(newHeader, header);
		setTimeout(function() {},1000);

	} else {
	
		//changing header
		var header=document.getElementsByClassName("header")[0];
		header.className = header.className.replace('slideInDown','slideOutUp');
		var newHeader = header.cloneNode(true);
		header.parentNode.replaceChild(newHeader, header);
		setTimeout(function() {},1000);
	  
		//changing menu items
		for(var i=0;i<d.length;i++) {
			d[i].className = d[i].className.replace( "fadeOutRight", 'fadeInLeft' );
		}
		//changing header
		header=document.getElementsByClassName("header")[0];
		header.className = header.className.replace('slideOutUp','slideInDown');
		var newHeader = header.cloneNode(true);
		header.parentNode.replaceChild(newHeader, header);
		setTimeout(function() {},1000);
		startPage.style.display="table";
		gamePage.style.display="none";
	}

}

function showScores() {
	var stars=0;
	switch(localStorage.getItem('level')) {
		case "starter" : stars=0; break;
		case "beginner" : stars=1; break;
		case "intermediate" : stars=2; break;
		case "advanced" : stars=3; break;
		case "expert" : stars=4; break;
		case "master of words'" : stars=5; break;
	}
	var filling="";
	for(var i=1;i<=stars;i++) {
		filling+="<div class='diamond'></div>";
	}
	
	var textid="";
	if(localStorage.getItem('highscore')==null) {
		textid="sorry, you don't have a highscore yet... start playing! :)";
	} else if(localStorage.getItem('level')==null) {
		textid="<p>"+localStorage.getItem('highscore')+" - you are a starter up to 50 points</p>";
	} else {
		textid="<p>"+localStorage.getItem('highscore')+" - "+localStorage.getItem('level')+"</p><p>"+filling+"</p>"
	}
	swal( {
		html:true,
		title:"high score",
		text:textid
		});
}

function setSound()  {
	if(isSoundOn) {
		isSoundOn=false;
	} else {
		isSoundOn=true;
		playGoodSound();
	}
}

function playGoodSound() {
	if(isSoundOn) {
		var sound = new buzz.sound( "http://leahnori.github.io/sound.mp3", {});
		sound.play();
	}
}
function playBadSound() {
	if(isSoundOn) {
		var sound = new buzz.sound( "http://leahnori.github.io/soundbad.mp3", {});
		sound.play();
	}
}

function showInfo() {
	swal({ html:true, title:'information', confirmButtonText:'OK :)',  text:'<p>vocable</p><p> mobile application - game </p><p>created by Leonora Der</p><p>version : 1.0.1</p>'});
}

function showHelp() {
	swal({  title: "how to play this game?",   
			text: "<p>You'll get a random word, click on it, and change only one thing: add, delete or change one letter!</p> <img style='height:180px; padding:0px' src='../www/res/example.png'>",   
			html: true,
			showCancelButton: true,   
			confirmButtonText: "next",   
			cancelButtonText: "back",   
			closeOnConfirm: false,   
			closeOnCancel: true }, 
			function(){   
				swal( {	html:true, 
						title:"go on!" , 
						text:"<p>Grow your network by adding more and more words!</p> <img style='height:180px; padding:0px' src='../www/res/example2.png'>",
						showCancelButton: true,  
						confirmButtonText: "next", 
						cancelButtonText: "back", 
						closeOnCancel: true,
						closeOnConfirm: false},
						function(){ 
						swal( {	html:true, 
								showCancelButton: true,  
								cancelButtonText: "back", 
								closeOnCancel: false,
								title: "collect points!",
								text:"<p>You will earn points if you add words: </p> <ul style='list-style-type: none;'> <li>+ number of letters</li><li>+ connections made</li></ul></p> <img style='height:120px; padding:0px' src='../www/res/example3.png'>",
								confirmButtonText: "play!" 
								}, function() {
									changePages(0);
								})
						}); 
			});
}

function startGame() {
	init();
	document.getElementById("text").style.display="none"; 
	
	var startWord=chooseStartWord();
	document.getElementById("point").innerHTML=0;

    nodes = new vis.DataSet([
        {id: 1, label: startWord, group: 1},
    ]);

    edges = new vis.DataSet([
	]);
	
    var container = document.getElementById('wordcloud');
	
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
	  autoResize: true,
	  height: '100%',
	  width: '100%'
	}
	
    var network = new vis.Network(container, data, options);
	
	network.on( 'click', function(properties) {
		nodeClick(properties);
	});
}

function loadGame() {
	init();
	document.getElementById("text").style.display="none"; 
	
	document.getElementById("point").innerHTML=localStorage.getItem('lastPoint');

    nodes = new vis.DataSet();
	nodes.add(JSON.parse(localStorage.getItem('lastNodes')));

    edges = new vis.DataSet();
	edges.add(JSON.parse(localStorage.getItem('lastEdges')));
	
    var container = document.getElementById('wordcloud');
	
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
	  autoResize: true,
	  height: '100%',
	  width: '100%'
	}
	
    var network = new vis.Network(container, data, options);
	
	network.on( 'click', function(properties) {
		nodeClick(properties);
	});
}

function init() {
	var init = true;
	addedWords=[];
	dicOneTwo = JSON.parse(dic12);
	dicThree = JSON.parse(dic3);
	dicFour = JSON.parse(dic4);
	dicFive = JSON.parse(dic5);
	dicSix = JSON.parse(dic6);
	dicSeven = JSON.parse(dic7);
	dicEight = JSON.parse(dic8);
	dicNine = JSON.parse(dic9);
	dicTen = JSON.parse(dic10);
	dic=[dicOneTwo, dicThree, dicFour, dicFive, dicSix, dicSeven, dicEight, dicNine, dicTen];
	
}
function dicContains(word) {
	var cont=false;
	for(var i=0;i<dic.length;i++) { 
		if(!cont) {
			var d=dic[i];
			if(d[0].w.length==word.length||d[1].w.length==word.length) {
				for(var j=0;j<d.length;j++) {
					if(d[j].w==word) {
						cont=true;
						break;
					}
				}
			}
		} else {
			break;
		}
	}
	return cont;
}

function listContains(list, word) {
	var cont=false;
	for(var i=0;i<list.length;i++) { 
		if(list[i]==word) {
			cont=true;
			break;
		}
	}
	return cont;
}

function chooseStartWord() {
	var startWord=dicOneTwo[Math.floor(Math.random()*dicOneTwo.length)].w;
	addedWords[0]=startWord;
	return startWord;
}

function nodeClick(properties) {
	if(typeof nodes.get(properties.nodes)[0] !="undefined") { //can click anywhere else not only on a node
		document.getElementById("text").style.display="block";
		document.getElementById("newWord").value=nodes.get(properties.nodes)[0].label;
		selectedWord=nodes.get(properties.nodes)[0].label;		
	} else {
		document.getElementById("text").style.display="none";
	}
}

function enterWord() {
	var word=document.getElementById("newWord").value.toLowerCase().replace(/\s+/g, '');	
	if(dicContains(word)) {
		document.getElementById("text").style.display="none";
		var numOfChanges = changeCount(selectedWord, word);
		var notYetAdded = !checkIfAlreadyEntered(word);
		if(notYetAdded) {
			if(numOfChanges==1) {
				addToGraph(word);
			} else {
				swal("Pay attention!", "You can add, remove or change only 1 letter! (-2 points) Try again!");
				playBadSound();
				addPoints(-2);
			}	
		} else {
			swal("Pay attention!", "This word is already added to the cloud! (-1 points) Try another one!");
			playBadSound();
			addPoints(-1);
		}
	} else {
		swal("Error", "Sorry, this word is not in the dictionary. (-3 points) Try another one! ");
		playBadSound();
		addPoints(-3);
	}	
}

function checkIfAlreadyEntered(word) {
	var entered=false;
	for(var i=0;i<addedWords.length;i++) {
		if(addedWords[i]==word) {
			entered=true;
		}
	}
	return entered;
}


function changeCount(currentWord, newWord) {
	currentWord = typeof currentWord == 'undefined' ? "" : currentWord;
	newWord = typeof newWord == 'undefined' ? "" : newWord;
	
	var numberOfChanges=0;
	if(currentWord.length==newWord.length) {
		for(var i=0;i<newWord.length;i++) {
			if(currentWord.charAt(i)!=newWord.charAt(i)) {
				numberOfChanges++;
			}
		}
	} else if(newWord.length==(currentWord.length-1)) {
		var w0=currentWord;
		var w1=newWord;
		if(w0.substring(1)==w1) {
			numberOfChanges++;
		} else if(w0.substring(0, w1.length)==w1) {
			numberOfChanges++;
		} else {
			for(var i=0;i<w0.length;i++) {
				if(w0.charAt(i)!=w1.charAt(i)) {
					numberOfChanges++;
					w0=w0.substring(0, i) + w0.substring(i+1);
					i--;
				}
			}
		}
	} else if(newWord.length==(currentWord.length+1)) {
		var w0=currentWord; 
		var w1=newWord; 
		if(w1.substring(1)==w0) {
			numberOfChanges++;
		} else if(w1.substring(0, w0.length)==w0) {
			numberOfChanges++;
		} else {
			for(var i=0;i<w1.length;i++) {
				if(w0.charAt(i)!=w1.charAt(i)) {
					numberOfChanges++;
					w1=w1.substring(0, i) + w1.substring(i+1);
					i--;
				}
			}
		}
	} else {
		numberOfChanges=10;
	}
	return numberOfChanges;
}

function addToGraph(word) {
	var point=word.length;
	var gr=word.length-1;
	var numberOfNodes=nodes.length;
	nodes.add([
		{id: numberOfNodes+1, label: word, group: gr}
	]);
	for(var i=1;i<=nodes.length;i++) {
		var con=nodes.get(i).label;
		var num=changeCount(word, con);
		if(num==1) {
			point++;
			edges.add([
				{from: numberOfNodes+1, to: i},
			]);
		}
	}
	addedWords[addedWords.length]=word;
	addPoints(point);
}

function addPoints(point) {
	document.getElementById("point").innerHTML=parseInt(document.getElementById("point").innerHTML)+point;
	if(localStorage.getItem('highscore')<=parseInt(document.getElementById("point").innerHTML)) {
		localStorage.setItem('highscore',document.getElementById("point").innerHTML);
		if(!notified) {
			swal("new high score!", localStorage.getItem('highscore'));
			notified=true;
		}
	}
	var levelbefore=localStorage.getItem('level');
	dealLevels(parseInt(document.getElementById("point").innerHTML));
	var levelafter=localStorage.getItem('level');
	if(levelbefore!=levelafter) {
		showAchivement(levelafter);
	}
	playGoodSound();
	
	var nodeItems = nodes.get({
		fields: ['id', 'label', 'group'],   
	});
	var edgeItems = edges.get({
		fields: ['from', 'to', 'group'],   
	});
	
	localStorage.setItem('lastNodes', JSON.stringify(nodeItems));
	localStorage.setItem('lastEdges', JSON.stringify(edgeItems));
	localStorage.setItem('lastPoint',parseInt(document.getElementById("point").innerHTML));
	
}
function showAchivement(levelafter) {
		var stars=0;
		switch(levelafter) {
			case "starter" : stars=0; break;
			case "beginner" : stars=1; break;
			case "intermediate" : stars=2; break;
			case "advanced" : stars=3; break;
			case "expert" : stars=4; break;
			case "master of words'" : stars=5; break;
		}
		var filling="";
		for(var i=1;i<=stars;i++) {
			filling+="<div class='diamond'></div>";
		}
		swal( {
			html:true,
			title:"new level achieved!",
			text:"<p>"+localStorage.getItem('level')+"</p><p>"+filling+"</p>"
			});
}

function dealLevels(currentPoint) {
	if(currentPoint>5000) {
		localStorage.setItem('level', 'master of words');
	} else if(currentPoint>1000) {
		localStorage.setItem('level', 'expert');
	} else if(currentPoint>500) {
		localStorage.setItem('level', 'advanced');
	} else if(currentPoint>250) {
		localStorage.setItem('level', 'intermediate');
	} else if(currentPoint>50) {
		localStorage.setItem('level', 'beginner');
	} 
}

function addWordsFromDic(list, dic) {
	for(var i=0;i<dic.length;i++) {
		if(!listContains(list, dic[i].w)) {
			list[list.length]=dic[i].w;
		}
	}
	return list;
}
