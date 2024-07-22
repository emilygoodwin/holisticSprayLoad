import React from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Recall() {
  const player = usePlayer();
  const sec = "border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700";

  return (
    <div>
      <table>
        <tbody>
        <tr>
          <td style = {{paddingRight: "10px"}}> Correctly label the image. </td>
        </tr>
        </tbody>
      </table>

    </div>
  );
}