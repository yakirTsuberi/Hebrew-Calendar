var app = angular.module('app', []);
app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
}]);
app.controller('MainController', function ($scope, $http,$timeout, letters) {

    $scope.animate_active = null;

    var vm = this;
    vm.list = null;
    vm.is_pregnant = false;
    vm.today = {year: null, month: null, day: null};

    vm.months_list = months_list;
    vm.get_year = get_year;
    vm.to_heb = to_heb;
    vm.month_today = month_today;
    vm.is_today = is_today;
    vm.next_month = next_month;
    vm.before_month = before_month;
    vm.next_year = next_year;
    vm.before_year = before_year;
    vm.num_to_letter = letters.num_to_letter;


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
        var months = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'אדר א', 'אדר ב', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
        if (vm.is_pregnant) {
            months.splice(5, 1);
        } else {
            months.splice(6, 2);
        }
        return months
    }

    function month_today(num) {
        num = Number(num);
        if (vm.is_pregnant && num >= 6) {
            num += 1
        }
        return months_list()[num]
    }

    function is_today(day) {
        return day === vm.today.day & vm.month === vm.today.month & vm.year === vm.today.year
    }

    function next_month() {
        vm.month = Number(vm.month);
        if (vm.month < months_list().length - 1){
            $scope.animate_active = 'animated zoomOutLeft';
            $timeout(function(){
                vm.month += 1
                $scope.animate_active='animated zoomInRight';
            },500,true);
         }
    }

    function before_month() {
        vm.month = Number(vm.month);
        if (vm.month > 0){

            $scope.animate_active = 'animated zoomOutRight';
            $timeout(function(){
                vm.month -= 1
                $scope.animate_active='animated zoomInLeft';
            },500,true);


        }

    }

    function next_year() {
        if (vm.year < 6000) {
            $scope.animate_active = 'animated zoomOut';
            $timeout(function(){
                vm.year += 1;
                vm.get_year(vm.year);
                $scope.animate_active='animated zoomIn';
            },500,true);

        }
    }

    function before_year() {
        $scope.animate_active = 'animated zoomOut';
            $timeout(function(){
                vm.year -= 1;
                vm.get_year(vm.year)
                $scope.animate_active='animated zoomIn';
            },500,true);

    }
});
app.service('letters', function () {
        this.num_to_letter = num_to_letter;
        function year_to_list(year) {
            var result = [];
            var _next = year;
            for (var i = year.toString().length - 1; i > -1; i--) {
                var exp = Math.pow(10, i);
                var tmp = Math.floor(_next / exp);
                _next = _next % exp;
                result.push(tmp * exp)
            }
            return result
        }

        function map_letters(num) {
            var num_1 = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
            var num_10 = ['י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
            var num_100 = ['ק', 'ר', 'ש', 'ת'];
            if (num < 10)
                return num_1[num - 1];
            if (num < 100)
                return num_10[Math.floor(num / 10) - 1];
            if (num < 1000) {
                if (num <= 400)
                    return num_100[Math.floor(num / 100) - 1];
                if (num > 899) {
                    return 'תתק'
                } else {

                    return num_100[3] + num_100[(Math.floor(num / 100) - 4) - 1]
                }
            }
            if (num < 10000)
                return num_1[Math.floor(num / 1000) - 1]

        }

        function num_to_letter(num) {
            var result = '';
            var list = year_to_list(num);
            for (var i in list)
                result += map_letters(list[i])
            return result.slice(0, -1) + '"' + result.slice(-1)
        }
    }
);