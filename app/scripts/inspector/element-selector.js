var inspector = require('./inspector');
var pageFrame = document.getElementById('page-content').contentDocument;
var allElements = pageFrame.querySelectorAll('body *:not(script)');
var pageDoc = $(pageFrame);
var hoverIntent;

pageDoc.click(function(e){
    var target = $(e.target);
    var selectors = target.data();
    var tagName = target.prop('tagName');
    var tagPosition = target.prevAll( tagName ).length;
        
    if (!target.is( inspector.selectedEl )){
        inspector.highlight({
            el: target,
            tagName: tagName,
            tagPosition: tagPosition,
            scrollPage: false,
            scrollDomTree: true,
            select: true
        });
    }
});


pageDoc.on('mouseover','*', function(e){
    var target = $(e.target),
        tagName = target.prop('tagName'),
        tagPosition = target.prevAll( tagName ).length;
        
    // clearTimeout(hoverIntent)
    if (!target.is( inspector.selectedEl )){
        hoverIntent = setTimeout(function(){
            inspector.highlight({
                el: target,
                tagName: tagName,
                tagPosition: tagPosition,
                scrollPage: false,
                scrollDomTree: true
            });
        }, 50)  
    }
    
    e.stopPropagation();
});

pageDoc.on('mouseout','*', function(e){
    inspector.clear();
    clearTimeout(hoverIntent)
});

module.exports = {}