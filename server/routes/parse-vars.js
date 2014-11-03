var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var lineReader = require('line-reader');
var varsDir = path.join( __dirname, '../../app/assets/styles/vars/');

function parseVar(variable){
    variable = variable.split(':');

    var name = variable[0].replace('$','');
    var value = variable[1].replace(';','');

    if (value.indexOf('new-breakpoint') > -1){
        value = value.match(/\((.*?)\)/)[1];
    } 

    if (value[0] == ' '){
        value = value.substring(1);
    }
console.log(value)

    return {
        name: name,
        value: value
    }
}

function parse(callback){
    var varFiles;
    var done;
    
    fs.readdir(varsDir, function(err, files){
        varFiles = files;
        
        done = _.after(files.length, function() {
            callback(varFiles);
        });
        
        _.forEach(files, function(file, i) {
            var sourcePath = path.join( __dirname, '../../app/assets/styles/vars/' + file);
            var vargroups = [];
            var lineCount = 0;
            var prevVargroup;
            var vargroup;

            lineReader.eachLine(sourcePath, function(line, last) {
                var comment = line.indexOf('//');
                
                // if current line is comment, use as vargroup name
                if (comment > -1){
                    vargroup = line.split('').splice(2);
                    
                    if (vargroup[0] == ' '){
                        vargroup.shift();
                    }

                    vargroup = vargroup.join('');
                    
                    if (vargroup != prevVargroup){
                        vargroups.push({
                            name: vargroup,
                            variables: []
                        });
                        prevVargroup = vargroup;
                    }
                } else if (vargroups && line[0] == '$') {
                    vargroups[vargroups.length-1].variables.push({
                        line: lineCount,
                        variable: parseVar(line)
                    });
                }

                lineCount++;
            }).then(function(){
                var source = varFiles[i].replace('_','').replace('.scss','');
                // add groups to file source
                varFiles[i] = {
                    source: varFiles[i],
                    name: source,
                    vargroups: vargroups
                }
                done();
            });    
        });
    });
}

module.exports.parse = parse;