import React from "react";
import ReactDOMServer from "react-dom/server";
import * as RouterDOM from 'react-router-dom';
import * as ReactRedux from 'react-redux';

import { Pages, Action, StateType, SearchData, AuthData } from "../../../definitions";
import * as localStorage from "../../../local_storage";
import * as scanApiHelper from '../../../scan_api_helper'
import * as helper from '../../../helper'
import style from "./docs.module.scss";



export function Docs(): JSX.Element
{
	const dispatch = ReactRedux.useDispatch();
	const navigate = RouterDOM.useNavigate();

	const authData = ReactRedux.useSelector<StateType,AuthData | undefined>(state => state.authData);
	const searchData = ReactRedux.useSelector<StateType,SearchData | undefined>(state => state.searchData!);
	const documentsID = ReactRedux.useSelector<StateType,string[] | undefined>(state => state.documentsID);

	const [docsHtml, SetDocsHtml] = React.useState<string>("");
	const [processedDocsNum, SetProcessedDocsNum] = React.useState<number>(0);
	const [docsLoading, SetDocsLoading] = React.useState<boolean>(false);

	const LoadDocumentsChunk = React.useCallback(() => {
			if(authData!==undefined && documentsID!==undefined &&
				processedDocsNum < documentsID!.length &&
				!docsLoading)
			{
				SetDocsLoading(true);

				const numDocsAtOne = 10;
				const docsIds: string[] = documentsID.slice(processedDocsNum, processedDocsNum + numDocsAtOne);

	 			scanApiHelper.MakeDocumentsRequest(authData!.accessToken, docsIds,
					(res: scanApiHelper.RequestResult) => {
						if(res.response?.status === 200)
							AddReceivedDocs(res.data);
						else if(res.response?.status === 401)
						{
							localStorage.DeleteAuthorizationData();
							dispatch({type: Action.ResetAuth});
							navigate(Pages.Login);
						}

						SetProcessedDocsNum(Math.min(processedDocsNum + numDocsAtOne, documentsID.length));
						SetDocsLoading(false);
					}
				);
			}

			type DocData = {
				id: string,
				date: string | undefined,
				author: string | undefined,
				url: string | undefined,
				title: string | undefined,
				type: "TechNews" | "Announcement" | "Digest" | undefined,
				content: string,
				wordCount: number | undefined,
			};				

			const AddReceivedDocs = (data: any) => {
					let docsData: DocData[] = [];

					data.forEach((o: any) => {
						if(Object.hasOwn(o,"ok") &&
							Object.hasOwn(o.ok,"id") && Object.hasOwn(o.ok,"content") &&
							Object.hasOwn(o.ok,"attributes"))
						{
							docsData.push({
								id: o.ok.id,
								date: (Object.hasOwn(o.ok,"issueDate") ? o.ok.issueDate : undefined),
								author: (Object.hasOwn(o.ok,"author") ? o.ok.author.name : undefined),
								url: (Object.hasOwn(o.ok,"url") && o.ok.url.length>0 ? o.ok.url : undefined),
								title: (Object.hasOwn(o.ok,"title") ? o.ok.title.text : undefined),
								type: (o => {
										if(Object.hasOwn(o,"isTechNews") && !!o.isTechNews) return "TechNews";
										if(Object.hasOwn(o,"isAnnouncement") && !!o.isAnnouncement) return "Announcement";
										if(Object.hasOwn(o,"isDigest") && !!o.isDigest) return "Digest";
										return undefined;
									})(o.ok.attributes),
								content: o.ok.content.markup,
								wordCount: (Object.hasOwn(o.ok.attributes,"wordCount") ? o.ok.attributes.wordCount : undefined)
							});
						}
					});

					let docsHtmlNew: string = docsHtml;
					docsData.forEach(d => docsHtmlNew += ReactDOMServer.renderToStaticMarkup( DocDataToJSXElement(d) ));
					SetDocsHtml(docsHtmlNew);

					dispatch({type: Action.SetDocumentsLoaded, state: true});
				};

			const DocDataToJSXElement = (d: DocData): JSX.Element => {
					return (
						<section key={d.id} className={style.doc}>
							<div className={style.header}>
								<div className={style.date}>{d.date!==undefined ? helper.ExtractLocaleDate(d.date) : ""}</div>
								{(() => {
									if(d.author===undefined) return <div className={style.author}></div>;
									if(d.url===undefined) return <div className={style.author}>{d.author}</div>;
									return <a className={style.author} href={d.url} rel="noreferrer" target="_blank">{d.author}</a>;
								})()}
							</div>

							{d.title && <h2 className={style.title}>{d.title}</h2>}

							{d.type && d.type==="TechNews" && <div className={style.badge}>Технические новости</div>}
							{d.type && d.type==="Announcement" && <div className={style.badge}>Анонсы и события</div>}
							{d.type && d.type==="Digest" && <div className={style.badge}>Сводки новостей</div>}

							<div className={style.content} dangerouslySetInnerHTML={{__html: d.content}}></div>

							<div className={style.footer}>
								<button type='button' className={style.btnGoToSource} disabled={d.url===undefined}
									data-url={d.url}>Читать в источнике</button>
								<div className={style.wordCount}>{d.wordCount ? GetWordCountText(d.wordCount) : ""}</div>
							</div>
						</section>
					);
				};

			const GetWordCountText = (count: number) => {
					const modulo1 = count % 100;
					const modulo2 = count % 10;
					const postfix: string = ((modulo1>=5 && modulo1<=20) || modulo2===0 || (modulo2>=5 && modulo2<=9) ?
						"слов" : (modulo2===1 ? "слово" : "слова"));
					return `${count} ${postfix}`;
				};

		}, [authData,documentsID,docsHtml,docsLoading,processedDocsNum,dispatch,navigate])


	React.useEffect(() => {
		const OnDocumentMouseDown = (e: MouseEvent): void => {
				if(e.target instanceof HTMLButtonElement)
					if(e.target.dataset.url)
						window.open(e.target.dataset.url,"_blank");
			};

		document.addEventListener("click", OnDocumentMouseDown);
		return () => document.removeEventListener("click", OnDocumentMouseDown);
	}, []);


	React.useEffect(() => {
		if(authData!==undefined && searchData!==undefined && documentsID===undefined)
		{
			scanApiHelper.MakeObjectSearchRequest(authData!.accessToken, searchData,
				(res: scanApiHelper.RequestResult) => {
					if(res.response?.status === 200)
					{
						const docsId: string[] = res.data.items.map((o: any) => o.encodedId);
						dispatch({type: Action.SetDocumentsID, state: docsId});
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

		if(documentsID!==undefined && docsHtml.length===0 &&
			!docsLoading)
		{
			if(documentsID.length > 0)
				LoadDocumentsChunk();
			else
				dispatch({type: Action.SetDocumentsLoaded, state: true});
		}
	}, [authData,searchData,documentsID,docsHtml,docsLoading,LoadDocumentsChunk,dispatch,navigate])


	if(docsHtml.length === 0)
		return <></>;

	return (
		<section className={style.docs}>
			<h2 className={style.title}>Список документов</h2>

			<div className={style.docList} dangerouslySetInnerHTML={{__html: docsHtml}}></div>

			<button type='button' className={style.btnShowMore}
				hidden={processedDocsNum>=documentsID!.length} disabled={docsLoading}
				onClick={() => LoadDocumentsChunk()}>Показать больше</button>
		</section>
	);
}

