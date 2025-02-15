export const REDIS_KEYS = {
    RATED_MOVIES: (userId: number) => `ratedMovies:${userId}`,
    WATCHED_MOVIES: (userId: number) => `watchedMovies:${userId}`,
    WISHLIST_MOVIES: (userId: number) => `wishlistMovies:${userId}`,
};