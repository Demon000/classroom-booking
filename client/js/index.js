var dateSelector = new Calendar({
    input: document.querySelector('#date'),
    language: {
        month: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
        weekday: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
        w : ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    }
});
var roomSelector = new Selector({
    container: document.querySelector('#rooms'),
    options: ['25', '31', '7']
});
