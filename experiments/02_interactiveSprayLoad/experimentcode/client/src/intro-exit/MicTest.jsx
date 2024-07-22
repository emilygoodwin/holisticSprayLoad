import React from "react";
import { AudioTest } from "../components/AudioTest";
import { Button } from "../components/Button";

export function MicTest({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Microphone and Speaker Test
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          Record and play back audio to make sure your mic and speaker are both working. The task relies on a working microphone and speaker.
        </p>
      </div>
      <AudioTest />
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}