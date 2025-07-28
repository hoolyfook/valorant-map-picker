export interface ValorantMap {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const valorantMaps: ValorantMap[] = [
  {
    id: 'ascent',
    name: 'Ascent',
    image: '/images/ascent.jpg',
    description: 'A Mediterranean-inspired map with two bombsites connected by a middle courtyard.'
  },
  {
    id: 'bind',
    name: 'Bind',
    image: '/images/bind.jpg',
    description: 'A two-site map with teleporters instead of a traditional middle lane.'
  },
  {
    id: 'breeze',
    name: 'Breeze',
    image: '/images/breeze.jpg',
    description: 'A tropical island map with long sightlines and open spaces.'
  },
  {
    id: 'fracture',
    name: 'Fracture',
    image: '/images/fracture.jpg',
    description: 'A unique H-shaped map where attackers can split and pinch defenders.'
  },
  {
    id: 'haven',
    name: 'Haven',
    image: '/images/haven.jpg',
    description: 'The only map with three bombsites, offering multiple strategic options.'
  },
  {
    id: 'icebox',
    name: 'Icebox',
    image: '/images/icebox.jpg',
    description: 'A vertical map set in a frozen tundra with multiple elevation levels.'
  },
  {
    id: 'lotus',
    name: 'Lotus',
    image: '/images/lotus.jpg',
    description: 'A three-site map inspired by ancient Indian architecture.'
  },
  {
    id: 'pearl',
    name: 'Pearl',
    image: '/images/pearl.jpg',
    description: 'An underwater city map with mid control being crucial.'
  },
  {
    id: 'split',
    name: 'Split',
    image: '/images/split.jpg',
    description: 'A two-site map with elevated positions and rope ascenders.'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    image: '/images/sunset.jpg',
    description: 'A Los Angeles-themed map with a vibrant, urban setting.'
  }
];
