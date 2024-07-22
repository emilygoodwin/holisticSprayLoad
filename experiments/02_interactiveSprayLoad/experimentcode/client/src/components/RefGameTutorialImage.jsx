import React from "react";
import { usePlayer, useRound, useStage } from "@empirica/core/player/classic/react";

export function RefGameTutorialImage({
  children,
  tag = "",
  handleClick = null,
}) {
  const player = usePlayer();
  const stage = useStage();
  const round = useRound();
  const flipped = false;

  // because this is the tutorial, the target image is highlighted in GREEN for the director at both stages,  and the guessor at the second stage 
  const highlightImage = 
  (round.get("target") == tag && player.get("role") == "director") || 
  ((round.get("target") == tag && player.get("role") == 'guesser' && stage.get("name") == "tutorial-result") || 
  (round.get("decision") == tag && player.get("role") == 'guesser' && stage.get("name") == "tutorial-choice"))


  const borderWidth = highlightImage ? "5px" : "0px"

  const borderColor = (player.get("role") == "guesser" && player.stage.get("submit")) ? "black" : "green"

  // Images are "clickable" only for the guessor, not director 
  const director_images =  
  <div style = {{width: "400px", border: "solid " + `${borderWidth}` + " " + `${borderColor}`, padding: '2px'}}>
  <img onClick = {handleClick} src={'../../img/finished_stimuli/' + tag + '.jpg'} className = {flipped ? "img-hor" : ""} />
  </div>
  
  const guessor_images =  
  <div style = {{width: "400px", border: "solid " + `${borderWidth}` + " " + `${borderColor}`, padding: '2px'}}>
  <img onClick = {handleClick} src={'../../img/finished_stimuli/' + tag + '.jpg'} className = {flipped ? "img-hor" : ""} style = {{cursor:"pointer"}}/>
  </div>

  if (player.get("role") == "director"){
  return (
    director_images
  );
  }
  else{
    return(guessor_images)
  }
}
