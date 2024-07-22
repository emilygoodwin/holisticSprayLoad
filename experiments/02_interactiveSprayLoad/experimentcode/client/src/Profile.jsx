import {
  usePlayer,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import React from "react";
import { Stage } from "./Stage";


export function Profile({inAudioRoom, setInAudioRoom}) {
  const player = usePlayer();
  const round = useRound();
  const stage = useStage();

  const score = player.get("score") || 0;

  return (
    <div className="min-w-lg md:min-w-2xl mt-2 m-x-auto px-3 py-2 text-gray-500 rounded-md grid grid-cols-3 items-center border-.5">
      <div className="leading-tight ml-1">
        <div className="text-gray-600 font-semibold">
          {round ? round.get("name") + "/" + "82": ""}
        </div>
        {/* <div className="text-empirica-500 font-medium">
          {stage ? stage.get("name") : ""}
        </div> */}
      </div>

      <div> <Stage inAudioRoom = {inAudioRoom} setInAudioRoom = {setInAudioRoom} /> </div>

    </div>
  );
}
