var fs = require('fs');
var path = require('path');
var lineReader = require('line-reader');

module.exports = function(req, res){
    var source = req.body;
    // var sourcePath = source.sourceStart.source.replace('/source/','');
    var sourceStart = source.lineNumber;
    var sourcePath = 'main.scss';
    var lines = [];
    var lineCount = 0;

    sourcePath = path.join( __dirname, '../../app/assets/styles/' + sourcePath);
    
    fs.writeFile(sourcePath, source.editContent, function (err) {
        if (err) throw err;
        console.log('It\'s saved! in same location.');
    });
    
    // lineReader.eachLine(sourcePath, function(line, last) {
    //     if (sourceStart == lineCount){
    //         line = source.editContent;
    //     }

    //     lines.push(line);
    //     lineCount++;
    // }).then(function(){
    //     fs.writeFile(sourcePath, lines.join('\n'), function(err) {
    //         if(err) {
    //             console.log(err);
    //         } else {
    //             console.log("The file was saved!");
    //         }
    //     });
    // });
}