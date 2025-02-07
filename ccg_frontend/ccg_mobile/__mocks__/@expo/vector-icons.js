// __mocks__/@expo/vector-icons.js
import React from 'react';

// Mock FontAwesome icon component
export const FontAwesome = ({ name, size, color, style }) => (
    <div data-testid="chevron-icon" style={style}>{name}</div>
);
