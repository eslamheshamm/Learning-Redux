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
	ADD_MOVIE_TO_WATCHLIST: "MOVIE_TO_WATCHLIST",
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
					name: action.payload.name,
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
					userId: action.payload.userId,
					userName: action.payload.userName,
					isLogin: true,
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
			return [
				...state,
				{
					payload: {
						movieId,
						user,
						userId,
						watchingDetails: [
							{
								WatchedMinuts: 0,
								started: true,
								endTime: timeStarted,
								date: UTC,
							},
						],
					},
				},
			];
		case USER.STOP_WATCH:
			return [...state, console.log(...state)];
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
// building my store
const netlflex = combineReducers({
	movies,
	addUsers,
	usersAuthorization,
	userWatchList,
	userFavList,
});
const store = createStore(netlflex);
// functions for actions
const addMovie = (name, releaseYear, director, genres) => {
	store.dispatch({
		type: MOVIES.ADD_MOVIE,
		payload: {
			movieId: ++lastMovieId,
			name,
			releaseYear,
			director,
			genres,
		},
	});
};
const addMovieToUserWatchList = (movieId, userId) => {
	// let users = store.getState().usersAuthorization;
	// let userData = users;
	// // .filter((user) => user.userId == userId)
	// // .forEach((user) => {
	// // 	console.log(user);
	// // });
	// console.log(userData);
	if (store.getState().usersAuthorization.length > 0) {
		const jsonDate = new Date().toJSON();
		let UTC = new Date(jsonDate).toUTCString();
		user = store.getState().usersAuthorization.filter((user) => {
			return user.userId == userId;
		});
		return store.dispatch({
			type: USER.ADD_MOVIE_TO_WATCHLIST,
			payload: {
				movieId,
				user,
				userId,
				watchingDetails: [
					{
						WatchedMinuts: 0,
						started: false,
						date: UTC,
					},
				],
			},
		});
	} else {
		return "PLEASE LOGIN FIRST!";
	}
};
const addMovieToUserFavList = (movieId, userId) => {
	if (store.getState().usersAuthorization.length > 0) {
		user = store.getState().usersAuthorization.filter((user) => {
			return user.userId == userId;
		});
		return store.dispatch({
			type: USER.ADD_MOVIE_TO_FAV,
			payload: {
				movieId,
				user,
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
const updateMovie = (movieId, name) => {
	store.dispatch({
		type: MOVIES.UPDATE_MOVIE,
		payload: {
			movieId,
			name,
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
				movieId: movie.movieId,
				watchingDetails: movie.watchingDetails,
				user: user,
			});
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
const startWatchMovie = (movieId, userId) => {
	const jsonDate = new Date().toJSON();
	let UTC = new Date(jsonDate).toUTCString();
	//
	let timeStarted = Date.now();
	if (store.getState().usersAuthorization.length > 0) {
		user = store.getState().usersAuthorization.filter((user) => {
			return user.userId == userId;
		});
	}
	store.dispatch({
		type: USER.START_WATCH,
		payload: {
			movieId,
			user,
			userId,
			watchingDetails: [
				{
					WatchedMinuts: 0,
					started: true,
					startedTime: timeStarted,
					date: UTC,
				},
			],
		},
	});
};
const stopWatchMovie = (movieId, userId) => {
	const jsonDate = new Date().toJSON();
	let UTC = new Date(jsonDate).toUTCString();
	//
	if (store.getState().usersAuthorization.length > 0) {
		user = store.getState().usersAuthorization.filter((user) => {
			return user.userId == userId;
		});
	}
	store.dispatch({
		type: USER.START_WATCH,
		payload: {
			movieId,
			user,
			userId,
			watchingDetails: [
				{
					WatchedMinuts: 0,
					started: true,
					endTime: timeStarted,
					date: UTC,
				},
			],
		},
	});
};
// case MOVIES.WATCHED:
// 	return state.map((movie) =>
// 		movie.id !== action.payload.id ? movie : { ...movie, watched: true }
// 	);
