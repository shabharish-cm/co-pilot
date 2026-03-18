/** Canonical Todoist section registry. Never hardcode IDs elsewhere. */
export const TODOIST_SECTIONS = {
  features:   { id: '6g8x4JxwH876pgGQ', name: 'Features' },
  csRequests: { id: '6g8x4HVHxpWVfVHQ', name: 'CS Requests' },
  enggAsks:   { id: '6g8x4MgXR2q68fgQ', name: 'Engg asks' },
  effy:       { id: '6g9QcvpjJw2cFmCx', name: 'effy' },
  cm:         { id: '6g9wjjpVgppgxJwQ', name: 'CM' },
} as const;

export type SectionKey = keyof typeof TODOIST_SECTIONS;
export type SectionId = typeof TODOIST_SECTIONS[SectionKey]['id'];
