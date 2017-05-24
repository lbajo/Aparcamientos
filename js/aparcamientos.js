var apiKey = 'AIzaSyAzQAuJA4hn8S8j6DkSetnTVV-Y2RZRYCE';
var listUsers = [];
var listCol = [];
var j = 0;

function createMap(){
  map = L.map('map').setView([40.4175, -3.708], 11);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
};

function saveButton(){
  var collectionSelect = [];

  for (var i = 0; i < listCol.length; i++) {
    if(listCol[i].name == document.getElementById("n_c").value){
       collectionSelect.push({name:listCol[i].name, value: listCol[i].value}); 
    }
  }

  $("#guf").click(function(event){
    var data = JSON.stringify(collectionSelect);
    var token = document.getElementById("tokeng").value;
    var repo = document.getElementById("nameg").value;
    var file = document.getElementById("fichg").value;
    var github = new Github({token:token,auth:"oauth"});
    var repository = github.getRepo("lbajo", repo);

    repository.write("master", file, data, "prueba2", function(err){console.log(err)});
    $("#bot_g").hide();
  });
};

function loadButton(){

  var token = document.getElementById("tokenc").value;
  var repo = document.getElementById("namec").value;
  var file = document.getElementById("fichc").value;
  var github = new Github({token:token,auth:"oauth"});
  var repository = github.getRepo("lbajo", repo);

  repository.read('master',file, function(e, data) {
    var obj;
    obj=JSON.parse(data);

    for (var i = 0; i < obj.length; i++){
      listCol.push({name:obj[i].name, value: obj[i].value});
      var name =obj[i].name;
    }

    $("#list_colec").append('<h4 value="'+name+'" id="'+name+'">' + name + '</h4>');
    $('h4').click(listCollec);
      
    $("#bc").click(function(event){
      $("#bot_c").hide();
    });
  });
};


function listCollec(){
  var h=0;
  var colec = $(this).attr('value');
  $('#name_colec').html("");
  document.getElementById("name_colec").value="";
  $('#name_colec').html(colec);
  document.getElementById("name_colec").value=colec;

  $('#n_c').html("");
  $('#n_c').html(colec);
  document.getElementById("n_c").value=colec;

  for (var i = 0; i < listCol.length; i++) {
   // console.log("--name"+listCol[i].name);
    if (h ==0){
      $('#arrastrar ').html("");
      $('#colec p').html("");
    }
    if(listCol[i].name == colec){
      if(listCol[i].name!=undefined){
        $("#arrastrar").append("<li>" + listCol[i].value + "</li>");
        $("#colec p").append("<li>" + listCol[i].value + "</li>");
       // console.log("lista"+listCol[i].value);
      }
    }
    h = h+1;
  }
};

function listUs(){
  var na = document.getElementById("n_apar3").value;
  var t=0;
   for (var i = 0; i < listUsers.length; i++) {
    if (t ==0){
      $('#mostrar').html("");
    }
    if(listUsers[i].name == na){
      if(listUsers[i].name!=undefined){
        console.log("undef");
        $("#mostrar").append("<li>" + listUsers[i].value + "</li>");
   //     console.log("lista"+listUsers[i].value);
      }
    }
    t = t+1;
  }
};

function createCollection(){
  var name = document.getElementById("new_colecc").value;
  $("#list_colec").append('<h4 value="'+name+'" id="'+name+'">' + name + '</h4>');
  $('h4').click(listCollec);
 
};

function photos(lat, lon){
  var url1="https://commons.wikimedia.org/w/api.php?format=jsonfm&action=query&list=geosearch&gsprimary=all&gsnamespace=6&gsradius=500&gscoord="+lat+"|"+lon+"&callback=?";
  $.getJSON( url1, {
        tagmode: "any",
        format: "json"
  }).done(function(data) {
    var len=data.query.geosearch.length;
    var array=[];
    for (var i = 0; i < len; i++) {
      array[i]=data.query.geosearch[i].pageid;
    }
            
    var url2="https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord="+lat+"|"+lon+"&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";
    $.getJSON( url2, {
          tagmode: "any",
          format: "json"
    }).done(function(data) {

       if(len>0){
        $('#img0,#img1,#img2,#img3,#img4').html('');
        $("<img>").attr("src", data.query.pages[array[0]]["imageinfo"][0].thumburl).appendTo("#img0");
        if(len>1)
        $("<img>").attr("src", data.query.pages[array[1]]["imageinfo"][0].thumburl).appendTo("#img1");
        if(len>2)
        $("<img>").attr("src", data.query.pages[array[2]]["imageinfo"][0].thumburl).appendTo("#img2");
        if(len>3)
          $("<img>").attr("src", data.query.pages[array[3]]["imageinfo"][0].thumburl).appendTo("#img3");
        if(len>4)
          $("<img>").attr("src", data.query.pages[array[4]]["imageinfo"][0].thumburl).appendTo("#img4");
      }
    });
  });

};


function parkingsList(){
  var apar = apars[$(this).attr('no')];
  var lat = apar.location.latitude;
  var lon = apar.location.longitude;
  var url = apar.relation;
  var name = apar.title;
  var place = apar.address["locality"];
  var street = apar.address["street-address"];
  var cod = apar.address["postal-code"];
  var desc = apar.organization["organization-desc"];
  L.marker([lat, lon]).addTo(map)
   .bindPopup('<a href="' + url + '">' + name + '</a><br/>')
   .openPopup();
  map.setView([lat, lon], 15);

  $('#n_apar, #n_apar3').html(name);
  document.getElementById("n_apar3").value=name;

  $('#desc, #desc3').html('<p>'+place+'</p> <p>'+ street +', '+cod+ '</p><p>' + desc + '</p>');

  photos(lat, lon);

};


function getParkings(){
  var url="json/aparcamientos.json";
    $.getJSON( url, {
          tagmode: "any",
          format: "json"
    }).done(function(data) {

        $('#info,#info2').html('');

        apars = data.graph;
        n = apars.length;
        var list = '<p>Aparcamientos encontrados: ' + n + '</p>'
        list = list + '<ul>'
        for (var i = 0; i < n; i++) {
          list = list + '<li no=' + i + ' draggable="true" value="'+apars[i].title+'">' + apars[i].title + '</li>';
        }
        list = list + '</ul>';
        $('#list,#list2').html(list);

        $('li').click(parkingsList);
        $('li').click(listUs);

        $(function() {
          $("#list li").draggable({revert:true, appendTo:"body", helper:"clone"});
        });

      });

};

$( "#arrastrar" ).droppable({
      drop: function( event, ui ) {
        var n_colec=document.getElementById("new_colecc").value;
        var nameColec=document.getElementById("name_colec").value;
      //  console.log("nameColec "+nameColec);
        if(n_colec!=""){
          $( this )
            .find( "p" )
            .append('<h5 value="'+ui.draggable[0].attributes[2].value+'">' + ui.draggable[0].attributes[2].value + '</h5>');
         //   console.log(ui.draggable[0].attributes[2].value);
          }
     
          listCol.push({name:nameColec, value: ui.draggable[0].attributes[2].value});
          
        }
    });

$( "#usuarios" ).droppable({
      drop: function( event, ui ) {
        var desc=document.getElementById("desc3").value;
        var name_apar = document.getElementById("n_apar3").value;
        console.log("holaaaa ->"+ name_apar);
        if(desc!=""){
          $( this )
            .find( "p" )
            .append('<h5 value="'+ui.draggable[0].attributes[2].value+'">' + ui.draggable[0].attributes[2].value + '</h5>');
        //    console.log(ui.draggable[0].attributes[2].value);
          }

          listUsers.push({name:name_apar, value: ui.draggable[0].attributes[2].value});
          listUs();
        }
    });

$(document).ready(function(){

  $('#n_c').html("");
  $('#name_colec').html("");
  document.getElementById("new_colecc").value="";

  createMap();

  $("#bot_c, #bot_g").hide();
  $("#ins,#ins2").click(getParkings);
  $("#add").click(createCollection);
  
  $("#caf").click(function(event){
    $("#bot_c").hide();
  });


  $("#bc").click(function(event){
    $("#bot_c").show();
    loadButton();
  });

  $("#bg").click(function(event){
    $("#bot_g").show();
    saveButton();
  });
});
