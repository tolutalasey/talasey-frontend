export const videoPath = ({ slug }: { slug: string }) => `/videos/${slug}/`;
export const videoStill = ({ youtube }: { youtube: string }) =>
  `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`;
export const videoEmbed = ({ youtube }: { youtube: string }) =>
  `https://www.youtube-nocookie.com/embed/${youtube}?rel=0`;
