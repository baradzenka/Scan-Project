

export function ContainsDigitsOnly(str: string): boolean
{
	return /^\d+$/.test(str);
}


export function IsInnValid(inn: string): boolean
{
	if(inn.length === 0 || inn.length > 10 || !ContainsDigitsOnly(inn))
		return false

	const CheckDigit = (inn: string, factor: number[]): number => {
			let n: number = 0;
			for (let i in factor)
				n += factor[i] * parseInt(inn[i]);
			return n % 11 % 10;
		};

	const sum: number = CheckDigit(inn, [2,4,10,3,5,9,4,6,8]);
	return sum === parseInt(inn[9]);
}


export function ExtractLocaleDate(date: string): string
{
	return new Date(date).toLocaleDateString("ru");
}
