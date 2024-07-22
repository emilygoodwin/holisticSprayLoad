import React from "react";
import { AudioRoom } from "../components/AudioRoom";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Choice({inAudioRoom, setInAudioRoom}) {
  const player = usePlayer();
  console.log(inAudioRoom, setInAudioRoom)

  return (
    <div>      
          {!inAudioRoom ? 
          <AudioRoom userName = {player.id} 
          roomCode = {player.get("roomCode")} 
          forceJoin = {false} 
          setInAudioRoom = {setInAudioRoom}
          buttonText = "Re-Connect Audio" />
           : (<h2> Connected to Audio </h2>) }

    </div>
  );
}