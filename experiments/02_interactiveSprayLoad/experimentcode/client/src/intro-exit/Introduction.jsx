// import React from "react";
// import { Button } from "../components/Button";

// export function Introduction({ next }) {
//   return (
//     <div className="mt-3 sm:mt-5 p-20">
//       <h3 className="text-xl leading-6 font-bold text-gray-900">
//         Instructions
//       </h3>
//       <div className="mt-2 mb-6">
//         <p>
//         You will be paired with another participant for all three parts of this game. 
//         </p>
//         <br></br>
//         <h4 className="text-lg leading-6 font-medium text-gray-900">
//           Stage One:
//         </h4>
//         <ul className = 'list-disc list-inside'>
//           <li> <strong>Memorize</strong> the names of some objects. </li>
//         </ul>
//         <br></br>
//         <h4 className="text-lg leading-6 font-medium text-gray-900">
//           Stage Two:
//         </h4>
//         <ul className = 'list-disc list-inside'>
//           <li> <strong> Test </strong> your memory of the names you just learned. </li>
//         </ul>
//         <br></br>
//         <h4 className="text-lg leading-6 font-medium text-gray-900">
//           Stage Three:
//         </h4>
//         <ul className = 'list-disc list-inside'>
//           <li> <strong> Communicate </strong> with your partner about some images, using the names you just learned. </li>
//         </ul>
//         <br></br> For each round, <strong> you and your partner must both complete the round before moving to the next one together</strong> (even for tasks where you are not directly interacting).
//       </div>
//       <Button handleClick={next} autoFocus>
//         <p>Next</p>
//       </Button>
//     </div>
//   );
// }
import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-xl leading-6 font-bold text-gray-900">
        Welcome!
      </h3>
      <div className="mt-2 mb-6">
        <p>
        You will be paired with another participant for this game, and speak to them in an audio chat room. First, we need to test your mic.  
        </p>
        {/* <br></br>
        <h4 className="text-lg leading-6 font-medium text-gray-900">
          Stage One:
        </h4>
        <ul className = 'list-disc list-inside'>
          <li> <strong>Memorize</strong> the names of some objects. </li>
        </ul>
        <br></br>
        <h4 className="text-lg leading-6 font-medium text-gray-900">
          Stage Two:
        </h4>
        <ul className = 'list-disc list-inside'>
          <li> <strong> Test </strong> your memory of the names you just learned. </li>
        </ul>
        <br></br>
        <h4 className="text-lg leading-6 font-medium text-gray-900">
          Stage Three:
        </h4>
        <ul className = 'list-disc list-inside'>
          <li> <strong> Communicate </strong> with your partner about some images, using the names you just learned. </li>
        </ul>
        <br></br> For each round, <strong> you and your partner must both complete the round before moving to the next one together</strong> (even for tasks where you are not directly interacting). */}
      </div>
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}