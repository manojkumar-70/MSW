import { Box } from "@mui/material";

export default function ComingSoonIllustration({ ...other }) {
  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 480 320" fill="none">
        <rect x="40" y="36" width="400" height="248" rx="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="240" cy="156" r="88" fill="#EEF2FF" />
        <circle cx="240" cy="156" r="58" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="6" />
        <path d="M240 120v38l26 16" stroke="#0EA5E9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="240" cy="158" r="6" fill="#4F46E5" />
        <circle cx="144" cy="100" r="10" fill="#A5B4FC" />
        <circle cx="342" cy="212" r="14" fill="#7DD3FC" />
      </svg>
    </Box>
  );
}
