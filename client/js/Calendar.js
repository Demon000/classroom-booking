(function(){
    var defaultLanguage = {
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekday: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        w : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    };
    function Calendar(o) {
        var c = this;
        Emitter.mixin(c);
    }
    window.Calendar = Calendar;
})();
