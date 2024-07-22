import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function ExChoice() {
  const player = usePlayer();
  const sec = "border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700";
  const instructions = player.get("role") == 'director' ? 'Describe the target image.' : 'Click on the target image.'
  const cont = player.get("role") == 'director' ? <Button handleClick={() => player.stage.set("submit", true)}> Continue </Button> : null

  return (
    <div>
      
    <table>
      <tr>
        <td style = {{paddingRight: "10px"}}> You are the <strong>{player.get("role")}</strong>. {instructions} </td>
        <td> <Button handleClick={() => player.stage.set("submit", true)}> Continue </Button> </td>
      </tr>
    </table>
    
  </div>
  );
}