import React, { useEffect } from "react";
import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';

import style from "./header.module.scss";
import { Pages, StateType, Action, AuthData, CompaniesData } from "../definitions";
import * as localStorage from "../local_storage";
import * as scanApiHelper from '../scan_api_helper'



export function Header(): JSX.Element
{
	const dispatch = ReactRedux.useDispatch();
	const navigate = RouterDOM.useNavigate();

	const authData = ReactRedux.useSelector<StateType,AuthData | undefined>(state => state.authData);
	const auth = (authData !== undefined);
	const companiesData = ReactRedux.useSelector<StateType,CompaniesData | undefined>(state => state.companiesData);

	const statisticsLoading: boolean = (auth && companiesData===undefined);

	useEffect(() => {
		if(statisticsLoading)
			scanApiHelper.MakeAccountInfoRequest(authData!.accessToken,
					(res: scanApiHelper.RequestResult) => {
						if(res.response?.status === 200)
						{
							const data: CompaniesData = {
								usedNumber: res.data.eventFiltersInfo.usedCompanyCount,
								limitNumber: res.data.eventFiltersInfo.companyLimit
							};
							dispatch({type: Action.SetCompaniesData, state: data});
						}
						else if(res.response?.status === 401)
						{
							localStorage.DeleteAuthorizationData();
							dispatch({type: Action.ResetAuth});
							navigate(Pages.Login);
						}
					}
				);
	}, [statisticsLoading,authData,dispatch,navigate]);


	const [dropDownMenuVisible, ShowDropDownMenu] = React.useState<boolean>(false);

	const menuRef = React.useRef<HTMLHtmlElement>(null);
	const dropDownMenuRef = React.useRef<HTMLDivElement>(null);


	const OnLogin = React.useCallback(() => {
			ShowDropDownMenu(false);
			navigate(Pages.Login);
		}, [navigate]);

	const OnLogout = React.useCallback(() => {
			localStorage.DeleteAuthorizationData();
			dispatch({type: Action.ResetAuth});
			navigate(Pages.Index, { replace: true });
		}, [dispatch,navigate]);


	React.useEffect(() => {
		if(dropDownMenuVisible)
		{
			const OnDocumentKeyDown = (e : KeyboardEvent): void => {
				e.key==="Escape" && ShowDropDownMenu(false); };
			const OnDocumentMouseDown = (e: MouseEvent): void => {
				if(!dropDownMenuRef.current?.contains(e.target as Node))   // нажатие за приделами выпадающего меню.
					ShowDropDownMenu(false);
			};
			const OnDocumentReset = (): void => {
				if(dropDownMenuVisible && menuRef.current?.offsetParent)
					ShowDropDownMenu(false);   // скрываем меню, если из-за @media оно уже не видно.
			};

			document.addEventListener("keydown", OnDocumentKeyDown);
			document.addEventListener("mousedown", OnDocumentMouseDown);
			window.addEventListener("resize", OnDocumentReset);
			return () => {
					document.removeEventListener("keydown", OnDocumentKeyDown);
					document.removeEventListener("mousedown", OnDocumentMouseDown);
					window.removeEventListener("resize", OnDocumentReset);
				};
		}
	}, [dropDownMenuVisible]);


	const MakeBurgerButton = React.useCallback((): JSX.Element =>
			<button type="button" className={style.burgerBtn}
				onClick={() => ShowDropDownMenu(!dropDownMenuVisible)}>
				<div></div>
				<div></div>
				<div></div>
			</button>
		, [dropDownMenuVisible,]);

	const MakeRightBlockUnAuth = React.useCallback((): JSX.Element => 
			<div className={style.rightBlockUnAuth}>
				<a className={style.signin} aria-disabled href="/#">Зарегистрироваться</a>
				<div className={style.separator}></div>
				<button type="button" className={style.login} onClick={OnLogin}>Войти</button>

				<MakeBurgerButton />
			</div>
		, [MakeBurgerButton,OnLogin]);

	const MakeRightBlockAuth = React.useCallback((): JSX.Element => {
			const MakeStatistics = (): JSX.Element => 
					<div className={style.statistics}>
						<div className={style.companiesUsedTitle}>Использовано компаний</div>
						<div className={style.companiesUsedNumber}>{companiesData!.usedNumber}</div>
						<div className={style.companiesLimitTitle}>Лимит по компаниям</div>
						<div className={style.companiesLimitNumber}>{companiesData!.limitNumber}</div>
					</div>;

			const MakeStatisticsLoading = (): JSX.Element => 
					<div className={style.statisticsLoading}></div>;

			return (
				<div className={style.rightBlockAuth}>
					{!statisticsLoading ? MakeStatistics() : MakeStatisticsLoading()}

					<div className={style.user}>
						<div>
							<div className={style.name}>Алексей А.</div>
							<a className={style.logout} onClick={OnLogout} href={Pages.Index}>Выйти</a>
						</div>
						<div className={style.avatar}></div>
					</div>

					<MakeBurgerButton />
				</div>
			);
		}, [statisticsLoading,companiesData,MakeBurgerButton,OnLogout]);

	const DropDownMenu = React.useCallback((): JSX.Element => 
			<div ref={dropDownMenuRef} className={style.dropDownMenu}>
				<div className={style.dropDownMenuHeader}>
					<a className={style.dropDownMenuLogo} href={Pages.Index}> </a>
					<button type="button" className={style.dropDownMenuCloseBtn}
						onClick={() => ShowDropDownMenu(!dropDownMenuVisible)}></button>
				</div>

				<div className={style.dropDownMenuOptions}>
					<a className={style.dropDownMenuOption} href={Pages.Index}>Главная</a>
					<a className={style.dropDownMenuOption} aria-disabled href="/#">Тарифы</a>
					<a className={style.dropDownMenuOption} aria-disabled href="/#">FAQ</a>
				</div>

				{!auth && <a className={style.dropDownMenuSignin} aria-disabled href="/#">Зарегистрироваться</a>}
				{!auth && <button type="button" className={style.dropDownMenuLogin} onClick={OnLogin}>Войти</button>}

				{auth && <a className={style.dropDownMenuLogout} onClick={OnLogout} href={Pages.Index}>Выйти</a>}
			</div>
		, [dropDownMenuVisible,auth,OnLogin,OnLogout]);

	return (
		<header className={style.header}>
			<a className={style.logo} href={Pages.Index}> </a>

			<nav ref={menuRef} className={style.menu}>
				<a className={style.option} href={Pages.Index}>Главная</a>
				<a className={style.option} aria-disabled href="/#">Тарифы</a>
				<a className={style.option} aria-disabled href="/#">FAQ</a>
			</nav>
			
			{!auth ? MakeRightBlockUnAuth() : MakeRightBlockAuth()}

			{dropDownMenuVisible && DropDownMenu()}
		</header>
	);
}

