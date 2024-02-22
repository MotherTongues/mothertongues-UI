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
  contributors: `
Abby Graham
Aiden Pine
Alaa Sarji
Albert Parisien
Alexa Little
Anna Belew
Awanigiizhik Bruce
Bamidele Olowo-okere
Breanne Beaubien
Briana Faubert
Caitlin Bergin
Carly Sommerlot
Carmen Leeming
Cassandra Gaudard
Chantelle Jackson
Christi Belcourt
Christopher Cox
Connie Henry
Conor Quinn
Dale McCreery
David Delorme
David Huggins-Daines
Deanna Garand
Delaney Lothian
Dominique Simard
Eddie Santos
Elvis Demontigny
Fineen Davis
Gail Welburn
George Peltier
Grace (Ledoux) Zoldy
Harvey Pelletier
India Schlegel
Itziri Moreno
Iwona Gniadek
Jacob Collard
James Lavallee
Janelle Zazalak
Jarle Kvale
Jennifer Bright
Jessica Charest
Jessica Lagimodiere
Julie Flett
Kade Ferris
Kai Pyle
Kaitlyn Foley
Kayleigh Jeannette
Kellie Hall
Kim Laberinto
Lacie Allary
Laura Forsythe
Laura Grant
Mackenzie Elliot
Marlee Paterson
Melanie Lavallee
Mira Kolodka
Nicole Reel
Patrick Littel
Rebecca Kirkpatrick
Roland Kuhn
Ruth Ireland-Dejarlais
Samantha Cornelius
Samantha Nock
Samantha Schwab
Sandra Houle (The late)
Stephen Demontigny
Talula Schlegel
Teresa Delorme
Terri Martin-Parisien
Terry Ireland
Tiara Opissinow
Vasiliki Vita
Vivian Smith
Wanda Smith
`
    .trim()
    .split('\n'),
  languages: [{ label: 'en', value: 'en' }],
  copyright: {
    name: 'Turtle Mountain Community College',
    url: 'https://www.tm.edu'
  },
  links: {
    github: {
      display: false,
      url: ''
    },
    medium: {
      display: false,
      url: ''
    },
    facebook: {
      display: false,
      url: ''
    },
    youtube: {
      display: false,
      url: ''
    }
  }
};
