import React from 'react';

/**
 * Zestora Brand Logo with the botanical leaf sprout motif on letter 'O'
 * and the 'Nature's Crunch' subtitle, matching the uploaded brand asset.
 */
export const Logo = ({
  className = 'h-9 sm:h-10 w-auto',
  variant = 'dark',
  showTagline = true,
}) => {
  const fillColor = variant === 'light' ? '#FAF7F2' : '#193826';
  const leafVeinColor = variant === 'light' ? '#193826' : '#FAF7F2';

  return (
    <div className={`inline-flex items-center select-none ${className}`} aria-label="Zestora - Nature's Crunch">
      <svg
        viewBox="0 0 760 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        <g fill={fillColor}>
          {/* Main ZESTORA Wordmark with custom stylized O and leaf sprout */}
          <text
            x="380"
            y="132"
            fontFamily="'Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Georgia', serif"
            fontSize="104"
            fontWeight="700"
            letterSpacing="0.05em"
            textAnchor="middle"
          >
            ZEST<tspan dx="26">RA</tspan>
          </text>

          {/* Botanical 'O' with Sprouting Foliage Motif */}
          <g transform="translate(432, 94)">
            {/* Oval Body of the letter 'O' */}
            <ellipse
              cx="0"
              cy="0"
              rx="34"
              ry="38"
              stroke={fillColor}
              strokeWidth="14"
              fill="none"
            />

            {/* Right primary leaf arching to upper right */}
            <path
              d="M-2 -38 C 2 -64, 25 -86, 33 -94 C 33 -72, 25 -52, 6 -39 Z"
              fill={fillColor}
            />
            {/* Subtle interior leaf vein highlight */}
            <path
              d="M-1 -39 C 9 -58, 20 -72, 29 -86"
              stroke={leafVeinColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Left secondary leaf angling to upper left */}
            <path
              d="M-4 -38 C -13 -56, -30 -66, -35 -70 C -28 -54, -16 -44, -5 -37 Z"
              fill={fillColor}
            />
            {/* Stem anchor */}
            <path
              d="M-2 -32 L -1 -42"
              stroke={fillColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* TM Trademark superscript */}
          <text
            x="644"
            y="64"
            fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
            fontSize="16"
            fontWeight="600"
            letterSpacing="0.02em"
          >
            TM
          </text>

          {/* Subtitle: Nature's Crunch */}
          {showTagline && (
            <text
              x="380"
              y="186"
              fontFamily="'Plus Jakarta Sans', 'Montserrat', sans-serif"
              fontSize="32"
              fontWeight="400"
              letterSpacing="0.22em"
              textAnchor="middle"
            >
              Nature's Crunch
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
