export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={24}
      fill="none"
      viewBox="0 0 95 83"
    >
      <title>AI SDK Tools</title>
      <path fill="url(#a)" d="m22 .5 16 52L31 83H0L22 .5Z" />
      <path fill="currentColor" d="M62 .5H30l13 41.25L56 83h31L62 .5Z" />
      <defs>
        <linearGradient
          id="a"
          x1={21.5}
          x2={21.5}
          y1={0.5}
          y2={83}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="currentColor" />
        </linearGradient>
      </defs>
    </svg>
  );
}
