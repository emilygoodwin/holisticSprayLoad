import {
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Choice } from "./stages/Choice";
import { Result } from "./stages/Result";
import { JoinRoom } from "./stages/JoinRoom";
import { Train } from "./stages/Train";
import { Recall } from "./stages/Recall";
import { RecallResult } from "./stages/RecallResult";
import { Button } from "./components/Button";
import { ExChoice } from "./stages/ExChoice";
import { ExResult } from "./stages/ExResult";

// import { InstructionsBar } from "./stages/InstructionsBar";

export function Stage({inAudioRoom, setInAudioRoom}) {
  const player = usePlayer();
  const stage = useStage();
  
  if (player.stage.get("submit")) {
    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player.
      </div>
    );
  }

  switch (stage.get("name")) {
    case "joinroom":
      return <JoinRoom inAudioRoom = {inAudioRoom} setInAudioRoom = {setInAudioRoom}/>;
    case "choice":
      return <Choice inAudioRoom = {inAudioRoom} setInAudioRoom = {setInAudioRoom}/>;
    case "result":
      return <Result inAudioRoom = {inAudioRoom} setInAudioRoom = {setInAudioRoom}/>;
    case "train":
      return <Train />;
    case "recall":
      return <Recall />;
    case "recall-result":
      return <RecallResult />
    case "tutorial-choice":
      return <ExChoice />;
    case "tutorial-result":
      return <ExResult />
    case "instructions":
      return <Button handleClick={() => player.stage.set("submit", true)}> Continue </Button>;
    default:
      return <Loading />;
  }
}