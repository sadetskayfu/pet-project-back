export type MovieSortedBy = 'averageRating' | 'releaseYear'

export type Cursor = {
    id: number;
    averageRating?: number;
    releaseYear?: number;
};