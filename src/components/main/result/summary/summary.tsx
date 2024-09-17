import React from "react";
import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import { Pages, Action, StateType, SearchData, AuthData, HistogramsData } from "../../../definitions";
import * as localStorage from "../../../local_storage";
import * as scanApiHelper from '../../../scan_api_helper'
import * as helper from '../../../helper'
import style from "./summary.module.scss";



export function Summary(): JSX.Element
{
	const dispatch = ReactRedux.useDispatch();
	const navigate = RouterDOM.useNavigate();

	const authData = ReactRedux.useSelector<StateType,AuthData | undefined>(state => state.authData);
	const searchData = ReactRedux.useSelector<StateType,SearchData | undefined>(state => state.searchData!);
	const histogramsData = ReactRedux.useSelector<StateType,HistogramsData[] | undefined>(state => state.histogramsData);

	React.useEffect(() => {
		if(authData!==undefined && searchData!==undefined && histogramsData===undefined)
		{
			scanApiHelper.MakeObjectSearchHistogramsRequest(authData!.accessToken, searchData,
				(res: scanApiHelper.RequestResult) => {
					if(res.response?.status === 200)
					{
						let dataArr: HistogramsData[] = [];
						if(res.data.data.length > 0)
						{
							const totalIdx = (res.data.data[0].histogramType==="totalDocuments" ? 0 : 1);
							for(let i in res.data.data[0].data)
							{
								const data: HistogramsData = {
									date: helper.ExtractLocaleDate(res.data.data[0].data[i].date),
									totalDocuments: res.data.data[totalIdx].data[i].value,
									riskFactors: res.data.data[1-totalIdx].data[i].value
								};
								dataArr.push(data);
							}
						}
						dispatch({type: Action.SetHistogramsData, state: dataArr});
					}
					else if(res.response?.status === 401)
					{
						localStorage.DeleteAuthorizationData();
						dispatch({type: Action.ResetAuth});
						navigate(Pages.Login);
					}
				}
			);
		}
	}, [authData,searchData,histogramsData,dispatch,navigate])


	const options: EmblaOptionsType = { loop: true, slidesToScroll: 1, align: 'start', dragFree: true };
	const [carouselRef, carouselApi] = useEmblaCarousel(options);

	const [arrowsEnabled, EnableArrows] = React.useState<boolean>(false);
	const [loadingMsgVisible, ShowLoadingMsg] = React.useState<boolean>(false);


	const AdjustCarouselCtrl = React.useCallback(() => {

			const GetCSSVarValue = (element: Element, variable: string): number => {
					const value = getComputedStyle(element).getPropertyValue(variable);
					return parseInt(value,10);
				};

			const summaryElem: HTMLElement = document.querySelector("."+style.summary) as HTMLElement;
			const carouselCtrlElem: HTMLElement = document.querySelector("."+style.carouselCtrl) as HTMLElement;
			if(summaryElem && carouselCtrlElem)
			{
				const windowWidth = document.documentElement.clientWidth;
				const carouselCtrlHorzPadding = parseInt(window.getComputedStyle(carouselCtrlElem).paddingLeft);
				const arrowWidth = GetCSSVarValue(summaryElem, "--arrow-width");
				const carouselArrowGap = GetCSSVarValue(summaryElem, "--carousel-arrow-gap");
				const carouselBoardWidth = GetCSSVarValue(summaryElem, "--carousel-board-width");
				const carouselPaddingLeft = GetCSSVarValue(summaryElem, "--carousel-padding-left");
				const carouselPaddingRight = GetCSSVarValue(summaryElem, "--carousel-padding-right");
				const slideWidth = GetCSSVarValue(summaryElem, "--slide-width");
				const slideGap = GetCSSVarValue(summaryElem, "--slide-gap");

				const widthOccupied = 2 * (carouselCtrlHorzPadding + arrowWidth + carouselArrowGap) +
					carouselBoardWidth + carouselPaddingLeft + carouselPaddingRight;
				const slideNumberFit = Math.floor((windowWidth - widthOccupied) / (slideWidth + slideGap));

				const slideNumber = Math.max(1, Math.min((histogramsData===undefined ? 5 : histogramsData.length), slideNumberFit));
				summaryElem.style.setProperty("--slide-number", slideNumber.toString());

				const arrowsEnabledNew: boolean = (histogramsData!==undefined && histogramsData.length > slideNumber);
				if(arrowsEnabledNew !== arrowsEnabled)
					EnableArrows(arrowsEnabledNew);

				const loadingMsgVisibleNew = (histogramsData!==undefined && slideNumber > 1);
				if(loadingMsgVisibleNew !== loadingMsgVisible)
					ShowLoadingMsg(loadingMsgVisibleNew);
			}
		}, [arrowsEnabled,histogramsData,loadingMsgVisible]);
	AdjustCarouselCtrl();

	React.useEffect(() => {
			window.addEventListener("resize", AdjustCarouselCtrl);
			return () => window.removeEventListener("resize", AdjustCarouselCtrl);
		}, [AdjustCarouselCtrl]);


	const GetFoundCasesText = React.useCallback(() => {
			const number = (histogramsData===undefined ? 0 : histogramsData.length);
			const modulo1 = number % 100;
			const modulo2 = number % 10;
			const postfix: string = ((modulo1>=5 && modulo1<=20) || modulo2===0 || (modulo2>=5 && modulo2<=9) ?
				"вариантов" : (modulo2===1 ? "вариант" : "варианта"));
			return `Найдено ${number} ${postfix}`;
		}, [histogramsData]);


	return (
			<section className={style.summary}>
				<h2 className={style.title}>Общая сводка</h2>

				<div className={style.foundCases}>{GetFoundCasesText()}</div>

				<div className={style.carouselCtrl}>
					<button type='button' className={style.leftArrow} disabled={!arrowsEnabled}
						onClick={() => carouselApi?.scrollPrev()}></button>

					<div className={style.wrap}>
						<div className={style.board}>
							<div className={style.period}>Период</div>
							<div className={style.total}>Всего</div>
							<div className={style.risks}>Риски</div>
						</div>

						<div className={style.carousel} ref={carouselRef} aria-disabled={histogramsData===undefined}>
							<div className={style.container}>
								{histogramsData!==undefined && histogramsData.map((o,i) =>
									<div key={i} className={style.slideBase}>
										<div className={style.slide}>
											<div className={style.data}>
												<div className={style.period}>{o.date}</div>
												<div className={style.total}>{o.totalDocuments}</div>
												<div className={style.risks}>{o.riskFactors}</div>
											</div>
											<div className={style.border}></div>
										</div>
									</div>
								)}
								{histogramsData===undefined && (
									<div className={style.loading}>
										<div className={style.progress}></div>
										<div className={style.message} hidden={!loadingMsgVisible}>Загружаем данные</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<button type='button' className={style.rightArrow} disabled={!arrowsEnabled}
						onClick={() => carouselApi?.scrollNext()}></button>
				</div>
			</section>
		);
}

