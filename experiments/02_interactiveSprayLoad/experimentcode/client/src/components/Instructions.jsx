import React from "react";
import { useRound, usePlayer } from "@empirica/core/player/classic/react";

export function Instructions() {
  const round = useRound();
  const player = usePlayer();


function trainInstructions() {
  return(
  <div className="mt-3 sm:mt-5 p-50">
    <h2><strong>Phase 1: Memorization</strong></h2>
    <ul className="list-disc list-inside">
      <li> In this phase, you will see a series of objects with labels. </li>
      <li> Memorize the label for each object, then click continue. </li>
      <li> You and your partner see each object at the same time, so remember to click coninue: <strong> they cannot move on without you. </strong> </li>
      <li> There are 44 images to see.</li>
      </ul>
      </div>);
} 

function recallInstructions() {
  return(
  <div className="mt-3 sm:mt-5 p-50">
    <h2><strong>Phase 2: Recall</strong></h2>
    <ul className="list-disc list-inside">
      <li> In this phase, you will test your memory of the objects you learned.</li>
      <li> Once you have labelled one image, click submit to move to the next. </li>
      <li> You and your partner see each object at the same time, so remember to click coninue: <strong> they cannot move on without you. </strong> </li>
      <li> Don't worry if you cannot remember the name of some of the objects, or about spelling! </li>
      </ul>
      </div>);
}  

// function tutorialInstructionsDirector() {
//   return(
//   <div className="mt-3 sm:mt-5 p-5">
//     <h2><strong>Tutorial Phase</strong></h2>
//     <ul className="list-disc list-inside">
//       <li> This is Sally. In this part, you will be describing what Sally will do today. </li>
//       <li> You will see a verb and three pictures showing some of the objects you just learned, and you will describe the images to your partner. </li>
//       <li> Please <strong> mention Sally in your sentence, use complete sentences, and remember to use the provided verb. </strong> </li>
//       <li> You will first see two examples. </li>
//       </ul>
//       <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
//       </div>);
// }

// function tutorialInstructionsGuesser() {
//   return(
//   <div className="mt-3 sm:mt-5 p-50">
//     <h2><strong>Tutorial Phase</strong></h2>
//     <ul className="list-disc list-inside">
//       <li> This is Sally. In this part, you will be deciding what Sally will do today.  </li>
//       <li> You will see three pictures, and your partner will tell you which image describes what Sally will do today: Please click on the image showing what Sally will do.</li>
//       <li> You will first see two examples. </li>
//       </ul>
//       <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
//       </div>);
// }  

function tutorialInstructionsDirector() {
  return(
  <div className="mt-3 sm:mt-5 p-5">
    <h2><strong>Tutorial Phase</strong></h2>
    <ul className="list-disc list-inside">
      <li> This is Sally. You will be describing what Sally will do today. </li>
      <li> You will see a verb and three pictures, and you will describe the images to your partner. </li>
      <li> Please <strong> mention Sally in your sentence, use complete sentences, and remember to use the provided verb. </strong> </li>
      <li> You will now see two examples. </li>
      </ul>
      <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
      </div>);
}

function tutorialInstructionsGuesser() {
  return(
  <div className="mt-3 sm:mt-5 p-50">
    <h2><strong>Tutorial Phase</strong></h2>
    <ul className="list-disc list-inside">
      <li> This is Sally. You will be deciding what Sally will do today.  </li>
      <li> You will see three pictures, and your partner will tell you which image describes what Sally will do today: Please click on the image showing what Sally will do.</li>
      <li> You will now see two examples. </li>
      </ul>
      <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
      </div>);
}  


function choiceInstructionsGuesser() {
  return(
  <div className="mt-3 sm:mt-5 p-50">
    <h2><strong>Game Phase</strong></h2>
    <ul className="list-disc list-inside">
      <li> You will now be connected with another participant, who will tell you what to click on. </li>
      <li> Click Continue to join the audio chat and say hello. </li>
      </ul>
      <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
      </div>);
}  

function choiceInstructionsDirector(){
  return(
  <div className="mt-3 sm:mt-5 p-50">
    <h2><strong>Game Phase</strong></h2>
    <ul className="list-disc list-inside">
      <li> You will now be connected with another participant, and describe the images to them. </li>
      <li> Click Continue to join the audio chat and say hello. </li>
      </ul>
      <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
      </div>);
}  

// function choiceInstructionsGuesser() {
//   return(
//   <div className="mt-3 sm:mt-5 p-50">
//     <h2><strong>Phase 3: Choice</strong></h2>
//     <ul className="list-disc list-inside">
//       <li> You will now be connected with another participant, who will tell you what to click on. </li>
//       <li> Click Continue to join the audio chat and say hello. </li>
//       </ul>
//       <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
//       </div>);
// }  

// function choiceInstructionsDirector(){
//   return(
//   <div className="mt-3 sm:mt-5 p-50">
//     <h2><strong>Phase 3: Choice</strong></h2>
//     <ul className="list-disc list-inside">
//       <li> You will now be connected with another participant, and describe the images to them. </li>
//       <li> Click Continue to join the audio chat and say hello. </li>
//       </ul>
//       <img src = "../../img/sally.png" width = "150" className = 'topCenter'/>
//       </div>);
// }  

const roundPhase = round.get("instructions")
const returnme =  roundPhase  == 'tutorial' && player.get("role") == 'director' ? tutorialInstructionsDirector() : 
  roundPhase  == 'tutorial' && player.get("role") == 'guesser' ? tutorialInstructionsGuesser() : 
  roundPhase  == 'choice' && player.get("role") == 'director' ? choiceInstructionsDirector() : 
  roundPhase  == 'choice' && player.get("role") == 'guesser' ? choiceInstructionsGuesser() : 
  roundPhase == "recall" ? recallInstructions() :
  roundPhase == "train" ? trainInstructions() :
console.log(returnme)
// }
  return (
    returnme
  );
}