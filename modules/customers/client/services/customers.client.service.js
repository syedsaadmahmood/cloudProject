'use strict';

//Customers service used for communicating with the customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
  function ($resource) {
    return $resource('api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
