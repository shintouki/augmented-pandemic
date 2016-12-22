var assert = chai.assert;

describe('Testing play.js', function() {
    describe('initMap function', function() {
        
        describe('checkFunction', function() {
            it('initMap should exist and be function', function() {
                assert.isFunction(initMap);
            });
        });

        describe('checkFunction', function() {
            it('should return geolation failed if handleLocationError is called', function() {
                var actualResult = handleLocationError();
                var expectedResult = "Geolocation failed.";
                assert.equal(actualResult, expectedResult);
            });

            it('handleLocationError should exist and be function', function() {
                assert.isFunction(handleLocationError);
            });
        });
        
    });

});