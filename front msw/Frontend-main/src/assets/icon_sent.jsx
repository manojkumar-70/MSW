import { Box } from "@mui/material";

export default function SentIcon({ ...other }) {
  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="52" fill="#EEF2FF" />
        <circle cx="60" cy="60" r="38" fill="#E0E7FF" />
        <path
          d="M90 34L28 57.5L51.5 67.5L78 44L59 71L69 91L90 34Z"
          fill="#4F46E5"
          stroke="#312E81"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M51.5 67.5L59 71L54 84L51.5 67.5Z"
          fill="#0EA5E9"
        />
      </svg>
    </Box>
  );
}
