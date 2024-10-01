import React from "react";
import ReactDOM from "react-dom/client";
import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';

import "./index.module.scss";
import { StateType, Pages } from "./components/definitions";
import { store } from "./components/reducer";
import { PageNotFound } from "./components/page_not_found/page_not_found";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Main as MainStart} from "./components/main/start/main_start";
import { Main as MainLogin } from "./components/main/login/main_login";
import { Main as MainSearch } from "./components/main/search/main_search";
import { Main as MainResult } from "./components/main/result/main_result";



const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
		<React.StrictMode>
			<ReactRedux.Provider store={store}>
				<SiteContent/>
			</ReactRedux.Provider>
		</React.StrictMode>
	);

/*
  Логин     Пароль
sf_student1	4i2385j
sf_student3	6z9ZFRs
sf_student2	lV8xjCH
sf_student4	Br1+tbG
sf_student5	LuwAwJf
sf_student6	eczpWCB
sf_student7	P6VcKNf
sf_student8	5QB0KM/
sf_student9	DTdEwAn

INN: 7710137066
*/

export function SiteContent(): JSX.Element
{
	const auth = ReactRedux.useSelector<StateType,boolean>(state => state.authData!==undefined);
	const searchDataReady = ReactRedux.useSelector<StateType,boolean>(state => state.searchData!==undefined);

	const Layout = React.useCallback((): JSX.Element =>
			<React.Fragment>
				<Header/>
				<RouterDOM.Outlet/>
				<Footer/>
			</React.Fragment>
		, []);

	return (
			<RouterDOM.HashRouter>
				<RouterDOM.Routes>
					<RouterDOM.Route element={<Layout/>}>
						<RouterDOM.Route index element={<MainStart/>}/>
						<RouterDOM.Route path={Pages.Login} element={!auth ? <MainLogin/> : <MainStart/>}/>
						<RouterDOM.Route path={Pages.Search} element={auth ? <MainSearch/> : <MainStart/>}/>
						<RouterDOM.Route path={Pages.Result} element={auth && searchDataReady ? <MainResult/> : <MainSearch/>}/>
					</RouterDOM.Route>
					<RouterDOM.Route path="*" element={<PageNotFound/>}/>
				</RouterDOM.Routes>
			</RouterDOM.HashRouter>
		);
}

