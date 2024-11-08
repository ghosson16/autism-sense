import React, { forwardRef } from "react";

const EnterInput = forwardRef(({ onEnter, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        console.log("Enter key pressed"); // Debugging line
        e.preventDefault();
        onEnter(); // Call the onEnter function passed in props
      }
    }}
    className="input-field"
  />
));

export default EnterInput;