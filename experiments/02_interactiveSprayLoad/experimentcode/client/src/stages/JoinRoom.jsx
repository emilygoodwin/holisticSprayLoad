import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function JoinRoom({inAudioRoom, setInAudioRoom}) {
  const player = usePlayer();


  function handleClick(){
    player.stage.set("submit", true)
    setInAudioRoom(true)
    console.log('handleCLick!')
  }

  

  return (
    <div>

      <table>
        <tr>
          <td style = {{paddingRight: "10px"}}> Click "Join" connect to an audio chat with your partner (connecting may take a moment). Say Hello, then press "Continue". </td>
          <td> {player.stage.get("joinedRoom") ? <Button handleClick = {handleClick}> Continue  </Button>: null} </td>
        </tr>
      </table>          

    </div>
  );
}