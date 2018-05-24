"use strict"
var model = new Object();
var csharpDataTypes = ["bool", "byte", "char", "decimal", "double", "enum", "float", "int", "long", "sbyte", "short", "object", "string", "uint", "ulong", "ushort", "DateTime"];
var csharpClass = "class";
//test
$( document ).ready(function() {
    var test = 'public class Example'
    test += '\n{'
    test += '\n\tpublic long id {get;set;}'
    test += '\n\tpublic int age {get;set;}'
    test += '\n\tpublic string name {get;set;}'
    test += '\n\tpublic bool isCsharp {get;set;}'
    test += '\n}';
    $('#codeTextarea').val(test);
    $('#codeTextarea').trigger('change');
});

$('#codeTextarea').bind('input change', function() {
    extract(this.value);
    transform();
});

function extract(text) {

    model = new Object();
    model.properties = [];
    $('#properties').empty();

    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {

        var line = lines[i].replace(/\s+/g, " ");

        if (line.toLowerCase().indexOf(csharpClass) !== -1) {
            model.name = line.slice(line.toLowerCase().indexOf(csharpClass) + csharpClass.length + 1).split(' ')[0];
            continue;
        }

        $.each(csharpDataTypes, function() {
            var dataType = this;
            if (line.toLowerCase().indexOf(dataType) !== -1) {
                var property = new Object();
                property.type = dataType;
                property.name = line.slice(line.toLowerCase().indexOf(dataType) + dataType.length + 1).split(' ')[0];
                property.isKey = true;
                model.properties.push(property);

                $('#properties').append('<div class="form-check">' +
                                            '<label class="form-check-label">' +
                                                '<input class="form-check-input" type="checkbox" checked onchange="transform();" value="' + property.name +  '"> ' + property.name +
                                            '</label>' +
                                        '</div>');
            }
        });
    }
}

function transform() {

    $('#properties input').each(function() {
         var propertyName = this.value;
         var isChecked = this.checked;
         
         $.each(model.properties, function() {
                if (this.name == propertyName) {
                    this.isKey = isChecked;
                }
         });
    });

    if (!model.name || model.properties.length == 0) {
        $('#getTextarea').text("");
        $('#addTextarea').text("");
        $('#updateTextarea').text("");
        $('#deleteTextarea').text("");
        return;
    }

    // get record(s) by key(s).
    var keys = [];
    var code = 'public IEnumerable<' + model.name + '> Get(';
    for (var i = 0; i < model.properties.length; i++) {
        var property = model.properties[i];
        if (property.isKey) {
            keys.push(property.type + " " + property.name.lowerCaseFirstLetter());
        }
    }
    code += keys.join(', ');
    code += ')';
    code += '\n{';
    code += '\n\tvar query = "SELECT * FROM [' + model.name + ']';

    var conditions = [];
    for (var i = 0; i < keys.length; i++) {
        var keyName = keys[i].split(/\s+/g)[1];
        conditions.push('[' + keyName + '] = @' + keyName);
    }
    if (conditions.length > 0) {
        code += ' WHERE ' + conditions.join(' AND ');
    }
    code += '";';
    if (conditions.length > 0) {
        code += '\n\tvar parameters = new List<SqlParameter>()';
        code += '\n\t{';
        for (var i = 0; i < keys.length; i++) {
            var keyName = keys[i].split(/\s+/g)[1];
            code += '\n\t\tnew SqlParameter("@' + keyName.lowerCaseFirstLetter() + '", ' + keyName + '), ';
        }
        code += '\n\t};';
    }

    code += '\n}';
    $('#getTextarea').text(code);

    // add record(s) with object(s).
    code = 'public int Add(IEnumerable<' + model.name + '> ' +  pluralize(model.name.lowerCaseFirstLetter()) + ')';
    code += '\n{';
    code += '\n\tforeach (var ' + model.name.lowerCaseFirstLetter() + ' in ' + pluralize(model.name.lowerCaseFirstLetter()) + ') ';
    code += '\n\t{';
    code += '\n\t\tvar query = "INSERT INTO [' + model.name + '] (';

    var propertyNames = model.properties.map(function(property) {return property.name;});
    var columnNames = propertyNames.map(function(name) { return "[" +  name + "]";})
    code += columnNames.join(', ') + ') VALUES (';
    var parameterNames = propertyNames.map(function(name) { return "@" +  name.lowerCaseFirstLetter();});
    code += parameterNames.join(', ') + ')";';

    code += '\n\t\tvar parameters = new List<SqlParameter>()';
    code += '\n\t\t{';
    for (var i = 0; i < propertyNames.length; i++) {
        code += '\n\t\t\tnew SqlParameter("@' + propertyNames[i].lowerCaseFirstLetter() + '", ' + model.name.lowerCaseFirstLetter() + '.' + propertyNames[i] + '), ';
    }
    code += '\n\t\t};';
    code += '\n\t}';
    code += '\n}';

    $('#addTextarea').text(code);

    // update record(s) with object(s).
    code = 'public int Update(IEnumerable<' + model.name + '> ' +  pluralize(model.name.lowerCaseFirstLetter()) + ')';
    code += '\n{'
    code += '\n\tforeach (var ' + model.name.lowerCaseFirstLetter() + ' in ' + pluralize(model.name.lowerCaseFirstLetter()) + ') ';
    code += '\n\t{';
    code += '\n\t\tvar query = "UPDATE [' + model.name + '] SET ';
    
    columnNames = propertyNames.map(function(name) { return "[" +  name + "] = @" + name;})
    code += columnNames.join(', ');
    if (conditions.length > 0) {
        code += ' WHERE ' + conditions.join(' AND ');
    }
    code += '";';    
    code += '\n\t\tvar parameters = new List<SqlParameter>()';
    code += '\n\t\t{';
    for (var i = 0; i < propertyNames.length; i++) {
        code += '\n\t\t\tnew SqlParameter("@' + propertyNames[i].lowerCaseFirstLetter() + '", ' + model.name.lowerCaseFirstLetter() + '.' + propertyNames[i] + '), ';
    }
    code += '\n\t\t};';
    code += '\n\t}';
    code += '\n}';
    
    $('#updateTextarea').text(code);

    // delete record(s) with key(s).   
    var code = 'public int Delete(';
    code += keys.join(', ');
    code += ')';
    code += '\n{';
    code += '\n\tvar query = "DELETE FROM [' + model.name + ']';
        var conditions = [];
    for (var i = 0; i < keys.length; i++) {
        var keyName = keys[i].split(/\s+/g)[1];
        conditions.push('[' + keyName + '] = @' + keyName);
    }
    if (conditions.length > 0) {
        code += ' WHERE ' + conditions.join(' AND ');
    }
    code += '";';
    if (conditions.length > 0) {
        code += '\n\tvar parameters = new List<SqlParameter>()';
        code += '\n\t{';
        for (var i = 0; i < keys.length; i++) {
            var keyName = keys[i].split(/\s+/g)[1];
            code += '\n\t\tnew SqlParameter("@' + keyName.lowerCaseFirstLetter() + '", ' + keyName + '), ';
        }
        code += '\n\t};';
    }
    code += '\n}';
    
    $('#deleteTextarea').text(code);
    
    Prism.highlightAll();
}

String.prototype.lowerCaseFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
