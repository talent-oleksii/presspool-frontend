import { FC } from "react";

const SupportIcon: FC<{fontSize?: number}> = ({fontSize = 24}) => (
  <svg
    width={fontSize}
    height={fontSize}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pt-1"
  >
    <g id="beta-feedback">
      <path
        id="Icon"
        d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H14.2C15.8802 1 16.7202 1 17.362 1.32698C17.9265 1.6146 18.3854 2.07354 18.673 2.63803C19 3.27976 19 4.11984 19 5.8V11.2C19 12.8802 19 13.7202 18.673 14.362C18.3854 14.9265 17.9265 15.3854 17.362 15.673C16.7202 16 15.8802 16 14.2 16H7.68375C7.0597 16 6.74767 16 6.44921 16.0613C6.18443 16.1156 5.9282 16.2055 5.68749 16.3285C5.41617 16.4671 5.17252 16.662 4.68521 17.0518L2.29976 18.9602C1.88367 19.2931 1.67563 19.4595 1.50054 19.4597C1.34827 19.4599 1.20422 19.3906 1.10923 19.2716C1 19.1348 1 18.8684 1 18.3355V5.8Z"
        stroke="#000"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector"
        d="M10 8.5V4.5"
        stroke="#000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        id="Ellipse 2"
        cx="10"
        cy="12"
        r="0.75"
        fill="#000"
        stroke="#000"
        stroke-width="1.5"
      />
    </g>
  </svg>
);
export default SupportIcon;
