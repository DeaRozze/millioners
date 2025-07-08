export const ROUTE_NAMES = {
  HOME: 'home',
  GAME: 'game',
  RESULT: 'result',
} as const;

export const ROUTE_PATHS = {
  HOME: '/',
  GAME: '/game',
  RESULT: '/result',
} as const;

export type RoutePaths = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS];
export type RouteNames = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES];
