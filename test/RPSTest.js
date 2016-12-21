var assert = chai.assert;

describe('RPS', function() {
    describe('compareFunction', function() {
        describe('userAndCompEqual', function() {
            it('should return outcome 0 if both quarantine', function() {
                var userSelection = "quarantine";
                var computerSelection = "quarantine";
                var actualResult = compare(userSelection, computerSelection);
                assert.equal(outcome, 0);
            });

            it('should return outcome 0 if both cure', function() {
                var userSelection = "cure";
                var computerSelection = "cure";
                var actualResult = compare(userSelection, computerSelection);
                assert.equal(outcome, 0);
            });

            it('should return outcome 0 if both rescue', function() {
                var userSelection = "rescue";
                var computerSelection = "rescue";
                var actualResult = compare(userSelection, computerSelection);
                assert.equal(outcome, 0);
            });

            it('should return outcome -1 if not quarantine, cure, or rescue', function() {
                var userSelection = "pizza";
                var computerSelection = "pizza";
                var actualResult = compare(userSelection, computerSelection);
                assert.equal(outcome, -1);
            });

            it('should return quarantine message', function() {
                var userSelection = "quarantine";
                var computerSelection = "quarantine";
                var actualResult = compare(userSelection, computerSelection);
                var expectedResult = "You tried to herd some of the infected towards a " +
                     "quarantine zone, but your technique was ineffective " +
                     "and they scattered. Try again.";
                assert.equal(actualResult, expectedResult);
            });

        });
    });
});



// template for it
// it('', function() {
//       assert.equal(0, 0);
// });