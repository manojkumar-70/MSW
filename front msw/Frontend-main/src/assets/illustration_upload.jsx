import { Box } from "@mui/material";

export default function UploadIllustration({ ...other }) {
  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 480 320" fill="none">
        <rect x="40" y="36" width="400" height="248" rx="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="240" cy="156" r="88" fill="#EEF2FF" />
        <rect x="164" y="96" width="152" height="128" rx="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="8 6" />
        <path d="M240 190v-56" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round" />
        <path d="M214 158l26-26 26 26" stroke="#0EA5E9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="196" y="202" width="88" height="8" rx="4" fill="#CBD5E1" />
      </svg>
    </Box>
  );
}
