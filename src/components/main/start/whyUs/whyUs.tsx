import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import style from "./whyUs.module.scss";


export function WhyUs(): JSX.Element
{
	const options: EmblaOptionsType = { loop: true, slidesToScroll: 1, align: 'start', dragFree: true };
	const [carouselRef, carouselApi] = useEmblaCarousel(options);

	return (
		<section className={style.whyUs}>
			<h2 className={style.title}>Почему именно мы</h2>

			<div className={style.carouselCtrl}>
				<button type='button' className={style.leftArrow} onClick={() => carouselApi?.scrollPrev()}></button>

				<div className={style.carousel} ref={carouselRef}>
					<div className={style.container}>

						<div className={style.slideBase}>
							<div className={style.slide}>
								<div className={style.slideLogo1}></div>
								<div className={style.slideDesc}>Высокая и оперативная скорость обработки заявки</div>
							</div>
						</div>

						<div className={style.slideBase}>
							<div className={style.slide}>
								<div className={style.slideLogo2}></div>
								<div className={style.slideDesc}>Огромная комплексная база данных, обеспечивающая объективный ответ на запрос</div>
							</div>
						</div>

						<div className={style.slideBase}>
							<div className={style.slide}>
								<div className={style.slideLogo3}></div>
								<div className={style.slideDesc}>Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству</div>
							</div>
						</div>

						<div className={style.slideBase}>
							<div className={style.slide}>
								<div className={style.slideLogo4}></div>
								<div className={style.slideDesc}>Поиск публикаций о компаниях в СМИ по ИНН, анализ упоминаний по 65 риск-факторам</div>
							</div>
						</div>

						<div className={style.slideBase}>
							<div className={style.slide}>
								<div className={style.slideLogo5}></div>
								<div className={style.slideDesc}>Мониторинг упоминаний в СМИ и отзывов в соцсетях, моментальные уведомления о новых публикациях</div>
							</div>
						</div>

						<div className={style.slideBase}>
							<div className={style.slide}>
								<div className={style.slideLogo6}></div>
								<div className={style.slideDesc}>Данные SCAN интегрируются по API в кредитные конвейеры и системы принятия решений</div>
							</div>
						</div>

					</div>
				</div>

				<button type='button' className={style.rightArrow} onClick={() => carouselApi?.scrollNext()}></button>
			</div>

			<div className={style.back}>
				<div className={style.back_left}></div>
				<div className={style.back_right}></div>
			</div>
		</section>
	);
}

