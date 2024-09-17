import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';

import style from "./intro.module.scss";
import { StateType, Pages } from "../../../definitions";



export function Intro(): JSX.Element
{
	const auth = ReactRedux.useSelector<StateType,boolean>(state => state.authData!==undefined);

	const navigate = RouterDOM.useNavigate();

	return (
		<section className={style.intro}>
			<div className={style.content}>
				<div className={style.wrap}>
					<h1 className={style.title}>сервис по поиску<br/>публикаций<br/>о компании<br/>по его ИНН</h1>
					<div className={style.desc}>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</div>
					<button type="button" className={style.dataReqBtn} hidden={!auth}
						onClick={() => navigate(Pages.Search)}>Запросить данные</button>
				</div>
			</div>
			<div className={style.image}></div>
		</section>
	);
}

