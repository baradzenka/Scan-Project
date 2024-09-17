import style from "./footer.module.scss";


export function Footer(): JSX.Element
{
	return (
		<footer className={style.footer}>
			<div className={style.logo}></div>
			
			<div className={style.contacts}>
				<div className={style.address}>г. Москва, Цветной б-р, 40</div>
				<div className={style.phone}>+7 495 771 21 11</div>
				<div className={style.email}>info@skan.ru</div>
				<div className={style.copyright}>Copyright. 2022</div>
			</div>
		</footer>
	);
}

