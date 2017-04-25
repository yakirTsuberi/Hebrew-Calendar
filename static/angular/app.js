var app = angular.module('app', []);
app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
}]);
app.controller('MainController', function ($http) {
    var vm = this;
    vm.list = null;
    vm.is_pregnant = false;
    vm.get_year = get_year;
    vm.to_heb = to_heb;




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
            console.log(month);
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
        console.log(result);
        return result
    }

    function to_heb(num) {
        var hebrew = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו',
            'טז', 'יז', 'יח', 'יט', 'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל'];
        return hebrew[num - 1]
    }
});
