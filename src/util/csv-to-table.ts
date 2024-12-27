import Papa from "papaparse";
import { SongTable, User, UserWithSong } from "../types";
import { popRandomItem, randomisedArray } from "./random";

type RawParsedData = string[][];

const USER_COLUMN_INDEX = 4;
const AUTHOR_COLUMN_INDEX = 1;
const SONG_COLUMN_INDEX = 2;
const SONGS_ROW_START_INDEX = 3;
const SONGS_PER_USER = 15;

export async function parseData(file: File): Promise<SongTable> {
  const parsed = await parseCSV(file);
  const users: string[] = [];

  const userSong: SongTable = [];

  for (const row of parsed) {
    const userName = row[USER_COLUMN_INDEX];

    if (!userName) {
      break;
    }

    users.push(userName);
  }

  let globalIndexShift = SONGS_ROW_START_INDEX;
  for (const user of users) {
    const currentUser: User = {
      name: user,
      songs: [],
    }

    for (let i = 0; i < SONGS_PER_USER; i++) {
      const idx = globalIndexShift + i;
      const row = parsed[idx];
      const author = row[AUTHOR_COLUMN_INDEX];
      const song = row[SONG_COLUMN_INDEX];

      if (!author && !song) {
        continue
      }

      currentUser.songs.push({
        singer: author,
        name: song,
      });
    }

    globalIndexShift += SONGS_PER_USER;

    userSong.push(currentUser);
  }

  return userSong;
}

function parseCSV(file: File) {
  return new Promise<RawParsedData>((complete, error) => {
    Papa.parse(file, {
      // complete,
      complete(results) {
        complete(results.data as RawParsedData);
      },
      error,
    })
  });
}

export function shuffleSongs(songTable: SongTable) {
  const cloned = clone(songTable);

  const total: UserWithSong[] = [];

  const totalSongsCount = songTable.reduce((accum, user) => accum + user.songs.length, 0);

  let counter = 0;
  while (cloned.length > 0 && counter < totalSongsCount) {
    const users = randomisedArray(cloned);
    for (const user of users) {
      const song = popRandomItem(user.songs);
      if (!song) {
        const userIdx = cloned.findIndex((u) => user.name === u.name);
        cloned.slice(userIdx, 1);
        continue;
      }
      total.push({
        user: user.name,
        song,
      });
      counter++;
    }

  }

  return total;
}

function clone<T>(item: T): T {
  return JSON.parse(JSON.stringify(item));
}