import React from "react";
import { usePlayer, useRound, useStage } from "@empirica/core/player/classic/react";
import { Button } from '../components/Button'
import { useState } from "react";

export function RecallImage() {
  const round = useRound();
  const player = usePlayer();
  const [formData, setFormData] = useState({userGuess: ""});
  const [errors, setErrors] = useState({});
  
  
  const handleValidation = () => {
    const formFields = {...formData};
    const formErrors = {};
    let formIsValid = true;

    // Validate participant guesses for the name of the object
    let isGoodString = /^[a-zA-Z]+$/.test(formFields["userGuess"])
    let isEmptyGuess = !formFields["userGuess"]
    console.log(isGoodString)
    if(isEmptyGuess || !isGoodString){
      formIsValid = false;
      formErrors["userGuess"] = "Cannot be empty";
    }

    setErrors(formErrors)
    return formIsValid;
  }
  const handleCheckAnswer = (event) => {
    console.log('hello')
    // event.preventDefault();
    if(!handleValidation()){
      alert("Please enter a name for this object.")
    }else{
      player.stage.set("checkAnswer", true)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    player.round.set("decision", value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    player.stage.set("checkAnswer", true);  
};

  function nounFeedback(userResponse, correctResponse, nounType) {
    const recallCorrectly =
      <div> 
      <table> 
        <tbody>
        <tr>
          <td>
            Great! We called this {nounType == 'count' ? 'a' : '' }<strong> {userResponse}</strong>.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    const recalledIncorrectly =
      <div> 
      <table> 
        <tbody>
        <tr>
          <td>
            Oops! We called this {nounType == 'count' ? 'a' : '' }<strong> {correctResponse}</strong>; you said <strong> {userResponse}</strong>.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    if (userResponse == correctResponse){
      return(recallCorrectly)      
    }else{
      return(recalledIncorrectly)
    }
    
};


  return (
    <form onSubmit={handleSubmit}>
      <img src={'../../img/nouns/' + round.get('label') + '.png'} width="300"/>
      <label htmlFor="userGuess"></label>
      {player.stage.get("checkAnswer") ? null : <input type="text" id="userGuess" name="userGuess" value={formData.userGuess} onChange={handleChange}/>} 
      {player.stage.get("checkAnswer") ? null : <Button handleClick={handleCheckAnswer}> Check Answer </Button>} 
      
      {player.stage.get("checkAnswer") ? nounFeedback(formData.userGuess, round.get('label'), round.get('nounType')) : null}
      {/* Make players click "next" to acknowledge they have read the feedback; then take the button away after they've clicked it */}
      {player.stage.get("checkAnswer") ? 
        player.stage.get("submit")? `Please wait for your partner to check their answer.` : <Button handleClick={() => player.stage.set("submit", true)}> Next </Button> 
      : null
    } 
    </form>
  );
}
    