// store functions
const createStore = (reducer) => {
	let state;
	let listeners = [];
	const getState = () => state;
	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach((listener) => listener());
	};
	const subscribe = (listener) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter((l) => l !== listener);
		};
	};
	dispatch({}); // dummy dispatch
	return { getState, dispatch, subscribe };
};
const combineReducers = (reducers) => {
	return (state = {}, action) => {
		// Reduce all the keys for reducers
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				// Call the corresponding reducer function for a given key
				nextState[key] = reducers[key](state[key], action);
				return nextState;
			},
			{} // The `reduce` on our keys gradually fills this empty object until it is returned.
		);
	};
};
// action types
const MOVIES = {
	GET_MOVIES: "GET_MOVIES",
	ADD_MOVIE: "ADD_MOVIE",
	ADD_MOVIE_DETAILS: "ADD_MOVIE_MOVIE",
	REMOVE_MOVIE: "REMOVE_MOVIE",
	UPDATE_MOVIE: "UPDATE_MOVIE",
	WATCHED: "WATCHED_MOVIE",
	RATE_MOVIE: "RATE_MOVIE",
};
const USERS = {
	ADD_USER: "ADD_USER",
	FETCH_USERS: "FETCH_USERS",
	LOGIN_USER: "LOGIN_USER",
	LOGOUT_USER: "LOGOUT_USER",
	GET_LOGIN_USERS: "GET_LOGIN_USERS",
};
const USER = {
	ADD_MOVIE_TO_WATCHLIST: "ADD_MOVIE_TO_WATCHLIST",
	REMOVE_MVOIE_FROM_WATCHLIST: "REMOVE_MVOIE_FROM_WATCHLIST",
	GET_USERS_MOVIES_WATCHLIST: "GET_USERS_MOVIES_WATCHLIST",
	GET_USER_WATCHLIST: "GET_USER_WATCHLIST",
	ADD_MOVIE_TO_FAV: "ADD_MOVIE_TO_FAV",
	GET_USER_FAV_MOVIES: "GET_USER_FAV_MOVIES",
	START_WATCH: "START_WATCH",
	STOP_WATCH: "STOP_WATCH",
};

// id
let lastMovieId = 0;
let userId = 0;
// reducer function for movies
const movies = (state = [], action) => {
	switch (action.type) {
		case MOVIES.GET_MOVIES:
			return [...state];
		case MOVIES.ADD_MOVIE:
			return [
				...state,
				{
					...action.payload,
				},
			];
		case MOVIES.REMOVE_MOVIE:
			return state.filter((movie) => movie.movieId !== action.payload.movieId);

		case MOVIES.UPDATE_MOVIE:
			const index = state.findIndex(
				(movie) => movie.movieId == action.payload.movieId
			);
			return [
				...state.slice(0, index),
				{
					...state[index],
					movieName: action.payload.movieName,
				},
				...state.slice(index + 1),
			];
		case MOVIES.ADD_MOVIE_DETAILS:
			let index1 = state.findIndex(
				(movie) => movie.movieId == action.payload.movieId
			);
			return [
				...state.slice(0, index1), // everything before current post
				{
					...state[index1],
					details: action.payload.details,
				},
				...state.slice(index1 + 1), // everything after current post
			];
		case MOVIES.RATE_MOVIE:
			return state.map((movie) => {
				if (movie.movieName === action.payload.movieName) {
					if (movie.rating.length > 0) {
						const userExist = movie.rating.find(
							(rate) => rate.userName === action.payload.userName
						);
						if (userExist.userName === action.payload.userName) {
							movie.rating.filter(
								(user) => user.userName != action.payload.userName
							);
						}
					}
					movie.rating = [
						...movie.rating,
						{
							userName: action.payload.userName,
							rating: action.payload.rating,
						},
					];
				}
				return movie;
			});
		default:
			return state;
	}
};
// reducer function for user
const addUsers = (state = [], action) => {
	switch (action.type) {
		case USERS.ADD_USER:
			return [
				...state,
				{
					userId: action.payload.userId,
					userName: action.payload.userName,
					userEmail: action.payload.userEmail,
					isLogin: false,
					watchingNow: [],
				},
			];
		case USERS.FETCH_USERS:
			return [...state];
		default:
			return state;
	}
};
const usersAuthorization = (state = [], action) => {
	switch (action.type) {
		case USERS.LOGIN_USER:
			return [
				...state,
				{
					...state.payload,
					...action.payload,
				},
			];
		case USERS.LOGOUT_USER:
			return state.filter((movie) => movie.userId !== action.payload.userId);
		case USERS.FETCH_USERS:
			return [...state];
		default:
			return state;
	}
};
const userWatchList = (state = [], action) => {
	switch (action.type) {
		case USER.GET_USERS_MOVIES_WATCHLIST:
			return [...state];
		case USER.ADD_MOVIE_TO_WATCHLIST:
			return [
				...state,
				{
					...action.payload,
				},
			];
		case USER.START_WATCH:
			return state.map((user) => {
				if (user.userName === action.payload.userName) {
					console.log(user);
					user.watchingNow = [
						...user.watchingNow,
						{
							movieName: action.payload.movieName,
							isPlaying: true,
							lastedTime: 0,
							timeDuratuin: [{ play: Date.now() }],
						},
					];
				}
				return user;
			});
		case USER.STOP_WATCH:
			return state.map((user) => {
				if (user.userName === action.payload.userName) {
					console.log(user);
					user.watchingNow.map((movie) => {
						if (movie.movieName === action.payload.movieName) {
							movie.isPlaying = false;
							movie.timeDuratuin[
								movie.timeDuratuin.length - 1
							].pause = Date.now();
							movie.lastedTime =
								movie.movieTime -
								(action.payload.pause - action.payload.play) / 60000;
						}
					});
				}
				return user;
			});
		case USER.REMOVE_MVOIE_FROM_WATCHLIST:
			const index = state.findIndex(
				(movie) => movie.movieId == action.payload.movieId
			);
			return state.slice(0, index).concat(state.slice(index + 1));
	}
};
const userFavList = (state = [], action) => {
	switch (action.type) {
		case USER.ADD_MOVIE_TO_FAV:
			return [
				...state,
				{
					...action.payload,
				},
			];
		case USER.GET_USER_FAV_MOVIES:
			let users = [];
			state.map((movie) => {
				if (movie.movieId == action.payload) users.push(movie.userId);
			});
			return users;
		default:
			return state;
	}
};
const lastAction = (state = null, action) => {
	return action;
};
// action creators
const rateMovieCreator = (movieName, userName, rating) => ({
	type: MOVIES.RATE_MOVIE,
	payload: { movieName, userName, rating },
});

const pauseMovieCreator = (username, movieName, play, pause) => ({
	type: actionTypes.PAUSE_MOVIE,
	payload: { username, movieName, play, pause },
});
// building my store
const netlflex = combineReducers({
	movies,
	addUsers,
	usersAuthorization,
	userWatchList,
	userFavList,
	lastAction,
});
const store = createStore(netlflex);
// functions for actions
const addMovie = (movieName, releaseYear, director, genres, time) => {
	store.dispatch({
		type: MOVIES.ADD_MOVIE,
		payload: {
			movieId: ++lastMovieId,
			movieName,
			releaseYear,
			director,
			genres,
			time,
			rating: [],
		},
	});
};
const rateMovie = (movieName, userName, rating) => {
	user = store
		.getState()
		.usersAuthorization.find((user) => user.userId === userId);
	if (user.isLogin) {
		store.dispatch(rateMovieCreator(movieName, userName, rating));
	} else {
		console.log("PLEASE LOGIN FIRST!");
	}
};
const addMovieToUserWatchList = (movieId, userId) => {
	user = store
		.getState()
		.usersAuthorization.find((user) => user.userId === userId);
	if (user.userId === userId) {
		return store.dispatch({
			type: USER.ADD_MOVIE_TO_WATCHLIST,
			payload: {
				movieId,
				userId,
				rating: [],
				watchingNow: [],
			},
		});
	} else {
		return "PLEASE LOGIN FIRST!";
	}
};
const addMovieToUserFavList = (movieId, userId) => {
	user = store
		.getState()
		.usersAuthorization.find((user) => user.userId === userId);
	if (user.userId === userId) {
		return store.dispatch({
			type: USER.ADD_MOVIE_TO_FAV,
			payload: {
				movieId,
				userId,
			},
		});
	} else {
		return "PLEASE LOGIN FIRST!";
	}
};
const removeMovie = (movieId) => {
	store.dispatch({
		type: MOVIES.REMOVE_MOVIE,
		payload: {
			movieId,
		},
	});
};
const updateMovie = (movieId, movieName) => {
	store.dispatch({
		type: MOVIES.UPDATE_MOVIE,
		payload: {
			movieId,
			movieName,
		},
	});
};
const addMovieDetails = (movieId, details) => {
	store.dispatch({
		type: MOVIES.ADD_MOVIE_DETAILS,
		payload: {
			movieId,
			details,
		},
	});
};
const addUser = (userName, userEmail) => {
	store.dispatch({
		type: USERS.ADD_USER,
		payload: {
			userId: ++userId,
			userName,
			userEmail,
		},
	});
};
const loginUser = (userId, userName) => {
	store.dispatch({
		type: USERS.LOGIN_USER,
		payload: {
			userId,
			userName,
			watchingNow: [],
			isLogin: true,
		},
	});
};
const logoutUser = (userId) => {
	store.dispatch({
		type: USERS.LOGOUT_USER,
		payload: {
			userId,
		},
	});
};
const getAuthenticatedUsers = () => {
	store.dispatch({ type: USERS.GET_LOGIN_USERS });
	return store.getState().usersAuthorization;
};
const getUsers = () => {
	store.dispatch({
		type: USERS.FETCH_USERS,
	});
	return store.getState().addUsers;
};
const getMovies = () => {
	store.dispatch({
		type: MOVIES.GET_MOVIES,
	});
	return store.getState().movies;
};
const getUserWatchList = (userId) => {
	if (userId == undefined) userId = store.getState().usersAuthorization.userId;
	let userMovies = [];
	store.getState().userWatchList.map((movie) => {
		if (movie.userId == userId)
			userMovies.push({
				movieName: movie.movieName,
				movieId: movie.movieId,
				watchingNow: movie.watchingNow,
				rating: movie.rating,
			});
		console.log(movie);
	});
	return userMovies;
};
const getUserFavList = (userId) => {
	if (userId == undefined) userId = store.getState().usersAuthorization.userId;
	let userMovies = [];
	store.getState().userFavList.map((movie) => {
		if (movie.userId == userId)
			userMovies.push({
				movieId: movie.movieId,
			});
	});
	return userMovies;
};
const startWatchMovie = (userId, movieId) => {
	user = store
		.getState()
		.usersAuthorization.find((user) => user.userId === userId);
	if (user.isLogin) {
		let movieTime;
		let movieName;
		store.getState().movies.map((movie) => {
			if (movie.movieId === movieId) {
				movieTime = movie.time;
				movieName = movie.movieName;
			}
		});
		store.dispatch({
			type: USER.START_WATCH,
			payload: { movieId, movieTime, userId, movieName },
		});
	} else {
		console.log("You are not logged in!");
	}
};
const stopWatchMovie = (movieId, userId) => {
	let user = store
		.getState()
		.userWatchList.find((user) => user.userId === userId);
	if (user) {
		let play, pause;
		user.watchingNow.map((watching) => {
			play = watching.timeDuratuin[watching.timeDuratuin.length - 1].play;
			pause = watching.timeDuratuin[watching.timeDuratuin.length - 1].pause;
			console.log("pause", pause);
		});
		// store.dispatch(pauseMovieCreator(username, movieId, play, pause));
		store.dispatch({
			type: USER.STOP_WATCH,
			payload: { userId, movieId, play, pause },
		});
	} else {
		console.log("You are not logged in!");
	}
};

const render = () => {
	var lastAction = store.getState().lastAction;
	switch (lastAction.type) {
		case "ADD_MOVIE":
			let li = document.createElement("li");
			li.id = lastAction.payload.movieId;
			document.getElementById("ul_movies").appendChild(li);
			li.innerHTML = lastAction.payload.movieName;
			break;
		case "REMOVE_MOVIE":
			var elem = document.getElementById(lastAction.payload);
			elem.remove(elem);
			break;
		case "LOGIN_USER":
			document.getElementById("welcome").innerText =
				"Welcome " + lastAction.payload.userName;

			break;
		case "UPDATE_MOVIE":
			document.getElementById(lastAction.payload.movieId).innerText =
				lastAction.payload.movieName;
			break;
		case "ADD_MOVIE_TO_FAV":
			document.getElementById("fav");
			let ele = document.createElement("li");
			ele.id = lastAction.payload.movieId;
			document.getElementById("fav").appendChild(ele);
			const index = store
				.getState()
				.movies.findIndex(
					(movie) => movie.movieId == lastAction.payload.movieId
				);
			ele.innerHTML = store.getState().movies[index].movieName;
			break;

		case "RATE_MOVIE":
			let eleem = document.createElement("li");
			eleem.id = lastAction.payload.movieId;
			document.getElementById("rate").appendChild(eleem);
			const i = store
				.getState()
				.movies.findIndex(
					(movie) => movie.movieId == lastAction.payload.movieId
				);
			eleem.innerHTML =
				"you rate  : " +
				lastAction.payload.rating +
				" by " +
				lastAction.payload.userName;
			break;
		case "ADD_MOVIE_TO_WATCHLIST":
			let el = document.createElement("li");
			el.id = lastAction.payload.movieId;
			document.getElementById("watch").appendChild(el);
			const idx = store
				.getState()
				.movies.findIndex(
					(movie) => movie.movieId == lastAction.payload.movieId
				);
			el.innerHTML = store.getState().movies[idx].movieName;
			break;
	}
};

store.subscribe(() => {
	render();
});
