// To ensure Cypress tests work as expected, add any code/functions that you would like to run on page load inside this function

const BASE_URL = 'https://resource-ghibli-api.onrender.com'
const PEOPLE_URL = `${BASE_URL}/people`
const FILMS_URL = `${BASE_URL}/films`
const films = document.querySelector('#film');
const movieDescription = document.querySelector('#description');
const movieYear = document.querySelector('#release_year');
const userSubmit = document.querySelector('#user_submit');
const resetButton = document.querySelector("#reset-reviews");   
const people = document.querySelector('#show-people');    
const olPeople = document.querySelector('#people-names');  
const ulUserReviews = document.querySelector('#user_review');
const UserReviewInput = document.querySelector('#review');
const movieName = document.querySelector("#movie_name")
let selectedId;

function run() {
    fetchMovies(movies => {
        movieSelection(movies);
        userReviews(movies);
        showPeople();
    });
    resetReviews();
}

setTimeout(run, 2000);

function fetchMovies(callback) {
    fetch(FILMS_URL)
    .then((response) => response.json())
    .then((movies) => {
        console.log(movies)
        movies.forEach((movie) => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.title;
            films.append(option);
        });
    callback(movies);
    })
    .catch((error) => {
        console.error('Error fetching movies:', error);
        alert("An error occured while fetching the data. Please try again later.");
    });
}

function movieSelection(movies) {
    films.addEventListener('change', (event) => {
        event.preventDefault();
        selectedId = event.target.value;
        console.log(`Selected movie id: ${selectedId}`);
        const selectedMovie = movies.find((movie) => movie.id === selectedId);
        
        if (selectedMovie) {
            movieName.textContent = selectedMovie.title
            movieYear.textContent = selectedMovie.release_date;
            console.log('222',movieYear.textContent)
            movieDescription.textContent = selectedMovie.description;
        } else {
            console.error('Error: Selected movie not found');
            alert('Please select a movie first');
        }
    });
}

function userReviews(movies) {
    userSubmit.addEventListener('click', (event) => {
        event.preventDefault();    
        //Error handling       
        if (!selectedId) {
            alert("Please select a movie first");                
        } else if (!UserReviewInput.value) {
            alert("Please enter a review before submitting.")
        } else{
            //Correct user input
            const movie_review = movies.find((movie) => movie.id === selectedId);                       
            if(!movie_review) {
                console.log("movie not found")
                return;
            }
            const liReview = document.createElement('li');                    
            const boldReview = document.createElement('strong');                    
            boldReview.textContent = movie_review.title + ': ';                    
            liReview.textContent = UserReviewInput.value;                    
            liReview.prepend(boldReview); 
            ulUserReviews.append(liReview);    
            UserReviewInput.value = '';
        }
    });
}

function resetReviews() {
    resetButton.addEventListener("click", event => {  
        event.preventDefault();
        ulUserReviews.textContent = '';
    });
}

function showPeople() {
    people.addEventListener('click', (event) => {
            event.preventDefault();
            if (!selectedId) {
                alert("Please select a movie first");
                return;
            }
            fetch(PEOPLE_URL)
            .then((response) => response.json())
            .then((people) => {
                console.log(24, people);
                people.forEach((person) => {
                const liPerson = document.createElement('li');
                liPerson.textContent = person.name;
                olPeople.append(liPerson);
            });
        });         
    });
}
// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now A non-hacky solution is being researched

    