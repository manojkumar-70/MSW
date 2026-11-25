import { Box } from "@mui/material";

export default function SeverErrorIllustration({ ...other }) {
  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 480 320" fill="none">
        <rect x="40" y="36" width="400" height="248" rx="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="240" cy="156" r="92" fill="#FEF2F2" />
        <rect x="150" y="88" width="180" height="44" rx="10" fill="#1E293B" />
        <circle cx="176" cy="110" r="6" fill="#EF4444" />
        <rect x="194" y="106" width="110" height="8" rx="4" fill="#475569" />
        <rect x="150" y="146" width="180" height="44" rx="10" fill="#1E293B" />
        <circle cx="176" cy="168" r="6" fill="#F59E0B" />
        <rect x="194" y="164" width="110" height="8" rx="4" fill="#475569" />
        <path d="M240 204l26 42h-52l26-42z" fill="#EF4444" />
        <path d="M240 218v12" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="240" cy="238" r="2.2" fill="#FFFFFF" />
      </svg>
    </Box>
  );
}
