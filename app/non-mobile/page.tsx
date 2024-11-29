// // pages/non-mobile.tsx
// const NonMobile = () => {
//   return (
//     <div>
//       <h1>Access Restricted</h1>
//       <p>This website is accessible only on mobile devices.</p>
//     </div>
//   );
// };

"use client";

import disableDevtool from "disable-devtool";
// export default NonMobile;
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    disableDevtool();
  });
  return (
    <div>
      <h1 className="flex justify-items-center">Access Restricted</h1>
      <p>This website is accessible only on Iphone Mobile devices.</p>
    </div>
  );
};

export default page;
