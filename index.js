// http://www.omdbapi.com/?i=tt3896198&apikey=fb0beea4  => Api Key fb0beea4

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  // console.log(movie);
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'fb0beea4 ',
      i: movie.imdbID,
    },
  });
  console.log(response.data);

  //render details on html document
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  console.log('left Movie', leftMovie);
  console.log('Right Movie', rightMovie);

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

//run comparison
const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    console.log(leftStat, rightStat);

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

//generate html for movie details
const movieTemplate = (movieDetails) => {
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );

  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
  const awards = movieDetails.Awards.split(' ').reduce((acc, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return acc;
    } else {
      return acc + value;
    }
  }, 0);

  console.log(awards);

  return `
<article class="media">
  <figure class="media-left">
    <p class="image">
      <img src="${movieDetails.Poster}"/>
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movieDetails.Title} </h1>
      <h4>${movieDetails.Genre} 
      ${movieDetails.Type}</h4>
      <h4>${movieDetails.Released}</h4>
      <p>${movieDetails.Runtime}</p>
      <p>${movieDetails.Plot}</p>
    </div>
  </div>
</article>
      <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards </p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
      </article>
`;
};

const autocompleteConfig = {
  //how to show the item on the widget
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src = "${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
  },

  //Change the title in the search field to the title of the clicked movie
  inputValue: (movie) => {
    return movie.Title;
  },

  //Fetch data from the api
  fetchData: async (searchItem) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'fb0beea4 ',
        s: searchItem.trim(),
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

//Left half of the window
createAutoComplete({
  //Get all the key value pairs from autocompleteconfig and add the root property
  ...autocompleteConfig,

  //display movie when the movie is clicked
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },

  //where to render the autocompletion to
  root: document.querySelector('#left-autocomplete'),
});

//Right Half of the window
createAutoComplete({
  //Get all the key value pairs from autocompleteconfig and add the root property
  ...autocompleteConfig,

  //display movie when the movie is clicked
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },

  //where to render the autocompletion to
  root: document.querySelector('#right-autocomplete'),
});
