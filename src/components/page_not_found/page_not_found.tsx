import style from "./page_not_found.module.scss";


export function PageNotFound(): JSX.Element
{
	return (
		<main className={style.main}>
			<h1>Sorry, the page not found</h1>
			<p>The link you followed probably broken or the page has been removed.</p>
		</main>
	);
}

