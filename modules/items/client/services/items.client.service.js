'use strict';

//Items service used for communicating with the items REST endpoints
angular.module('items').factory('Items', ['$resource',
  function ($resource) {
    return $resource('api/items/:itemId', {
      itemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
