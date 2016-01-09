import { test } from 'qunit';
import moduleForAcceptance from 'atlantaember/tests/helpers/module-for-acceptance';

const doesInclude = function (string, substrings) {
  const statuses = substrings.map(function (substring) {
    if(string.indexOf(substring) > -1) {
      return true;
    } else {
      return false;
    }
  });

  return statuses.indexOf(false) < 0;
};

moduleForAcceptance('Acceptance | topic');

test('visiting /topics', function(assert) {
  visit('/topics');

  andThen(function() {
    assert.equal(currentURL(), '/topics');
  });
});

test('has a title', function(assert) {
  visit('/topics');

  andThen(function() {
    assert.equal(this.$('h1.page-title').text().trim(), 'Topics');
  });
});

test('has a list of topics', function(assert) {
  visit('/topics');
  const topicNames = server.createList('topic', 3)
    .map(function (topic) {
      return topic.name;
    });

  andThen(function() {
    let string = this.$('.topics li').text();
    assert.ok(doesInclude(string, topicNames));
  });
});

test('can create a new topic', function (assert) {
  visit('/topics');

  fillIn('.new-topic .name', 'some name');
  click ('.new-topic .submit');

  andThen(function() {
    let string = this.$('.topics li').text();
    assert.ok(doesInclude(string, ['some name']));
  });

  fillIn('.new-topic .name', 'some other name');
  click ('.new-topic .submit');

  andThen(function() {
    let string = this.$('.topics li').text();
    assert.ok(doesInclude(string, ['some name', 'some other name']));
  });
});

// test('it shows errors from server validations', function (assert) {
//   const errors = {
//           errors: [
//             { detail: "can't be blank",
//               source: {
//                 pointer: "data/attributes/name"
//               }
//             }
//           ]
//         }

//   visit('/topics');
//   server.post('/topics', errors, 404);
//   click ('.new-topic .submit');

//   andThen(function() {
//     let string = this.$('.topics').text();
//     assert.ok(doesInclude(string, ["can't be blank"]));
//   });
// });