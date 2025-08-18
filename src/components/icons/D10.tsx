import * as React from "react";

const D10Icon: React.FC<React.SVGProps<SVGElement>> = (
  props: React.SVGAttributes<HTMLOrSVGElement>,
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="30.319"
    height="30.325"
    version="1.1"
    viewBox="0 0 8.022 8.023"
  >
    <g
      fill="none"
      fillOpacity="1"
      fillRule="evenodd"
      strokeDasharray="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      paintOrder="stroke fill markers"
      transform="translate(-.274 -.207)"
    >
      <path
        strokeWidth="0.758"
        d="m4.264.586 3.59 3.088.064.822-3.515 3.451-3.75-3.333.064-.972Z"
      ></path>
      <path
        strokeWidth="0.529"
        d="m.653 4.614 1.271-.406 2.447.908 2.212-.93 1.314.31v0"
      ></path>
      <path strokeWidth="0.529" d="M4.215.657 1.925 4.24"></path>
      <path strokeWidth="0.529" d="M4.276.598 6.56 4.144v0"></path>
      <path strokeWidth="0.529" d="m4.393 5.116.02 2.682v0"></path>
    </g>
  </svg>
);

export default D10Icon;
