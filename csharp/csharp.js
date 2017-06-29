"use strict"

var regex = /(.*public\s+)(.*)(\s+{ get; set; }.*)/;

$("#codeTextarea").bind('paste', function(e) {
    var code = e.originalEvent.clipboardData.getData('text');
    
    $('#properties').empty();
    
     var lines = code.split('\n');
      for(var i = 0;i < lines.length;i++){
               
       var propertyName = lines[i].replace(regex, "$2");
          
       if (propertyName.indexOf(" class ") !== -1) {
            continue;
       }
          
       var propertyType = propertyName.split(/\s+/g)[0];
       propertyName = propertyName.split(/\s+/g)[1];
          
       if (!propertyType || !propertyName) {
        continue;
       }
          
      var property = '<div class="form-check">';
      property += '<label class="form-check-label">';
      property += '<input class="form-check-input" type="checkbox"> ';
      property += propertyName;
      property += '</label>';
      property += '</div>';
      
      $('#properties').append(property);
  }
});

$('#generateButton').on('click', function() {
    alert('doing work')
  
});
