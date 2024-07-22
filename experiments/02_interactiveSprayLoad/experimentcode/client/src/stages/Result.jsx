import React from "react";
import { usePlayer, useRound, } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { AudioRoom } from "../components/AudioRoom";

export function Result({inAudioRoom, setInAudioRoom}) {
  const player = usePlayer();
  const round = useRound();

  const rightSelection = (round.get("decision") == round.get("target"));

  const messageSubject = player.get("role") == "guesser" ? "You" : "Your partner";
  const messageContinuation = rightSelection ? " made the right selection!" : " made the wrong selection!"
  const message = messageSubject + messageContinuation

  return (
    <div>
      
      <table>
        <tr>
          <td style = {{paddingRight: "10px"}}> {message}  </td>
          <td> <Button handleClick={() => player.stage.set("submit", true)}> Continue </Button> </td>
          </tr>
          <tr>
          <td> {!inAudioRoom ? 
          <AudioRoom userName = {player.id} 
          roomCode = {player.get("roomCode")} 
          forceJoin = {false} 
          setInAudioRoom = {setInAudioRoom}
          buttonText = "Re-Connect Audio"/>
           : "Connected to Audio"  }</td>
        </tr>
      </table>
      
      

    </div>

  );
}