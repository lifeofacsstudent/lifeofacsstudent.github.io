function goBack(){location.href="/index.html"}function byFive(e){col=e;for(var l=collectByColor(),t=0;t<document.getElementsByClassName("article").length;t++)document.getElementsByClassName("article")[t].style.display="none";if(l.length>5){document.getElementsByClassName("more")[0].style.display="block";for(var t=0;5>t;t++)l[t].style.display="flex"}else{document.getElementsByClassName("more")[0].style.display="none";for(var t=0;t<l.length;t++)l[t].style.display="flex"}}function fiveMore(){document.getElementsByClassName("more")[0].style.display="none";for(var e=collectByColor(),l=[],t=0;t<e.length;t++)"none"==e[t].style.display&&l.push(e[t]);if(l.length>5){document.getElementsByClassName("more")[0].style.display="block";for(var t=0;5>t;t++)l[t].style.display="flex"}else{document.getElementsByClassName("more")[0].style.display="none";for(var t=0;t<l.length;t++)l[t].style.display="flex"}}function collectByColor(){var e=document.getElementsByClassName("article"),l=[];if(""==col)l=e;else for(var t=0;t<e.length;t++)e[t].id.substring(e[t].id.length-1,e[t].id.length)==col.substring(0,1)&&l.push(e[t]);return l}var col="";