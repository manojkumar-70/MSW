import { Box } from "@mui/material";

export default function PageNotFoundIllustration({ ...other }) {
  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 480 320" fill="none">
        <rect x="40" y="36" width="400" height="248" rx="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="240" cy="150" r="88" fill="#EEF2FF" />
        <path d="M126 116v56h38v-56M156 116v84" stroke="#4F46E5" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="240" cy="158" r="34" stroke="#0EA5E9" strokeWidth="10" fill="#FFFFFF" />
        <path d="M226 144l28 28M254 144l-28 28" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" />
        <path d="M314 116v56h38v-56M344 116v84" stroke="#4F46E5" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="160" y="232" width="160" height="12" rx="6" fill="#CBD5E1" />
      </svg>
    </Box>
  );
}
