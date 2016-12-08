//Tests for rock paper scissors game

// dependencies
var chai = require('chai');
var assert = chai.assert;

describe("RockPaperScissors", function () {
    it("create computer selection", function() {
      var computer = Math.random();
      assert.isAtMost(computer, 1, "should at most be 1");
      assert.isAtLeast(computer, 0, "should at least be 0");
    });
    it("test computer selection assignment", function() {
      var computer = Math.random();

      if (computer<0.34 && computer>0){
        computer = "quarantine";
        assert.equal(computer, "quarantine", "is not quarantine when 0<x<.34");
      }
      else if(computer<=0.67 && computer>=0.34){
        computer = "cure";
        assert.equal(computer, "cure", "is not cure when .34<x<.67");
      }
      else if(computer>.67){
        computer = "rescue";
        assert.equal(computer, "rescue", "is not quarantine when >.67");
      }
    });    
});
