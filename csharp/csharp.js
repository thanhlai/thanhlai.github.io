"use strict"

$("#codeTextarea").bind('paste', function(e) {
    var code = e.originalEvent.clipboardData.getData('text');
    if (!code) {
         $('#properties').empty();
        return;
    }
     var lines = code.split('\n');
      for(var i = 0;i < lines.length;i++){
       
       // get property name
       var regex = /(.*public\s+)(.*)(\s+{ get; set; }.*)/;
       var propertyName = lines[i].replace(regex, "$2");
          
      var property = '<div class="form-check">';
      property += '<label class="form-check-label">';
      property += '<input class="form-check-input" type="checkbox">';
      property += propertyName;
      property += '</label>';
      property += '</div>';
      
      $('#properties').append(property);
  }
});

$('#generateButton').on('click', function() {
    alert('doing work')
  
});
