// rock paper scissor game mechanics

var user = undefined;
var outcome = undefined;

function playGame(choice){
  var computer = Math.random();
  user = choice;

  if (computer<0.34 && computer>0){
    computer = "quarantine";
  }
  else if(computer<=0.67 && computer>=0.34){
    computer = "cure";
  }
  else if(computer>.67){
    computer = "rescue";
  }

  result = compare(user, computer);
  document.getElementById("result").innerHTML =
    "You: " + user + " Enemy: " + computer + "<br>" + result;
}

function compare(userSelection, computerSelection){
  if (userSelection == computerSelection){
    outcome = 0;
    if (userSelection == "quarantine"){
      return "You tried to herd some of the infected towards a quarantine zone, " +
             "but your technique was ineffective and they scattered. Try again.";
    }
    else if (userSelection == "cure"){
      return "You tried to inject the antidote into a nearby infected person, " +
             "but your aim was off- try again.";
    }
    else if(userSelection == "rescue"){
      return "You attempted to get to the healthy person, "+
             "but too many infected got in your way, obstructing your path. Try again."
    }
	}
  if (userSelection == "rock"){
    if (computerSelection == "scissors"){
      outcome = 1;
      return "You win! Infection rate down.";
    }
    else {
      outcome = -1;
      return "You lost. Infection rate up.";
		}
  }
  else if (userSelection == "paper"){
    if (computerSelection == "rock"){
      outcome = 1;
      return "You win! Infection rate down." ;
    }
    else if("scissors"){
      outcome = -1;
      return "You lost. Infection rate up." ;
    }
  }
  else if (userSelection == "scissors"){
    if (computerSelection == "rock"){
      outcome = -1;
      return "You lost. Infection rate up.";
    }
    else {
      outcome = 1;
      return "You win! Infection rate down.";
    }
	}
}
