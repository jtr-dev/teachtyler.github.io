(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies']).directive('ngModelOnblur', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                priority: 1, // needed for angular 1.2.x
                link: function (scope, elm, attr, ngModelCtrl) {
                    if (attr.type === 'radio' || attr.type === 'checkbox') return;

                    elm.unbind('input').unbind('keydown').unbind('change');
                    elm.bind('blur', function () {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(elm.val());
                        });
                    });
                }
            }
        })
        .config(config)
        .run(run);


    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider, $rootScope, $http) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'views/home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'views/register/register.view.html',
                controllerAs: 'vm'
            })

            .when('/event', {
                controller: 'EventController',
                templateUrl: 'views/event/event.view.html',
                controllerAs: 'vm'
            })

            .when('/events', {
                controller: 'EventsController',
                templateUrl: 'views/events/events.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }






    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }










})();
