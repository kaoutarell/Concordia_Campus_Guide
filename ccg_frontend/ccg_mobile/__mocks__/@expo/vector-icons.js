import React from 'react';

// Mock FontAwesome icon component
export const FontAwesome = ({ name, size, color, style }) => (
    <div data-testid="chevron-icon" style={style} size={size} color={color} >{name}</div>
);
