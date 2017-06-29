"use strict"
var model = new Object();
var regex = /(.*public\s+)(.*)(\s+{ get; set; }.*)/;

$('#codeTextarea').bind('input change', function() {
    extract(this.value);
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
            model.name = propertyName.replace(/\s+/g, " ").match(/class\s(\w*)/, '')[1];
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
    // get record(s) by key(s).
    var keys = [];
    var code = 'public IEnumerable<' + model.name + '> Get(';
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
    $('#getTextarea').val(code);
    
    // add record(s).
    code = 'INSERT INTO [' + model.name + '] (';
    
    $('#addTextarea').val(code);
    
    // update record(s).
    code = 'UPDATE [' + model.name + ']';
    $('#updateTextarea').val(code);
    
    // delete record(s)
    code = 'DELETE FROM [' + model.name + ']';
    $('#deleteTextarea').val(code);
}
