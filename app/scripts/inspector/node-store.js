var _ = require('lodash');
var Reflux = require('reflux');

var NodeStore = Reflux.createStore({
    init: function() {
        this.listenTo(nodesChanged, this.output);
    },
    output: function(flag) {
        var status = flag ? 'ONLINE' : 'OFFLINE';
        this.trigger(status);
    }
}); 

console.log(Reflux)

module.exports = NodeStore;