import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type BADatasShape = [string, [string, string], string];
export type ChainIdShape =
  | 80001
  | 137
  | 1
  | 3
  | 4
  | 5
  | 42
  | 56
  | 97
  | 42161
  | 421611
  | 43114
  | 43113
  | 250
  | 4002
  | 27
  | "Unknown";
export type NetworksNamesShape =
  | "Mumbai"
  | "Polygon Mainnet"
  | "Ethereum Mainnet"
  | "Ropsten Testnet"
  | "Rinkeby Testnet"
  | "Goerli Testnet"
  | "Kovan Testnet"
  | "BSC Mainnet"
  | "BSC Testnet"
  | "Arbitrum One"
  | "Arbitrum Testnet"
  | "Avalanche"
  | "Avalanche Fuji"
  | "Fantom"
  | "Fantom Testnet"
  | "ShibaChain"
  | "Unknown";

/* Jikan API */
export interface JikanApiRes {
  pagination: Pagination;
  data: AnimeJikanDatasShape[];
}

export interface AnimeJikanDatasShape {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  title: string;
  title_english?: string;
  title_japanese?: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes?: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by?: number;
  rank?: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
  broadcast: Broadcast;
  producers: Producer[];
  licensors: Licensor[];
  studios: Studio[];
  genres: Genre[];
  explicit_genres: any[];
  themes: Theme[];
  demographics: Demographic[];
}

export interface AnimeDatasShape {
  name: string;
  image: string;
  score: number;
  type: string;
}

/* Sub Interface */
//#region

interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

interface Images {
  jpg: Jpg;
  webp: Webp;
}

interface Jpg {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface Webp {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface Trailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images: Images2;
}

interface Images2 {
  image_url?: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

interface Aired {
  from?: string;
  to: any;
  prop: Prop;
  string: string;
}

interface Prop {
  from: From;
  to: To;
}

interface From {
  day?: number;
  month?: number;
  year?: number;
}

interface To {
  day: any;
  month: any;
  year: any;
}

interface Broadcast {
  day?: string;
  time?: string;
  timezone?: string;
  string?: string;
}

interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface Licensor {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface Studio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface Theme {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface Demographic {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}
//#endregion
