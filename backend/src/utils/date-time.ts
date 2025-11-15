export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const thirtyDaysFromNow = (): Date =>
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const threeMinutesAgo = (): Date => new Date(Date.now() - 3 * 60 * 1000);

export const anHourFromNow = (): Date => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now;
}

export const tenMinutesAgo = (): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 10);
  return now;
}

export const fortyFiveMinutesFromNow = (): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() * 45);
  return now;
};

export const calculateExpirationDate = (seconds: string): Date => {
  const sec = +seconds;
  return new Date(Date.now() + sec);
};
