// rock paper scissor game mechanics
var user = undefined;

function playGame(choice){
  var computer = Math.random();
  user = choice;

  if (computer <0.34){
    computer = "rock";
  }
  else if(computerOption <=0.67){
    computer = "paper";
  }
  else{
    computer = "scissors";
  }

  result = compare(user, computer);
  document.getElementById("result").innerHTML = "You: " + user + " Enemy: " + computer + "<br>" + result;
}

function compare(userSelection, computerSelection){
  if (userSelection == computerSelection){
    return "Draw- try again.";
	}
  if (userSelection == "rock"){
    if (computerSelection == "scissors"){
      return "You win! Infection rate down.";
    }
    else {
      return "You lost. Infection rate up.";
		}
  }
  else if (userSelection == "paper"){
    if (computerSelection == "rock"){
      return "You win! Infection rate down." ;
    }
    else if("scissors"){
      return "You lost. Infection rate up." ;
    }
  }
  else if (userSelection == "scissors"){
    if (computerSelection == "rock"){
      return "You lost. Infection rate up.";
    }
    else {
      return "You win! Infection rate down.";
    }
	}
}
