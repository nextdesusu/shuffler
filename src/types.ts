export type Song = {
  name: string;
  singer: string;
}

export type User = {
  name: string;
  songs: Song[];
}

export type SongTable = User[];

export type UserWithSong = {
  user: string,
  song: Song,
}

export type ShuffledSongs = UserWithSong[];