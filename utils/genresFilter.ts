export const genresFilter = [50, 28, 9, 49, 26, 35, 12, 64, 65, 69, 73];

export const funcGenresFilter = (animeData: any[]): any[] => {
  return animeData.filter((item) => {
    return !item.genres.some((genre: any) => genresFilter.includes(genre.mal_id));
  });
};
