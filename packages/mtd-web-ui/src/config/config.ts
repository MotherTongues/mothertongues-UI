export interface Language {
  label: string;
  value: string;
}

export type AvailableLanguages = 'en';

export interface Link {
  display: boolean;
  url: string;
}

export interface Meta {
  browseAudio: boolean;
  contributors: string[];
  languages: Language[];
  links: {
    github: Link;
    medium: Link;
    facebook: Link;
    youtube: Link;
  };
  copyright: {
    name: string;
    url: string;
  };
}

export const META: Meta = {
  browseAudio: true,
  contributors: ['Aidan Pine'],
  languages: [{ label: 'en', value: 'en' }],
  copyright: {
    name: 'Mother Tongues',
    url: 'https://mothertongues.org',
  },
  links: {
    github: {
      display: false,
      url: '',
    },
    medium: {
      display: false,
      url: '',
    },
    facebook: {
      display: false,
      url: '',
    },
    youtube: {
      display: false,
      url: '',
    },
  },
};
