

export enum Pages {
	Index = "/",
	Login = "/login.html",
	Search = "/search.html",
	Result = "/result.html"
};


export enum Action {
	SetAuthData = "SetAuthData",
	ResetAuth = "ResetAuth",
	SetCompaniesData = "SetCompaniesData",
	SetSearchData = "SetSearchData",
	SetHistogramsData = "SetHistogramsData",
	SetDocumentsID = "SetDocumentsID",
	SetDocumentsLoaded = "SetDocumentsLoaded"
};

export type StateType = {
	authData: AuthData | undefined,
	companiesData: CompaniesData | undefined,
	searchData: SearchData | undefined,
	histogramsData: HistogramsData[] | undefined,
	documentsID: string[] | undefined,
	documentsLoaded: boolean
};

export type AuthData = {
	accessToken: string,
	expire: string
};

export type CompaniesData = {
	usedNumber: number,
	limitNumber: number
};

export type SearchData = {
	inn: string,
	tonality: string,
	limit: number,
	range: {
		begin: string,
		end: string
	},
	maxFullness: boolean,
	inBusinessNews: boolean,
	onlyMainRole: boolean,
	includeAnnouncements: boolean
};

export type HistogramsData = {
	date: string,
	totalDocuments: number,
	riskFactors: number
};

