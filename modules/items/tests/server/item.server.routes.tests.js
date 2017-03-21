'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Item = mongoose.model('Item'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, item;

/**
 * Item routes tests
 */
describe('Item CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new item
    user.save(function () {
      item = {
        title: 'Item Title',
        content: 'Item Content'
      };

      done();
    });
  });

  it('should be able to save an item if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Get a list of items
            agent.get('/api/items')
              .end(function (itemsGetErr, itemsGetRes) {
                // Handle item save error
                if (itemsGetErr) {
                  return done(itemsGetErr);
                }

                // Get items list
                var items = itemsGetRes.body;

                // Set assertions
                (items[0].user._id).should.equal(userId);
                (items[0].title).should.match('Item Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an item if not logged in', function (done) {
    agent.post('/api/items')
      .send(item)
      .expect(403)
      .end(function (itemSaveErr, itemSaveRes) {
        // Call the assertion callback
        done(itemSaveErr);
      });
  });

  it('should not be able to save an item if no title is provided', function (done) {
    // Invalidate title field
    item.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(400)
          .end(function (itemSaveErr, itemSaveRes) {
            // Set message assertion
            (itemSaveRes.body.message).should.match('Title cannot be blank');

            // Handle item save error
            done(itemSaveErr);
          });
      });
  });

  it('should be able to update an item if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Update item title
            item.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing item
            agent.put('/api/items/' + itemSaveRes.body._id)
              .send(item)
              .expect(200)
              .end(function (itemUpdateErr, itemUpdateRes) {
                // Handle item update error
                if (itemUpdateErr) {
                  return done(itemUpdateErr);
                }

                // Set assertions
                (itemUpdateRes.body._id).should.equal(itemSaveRes.body._id);
                (itemUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of items if not signed in', function (done) {
    // Create new item model instance
    var itemObj = new Item(item);

    // Save the item
    itemObj.save(function () {
      // Request items
      request(app).get('/api/items')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single item if not signed in', function (done) {
    // Create new item model instance
    var itemObj = new Item(item);

    // Save the item
    itemObj.save(function () {
      request(app).get('/api/items/' + itemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', item.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single item with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/items/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Item is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single item which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent item
    request(app).get('/api/items/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No item with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an item if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Delete an existing item
            agent.delete('/api/items/' + itemSaveRes.body._id)
              .send(item)
              .expect(200)
              .end(function (itemDeleteErr, itemDeleteRes) {
                // Handle item error error
                if (itemDeleteErr) {
                  return done(itemDeleteErr);
                }

                // Set assertions
                (itemDeleteRes.body._id).should.equal(itemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an item if not signed in', function (done) {
    // Set item user
    item.user = user;

    // Create new item model instance
    var itemObj = new Item(item);

    // Save the item
    itemObj.save(function () {
      // Try deleting item
      request(app).delete('/api/items/' + itemObj._id)
        .expect(403)
        .end(function (itemDeleteErr, itemDeleteRes) {
          // Set message assertion
          (itemDeleteRes.body.message).should.match('User is not authorized');

          // Handle item error error
          done(itemDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Item.remove().exec(done);
    });
  });
});
