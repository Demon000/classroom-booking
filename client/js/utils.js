(function(){
    function Range(low, high) {
        var l = [];
        for (var i = low; i <= high; i++) {
            l.push(i);
        }
        return l;
    }
    window.Range = Range;
})();

(function(){
    function guid() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    window.guid = guid;
    window.s4 = s4;
})();
