import { getCategoryIcon, getCategoryIcons } from '../utils/categoryIcons';

describe('CategoryIcons Utility', () => {
  it('should return the correct icon for a valid category', () => {
    const icon = getCategoryIcon('atm');
    expect(icon).toBeDefined();
  });

  it('should return university icon for an invalid category', () => {
    const fallbackIcon = getCategoryIcon('invalid_category');
    const universityIcon = getCategoryIcon('university');
    expect(fallbackIcon).toEqual(universityIcon);
  });

  it('should return all category icons', () => {
    const icons = getCategoryIcons();
    expect(icons).toBeDefined();
    expect(typeof icons).toBe('object');
    expect(Object.keys(icons).length).toBeGreaterThan(0);
    
    // Check a few specific categories exist
    expect(icons.university).toBeDefined();
    expect(icons.atm).toBeDefined();
    expect(icons.library).toBeDefined();
  });
});