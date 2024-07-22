import React from "react";
import { usePlayer } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

export function Train() {
  const player = usePlayer();
  const sec = "border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700";

  return (
    <div>
      <table>
        <tr>
          <td style = {{paddingRight: "10px"}}> Memorize the name of this image. </td>
          <td> <Button handleClick={() => player.stage.set("submit", true)}> Continue </Button> </td>
        </tr>
      </table>

    </div>
  );
}