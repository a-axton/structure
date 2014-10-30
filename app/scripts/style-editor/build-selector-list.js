var pageFrame = document.getElementById('page-content').contentDocument;

var selectorList = function(callback){
    $.ajax({
        url: "/build-selector-list",
        success: callback
    });
}

// get list of all selectors used in css file
// from server
selectorList(function(data){
    var selectors = data.selectors;
    var mediaQueries = data.mediaQueries;

    window.app.selectors = selectors;
    window.app.mediaQueries = mediaQueries;

    // iterate over list of all selectors returned
    // find dom elements that inherit from those selectors
    for (var i = 0; i < selectors.length; i++){
        var selector = selectors[i].selector;
        var queryList = pageFrame.querySelectorAll(selector);
        
        if (queryList.length > 0){
            function assignSelectorData(el){
                el = $(el),
                data = el.data();

                if (!data.selectors){
                    data.selectors = [selectors[i]];
                } else {
                    data.selectors.push(selectors[i]);
                }
            }

            if (queryList.length > 1){
                for (var n = 0; n < queryList.length; n++){
                    var el = queryList[n];
                    assignSelectorData(el);
                }   
            } else {
                assignSelectorData(queryList);
            }            
        }
    }
});

module.exports = {}