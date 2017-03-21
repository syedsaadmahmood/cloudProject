'use strict';

// Configuring the Items module
angular.module('items').run(['Menus',
  function (Menus) {
    // Add the items dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Items',
      state: 'items',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'List Items',
      state: 'items.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'Create Items',
      state: 'items.create'
    });
  }
]);
