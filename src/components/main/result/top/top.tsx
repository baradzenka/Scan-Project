import * as ReactRedux from 'react-redux';

import { StateType } from "../../../definitions";
import style from "./top.module.scss";



export function Top(): JSX.Element
{
	const showMessage = ReactRedux.useSelector<StateType,boolean>(state => !state.documentsLoaded);

	return (
		<section className={style.top}>
			<div className={style.text}>
				<div className={style.title} hidden={!showMessage}>Ищем. Скоро <br/>будут результаты</div>
				<div className={style.note} hidden={!showMessage}>Поиск может занять некоторое время, <br/>просим сохранять терпение.</div>
			</div>
			<div className={style.image}></div>
		</section>
	);
}

