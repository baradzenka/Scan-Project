import { Top } from "./top/top";
import { Summary } from "./summary/summary";
import { Docs } from "./docs/docs";



export function Main(): JSX.Element
{
	return (
		<main>
			<Top/>
			<Summary/>
			<Docs/>
		</main>
	);
}

