//global variables
const API_KEY = "ece985488c982715535011849742081f";
const imagePath = "https://image.tmdb.org/t/p/w1280";

//DOM elements
const input = document.querySelector(".search input");
const btn = document.querySelector(".search button");
const mainGridTitle = document.querySelector(".favourites h1");
const mainGrid = document.querySelector(".favourites .movies-grid");
const trendingGrid = document.querySelector(".trending .movies-grid");
const popupContainer = document.querySelector(".popup-container");

//this function will get movies by search term
async function getMovieBySearch(search_term) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
  );
  console.log("response received");
  let respData = await response.json(); // return promises
  return respData.results;
}

//add event listener to search button
btn.addEventListener("click", addSearchMoviesToDOM);

//adding search movies to DOM
async function addSearchMoviesToDOM() {
  mainGridTitle.innerText = "Searching Related Movies...";
  const search_term = input.value;
  //api call to get movies by search term
  const data = await getMovieBySearch(search_term);
  mainGridTitle.innerText = "Search Results...";
  let resultArr = data.map((m) => {
    return `
        <div class="card" data-id="${m.id}">
        <div class="img">
          <img src="${imagePath + m.poster_path}" alt="" />
        </div>
        <div class="info">
          <h2>${m.title}</h2>
          <div class="single-info">
            <span>Rating :</span>
            <span>${m.vote_average}</span>
          </div>
          <div class="single-info">
            <span>Release Date :</span>
            <span>${m.release_date}</span>
          </div>
        </div>
      </div>
        `;
  });
  resultArr = resultArr.join(" ");
  mainGrid.innerHTML = resultArr;
  input.value = "";
  const cards = document.querySelectorAll(".card");
  //passing cards to addClickEffectToCards function
  addClickEffectToCards(cards);
}
//finding exact movie by id
async function getMoviesById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const respData = await response.json(); // return promises
  return respData;
}
//finding movie trailer by id
async function getMovieTrailerById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  let respData = await response.json(); // return promises
  return respData.results[0].key;
}

//add click effect to cards
function addClickEffectToCards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", () => showPopUp(card));
  });
}
//this pop-up will show the movie details
async function showPopUp(card) {
  console.log("showPopup function called...");
  popupContainer.classList.add("show-popup");
  const movieId = card.getAttribute("data-id");
  const movie = await getMoviesById(movieId);
  const key = await getMovieTrailerById(movieId);
  popupContainer.style.background = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)),
  url(${imagePath + movie.poster_path})`;
  popupContainer.innerHTML = `<span class="x-icon">&#10006;</span>
  <div class="content">
    <div class="left">
      <div class="poster-img">
        <img src="${imagePath + movie.poster_path}" alt="" />
      </div>
      <div class="single-info">
        <span>Add to Favourites :</span>
        <span class="heart-icon">&#9829;</span>
      </div>
    </div>
    <div class="right">
      <h1>${movie.title}</h1>
      <h3>${movie.tagline}</h3>
      <div class="single-info-container">
        <div class="single-info">
          <span>Languages :</span>
          <span>${movie.spoken_languages[0].name}</span>
        </div>
        <div class="single-info">
          <span>Length :</span>
          <span>${movie.runtime} Minutes</span>
        </div>
        <div class="single-info">
          <span>Rating :</span>
          <span>${movie.vote_average}/10</span>
        </div>
        <div class="single-info">
          <span>Budget :</span>
          <span>${movie.budget}</span>
        </div>
        <div class="single-info">
          <span>Release Date </span>
          <span>${movie.release_date}</span>
        </div>
      </div>
      <div class="genres">
        <h2>Genres</h2>
        <ul>
          ${movie.genres
            .map((g) => {
              return `<li>${g.name}</li>`;
            })
            .join("")}
        </ul>
      </div>
      <div class="overview">
        <h2>Overview</h2>
        <p>
        ${movie.overview}
        </p>
      </div>
      <div class="trailer">
        <h2>Trailer</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${key}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>`;
  const favourites = getFavouritesFromLocalStorage();
  const heart_icon = document.querySelector(".heart-icon");
  console.log(heart_icon);
  // Apply change-color class if the movie is in favourites
  if (favourites.includes(movie.id)) {
    heart_icon.classList.add("change-color");
  }
  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () => {
    popupContainer.classList.remove("show-popup");
  });
  heart_icon.addEventListener("click", () => {
    if (heart_icon.classList.contains("change-color")) {
      heart_icon.classList.remove("change-color");
      removeFavouritesFromLocalStorage(movie.id);
    } else {
      heart_icon.classList.add("change-color");
      setFavouritesToLocalStorage(movie.id);
    }
  });
}

//this function will perform API calling to get trending movies
async function getTrendingMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
  );
  let respData = await response.json(); // return promises
  return respData.results;
}
//this function will add trending movies to DOM while loading
async function addTrendingMoviesToDOM() {
  const data = await getTrendingMovies();
  let resultArr = data.map((m) => {
    return `
    <div class="card" data-id="${m.id}">
    <div class="img">
      <img src="${imagePath + m.poster_path}" alt="" />
    </div>
    <div class="info">
      <h2>${m.title}</h2>
      <div class="single-info">
        <span>Rating :</span>
        <span>${m.vote_average}</span>
      </div>
      <div class="single-info">
        <span>Release Date :</span>
        <span>${m.release_date}</span>
      </div>
    </div>
  </div>
    `;
  });
  trendingGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}
//calling addTrendingMoviesToDOM function to add trending movies to DOM
addTrendingMoviesToDOM();

//set favourite movies to local storage
function setFavouritesToLocalStorage(movieId) {
  let movies;
  if (localStorage.getItem("movies") === null) {
    movies = [];
  } else {
    movies = JSON.parse(localStorage.getItem("movies"));
  }
  movies.push(movieId);
  localStorage.setItem("movies", JSON.stringify(movies));
}

// get favourite movies from local storage
function getFavouritesFromLocalStorage() {
  let movies = JSON.parse(localStorage.getItem("movies"));
  if (movies === null) {
    movies = [];
  }
  return movies;
}

//add favourite movies to DOM
async function addFavouritesMoviesToDOM() {
  const favouriteIds = getFavouritesFromLocalStorage();
  if (favouriteIds.length === 0) {
    mainGrid.innerHTML = "No favourite movies added.";
    return;
  }
  // Fetch all movies by their IDs and wait for all promises to resolve
  let resultArr = await Promise.all(
    favouriteIds.map(async (id) => {
      // Fetch movie data by ID
      const movie = await getMoviesById(id);
      // Return the HTML structure for each movie card
      return `
        <div class="card" data-id="${movie.id}">
          <div class="img">
            <img src="${imagePath + movie.poster_path}" alt="" />
          </div>
          <div class="info">
            <h2>${movie.title}</h2>
            <div class="single-info">
              <span>Rating :</span>
              <span>${movie.vote_average}</span>
            </div>
            <div class="single-info">
              <span>Release Date :</span>
              <span>${movie.release_date}</span>
            </div>
          </div>
        </div>
      `;
    })
  );

  mainGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}
addFavouritesMoviesToDOM();

//remove favourite movies from local storage
function removeFavouritesFromLocalStorage(movieId) {
  let movieIds = JSON.parse(localStorage.getItem("movies"));
  movieIds = movieIds.filter((m) => m != movieId);
  localStorage.setItem("movies", JSON.stringify(movieIds));
}
