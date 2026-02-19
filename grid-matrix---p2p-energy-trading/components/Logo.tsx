import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
    color?: string;
}

/**
 * Grid Matrix Logo – Stylized bird/phoenix in a shield shape.
 * Recreated as inline SVG from the brand asset.
 */
const Logo: React.FC<LogoProps> = ({ size = 40, className = '', color = 'currentColor' }) => (
    <svg
        viewBox="0 0 200 240"
        width={size}
        height={size * 1.2}
        fill={color}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Shield / pick base shape */}
        <path
            d="M100 235 C100 235 15 160 15 90 C15 40 50 10 100 10 C150 10 185 40 185 90 C185 160 100 235 100 235Z"
            fill={color}
        />
        {/* Inner crescent cutout – creates the bird head illusion */}
        <path
            d="M90 40 C55 45 45 75 55 105 C65 135 95 140 110 125 C80 130 65 105 70 80 C75 55 90 40 90 40Z"
            fill="#EAFFD2"
        />
        {/* Bird eye */}
        <circle cx="115" cy="62" r="8" fill="#EAFFD2" />
        {/* Beak / lightning bolt accent */}
        <path
            d="M130 72 L140 60 L132 58 L142 42 L125 58 L133 60 L125 72Z"
            fill="#EAFFD2"
        />
    </svg>
);

export default Logo;
