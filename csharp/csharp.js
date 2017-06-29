"use strict"
var model = new Object();
var regex = /(.*public\s+)(.*)(\s+{ get; set; }.*)/;

$('#codeTextarea').bind('input change', function() {
    extract(this.value);
});

$('#generateButton').on('click', function() {
    
  transform();
});


function extract(text) {
    
    model = new Object();
    model.properties = [];
    $('#properties').empty();
    
    
     var lines = text.split('\n');
      for(var i = 0;i < lines.length;i++){
               
       var propertyName = lines[i].replace(regex, "$2");
          
       if (propertyName.indexOf(" class ") !== -1) {
           console.log(propertyName);
            model.name = propertyName.trim().match(/class\s(\w*)/, '')[1];
           console.log(propertyName.trim());
            continue;
       }
          
       var propertyType = propertyName.split(/\s+/g)[0];
       propertyName = propertyName.split(/\s+/g)[1];
          
       if (!propertyType || !propertyName) {
        continue;
       }
          
      var modelProperty = new Object();
      modelProperty.type = propertyType;
      modelProperty.name = propertyName;
      modelProperty.isKey = true; // testing
      model.properties.push(modelProperty);
         
          
      var property = '<div class="form-check">';
      property += '<label class="form-check-label">';
      property += '<input class="form-check-input" type="checkbox"> ';
      property += propertyName;
      property += '</label>';
      property += '</div>';
      
      $('#properties').append(property);
}
}

function transform() {
    // get single record by key(s)
    var keys = [];
    var code = 'public bool Get(';
    for (var i = 0; i < model.properties.length; i++) {
        var property = model.properties[i];
        if (property.isKey) {
            keys.push(property.type + " " + property.name);
        }
    }
    code += keys.join(", ");
    code += ') {';
    
    code += '\n \tvar query = "SELECT * FROM [' + model.name + '] WHERE ';
    
    var conditions = [];
    for (var i = 0; i < keys.length; i++) {
        var keyName = keys[i].split(/\s+/g)[1];
        conditions.push('[' + keyName + '] = @' + keyName);
    }
    code += conditions.join(" AND ") + ';"';
    
    code += '\n}';
    console.log(code);
}
