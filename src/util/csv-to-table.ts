import Papa from "papaparse";
import { SongTable, User, UserWithSong } from "../types";
import { popRandomItem, randomisedArray } from "./random";

type RawParsedData = string[][];

const USER_COLUMN_INDEX = 4;
const AUTHOR_COLUMN_INDEX = 1;
const SONG_COLUMN_INDEX = 2;
const SONGS_ROW_START_INDEX = 3;
const SONG_PER_USER_COUNT = {
  column: 5,
  row: 1,
  default: 15,
}

function getSongsPerUser(data: RawParsedData) {
  try {
    const n = parseInt(data[SONG_PER_USER_COUNT.row][SONG_PER_USER_COUNT.column], 10);
    if (typeof n !== 'number' || Number.isNaN(n) || n <= 0) {
      return SONG_PER_USER_COUNT.default;
    }
    return n;
  } catch {
    return SONG_PER_USER_COUNT.default;
  }
}

export async function parseData(file: File): Promise<SongTable> {
  const parsed = await parseCSV(file);
  const users: string[] = [];
  const songsPerUser = getSongsPerUser(parsed);

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

    for (let i = 0; i < songsPerUser; i++) {
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

    globalIndexShift += songsPerUser;

    if (currentUser.songs.length > 0) {
      userSong.push(currentUser);
    }
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