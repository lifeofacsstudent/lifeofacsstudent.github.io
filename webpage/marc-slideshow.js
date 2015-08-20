/* Marc Slideshow
 * --------------
 * Marc Calendar is an easy to install Javascript file that adds a image
 * slideshow in your website. The slideshows can be fully customized via CSS.
 *
 * last update: 2014-09
 * ---
 * This code is released under the MIT License.
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012-2014 Marc Robledo - http://usuaris.tinet.cat/mark/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */




/* CONFIGURATION */
var DEFAULT_WAIT=3; //3 seconds
var THUMBNAIL_SUFFIX='.thumbnail';








/*Shortcuts*/
function el(e){return document.getElementById(e)}
function addEvent(elem,e,func){if(elem.addEventListener){elem.addEventListener(e,func,false)}else if(elem.attachEvent){elem.attachEvent('on'+e,func)}else{elem['on'+e]=func}}
function getDirectChildren(elem, tagName){var children=elem.getElementsByTagName(tagName);var directChildren=new Array();for(var i=0; i<children.length; i++)if(children[i].parentNode == elem)directChildren.push(children[i]);return directChildren} 





/* -------------------------------- */












var isIE=false;
if(/MSIE [4-9]/.test(navigator.userAgent)){isIE=true;changeElementOpacity=changeElementOpacityOldIE}

var slides=new Array();


function MarcSlideshow(id, params){
	if(!el(id)){
		console.error('Invalid slideshow ID.');
		return false;
	}else if(slides[id]){
		console.error('Slideshow ID already exists.');
		return false;
	}

	var div=el(id);
	var ul;
	this.slides; //maximum number of slides
	if(document.querySelector){
		ul=document.querySelector('#'+id+' > ul');
		this.slides=document.querySelectorAll('#'+id+' > ul > li');
	}else{
		ul=document.getElementById(id).getElementsByTagName('ul')[0];
		this.slides=getDirectChildren(el(id), 'li');
	}

	if(!ul || !this.slides){
		console.error('Slideshow '+id+' was not built correctly.');
		return;
	}
	ul.style.listStyle='none';
	this.ul=ul;

	this.i=0;
	this.nexti=0;
	this.nSlides=this.slides.length;
	this.timer=0;
	this.changing=false;
	this.mouseover=false;

	this.id=id;
	this.speed=DEFAULT_WAIT*1000;
	this.automatic=true;

	this.CSS3Slider=false;
	if(/horizontal/.test(params)){
		this.CSS3Slider='horizontal';
	}else if(/vertical/.test(params)){
		this.CSS3Slider='vertical';
	}

	this.lazyQueue=new Array(this.nSlides);
	for(var i=0; i<this.nSlides; i++){
		this.lazyQueue[i]=getLazyImagesFromSlide(this.slides[i]).length;
	}

	var startPaused=false;
	this.calculateOffsets=function(){
		var offset=0;
		for(var i=1; i<this.nSlides; i++){
			if(this.CSS3Slider == 'vertical'){
				offset+=this.slides[i-1].offsetHeight;
				offset+=getNumericCSS(this.slides[i-1], 'marginTop');
				offset+=getNumericCSS(this.slides[i-1], 'marginBottom');
			}else{
				offset+=this.slides[i-1].offsetWidth;
				offset+=getNumericCSS(this.slides[i-1], 'marginLeft');
				offset+=getNumericCSS(this.slides[i-1], 'marginRight');
			}
			this.offsets[i]=offset;
		}
	};

	div.style.overflow='hidden';
	if(!this.CSS3Slider){
		//Set first slide as opaque and the rest as transparent
		//div.style.overflow='hidden';
		for(var i=0; i<this.nSlides; i++){
			this.slides[i].style.position='absolute';
			this.slides[i].style.top='0px';
			this.slides[i].style.left='0px';
			this.slides[i].style.width='100%';
			this.slides[i].style.height='100%';
			if(i==0){
				this.slides[0].style.zIndex=301;
				changeElementOpacity(this.slides[0], 100);
			}else{
				this.slides[i].style.zIndex=300;
				changeElementOpacity(this.slides[i], 0);
			}
		}
	}else{
		ul.style.overflow='hidden';
		//Get maximum number of pages and calculate offsets	
		this.offsets=new Array(this.nSlides);
		this.offsets[0]=0;
		//this.calculateOffsets();
		addEvent(window, 'load', function(){slides[id].calculateOffsets();});
		addEvent(window, 'resize', function(){slides[id].calculateOffsets();});
	}


	this.marker=false;
	if(params){
		var matches;
		if(matches=params.match(/speed.?(\d+)/i)){
			this.speed=matches[1]*1000;
		}

		if(/numeric|thumbnail|text|marker/i.test(params)){
			var marker=document.createElement('div');
			marker.className='slideshow-markers';
			marker.style.zIndex=302;

			for(var i=0; i<this.nSlides; i++){
				var markerElement=document.createElement('div');
				if(/numeric/.test(params)){
					markerElement.innerHTML=(i+1);
				}else if(/thumbnail/.test(params)){
					if(this.slides[i].getAttribute('data-thumb')){
						markerElement.innerHTML='<img src="'+this.slides[i].getAttribute('data-thumb')+'" />';
					}else{
						var img;
						if(document.querySelector){
							img=this.slides[i].querySelector('img');
						}else{
							img=this.slides[i].getElementsByTagName('img')[0];
						}

						if(img.getAttribute('data-lazy')){
							img=img.getAttribute('data-lazy').replace(/\.(gif|jpe?g|png)$/, THUMBNAIL_SUFFIX+'.$1');
						}else if(img){
							img=img.src.replace(/\.(gif|jpe?g|png)$/, THUMBNAIL_SUFFIX+'.$1');
						}else{
							img='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
						}
						markerElement.innerHTML='<img src="'+img+'" />';
					}
				}else if(/text/.test(params)){
					var h2;
					if(document.querySelector){
						h2=this.slides[i].querySelector('h2');
					}else{
						h2=this.slides[i].getElementsByTagName('h2')[0];
					}
					markerElement.innerHTML=h2.innerHTML;
				}
				
				markerElement.className='slideshow-marker slideshow-marker-'+i;
				if(i==0){
					markerElement.className+=' selected';
				}
				marker.appendChild(markerElement);
				addClickMarkerEvent(markerElement, id, i);
			}
			div.appendChild(marker);
			this.marker=marker;
		}

		if(/button/i.test(params)){
			var previousButton=document.createElement('div');
			previousButton.className='slideshow-button slideshow-button-previous';
			previousButton.style.zIndex=302;
			//addEvent(previousButton, 'click', new Function('prevSlide(\''+this.id+'\');'));
			addEvent(previousButton, 'click', function(){prevSlide(id);});
			div.appendChild(previousButton);

			var nextButton=document.createElement('div');
			nextButton.className='slideshow-button slideshow-button-next';
			nextButton.style.zIndex=302;
			//addEvent(nextButton, 'click', new Function('nextSlide(\''+this.id+'\');'));
			addEvent(nextButton, 'click', function(){nextSlide(id);});
			div.appendChild(nextButton);
		}

		if(/no.?auto|manual/i.test(params)){
			this.automatic=false;
		}

		if(/paused/i.test(params)){
			startPaused=true;
		}
	}


	this.resume = function(){
		if(!this.changing && this.automatic){
			if(isIE)
				this.timer=window.setTimeout("nextSlide(\'"+this.id+"\')", this.speed);
			else
				this.timer=window.setTimeout(nextSlide, this.speed, this.id);
		}
		this.mouseover=false;
	};
	this.pause = function(){
		if(!this.changing){
			clearInterval(this.timer);
		}
		this.mouseover=true;
	};

	
	if(this.automatic){
		addEvent(el(this.id), 'mouseout', function(){slides[id].resume();});
		addEvent(el(this.id), 'mouseover', function(){slides[id].pause();});
	}
	slides[id]=this;

	if(!startPaused)
		addEvent(window, 'load', function(){slides[id].resume()});
}







function getNumericCSS(elem, name){
	var val;
	if(elem.style[name]){
		val=elem.style[name];
	}else if(elem.currentStyle){
		val=elem.currentStyle[name];
	}else if (document.defaultView && document.defaultView.getComputedStyle) {
		name = name.replace(/([A-Z])/g, "-$1");
		name = name.toLowerCase();
		s = document.defaultView.getComputedStyle(elem, "");
		val=s && s.getPropertyValue(name);
	}else{
		val=0;
	}

	val=parseInt(val.replace(/[^\d\-\.]/g,''));
	if(!val)
		val=0;

	return val;
}




function changeElementOpacity(elem,alpha){elem.style.opacity=alpha/100}
function changeElementOpacityOldIE(elem,alpha){elem.filters.item("DXImageTransform.Microsoft.Alpha").opacity=alpha}
function addClickMarkerEvent(markerElement,slideId,i){addEvent(markerElement, 'click', function(){setSlide(slideId, i)})}
function resumeLazy(idSlide,slide){slides[idSlide].lazyQueue[slide]--;if(slides[idSlide].lazyQueue[slide]==0)setSlide(idSlide,slide)}
function getLazyImagesFromSlide(slide){var lazyImages=new Array();var imgs=slide.getElementsByTagName('img');for(var i=0; i<imgs.length; i++)if(imgs[i].getAttribute('data-lazy') && imgs[i].getAttribute('data-lazy')!='0')lazyImages.push(imgs[i]);return lazyImages}
function nextSlide(idSlide){if(slides[idSlide].loadingLazy)return false;var next=slides[idSlide].nexti+1;if(next>=slides[idSlide].nSlides)next=0;setSlide(idSlide, next)}
function prevSlide(idSlide){if(slides[idSlide].loadingLazy)return false;var previous=slides[idSlide].nexti-1;if(previous<=-1)previous=slides[idSlide].nSlides-1;setSlide(idSlide,previous)}




function setSlide(nSlide, image){
	if(slides[nSlide].changing || slides[nSlide].i == image)
		return;

	if(slides[nSlide].lazyQueue[image]){
		var imgs=getLazyImagesFromSlide(slides[nSlide].slides[image]);
		for(var i=0; i<imgs.length; i++){
			if(imgs[i].getAttribute('src') != imgs[i].getAttribute('data-lazy')){
				addEvent(imgs[i], 'load', function(){resumeLazy(nSlide, image)});
				imgs[i].src=imgs[i].getAttribute('data-lazy');
			}
		}
		return;
	}

	slides[nSlide].nexti=image;
	slides[nSlide].changing=true;

	clearTimeout(slides[nSlide].timer);

	if(slides[nSlide].marker){
		var markerElements;
		if(document.querySelector){
			markerElements=slides[nSlide].marker.querySelectorAll('div');
		}else{
			markerElements=slides[nSlide].marker.getElementsByTagName('div');
		}
		if(markerElements[slides[nSlide].nexti]){
			markerElements[slides[nSlide].nexti].className+=' selected';
			markerElements[slides[nSlide].i].className=markerElements[slides[nSlide].i].className.replace(/ selected/, '');
		}
	}
	

	if(!slides[nSlide].CSS3Slider){
		var lis=slides[nSlide].slides;
		lis[slides[nSlide].i].style.zIndex=300;
		changeElementOpacity(lis[slides[nSlide].nexti], 0);
		lis[slides[nSlide].nexti].style.zIndex=301;

		var alpha=0;
		var alphaInc;
		if(!isIE){
			alphaInc=4;
		}else{
			alphaInc=5;
		}
		slides[nSlide].timer=window.setInterval(function(){
			alpha+=alphaInc;

			changeElementOpacity(lis[slides[nSlide].nexti], alpha);

			if(alpha>=100){
				changeElementOpacity(lis[slides[nSlide].i], 0);
				slides[nSlide].i=slides[nSlide].nexti;
				slides[nSlide].changing=false;
				clearInterval(slides[nSlide].timer);
				if(!slides[nSlide].mouseover){
					slides[nSlide].resume();
				}
			}
		}, 10);


	}else{
		if(slides[nSlide].CSS3Slider == 'vertical'){
			slides[nSlide].ul.style.marginTop=(-slides[nSlide].offsets[image])+'px';
		}else{
			slides[nSlide].ul.style.marginLeft=(-slides[nSlide].offsets[image])+'px';
		}

		slides[nSlide].i=slides[nSlide].nexti;
		slides[nSlide].changing=false;
		if(!slides[nSlide].mouseover){
			slides[nSlide].resume();
		}
	}
	
}
