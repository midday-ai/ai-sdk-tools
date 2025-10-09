const SVGIcon: React.FC<{
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  viewBox?: string;
}> = ({
  size = 20,
  stroke = "currentColor",
  fill = "currentColor",
  strokeWidth = 0.25,
  className,
  children,
  viewBox,
}) => {
  const intrinsicContentDimension = 20;
  const defaultViewBox = `0 0 ${intrinsicContentDimension} ${intrinsicContentDimension}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox || defaultViewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

export const Logo = () => (
  <SVGIcon size={18} viewBox="0 0 28 28">
    <path
      fill="currentColor"
      d="M14.854 2.698a9.148 9.148 0 0 1 0 5.786l-.542 1.623 2.012-1.783a7.378 7.378 0 0 0 2.333-4.04l.57-2.786 1.733.354-.57 2.787a9.149 9.149 0 0 1-2.892 5.01l-1.283 1.137 2.635-.538a7.379 7.379 0 0 0 4.04-2.333l1.888-2.129 1.324 1.174-1.887 2.129a9.148 9.148 0 0 1-5.01 2.892l-1.68.344 2.551.85a7.379 7.379 0 0 0 4.666 0l2.698-.9.56 1.68-2.698.9a9.148 9.148 0 0 1-5.785 0l-1.625-.543 1.784 2.012a7.375 7.375 0 0 0 4.04 2.331l2.787.572-.355 1.733-2.787-.57a9.148 9.148 0 0 1-5.01-2.892l-1.136-1.281.539 2.633a7.376 7.376 0 0 0 2.331 4.04l2.129 1.887L21.04 26.1l-2.129-1.887a9.146 9.146 0 0 1-2.892-5.01l-.343-1.677-.85 2.55a7.379 7.379 0 0 0 0 4.665l.9 2.698-1.68.56-.9-2.698a9.148 9.148 0 0 1 0-5.785l.541-1.627-2.01 1.785a7.38 7.38 0 0 0-2.334 4.04l-.57 2.788-1.733-.357.57-2.785a9.148 9.148 0 0 1 2.892-5.01l1.281-1.138-2.633.54a7.377 7.377 0 0 0-4.04 2.332l-1.887 2.129L1.9 21.04l1.887-2.129a9.146 9.146 0 0 1 5.01-2.892l1.678-.345-2.55-.849a7.379 7.379 0 0 0-4.666 0l-2.698.9-.56-1.68 2.698-.9a9.148 9.148 0 0 1 5.786 0l1.623.542-1.783-2.01a7.377 7.377 0 0 0-4.04-2.334l-2.786-.57.354-1.733 2.787.57a9.148 9.148 0 0 1 5.01 2.892l1.135 1.28-.538-2.632a7.376 7.376 0 0 0-2.331-4.04L5.786 3.223 6.96 1.898 9.09 3.785a9.148 9.148 0 0 1 2.892 5.01l.344 1.68.85-2.551a7.379 7.379 0 0 0 0-4.666l-.9-2.698 1.68-.56.9 2.698ZM14 11.234A2.767 2.767 0 0 0 11.234 14l.015.283a2.766 2.766 0 0 0 5.502 0l.014-.283-.014-.283a2.766 2.766 0 0 0-2.468-2.468L14 11.234Z"
    />
  </SVGIcon>
);
