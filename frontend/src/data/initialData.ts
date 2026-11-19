import type { CourseColor, CourseOption } from '../types/task';

export const COURSE_OPTIONS: CourseOption[] = [
  { code: 'CS 301', name: 'Data Structures & Algorithms', color: 'primary' },
  { code: 'MATH 240', name: 'Linear Algebra', color: 'secondary' },
  { code: 'BIO 115', name: 'Cellular Biology', color: 'tertiary' },
  { code: 'ENG 202', name: 'World Literature', color: 'primary-fixed-dim' },
  { code: 'PHYS 102', name: 'Electromagnetism', color: 'secondary' },
  { code: 'ENG 201', name: 'Modern Literature', color: 'primary-fixed-dim' },
  { code: 'PHIL 110', name: 'Ethics in AI', color: 'tertiary' },
];

export const COURSE_DOT_COLORS: Record<string, CourseColor> = {
  'CS 301': 'primary',
  'MATH 240': 'secondary',
  'MATH 204': 'secondary',
  'BIO 115': 'tertiary',
  'ENG 202': 'primary-fixed-dim',
  'ENG 201': 'primary-fixed-dim',
  'PHYS 102': 'secondary',
  'PHIL 110': 'tertiary',
};
