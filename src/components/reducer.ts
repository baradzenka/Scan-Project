import * as ReduxJS from '@reduxjs/toolkit'

import { StateType, AuthData, Action/*, SearchData*/ } from "./definitions";
import * as localStorage from "./local_storage";



const stateDefault: StateType = (() => {
	const authData: AuthData | null = localStorage.ReadAuthorizationData();
	const authenticated: boolean = (!!authData && new Date(authData.expire) > new Date());
/*
const searchData: SearchData = {
	inn: "7710137066",//"7704028125",
	tonality: "any",
	limit: 100,
	range: {
		begin: "2000-09-02T20:59:59.411Z",
		end: "2024-09-02T20:59:59.411Z"
	},
	maxFullness: true,
	inBusinessNews: true,
	onlyMainRole: true,
	includeAnnouncements: false
};
*/
	return {
			authData: (authenticated ? authData! : undefined),
			companiesData: undefined,
			searchData: undefined /*searchData*/,
			histogramsData: undefined,
			documentsID: undefined,
			documentsLoaded: false
		};
})();

const Reducer = ReduxJS.createReducer(stateDefault, (builder: any) => {
builder
	.addCase(Action.SetAuthData, (statePrev: StateType, action: any) => {
		return { ...statePrev, authData: action.state}; }
	)
	.addCase(Action.ResetAuth, (statePrev: StateType) => {
		return { ...statePrev, authData: undefined}; }
	)
	.addCase(Action.SetCompaniesData, (statePrev: StateType, action: any) => {
		return { ...statePrev, companiesData: action.state}; }
	)
	.addCase(Action.SetSearchData, (statePrev: StateType, action: any) => {
		return { ...statePrev, searchData: action.state, histogramsData: undefined, 
			documentsID: undefined, documentsLoaded: false}; }
	)
	.addCase(Action.SetHistogramsData, (statePrev: StateType, action: any) => {
		return { ...statePrev, histogramsData: action.state}; }
	)
	.addCase(Action.SetDocumentsID, (statePrev: StateType, action: any) => {
		return { ...statePrev, documentsID: action.state}; }
	)
	.addCase(Action.SetDocumentsLoaded, (statePrev: StateType, action: any) => {
		return { ...statePrev, documentsLoaded: action.state}; }
	)
	.addDefaultCase((statePrev: StateType) => 
		statePrev
	)
});

export const store: ReduxJS.EnhancedStore = ReduxJS.configureStore({reducer: Reducer});

