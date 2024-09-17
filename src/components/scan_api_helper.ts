
import { SearchData } from "./definitions";



export type RequestResult = {
	response: Response | undefined,
	data: any,
	error: any
};

function MakeRequest(url: string, method: string,
	accessToken: string | undefined, body: object | undefined,
	handleError: boolean, response: (res: RequestResult) => void) : void
{
	const request = async () => {
		const fullUrl = "https://gateway.scan-interfax.ru" + url;
		let options: any = {
				method: method,
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			};
		if(accessToken)
			options.headers["Authorization"] = `Bearer ${accessToken}`;
		if(body)
			options["body"] = JSON.stringify(body);
		const response: Response = await fetch(fullUrl,options);
		const data: object = await response.json();
		return {response, data, error: undefined};
	};
	request()
		.then(data => response(data))
		.catch(err => {
				if(!handleError)   // обработка ошибки не разрешена -> возвращаем данные об ошибке.
					response({response: undefined, data: undefined, error: err});
				else   // обработка ошибки разрешена -> выводим сообщение об ошибке.
					alert("Произошла ошибка во время запроса" + (err.message ? `: '${err.message}'` : ""));
			});
}


export function MakeAccountLoginRequest(login: string, password: string,
	response: (res: RequestResult) => void) : void
{
	MakeRequest("/api/v1/account/login", "POST", undefined, {login, password}, true/*handleError*/,
		(res: RequestResult) => {
			if(res.response?.status === 200)
			{
				if(!Object.hasOwn(res.data,"accessToken") ||
					!Object.hasOwn(res.data,"expire"))
				{
					alert("Получены некорректные данные во время запроса");
				}
				else
					response(res);
			}
			else if(res.response?.status === 401)   // ошибка авторизации.
				response(res);
			else
				alert(`Произошла ошибка во время запроса: \n  status: ${res.response?.status}` +
					(res.response ? `\n  statusText: '${res.response!.statusText}'` : ""));
		});
}


export function MakeAccountInfoRequest(accessToken: string,
	response: (res: RequestResult) => void) : void
{
	MakeRequest("/api/v1/account/info", "GET", accessToken, /*body*/undefined, true/*handleError*/,
		(res: RequestResult) => {
			if(res.response?.status === 200)
			{
				if(!Object.hasOwn(res.data,"eventFiltersInfo") ||
					!Object.hasOwn(res.data.eventFiltersInfo,"usedCompanyCount") ||
					!Object.hasOwn(res.data.eventFiltersInfo,"companyLimit"))
				{
					alert("Получены некорректные данные во время запроса");
				}
				else
					response(res);
			}
			else if(res.response?.status === 401)   // ошибка авторизации.
				response(res);
			else
				alert(`Произошла ошибка во время запроса: \n  status: ${res.response?.status}` +
					(res.response ? `\n  statusText: '${res.response!.statusText}'` : ""));
		});
}


function MakeObjectSearchRequestBody(searchData: SearchData): object
{
	return {
		"intervalType": "month",
		"histogramTypes": ["totalDocuments", "riskFactors"],
		"issueDateInterval": {
			"startDate": searchData.range.begin,   // <=
			"endDate": searchData.range.end   // <=
		},
		"searchContext": {
			"targetSearchEntitiesContext": {
				"targetSearchEntities": [
					{
						"type": "company",
						"sparkId": null,
						"entityId": null,
						"inn": searchData.inn,   // <=
						"maxFullness": searchData.maxFullness,   // <=
						"inBusinessNews": searchData.inBusinessNews   // <=
					}
				],
				"onlyMainRole": searchData.onlyMainRole,   // <=
				"tonality": searchData.tonality,   // <=
				"onlyWithRiskFactors": false,
				"riskFactors": {"and": [], "or": [], "not": []},
				"themes": {"and": [], "or": [], "not": []}
			},
			"themesFilter": {"and": [], "or": [], "not": []}
		},
		"similarMode": "none",
		"limit": searchData.limit,   // <=
		"sortType": "issueDate",
		"sortDirectionType": "asc",
		"attributeFilters": {
			"excludeTechNews": true,
			"excludeAnnouncements": !searchData.includeAnnouncements,   // <=
			"excludeDigests": true
		},
		"searchArea": {
			"includedSources": [],
			"excludedSources": [],
			"includedSourceGroups": [],
			"excludedSourceGroups": []
		}
	};
}

export function MakeObjectSearchHistogramsRequest(accessToken: string, searchData: SearchData,
	response: (res: RequestResult) => void) : void
{
	const body: object = MakeObjectSearchRequestBody(searchData);

	MakeRequest("/api/v1/objectsearch/histograms", "POST", accessToken, body, true/*handleError*/,
		(res: RequestResult) => {
			if(res.response?.status === 200)
			{
				if(!Object.hasOwn(res.data,"data") ||
					!Array.isArray(res.data.data) || (res.data.data.length!==0 &&
					(res.data.data.length!==2 ||
					!Object.hasOwn(res.data.data[0],"histogramType") ||
					!Object.hasOwn(res.data.data[0],"data") || !Array.isArray(res.data.data[0].data) ||
					!Object.hasOwn(res.data.data[1],"histogramType") ||
					!Object.hasOwn(res.data.data[1],"data") || !Array.isArray(res.data.data[1].data))))
				{
					alert("Получены некорректные данные во время запроса");
				}
				else
					response(res);
			}
			else if(res.response?.status === 401)   // ошибка авторизации.
				response(res);
			else
				alert(`Произошла ошибка во время запроса: \n  status: ${res.response?.status}` +
					(res.response ? `\n  statusText: '${res.response!.statusText}'` : ""));
		});
}

export function MakeObjectSearchRequest(accessToken: string, searchData: SearchData,
	response: (res: RequestResult) => void) : void
{
	const body: object = MakeObjectSearchRequestBody(searchData);

	MakeRequest("/api/v1/objectsearch", "POST", accessToken, body, true/*handleError*/,
		(res: RequestResult) => {
			if(res.response?.status === 200)
			{
				if(!Object.hasOwn(res.data,"items") ||
					!Array.isArray(res.data.items) || 
					(res.data.items.length>0 && !Object.hasOwn(res.data.items[0],"encodedId")))
				{
					alert("Получены некорректные данные во время запроса");
				}
				else
					response(res);
			}
			else if(res.response?.status === 401)   // ошибка авторизации.
				response(res);
			else
				alert(`Произошла ошибка во время запроса: \n  status: ${res.response?.status}` +
					(res.response ? `\n  statusText: '${res.response!.statusText}'` : ""));
		});
}


export function MakeDocumentsRequest(accessToken: string, docsId: string[],
	response: (res: RequestResult) => void) : void
{
	MakeRequest("/api/v1/documents", "POST", accessToken, {"ids": docsId}, true/*handleError*/,
		(res: RequestResult) => {
			if(res.response?.status === 200)
			{
				if(!Array.isArray(res.data) || 
					(res.data.length!==0 && !Object.hasOwn(res.data[0],"ok") && !Object.hasOwn(res.data[0],"fail")))
				{
					alert("Получены некорректные данные во время запроса");
				}
				else
					response(res);
			}
			else if(res.response?.status === 401)   // ошибка авторизации.
				response(res);
			else
				alert(`Произошла ошибка во время запроса: \n  status: ${res.response?.status}` +
					(res.response ? `\n  statusText: '${res.response!.statusText}'` : ""));
		});
}

