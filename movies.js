var inner1;
var inner2;
var inner3;
var strId;
function initialize () {
  inner1 = document.getElementById("inner1");
  inner2 = document.getElementById("inner2");
  inner3 = document.getElementById("inner3");
  rightpane = document.getElementById("rightpane");
}
function sendRequest () {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET","proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
         var json = JSON.parse(this.responseText);
         document.getElementById("leftpane").innerHTML="";
         
         var list = document.createElement('ul');
         list.id = 'list';
            for(var n=0;n<json.results.length;n++)
              {
          	     var item = document.createElement('li');
          	     var movieTitle = json.results[n].title;
          	     var textN = document.createTextNode(json.results[n].title +" - "+ json.results[n].release_date.substring(0,4));
          	     item.appendChild(textN);
          	     item.className = "item";
          	     list.appendChild(item);       	 
              }
         
         document.getElementById("leftpane").appendChild(list);
         document.getElementById("list").addEventListener("click", function(e){
            if (e.target && e.target.matches("li.item")) {
          		          var str = e.target.innerText;
   		                  var str1 = str.substring(0,str.indexOf('-')-1);
                        createId(str1,json);
                      }
              });
       }
   };
   xhr.send(null);
}
function createId(textstr,json)
{
    for(var h=0;h<json.results.length;h++)
    {
    	if(json.results[h].title==textstr)
    	{
    		var movieId = json.results[h].id;
        strId = String(movieId);
    	}
    }
    document.getElementById("inner1").innerHTML="";
    document.getElementById("inner3").innerHTML="";
    document.getElementById("inner2").innerHTML="";
    basicInfo();
    castInfo();
}

function basicInfo()
{
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(this.responseText);
        
          var imageSpan = document.createElement('img');
          imageSpan.src ="http://image.tmdb.org/t/p/w185/"+json.poster_path; 
          imageSpan.style.maxWidth='100%';
          imageSpan.style.maxHeight ='100%';
          imageSpan.display = 'block';

          var titleSpan = document.createElement('span');
          titleSpan.innerText = "TITLE: "+json.original_title+"\n";
     
          var genreSpan = document.createElement('span');
          for(var h=0;h<json.genres.length;h++){
            genreSpan.innerText ="GENRE: "+json.genres[h].name+"\n";
           }

          var overviewSpan = document.createElement('span');
          overviewSpan.innerText ="OVERVIEW: "+json.overview+"\n";

          inner1.appendChild(imageSpan);
          inner3.appendChild(titleSpan); 
          inner3.appendChild(genreSpan);
          inner2.appendChild(overviewSpan);
          
    }

  };
  xhttp.open("GET","proxy.php?method=/3/movie/"+strId);
  xhttp.send();  
}
function castInfo()
{
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET","proxy.php?method=/3/movie/"+strId+"/credits");
  xhttp.setRequestHeader("Accept","application/json");
  xhttp.onreadystatechange = function(){
     if (this.readyState == 4) {
       var json=JSON.parse(this.responseText); 
       var castSpan = document.createElement('span');
       if(json.cast.length==0){
        castSpan.innerText = "CAST MEMBER : Not Mentioned"+"\n";
       }else{
       castSpan.innerText = "CAST MEMBER : "+json.cast[0].name+","+json.cast[1].name+","+json.cast[2].name+","+json.cast[3].name+"\n";
       }
       inner3.appendChild(castSpan);  
       } 
  };
  xhttp.send(null);
}