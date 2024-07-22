import React from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export function RecallResult() {
  const player = usePlayer();
  const sec = "border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700";

  return (
    <div>
      <table>
        <tr>
          <td style = {{paddingRight: "10px"}}> Nice job! </td>
        </tr>
      </table>

    </div>
  );
}