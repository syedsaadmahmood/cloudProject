'use strict';

(function () {
  // Customers Controller Spec
  describe('Customers Controller Tests', function () {
    // Initialize global variables
    var CustomersController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Customers,
      mockCustomer;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Customers_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Customers = _Customers_;

      // create mock customer
      mockCustomer = new Customers({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Customer about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Customers controller.
      CustomersController = $controller('CustomersController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one customer object fetched from XHR', inject(function (Customers) {
      // Create a sample customers array that includes the new customer
      var sampleCustomers = [mockCustomer];

      // Set GET response
      $httpBackend.expectGET('api/customers').respond(sampleCustomers);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.customers).toEqualData(sampleCustomers);
    }));

    it('$scope.findOne() should create an array with one customer object fetched from XHR using a customerId URL parameter', inject(function (Customers) {
      // Set the URL parameter
      $stateParams.customerId = mockCustomer._id;

      // Set GET response
      $httpBackend.expectGET(/api\/customers\/([0-9a-fA-F]{24})$/).respond(mockCustomer);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.customer).toEqualData(mockCustomer);
    }));

    describe('$scope.craete()', function () {
      var sampleCustomerPostData;

      beforeEach(function () {
        // Create a sample customer object
        sampleCustomerPostData = new Customers({
          title: 'An Customer about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Customer about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Customers) {
        // Set POST response
        $httpBackend.expectPOST('api/customers', sampleCustomerPostData).respond(mockCustomer);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the customer was created
        expect($location.path.calls.mostRecent().args[0]).toBe('customers/' + mockCustomer._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/customers', sampleCustomerPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock customer in scope
        scope.customer = mockCustomer;
      });

      it('should update a valid customer', inject(function (Customers) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/customers\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/customers/' + mockCustomer._id);
      }));

      it('should set scope.error to error response message', inject(function (Customers) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/customers\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(customer)', function () {
      beforeEach(function () {
        // Create new customers array and include the customer
        scope.customers = [mockCustomer, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/customers\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCustomer);
      });

      it('should send a DELETE request with a valid customerId and remove the customer from the scope', inject(function (Customers) {
        expect(scope.customers.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.customer = mockCustomer;

        $httpBackend.expectDELETE(/api\/customers\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to customers', function () {
        expect($location.path).toHaveBeenCalledWith('customers');
      });
    });
  });
}());
