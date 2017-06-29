"use strict"

$("#codeTextarea").bind('paste', function(e) {
    var code = e.originalEvent.clipboardData.getData('text');
     var lines = code.split('\n');
      for(var i = 0;i < lines.length;i++){
      var property = '<div class="form-check">';
      property += '<label class="form-check-label">';
      property += '<input class="form-check-input" type="checkbox">';
      property += lines[i];
      property += '</label>';
      property += '</div>';
      
      $('#properties').append(property);
  }
});

$('#generateButton').on('click', function() {
    alert('doing work')
  
});
