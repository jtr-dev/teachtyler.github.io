(function () {
    'use strict';

    angular
        .module('app')
        .factory('EventService', EventService);

    EventService.$inject = ['$http'];
    function EventService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByEventName = GetByEventName;
        //service.GetAllGuests = GetAllGuests;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/events').then(handleSuccess, handleError('Error getting all events'));

        }

        function GetById(id) {
            return $http.get('/api/events/' + id).then(handleSuccess, handleError('Error getting events by id'));

        }

        function GetByEventName(eventName) {
            return $http.get('/api/events/' + eventName).then(handleSuccess, handleError('Error getting event by event name'));
        }

        //function GetAllGuests(username) {
        //    return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));

        //}

        function Create(event) {
            return $http.post('/api/events', event).then(handleSuccess, handleError('Error creating event'));
        }

        function Update(event) {
            return $http.put('/api/events/' + event.id, event).then(handleSuccess, handleError('Error updating event'));
        }

        function Delete(id) {
            return $http.delete('/api/events/' + id).then(handleSuccess, handleError('Error deleting event'));
        }


        //private functions

        function handleSuccess(res) {
            return res.data;
        }
        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }



    }
})();