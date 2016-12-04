// rock paper scissor game mechanics

var user = undefined;
var outcome = undefined;

function playGame(choice){
  var computer = Math.random();
  user = choice;

  if (computer<0.34 && computer>0){
    computer = "rock";
  }
  else if(computer<=0.67 && computer>=0.34){
    computer = "paper";
  }
  else if(computer>.67){
    computer = "scissors";
  }

  result = compare(user, computer);
  var resultOutput = "<p>You: " + user + " Enemy: " + computer + "<br>" + result + "</p>";
  $("#infoWindow").append(resultOutput);
  $("#infoWindow").animate({scrollTop: $('#infoWindow').prop("scrollHeight")}, 500);

  // document.getElementById("result").innerHTML =
  //   "You: " + user + " Enemy: " + computer + "<br>" + result;
}

function compare(userSelection, computerSelection){
  if (userSelection == computerSelection){
    outcome = 0;
    return "Draw- try again.";
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
