// Modified rock paper scissors; Quarantine = Rock, Cure = Paper, Rescue = Scissors

// var exports = module.exports = {};

var outcome = undefined;

playGame = function(choice){
  var computer = Math.random();
  let user = choice;

  if (computer<0.34 && computer>0){
    computer = "quarantine";
  }
  else if (computer<=0.67 && computer>=0.34){
    computer = "cure";
  }
  else if (computer>0.67){
    computer = "rescue";
  }

  let result = compare(user, computer);
  var resultOutput = "<p>You: " + user + " Enemy: " + computer + "<br>" + result + "</p>";

  $("#infoWindow").append(resultOutput);
  $("#infoWindow").animate({scrollTop: $('#infoWindow').prop("scrollHeight")}, 500);
}

function compare(userSelection, computerSelection){
  if (userSelection == computerSelection){
    outcome = 0;
    if (userSelection == "quarantine"){
      return "You tried to herd some of the infected towards a " +
             "quarantine zone, but your technique was ineffective " +
             "and they scattered. Try again.";
    }
    else if (userSelection == "cure"){
      return "You tried to inject the antidote into a nearby infected person," +
             " but your aim was off- try again.";
    }
    else if(userSelection == "rescue"){
      return "You attempted to get to the healthy person, but too many " +
             "infected got in your way, obstructing your path. Try again.";
    }
    else {
      outcome = -1;
      return "Error"
    }
	}
  if (userSelection == "quarantine"){
    if (computerSelection == "rescue"){
      outcome = 1;
      return "You successfully lured some infected into a vehicle " +
             "to transport them to a quarantine zone! Infection rate down.";
    }
    else {
      outcome = -1;
      return "While trying to attract the attention of one of the infected, " +
             "one of your colleagues was dragged away by a different group " +
             "of the infected. Infection rate up.";
		}
  }
  else if (userSelection == "cure"){
    if (computerSelection == "quarantine"){
      outcome = 1;
      return "You successfully injected the antidote into one of the infected!"+
             " Infection rate down.";
    }
    else{
      outcome = -1;
      return "You tried to inject the antidote into one of the infected, " +
             "but it saw you coming. A colleague comes to defend you but " +
             "gets bitten! Infection rate up." ;
    }
  }
  else if (userSelection == "rescue"){
    if (computerSelection == "quarantine"){
      outcome = 1;
      return "You successfully brought a healthy person into the safe zone! " +
             "Infection rate down.";
    }
    else {
      outcome = -1;
      return "You heard a scream as someone was overtaken by a group of " +
             "infected. Infection rate up.";
    }
  }
  else {
      return "Error"
    }
}
