(function () {
    'use strict';

    angular
        .module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['$location', 'UserService', 'EventService', '$rootScope', '$http', 'FlashService'];
    function EventController($location, UserService, EventService, $rootScope, $http, FlashService) {
        var vm = this;

        vm.guests = [];

        vm.addGuest = function () {
            vm.guests.push(vm.newGuest);
        }

        vm.removeGuest = function (guest) {
            var index = vm.guests.indexOf(guest);
            vm.guests.splice(index, 1);
        }

        vm.event = event;
        function event() {
            vm.dataLoading = true;
            EventService.Create(vm.events)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Event created successful', true);
                        $location.path('/events');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }






        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }









    }

})();
