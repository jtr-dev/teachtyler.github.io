(function () {
    'use strict';
 
    angular
      .module('app')
      .controller('RegisterController', RegisterController)
      .directive('pwCheck', [function () {
          return {
              require: 'ngModel',
              link: function (scope, elem, attrs, ctrl) {
                  var firstPassword = '#' + attrs.pwCheck;
                  elem.add(firstPassword).on('keyup', function () {
                      scope.$apply(function () {
                          // console.info(elem.val() === $(firstPassword).val());
                          ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                      });
                  });
              }
          }
      }]);
 
    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService', '$scope'];
    function RegisterController(UserService, $location, $rootScope, FlashService, $scope) {
        var vm = this;
        $scope.myRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})\S$/;
        //vm.myRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
        
        vm.password = '';
        

        //vm.myRegex = new RegExp("/[a-zA-Z]{4}[0-9]{6,6}[a-zA-Z0-9]{3}/");
        ////vm.myRegex = /[a-zA-Z]{4}[0-9]{6,6}[a-zA-Z0-9]{3}/;

        vm.register = register;
 
        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }



 
})();