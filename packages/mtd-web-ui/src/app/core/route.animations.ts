import {
  animate,
  query,
  style,
  transition,
  trigger,
  stagger,
  sequence,
  AnimationMetadata,
} from '@angular/animations';
import { routeAnimationType } from './settings.service';

export const ROUTE_ANIMATIONS_ELEMENTS = 'route-animations-elements';

const STEPS_ALL = [
  query(':enter > *', style({ opacity: 0, position: 'fixed' }), {
    optional: true,
  }),
  query(':enter .' + ROUTE_ANIMATIONS_ELEMENTS, style({ opacity: 0 }), {
    optional: true,
  }),
  sequence([
    query(
      ':leave > *',
      [
        style({ transform: 'translateY(0%)', opacity: 1 }),
        animate(
          '0.2s ease-in-out',
          style({ transform: 'translateY(-3%)', opacity: 0 })
        ),
        style({ position: 'fixed' }),
      ],
      { optional: true }
    ),
    query(
      ':enter > *',
      [
        style({
          transform: 'translateY(-3%)',
          opacity: 0,
          overflow: 'hidden',
          position: 'static',
        }),
        animate(
          '0.5s ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ],
      { optional: true }
    ),
  ]),
  query(
    ':enter .' + ROUTE_ANIMATIONS_ELEMENTS,
    stagger(75, [
      style({ transform: 'translateY(10%)', opacity: 0 }),
      animate(
        '0.5s ease-in-out',
        style({ transform: 'translateY(0%)', opacity: 1 })
      ),
    ]),
    { optional: true }
  ),
];
const STEPS_NONE: AnimationMetadata[] = [];
const STEPS_PAGE = [STEPS_ALL[0], STEPS_ALL[2]];
const STEPS_ELEMENTS = [STEPS_ALL[1], STEPS_ALL[3]];

/* FIXME: Should be a better way to do this than with a module variable? */
export const routeAnimations = trigger('routeAnimations', [
  transition(() => routeAnimationType === 'ALL', STEPS_ALL),
  transition(() => routeAnimationType === 'NONE', STEPS_NONE),
  transition(() => routeAnimationType === 'PAGE', STEPS_PAGE),
  transition(() => routeAnimationType === 'ELEMENTS', STEPS_ELEMENTS),
]);
