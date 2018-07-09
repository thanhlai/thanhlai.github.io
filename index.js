$(document).ready(function() {
loadJSON('projects.json', function(response) {
  var projects = JSON.parse(response);
  // render projects
  for (var i = 0; i < projects.length; i++) {
    var project = '<div class="col-lg-4 col-sm-6" style="text-align: center;">';
    project += '<img class="img-responsive" style="margin:0 auto;" width="64" src="' + projects[i].logo + '">';
    project += '<h3>' + projects[i].name + ' <small><a href="' + projects[i].url + '" target="_blank"><sup><i class="ion-link"></i></sup></a></small> </h3>';
    project += '<p>' +  projects[i].description + '</p>';
    project += '</div>';

    $('#projects').append(project);
  }

 });
 function loadJSON(file, callback) {   
    var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
    };
    xobj.send(null);  
 }
});
