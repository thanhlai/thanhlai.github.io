"use strict"

var letters = /^[0-9a-zA-Z]+$/;

$("#codeTextarea").bind('paste', function(e) {
    var code = e.originalEvent.clipboardData.getData('text');
    if (!code) {
         $('#properties').empty();
        return;
    }
     var lines = code.split('\n');
      for(var i = 0;i < lines.length;i++){
       
       if (lines.indexOf(" class ") !== -1) {
            continue;
       }
          
       var regex = /(.*public\s+)(.*)(\s+{ get; set; }.*)/;
       var propertyName = lines[i].replace(regex, "$2");
    
          if (!letters.test(propertyName)) {
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
