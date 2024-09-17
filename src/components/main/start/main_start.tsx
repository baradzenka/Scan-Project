import { Intro } from "./intro/intro";
import { WhyUs } from "./whyUs/whyUs";
import { OurPrices } from "./ourPrices/ourPrices";


export function Main(): JSX.Element
{
	return (
			<main>
				<Intro/>
				<WhyUs/>
				<OurPrices/>
			</main>
		);
}

