
import * as def from './definitions'


const g_localStorageKey: string = "ScanProject.a5e3b9.Authorization";


export function ReadAuthorizationData(): def.AuthData | null
{
	const jsonObj: string | null = localStorage.getItem(g_localStorageKey);
	if(!jsonObj)
		return null;
	const data: any = JSON.parse(jsonObj);
	return (data.accessToken && data.expire ? data : null);
}

export function WriteAuthorizationData(data: def.AuthData): void
{
	const jsonObj: string = JSON.stringify(data);
	localStorage.setItem(g_localStorageKey,jsonObj);
}


export function DeleteAuthorizationData(): void
{
	localStorage.removeItem(g_localStorageKey);
}

