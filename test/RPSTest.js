var assert = chai.assert;

describe('RPS', function() {
  describe('compareFunction', function() {
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