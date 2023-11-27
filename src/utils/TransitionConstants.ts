export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: '100%' },
  show: { opacity: 1, y: 0, transition: { duration: .8, type: "tween" } },
};

export const FADE_RIGHT_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, x: '100%' },
  show: { opacity: 1, x: 0, transition: { duration: .5, type: 'tween' } },
};