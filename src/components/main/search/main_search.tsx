import React from "react";
import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import classNames from "classnames";

import style from "./main_search.module.scss";
import {Pages, Action, SearchData} from "../../definitions";
import * as helper from "../../helper";



export function Main(): JSX.Element
{
	const dispatch = ReactRedux.useDispatch();
	const navigate = RouterDOM.useNavigate();


	const [inn, SetInn] = React.useState<string | undefined>(undefined);
	const [innInvalid, SetInnInvalid] = React.useState<boolean>(false);

	enum Tonality { Positive, Negative, Any };
	const [tonality, SetTonality] = React.useState<Tonality>(Tonality.Positive);

	const [docNumber, SetDocNumber] = React.useState<number | undefined>(undefined);
	const [docNumberInvalid, SetDocNumberInvalid] = React.useState<boolean>(false);

	const rangeBeginRef = React.useRef<HTMLInputElement>(null);
	const rangeEndRef = React.useRef<HTMLInputElement>(null);
	const [rangeBegin, SetRangeBegin] = React.useState<Date | undefined>(undefined);
	const [rangeEnd, SetRangeEnd] = React.useState<Date | undefined>(undefined);
	const [searchRangeInvalid, SetSearchRangeInvalid] = React.useState<boolean>(false);

	const [maxFullness, SetMaxFullness] = React.useState<boolean>(false);
	const [inBusinessNews, SetInBusinessNews] = React.useState<boolean>(false);
	const [onlyMainRole, SetOnlyMainRole] = React.useState<boolean>(false);
	const [includeAnnouncement, SetIncludeAnnouncement] = React.useState<boolean>(false);

	const [searchBtnEnabled, EnableSearchBtn] = React.useState<boolean>(false);


	const OnInnChanged = React.useCallback((str: string) => {
			SetInn(str.length > 0 && helper.ContainsDigitsOnly(str) ? str : undefined);
			SetInnInvalid(str.length > 0 && !helper.IsInnValid(str));
		}, []);

	const OnDocNumberChanged = React.useCallback((str: string) => {
			const val: number | undefined = (str.length > 0 && helper.ContainsDigitsOnly(str) ? parseInt(str) : undefined);
			SetDocNumber(val);
			SetDocNumberInvalid(str.length > 0 && (!helper.ContainsDigitsOnly(str) ||
				(val!==undefined && (val<1 || val>1000))));
		}, []);

	React.useEffect(() => {
		if(rangeBeginRef.current && rangeEndRef.current)
		{
			const curDate: Date = new Date(new Date().setHours(23,59,59));
			EnableSearchBtn(
				inn!==undefined && helper.IsInnValid(inn) &&
				docNumber!==undefined && docNumber >= 1 && docNumber <= 1000 &&
				rangeBegin!==undefined && rangeEnd!==undefined && rangeBegin < rangeEnd && rangeEnd <= curDate &&
				rangeBeginRef.current!.validity.valid && rangeEndRef.current!.validity.valid);

			SetSearchRangeInvalid(!rangeBeginRef.current!.validity.valid || !rangeEndRef.current!.validity.valid ||
				(rangeBegin!==undefined && rangeEnd!==undefined && (rangeBegin >= rangeEnd || rangeEnd > curDate)));
		}
	}, [inn, docNumber, rangeBegin,rangeEnd])


	const OnSearchBtnClicked = React.useCallback(() => {
			const TonalityToString = (tonality: Tonality): string => {
					switch(tonality)
					{	case Tonality.Positive: return "positive";
						case Tonality.Negative: return "negative";
						case Tonality.Any: return "any";
					}
				};

			const searchData: SearchData = {
					inn: inn!,
					tonality: TonalityToString(tonality),
					limit: docNumber!,
					range: {
						begin: rangeBegin!.toISOString(),
						end: rangeEnd!.toISOString()
					},
					maxFullness,
					inBusinessNews,
					onlyMainRole,
					includeAnnouncements: !includeAnnouncement
				};
			dispatch({type: Action.SetSearchData, state: searchData});

			navigate(Pages.Result);
		}, [dispatch, navigate, rangeBegin,rangeEnd, inn, maxFullness, onlyMainRole,
			Tonality, tonality, docNumber,inBusinessNews,includeAnnouncement]);


	return (
		<main className={style.main}>
			<section className={style.workArea}>
				<h1 className={style.title}>Найдите необходимые данные в пару кликов.</h1>
				<div className={style.auxText}>Задайте параметры поиска.<br/>Чем больше заполните, тем точнее поиск</div>

				<div className={style.form}>
					<div className={style.leftCol}>

						<div className={classNames(style.inn,innInvalid && style.invalid)}>
							<div className={style.innTitle}>ИНН компании <span className={style.asterix}>*</span></div>
							<div className={style.inputGroup}>
								<input type="text" className={style.innInput} aria-invalid={innInvalid}
									placeholder="10 цифр" onChange={e => OnInnChanged(e.currentTarget.value)}/>
								<div className={style.invalidNote}>Введите корректные данные</div>
							</div>
						</div>

						<div className={style.toneTitle}>Тональность</div>
						<div className={classNames(style.toneSelect,style.dropDownList)}>
							<select onChange={e => SetTonality(e.currentTarget.selectedIndex as Tonality)}>
								<option key={0}>Позитивная</option>
								<option key={1}>Негативная</option>
								<option key={2}>Любая</option>
							</select>
						</div>

						<div className={classNames(style.docNumber,docNumberInvalid && style.invalid)}>
							<div className={style.docNumberTitle}>Количество документов в выдаче <span className={style.asterix}>*</span></div>
							<div className={style.inputGroup}>
								<input type="text" className={style.docNumberInput} aria-invalid={docNumberInvalid}
									placeholder="От 1 до 1000" onChange={e => OnDocNumberChanged(e.currentTarget.value)}/>
								<div className={style.invalidNote}>Введите корректные данные</div>
							</div>
						</div>

						<div className={classNames(style.searchRange,searchRangeInvalid && style.invalid)}>
							<div className={style.searchRangeTitle}>Диапазон поиска <span className={style.asterix}>*</span></div>
							<input type="date" ref={rangeBeginRef} className={style.searchRangeBegin} aria-invalid={searchRangeInvalid}
								min="1900-01-01" placeholder="Дата начала" onChange={e => SetRangeBegin(e.currentTarget.valueAsDate ?? undefined)}/>
							<input type="date" ref={rangeEndRef} className={style.searchRangeEnd} aria-invalid={searchRangeInvalid}
								min="1900-01-01" placeholder="Дата конца" onChange={e => SetRangeEnd(e.currentTarget.valueAsDate ?? undefined)}/>
							<div className={style.invalidNote}>Введите корректные данные</div>
						</div>

					</div>

					<div className={style.rightCol}>
						<div className={style.options}>
							<input type="checkbox" id="cb1" checked={maxFullness} onChange={() => SetMaxFullness(!maxFullness)} /><label htmlFor="cb1">Признак максимальной полноты</label>
							<input type="checkbox" id="cb2" checked={inBusinessNews} onChange={() => SetInBusinessNews(!inBusinessNews)}/><label htmlFor="cb2">Упоминания в бизнес-контексте</label>
							<input type="checkbox" id="cb3" checked={onlyMainRole} onChange={() => SetOnlyMainRole(!onlyMainRole)}/><label htmlFor="cb3">Главная роль в публикации</label>
							<input type="checkbox" id="cb4" disabled/><label htmlFor="cb4">Публикации только с риск-факторами</label>
							<input type="checkbox" id="cb5" disabled/><label htmlFor="cb5">Включать технические новости рынков</label>
							<input type="checkbox" id="cb6" checked={includeAnnouncement} onChange={() => SetIncludeAnnouncement(!includeAnnouncement)}/><label htmlFor="cb6">Включать анонсы и календари</label>
							<input type="checkbox" id="cb7" disabled/><label htmlFor="cb7">Включать сводки новостей</label>
						</div>

						<div className={style.btnBlock}>
							<button type="button" className={style.searchBtn} disabled={!searchBtnEnabled}
								onClick={() => OnSearchBtnClicked()}>Поиск</button>
							<div className={style.note}>* Обязательные к заполнению поля</div>
						</div>
					</div>
				</div>
			</section>

			<div className={style.Images}>
				<div className={style.topImage}></div>
				<div className={style.bottomImage}></div>
			</div>
		</main>
	);
}

