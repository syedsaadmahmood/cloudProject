'use strict';

// Setting up route
angular.module('customers').config(['$stateProvider',
  function ($stateProvider) {
    // Customers state routing
    $stateProvider
      .state('customers', {
        abstract: true,
        url: '/customers',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('customers.list', {
        url: '',
        templateUrl: 'modules/customers/views/list-customers.client.view.html'
      })
      .state('customers.create', {
        url: '/create',
        templateUrl: 'modules/customers/views/create-customer.client.view.html'
      })
      .state('customers.view', {
        url: '/:customerId',
        templateUrl: 'modules/customers/views/view-customer.client.view.html'
      })
      .state('customers.edit', {
        url: '/:customerId/edit',
        templateUrl: 'modules/customers/views/edit-customer.client.view.html'
      });
  }
]);
