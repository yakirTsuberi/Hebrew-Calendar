var app = angular.module('app', []);
app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
}]);
app.controller('MainController', function ($http) {
    var vm = this;
    vm.list = null;
    vm.is_pregnant = false;
    vm.today = {year:null, month:null, day:null};

    vm.months_list = months_list;
    vm.get_year = get_year;
    vm.to_heb = to_heb;
    vm.month_today = month_today;
    vm.is_today = is_today;
    vm.next_month = next_month;
    vm.before_month = before_month;
    vm.next_year = next_year;
    vm.before_year = before_year;



    function get_year(year) {
        $http.post('/get_year', {year: year}).then(function (response) {

            vm.year_list = response.data.year_list;
            vm.is_pregnant = response.data.is_pregnant;
            vm.list = get_months();
        })
    }


    function range(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    }

    function get_months() {
        var result = [];
        for (var month in vm.year_list) {
            var start = vm.year_list[month][1];
            var result_month = range(1, vm.year_list[month][0]);
            if (start === 0)
                start = 7;

            for (var i = 1; i < start; i++) {
                result_month.unshift(null);
            }
            var tmp = result_month.length;

            if (tmp % 7 === 0) {
                result.push(result_month);
                continue;
            }
            for (var i = 0; i < 7 - tmp % 7; i++) {
                result_month.push(null);
            }
            result.push(result_month)
        }
        return result
    }

    function to_heb(num) {
        var hebrew = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו',
            'טז', 'יז', 'יח', 'יט', 'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל'];
        return hebrew[num - 1]
    }

    function months_list() {
        var months = ['תשרי','חשון','כסלו','טבת','שבט','אדר', 'אדר א' ,'אדר ב' ,'ניסן','אייר','סיון','תמוז','אב','אלול'];
        if (vm.is_pregnant){
            months.splice(5, 1);
        } else {
            months.splice(6, 2);
        }
        return months
    }
    function month_today(num){
        num = Number(num);
        if (vm.is_pregnant & num >= 6){
            num += 1
        }
        return months_list()[num]
    }
    function is_today(day) {
        return day == vm.today.day & vm.month == vm.today.month & vm.year == vm.today.year
    }
    function next_month(){
        vm.month = Number(vm.month);
        if(vm.month < months_list().length - 1)
            vm.month += 1
    }
    function before_month(){
        vm.month = Number(vm.month);
        if(vm.month > 0)
            vm.month -= 1
    }
    function next_year(){
        if(vm.year < 6000){
            vm.year += 1;
            vm.get_year(vm.year)
            }
    }
    function before_year(){
            vm.year -= 1;
            vm.get_year(vm.year)
    }
});
