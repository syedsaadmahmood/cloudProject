'use strict';

(function () {
  // Items Controller Spec
  describe('Items Controller Tests', function () {
    // Initialize global variables
    var ItemsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Items,
      mockItem;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Items_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Items = _Items_;

      // create mock item
      mockItem = new Items({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Item about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Items controller.
      ItemsController = $controller('ItemsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one item object fetched from XHR', inject(function (Items) {
      // Create a sample items array that includes the new item
      var sampleItems = [mockItem];

      // Set GET response
      $httpBackend.expectGET('api/items').respond(sampleItems);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.items).toEqualData(sampleItems);
    }));

    it('$scope.findOne() should create an array with one item object fetched from XHR using a itemId URL parameter', inject(function (Items) {
      // Set the URL parameter
      $stateParams.itemId = mockItem._id;

      // Set GET response
      $httpBackend.expectGET(/api\/items\/([0-9a-fA-F]{24})$/).respond(mockItem);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.item).toEqualData(mockItem);
    }));

    describe('$scope.craete()', function () {
      var sampleItemPostData;

      beforeEach(function () {
        // Create a sample item object
        sampleItemPostData = new Items({
          title: 'An Item about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Item about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Items) {
        // Set POST response
        $httpBackend.expectPOST('api/items', sampleItemPostData).respond(mockItem);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the item was created
        expect($location.path.calls.mostRecent().args[0]).toBe('items/' + mockItem._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/items', sampleItemPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock item in scope
        scope.item = mockItem;
      });

      it('should update a valid item', inject(function (Items) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/items\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/items/' + mockItem._id);
      }));

      it('should set scope.error to error response message', inject(function (Items) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/items\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(item)', function () {
      beforeEach(function () {
        // Create new items array and include the item
        scope.items = [mockItem, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/items\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockItem);
      });

      it('should send a DELETE request with a valid itemId and remove the item from the scope', inject(function (Items) {
        expect(scope.items.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.item = mockItem;

        $httpBackend.expectDELETE(/api\/items\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to items', function () {
        expect($location.path).toHaveBeenCalledWith('items');
      });
    });
  });
}());
