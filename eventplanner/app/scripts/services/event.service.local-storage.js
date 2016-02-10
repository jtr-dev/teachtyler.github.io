(function () {
    'use strict';

    angular
        .module('app')
        .factory('EventService', EventService);

    EventService.$inject = ['$timeout', '$filter', '$q'];
    function EventService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByEventName = GetByEventName;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getEvents());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getEvents(), { id: id });
            var event = filtered.length ? filtered[0] : null;
            deferred.resolve(event);
            return deferred.promise;
        }

       
        function GetByEventName(eventName) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getEvents(), { eventName: eventName});
            var event = filtered.length ? filtered[0] : null;
            deferred.resolve(event);
            return deferred.promise;
        }

        function Create(event) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByEventName(event.eventName)
                    .then(function (duplicateEvent) {
                        if (duplicateEvent !== null) {
                            deferred.resolve({ success: false, message: '"' + event.eventName + '" is already taken' });
                        } else {
                            var events = getEvents();

                            // assign id
                            var lastEvent = events[events.length - 1] || { id: 0 };
                            event.id = lastEvent.id + 1;

                            // save to local storage
                            events.push(event);
                            setEvents(events);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(event) {
            var deferred = $q.defer();

            var events = getEvents();
            for (var i = 0; i < events.length; i++) {
                if (events[i].id === events.id) {
                    events[i] = event;
                    break;
                }
            }
            setEvents(events);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var events = getEvents();
            for (var i = 0; i < events.length; i++) {
                var event = event[i];
                if (event.id === id) {
                    events.splice(i, 1);
                    break;
                }
            }
            setEvents(events);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getEvents() {
            if (!localStorage.events) {
                localStorage.events = JSON.stringify([]);
            }

            return JSON.parse(localStorage.events);
        }

        function setEvents(events) {
            localStorage.events = JSON.stringify(events);
        }
    }
})();