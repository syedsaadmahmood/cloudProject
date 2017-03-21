'use strict';

// Customers controller

var customersapp = angular.module('customers');

customersapp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log',
  function ($scope, $stateParams, Authentication, Customers, $modal, $log) {

      this.authentication = Authentication;
      // Find a list of Customers
      this.customers = Customers.query();

      this.modalUpdate = function (size, selectedCustomer) {

          var modalInstance = $modal.open({
              templateUrl: 'modules/customers/views/edit-customer.client.view.html',
              controller: function ($scope, $modalInstance, customer) {
                  $scope.customer = customer;

                  $scope.ok = function () {
                      $modalInstance.close($scope.customer);
                  };

                  $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                  };
              },
              size: size,
              resolve: {
                  customer : function () {
                      return selectedCustomer;
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedCustomer;
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      };

  }
]);

customersapp.controller('CustomersCreateController', ['$scope', 'Customers',
    function ($scope, Customers) {

    }
]);

customersapp.controller('CustomersUpdateController', ['$scope', 'Customers',
    function ($scope, Customers) {
        // Update existing Customer
        this.update = function (updatedCustomer) {
            var customer = updatedCustomer;

            customer.$update(function () {

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);

/*
    // Create new Customer
    $scope.create = function () {
      // Create new Customer object
      var customer = new Customers({
        firstName: this.firstName,
        number: this.number,
          country: this.country
      });

      // Redirect after save
      customer.$save(function (response) {
        $location.path('customers/' + response._id);

        // Clear form fields
        $scope.firstName = '';
        $scope.number = '';
          $scope.country = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Customer
    $scope.remove = function (customer) {
      if (customer) {
        customer.$remove();

        for (var i in $scope.customers) {
          if ($scope.customers[i] === customer) {
            $scope.customers.splice(i, 1);
          }
        }
      } else {
        $scope.customer.$remove(function () {
          $location.path('customers');
        });
      }
    };

    // Update existing Customer
    $scope.update = function () {
      var customer = $scope.customer;

      customer.$update(function () {
        $location.path('customers/' + customer._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find existing Customer
    $scope.findOne = function () {
      $scope.customer = Customers.get({
        customerId: $stateParams.customerId
      });
    };
*/
