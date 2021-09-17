import * as React from "react";

function SvgTrash(props) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      {...props}
    >
      <path d="M9 3h6V1.25a.25.25 0 00-.25-.25h-5.5a.25.25 0 00-.25.25V3zm11 1H4v18a1 1 0 001 1h14a1 1 0 001-1V4zM10 7.5a.5.5 0 00-1 0v12a.5.5 0 001 0v-12zm5 0a.5.5 0 00-1 0v12a.5.5 0 001 0v-12zM23 3v1h-2v18a2 2 0 01-2 2H5a2 2 0 01-2-2V4H1V3h7V1a1 1 0 011-1h6a1 1 0 011 1v2h7z" stroke="black" stroke-width="1" />
    </svg>
  );
}

export default SvgTrash;
