var assert = chai.assert;

describe('Testing play.js', function() {
    describe('initMap function', function() {
        
        describe('checkFunction', function() {
            it('initMap should exist and be function', function() {
                assert.isFunction(initMap);
            });
        });

    });

    describe('handleLocationError function', function() {
            it('should return geolocation failed if handleLocationError is called', function() {
                var actualResult = handleLocationError();
                var expectedResult = "Geolocation failed.";
                assert.equal(actualResult, expectedResult);
            });

            it('handleLocationError should exist and be function', function() {
                assert.isFunction(handleLocationError);
            });

    });


    describe('checkVars', function() {
        it('ccnyMarkers should exist and be a variable', function() {
            assert.isDefined(ccnyMarkers);
        });

        it('baysideMarkers should exist and be a variable', function() {
            assert.isDefined(baysideMarkers);
        });

        it('safeZoneMarkers should exist and be a variable', function() {
            assert.isDefined(safeZoneMarkers);
        });
    });

});