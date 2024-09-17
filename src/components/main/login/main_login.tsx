import React from "react";
import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';

import { Action, Pages } from '../../definitions'
import * as localStorage from "../../local_storage";
import * as scanApiHelper from '../../scan_api_helper'
import style from "./main_login.module.scss";



export function Main(): JSX.Element
{
	const dispatch = ReactRedux.useDispatch();
	const navigate = RouterDOM.useNavigate()

	const loginInputRef = React.useRef<HTMLInputElement>(null);
	const passwordInputRef = React.useRef<HTMLInputElement>(null);

	const [loginPasswordError, SetLoginPasswordError] = React.useState<boolean>(false);
	const [loginBtnEnabled, EnableLoginBtn] = React.useState<boolean>(false);


	const OnLoginPasswordChanged = React.useCallback(() => {
			if(loginInputRef && passwordInputRef)
			{
				EnableLoginBtn(loginInputRef.current?.value.trim().length !== 0 && 
					passwordInputRef.current?.value.trim().length !== 0);

				if(loginInputRef.current?.value.trim().length === 0 && 
					passwordInputRef.current?.value.trim().length === 0)
				{
					SetLoginPasswordError(false);   // выключаем подсветку предыдущей ошибки авторизации, если она была.
				}
			}
		}, []);

	const OnLoginBtnClick = React.useCallback(() => {
			SetLoginPasswordError(false);   // выключаем подсветку предыдущей ошибки авторизации, если она была.
			EnableLoginBtn(false);   // блокируем кнопку 'Войти'.

			scanApiHelper.MakeAccountLoginRequest(loginInputRef.current!.value, passwordInputRef.current!.value,
					(res: scanApiHelper.RequestResult) => {
						if(res.response?.status === 200)
						{
							const authData = {accessToken: res.data.accessToken, expire: res.data.expire};
							localStorage.WriteAuthorizationData(authData);
							dispatch({type: Action.SetAuthData, state: authData});
							navigate(Pages.Index, { replace: true });
						}
						else if(res.response?.status === 401)   // ошибка авторизации.
						{
							SetLoginPasswordError(true);   // включаем подсветку ошибки авторизации.
							EnableLoginBtn(true);   // делаем кнопку 'Войти' снова активной.
						}
					}
				);
		}, [dispatch,navigate]);


	return (
		<main className={style.main}>
			<div className={style.title}>Для оформления подписки<br/>на тариф, необходимо авторизоваться.</div>
			<div className={style.image}></div>

			<section className={style.form}>
				<div className={style.tabs}>
					<div className={style.tabLogin}>Войти</div>
					<div className={style.tabRegister}>Зарегистрироваться</div>
				</div>

				<div className={style.login}>
					<div className={style.loginTitle}>Логин или номер телефона:</div>
					<input type="text" ref={loginInputRef} className={style.loginInput} autoFocus aria-invalid={loginPasswordError}
						onChange={()=> OnLoginPasswordChanged()}/>
					<div className={style.loginError} aria-hidden={true/* !loginPasswordError */}>Введите корректные данные</div>
				</div>

				<div className={style.pass}>
					<div className={style.passTitle}>Пароль:</div>
					<input type="password" ref={passwordInputRef} className={style.passInput} aria-invalid={loginPasswordError}
						onChange={() => OnLoginPasswordChanged()}/>
					<div className={style.passwordError} aria-hidden={!loginPasswordError}>Неправильный логин или пароль</div>
				</div>

				<button type="button" className={style.loginBtn} disabled={!loginBtnEnabled}
					onClick={() => OnLoginBtnClick()}>Войти</button>

				<a className={style.passRestore} aria-disabled href="/#">Восстановить пароль</a>

				<div className={style.loginVia}>Войти через:</div>
				<div className={style.loginMeanses}>
					<a className={style.loginViaGoogle} aria-disabled href="/#"> </a>
					<a className={style.loginViaFacebook} aria-disabled href="/#"> </a>
					<a className={style.loginViaYandex} aria-disabled href="/#"> </a>
				</div>
			</section>
		</main>
	);
}

