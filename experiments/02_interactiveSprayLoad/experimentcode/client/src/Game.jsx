import { usePlayer, useStage } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { AudioRoom } from "./components/AudioRoom";
import { Options } from "./components/Options";
import { TrainImage } from "./components/TrainImage";
import { RecallImage } from "./components/RecallImage";
import { Instructions } from "./components/Instructions";
import { TutorialOptions } from "./components/OptionsTutorial";
import { useState } from "react";

export function Game({inAudioRoom, setInAudioRoom}) {

  const stage = useStage()
  const player = usePlayer()


  // show images if on selection/result stage
  const options = stage.get("name") == "result" & player.stage.get("submit") ? null :
    stage.get("name") == "joinroom" ? <AudioRoom userName = {player.id} roomCode = {player.get("roomCode")} forceJoin = {false} setInAudioRoom = {setInAudioRoom}/> :
    stage.get("name") == "train" ? <TrainImage /> :
    stage.get("name") == "recall" ? <RecallImage /> :
    stage.get("name") == "instructions" ? <Instructions /> :
    stage.get("name") == "tutorial-choice" ? <TutorialOptions /> :
    stage.get("name") == "tutorial-result" ? <TutorialOptions /> :
    <Options />

  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <Profile inAudioRoom = {inAudioRoom} setInAudioRoom = {setInAudioRoom} />
        <div className="h-full flex items-center justify-center">
          {options}
        </div>
      </div>

    </div>

    
  );
}