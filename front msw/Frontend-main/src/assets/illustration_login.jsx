import { Box } from "@mui/material";

export default function LoginIllustration({ ...other }) {
  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 560 420" fill="none">
        {/* Soft background glow */}
        <ellipse cx="280" cy="220" rx="220" ry="155" fill="#F0F9FF" />
        <circle cx="145" cy="115" r="42" fill="#E0F2FE" />
        <circle cx="425" cy="105" r="28" fill="#EEF2FF" />

        {/* Decorative sparkles */}
        <circle cx="120" cy="130" r="3" fill="#38BDF8" />
        <circle cx="230" cy="82" r="4" fill="#6366F1" />
        <circle cx="430" cy="195" r="3.5" fill="#38BDF8" />
        <circle cx="385" cy="88" r="2.5" fill="#818CF8" />

        {/* Ground line */}
        <line x1="65" y1="350" x2="495" y2="350" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" />
        <line x1="95" y1="362" x2="210" y2="362" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
        <line x1="340" y1="362" x2="440" y2="362" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />

        {/* Left Person (Student/Visitor) */}
        {/* Legs */}
        <rect x="115" y="255" width="16" height="90" rx="6" fill="#1E293B" />
        <rect x="137" y="255" width="16" height="90" rx="6" fill="#334155" />
        {/* Shoes */}
        <path d="M113 345h22c2 0 4 2 4 5H111c0-3 1-5 2-5z" fill="#0F172A" />
        <path d="M135 345h22c2 0 4 2 4 5h-28c0-3 1-5 2-5z" fill="#0F172A" />
        {/* Briefcase */}
        <rect x="74" y="242" width="42" height="32" rx="6" fill="#F43F5E" />
        <path d="M87 242v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6" stroke="#E11D48" strokeWidth="3" />
        {/* Torso */}
        <path d="M108 175c0-10 8-18 18-18h18c10 0 18 8 18 18l-4 82h-46l-4-82z" fill="#FBBF24" />
        {/* Arm reaching to desk */}
        <path d="M156 184l44 26" stroke="#FBBF24" strokeWidth="14" strokeLinecap="round" />
        <circle cx="204" cy="212" r="7" fill="#FDBA74" />
        {/* Head */}
        <circle cx="134" cy="136" r="18" fill="#FDBA74" />
        <path d="M116 132c0-12 10-20 22-20 10 0 18 7 18 16 0 4-2 7-4 9-3-6-9-9-16-9-7 0-14 3-20 4z" fill="#312E81" />

        {/* Right Person (Mentor/Host behind desk) */}
        <path d="M276 196c0-12 10-22 22-22h20c12 0 22 10 22 22v28h-64v-28z" fill="#E0E7FF" />
        <circle cx="308" cy="148" r="17" fill="#FDBA74" />
        <path d="M289 148c0-14 9-24 20-24 12 0 20 10 20 24v14c-4-5-10-8-20-8s-16 3-20 8v-14z" fill="#312E81" />

        {/* Modern Desk */}
        <rect x="175" y="222" width="210" height="128" rx="10" fill="#7DD3FC" />
        <path d="M175 295l210-36v81a10 10 0 0 1-10 10H185a10 10 0 0 1-10-10v-45z" fill="#38BDF8" />
        {/* Laptop on desk */}
        <rect x="215" y="206" width="52" height="16" rx="4" fill="#4F46E5" />

        {/* Plant on right */}
        <path d="M396 320h34l-5 30h-24l-5-30z" fill="#FBBF24" />
        <path d="M413 320c-18-18-26-44-16-66 8-18 28-24 38-8 10 16 4 46-22 74z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
        <path d="M413 320V256" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </Box>
  );
}
