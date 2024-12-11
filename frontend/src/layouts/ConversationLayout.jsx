// components/layouts/ConversationLayout.jsx
import React from "react";

function ConversationLayout({ children }) {
  return (

      <div className=" mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {children}
        </div>
      </div>

  )

}

export default ConversationLayout;
