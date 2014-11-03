
module.exports = {
    onEditorClicked: function(){
        var self = this;
        var cm = this.state.cm;

        if (cm._handlers.mousedown){
            delete cm._handlers.mousedown[0];    
        }
        cm.on('mousedown', function(editor, e){
            var cursor = cm.getCursor();
            var mark = cm.findMarksAt({line: cursor.line, ch: cursor.ch});
            
            self.setActiveMark(mark);
        });
    },
    onEditorTab: function(){
        // user can tab through marks pertaining to active selector
        var self = this;
        var cm = this.state.cm;

        if (cm._handlers.keyHandled){
            delete cm._handlers.keyHandled[0];    
        }

        cm.on('keyHandled', function(editor, name, e){
            e.preventDefault();

            if (name == 'Cmd-Down' || name == 'Cmd-Up'){
                var mark = self.getMarkPosition(name);

                cm.scrollIntoView(mark.position);
            }
        });
    },
    onEditorChanged: function(){
        // handles editor changes and send changes to server
        var self = this;
        var cm = this.state.cm;
        var pollInterval;

        function sendEditContent(lineNumber){
            var source = {
                lineNumber: lineNumber,
                editContent: cm.getValue()
            }
            
            $.ajax({
                url: '/edit-source',
                type: 'post',
                data: source
            });
        }

        function onChange(editor, changed){
            var lineNumber = changed.from.line;

            clearTimeout(pollInterval);

            pollInterval = setTimeout(function(){
                sendEditContent(lineNumber);
            }, 400);
        }

        if (cm._handlers.change){
            delete cm._handlers.change[0];    
        }
        
        cm.on('change', onChange);
    }
}