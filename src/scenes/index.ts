import type React from 'react';
import {BondLength} from './BondLength';
import {Cone} from './Cone';
import {Cosmos} from './Cosmos';
import {Direction} from './Direction';
import {Harmonics} from './Harmonics';
import {Hook} from './Hook';
import {Instrument} from './Instrument';
import {Isotope} from './Isotope';
import {Ladder} from './Ladder';
import {Outro} from './Outro';
import {Oven} from './Oven';
import {Pharma} from './Pharma';
import {Recap} from './Recap';
import {Ring} from './Ring';
import {Roadmap} from './Roadmap';
import {Satellite} from './Satellite';
import {Selection} from './Selection';
import {Sphere} from './Sphere';
import {Spin} from './Spin';
import {Stretch} from './Stretch';
import {Thermal} from './Thermal';
import {Title} from './Title';
import {Water} from './Water';

// Pemetaan id adegan di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  spin: Spin,
  ring: Ring,
  direction: Direction,
  sphere: Sphere,
  harmonics: Harmonics,
  cone: Cone,
  selection: Selection,
  ladder: Ladder,
  thermal: Thermal,
  bondlength: BondLength,
  isotope: Isotope,
  stretch: Stretch,
  instrument: Instrument,
  water: Water,
  oven: Oven,
  satellite: Satellite,
  cosmos: Cosmos,
  pharma: Pharma,
  recap: Recap,
  outro: Outro,
};
