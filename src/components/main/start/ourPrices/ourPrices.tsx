import React from "react";
import * as ReactRedux from 'react-redux';
import classNames from "classnames";

import style from "./ourPrices.module.scss";
import { StateType } from "../../../definitions";



export function OurPrices(): JSX.Element
{
	const auth = ReactRedux.useSelector<StateType,boolean>(state => state.authData!==undefined);

	type CardData = {
		title: string;
		desc: string;
		priceNow: string;
		priceOld: string;
		underPrice: string;
		includes: string[];
		active: boolean;
		headerBackColor: string;
		headerForeColor: string;
		imageClass: string;
	};

	const MakeCard = React.useCallback((data: CardData): JSX.Element => {
			const contentBorderStyle = {
					borderLeft: `2px solid ${data.headerBackColor}`,
					borderBottom: `2px solid ${data.headerBackColor}`,
					borderRight: `2px solid ${data.headerBackColor}`
				};

			return (
				<section className={classNames(style.card, data.active && style.active)}>
					<hgroup className={style.cardHeader} style={{backgroundColor: data.headerBackColor, color: data.headerForeColor}}>
						<div className={style.cardTitle}>{data.title}</div>
						<div className={style.cardDesc}>{data.desc}</div>
						<div className={style[data.imageClass]}></div>
					</hgroup>

					<div className={style.cardContent} style={data.active ? {...contentBorderStyle} : {}}>
						<div className={style.cardCurrent}>Текущий тариф</div>

						<div className={style.cardPrices}>
							<div className={style.cardPriceNow}>{data.priceNow}</div>
							<div className={style.cardPriceOld}>{data.priceOld}</div>
						</div>
						<div className={style.cardUnderPrice}>{data.underPrice}</div>

						<div className={style.cardIncludes}>
							<div className={style.cardIncludesTitle}>В тариф входит:</div>
							{data.includes.map((o,i) => <div key={i} className={style.cardInclude}>{o}</div>)}
						</div>

						<button type="button" className={style.cardBtn}>{data.active ? "Перейти в личный кабинет" : "Подробнее"}</button>
					</div>
				</section>
			);		
		}, []);


	const enum Tariff { None, Beginner, Pro, Business };
	const curTariff: Tariff = (!auth ? Tariff.None : Tariff.Beginner) as Tariff;

	return (
		<section className={style.ourPrices}>
			<h2 className={style.title}>наши тарифы</h2>

			<div className={style.cards}>
				<MakeCard title="Beginner" desc="Для небольшого исследования"
					priceNow="799 ₽" priceOld="1 200 ₽" underPrice="или 150 ₽/мес. при рассрочке на 24 мес."
					includes={["Безлимитная история запросов","Безопасная сделка","Поддержка 24/7"]}
					active={curTariff===Tariff.Beginner} headerBackColor="#FFB64F" headerForeColor="#000" imageClass="cardImg1"/>

				<MakeCard title="Pro" desc="Для HR и фрилансеров"
					priceNow="1 299 ₽" priceOld="2 600 ₽" underPrice="или 279 ₽/мес. при рассрочке на 24 мес."
					includes={["Все пункты тарифа Beginner","Экспорт истории","Рекомендации по приоритетам"]}
					active={curTariff===Tariff.Pro} headerBackColor="#7CE3E1" headerForeColor="#000" imageClass="cardImg2"/>

				<MakeCard title="Business" desc="Для корпоративных клиентов"
					priceNow="2 379 ₽" priceOld="3 700 ₽" underPrice=""
					includes={["Все пункты тарифа Pro","Безлимитное количество запросов","Приоритетная поддержка"]}
					active={curTariff===Tariff.Business} headerBackColor="#000" headerForeColor="#fff" imageClass="cardImg3"/>
			</div>
		</section>
	);
}

