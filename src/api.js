const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";
const BASE_SEARCH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopMovie() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getTv() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getPopTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getInfo(keyword) {
  return fetch(
    `${BASE_SEARCH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_audult=false`
  ).then((response) => response.json());
}
