'use client';

import {
	Fragment,
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

type ContributionDay = {
	date: string;
	count: number;
	level?: 0 | 1 | 2 | 3 | 4;
};

type ContactLink = {
	label: string;
	href: string;
	icon: ReactNode;
	card: ReactNode;
};

type Props = {
	email?: string;
	github?: {
		username: string;
		url?: string;
		days?: ContributionDay[];
		avatar?: ReactNode;
	};
	links?: ContactLink[];
	labels?: { copy?: string; copied?: string; contributions?: string };
	locale?: string;
	className?: string;
};

const API = 'https://github-contributions-api.jogruber.de/v4';

const LEVELS = [
	'bg-zinc-900/10 dark:bg-zinc-100/10',
	'bg-green-600/20 dark:bg-green-400/20',
	'bg-green-600/40 dark:bg-green-400/40',
	'bg-green-600/65 dark:bg-green-400/65',
	'bg-green-600/90 dark:bg-green-400/90',
];

const KEYFRAMES = `
@keyframes cc-in {
	from { opacity: 0; transform: translateX(calc(var(--cc-dir, 1) * 64px)) scale(0.97); filter: blur(6px); }
}
@keyframes cc-out {
	to { opacity: 0; transform: translateX(calc(var(--cc-dir, 1) * -64px)) scale(0.97); filter: blur(6px); }
}`;

export default function ContactCards({
	email,
	github,
	links = [],
	labels,
	locale,
	className = '',
}: Props) {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);
	const [direction, setDirection] = useState(1);
	const [outgoing, setOutgoing] = useState<{ index: number; direction: number; key: number }>();
	const [entryKey, setEntryKey] = useState(0);
	const [box, setBox] = useState({ left: 0, width: 0, height: 0 });
	const [morphing, setMorphing] = useState(false);
	const [githubDays, setGithubDays] = useState<ContributionDay[] | undefined>(github?.days);

	const contentRef = useRef<HTMLDivElement>(null);
	const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

	useEffect(() => {
		if (!github || github.days) return;
		let cancelled = false;
		fetch(`${API}/${github.username}?y=last`)
			.then((r) => (r.ok ? r.json() : Promise.reject()))
			.then((data: { contributions: ContributionDay[] }) => {
				if (!cancelled) setGithubDays(data.contributions);
			})
			.catch(() => { if (!cancelled) setGithubDays([]); });
		return () => { cancelled = true; };
	}, [github?.username, github?.days]);

	const items: ContactLink[] = [
		...(github
			? [
					{
						label: 'GitHub',
						href: github.url ?? `https://github.com/${github.username}`,
						icon: <GithubIcon />,
						card: (
							<GithubCard
								github={{ ...github, days: githubDays }}
								locale={locale}
								contributionsLabel={labels?.contributions ?? 'contributions in the last year'}
							/>
						),
					},
				]
			: []),
		...links,
	];

	useLayoutEffect(() => {
		const content = contentRef.current;
		const link = linkRefs.current[index];
		if (!open || !content || !link) return;

		const measure = () => {
			const rect = content.getBoundingClientRect();
			setBox({
				left: link.offsetLeft + link.offsetWidth / 2,
				width: Math.ceil(rect.width),
				height: Math.max(Math.ceil(rect.height), content.scrollHeight) + 8,
			});
		};

		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(content);
		return () => ro.disconnect();
	}, [open, index]);

	useEffect(() => {
		if (!outgoing) return;
		const timeout = setTimeout(() => setOutgoing(undefined), 400);
		return () => clearTimeout(timeout);
	}, [outgoing]);

	function handleEnter(next: number) {
		if (open && next === index) return;
		if (open) {
			setOutgoing({ index, direction: Math.sign(next - index) || 1, key: entryKey });
			setDirection(Math.sign(next - index) || 1);
		}
		setMorphing(open);
		setIndex(next);
		setEntryKey((key) => key + 1);
		setOpen(true);
	}

	return (
		<div className={`flex items-center gap-5 ${className}`}>
			<style>{KEYFRAMES}</style>

			{email && <CopyEmailButton email={email} labels={labels} />}

			<div
				className="relative flex gap-5"
				onMouseLeave={() => {
					setOpen(false);
					setOutgoing(undefined);
					setMorphing(false);
				}}
			>
				{items.map((item, itemIndex) => (
					<a
						key={item.label}
						ref={(node) => {
							linkRefs.current[itemIndex] = node;
						}}
						href={item.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={item.label}
						onMouseEnter={() => handleEnter(itemIndex)}
						onFocus={() => handleEnter(itemIndex)}
						className="z-10 p-2.5 text-zinc-400 transition-colors hover:text-zinc-100"
					>
						{item.icon}
					</a>
				))}

				<div
					aria-hidden={!open}
					style={{ left: box.left, width: box.width, height: box.height }}
					className={`absolute bottom-[calc(100%+0.5rem)] flex origin-bottom items-start overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl ring ring-zinc-100/10
						${
							morphing
								? 'transition-[left,width,height,opacity,transform] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]'
								: 'transition-[opacity,transform] duration-200 ease-out'
						}
						${
							open
								? '-translate-x-1/2 scale-100 opacity-100'
								: 'pointer-events-none -translate-x-1/2 translate-y-1 scale-[0.97] opacity-0'
						}`}
				>
					{outgoing && (
						<div
							key={`out-${outgoing.key}`}
							onAnimationEnd={(event) => {
								if (event.target === event.currentTarget) setOutgoing(undefined);
							}}
							style={
								{
									'--cc-dir': outgoing.direction,
									animation: 'cc-out 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
								} as React.CSSProperties
							}
							className="absolute"
						>
							{items[outgoing.index]?.card}
						</div>
					)}
					<div
						key={`in-${entryKey}`}
						ref={contentRef}
						style={
							{
								'--cc-dir': direction,
								animation: morphing
									? 'cc-in 0.4s cubic-bezier(0.32,0.72,0,1) backwards'
									: undefined,
							} as React.CSSProperties
						}
						className="absolute"
					>
						{items[index]?.card}
					</div>
				</div>

				{/* Pointer bridge, so the card stays open while moving towards it. */}
				<div className="absolute inset-0 -top-2" />
			</div>
		</div>
	);
}

async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		/* keep going */
	}
	try {
		const field = document.createElement('textarea');
		field.value = text;
		field.setAttribute('readonly', '');
		field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
		document.body.append(field);
		field.select();
		const copied = document.execCommand('copy');
		field.remove();
		return copied;
	} catch {
		return false;
	}
}

function CopyEmailButton({
	email,
	labels,
	className = '',
}: {
	email: string;
	labels?: { copy?: string; copied?: string };
	className?: string;
}) {
	const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
	const [hovered, setHovered] = useState(false);
	const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => () => clearTimeout(timeout.current), []);

	async function copy() {
		const copied = await copyText(email);
		setState(copied ? 'copied' : 'manual');
		clearTimeout(timeout.current);
		timeout.current = setTimeout(() => setState('idle'), copied ? 3000 : 8000);
	}

	const label = labels?.copy ?? 'Copy my email';
	const copiedLabel = labels?.copied ?? 'Email copied!';

	return (
		<button
			type="button"
			onClick={copy}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			aria-label={label}
			style={{
				backgroundColor: '#e4e4e7', color: '#18181b',
				paddingLeft: '1.5rem', paddingRight: '1.5rem',
				paddingTop: '0.625rem', paddingBottom: '0.625rem',
				borderRadius: '12px', border: 'none', fontWeight: 500, cursor: 'pointer',
				transform: hovered ? 'scale(1.06)' : 'scale(1)',
				boxShadow: hovered
					? '0 0 0 1px rgba(255,255,255,0.4), 0 0 45px rgba(255,255,255,0.3), 0 0 90px rgba(255,255,255,0.12)'
					: '0 0 28px rgba(255,255,255,0.18), 0 0 60px rgba(255,255,255,0.07)',
				transition: 'transform 0.3s ease, box-shadow 0.3s ease',
			}}
			className={`relative flex items-center justify-center active:scale-95 ${className}`}
		>
			<span
				className={`transition-all duration-500 ${state === 'idle' ? '' : 'opacity-0 blur-[2px]'}`}
			>
				{label}
			</span>
			<span
				aria-live="polite"
				className={`absolute transition-all duration-500 ${state === 'idle' ? 'opacity-0 blur-[2px]' : ''}`}
			>
				{state === 'manual' ? email : copiedLabel}
			</span>
		</button>
	);
}

function GithubCard({
	github,
	locale,
	contributionsLabel,
}: {
	github: NonNullable<Props['github']>;
	locale?: string;
	contributionsLabel: string;
}) {
	const days = github.days ?? [];
	const total = days.reduce((sum, day) => sum + day.count, 0);

	return (
		<div style={{ paddingLeft: '0.8rem', paddingRight: '0.8rem', paddingTop: '0.3rem', paddingBottom: '0.7rem' }} className="flex w-[min(19.2rem,calc(100vw-4rem))] flex-col gap-1.5">
			<div className="flex items-center gap-4">
				{github.avatar ?? (
					<span className="block size-10 shrink-0 rounded-full bg-gradient-to-br from-orange-300 to-red-500" />
				)}
				<div className="flex flex-col">
					<span className="font-medium">{github.username}</span>
					<span className="text-sm text-zinc-500">
						{total.toLocaleString(locale)} {contributionsLabel}
					</span>
				</div>
			</div>
			<ContributionGraph days={days} locale={locale} />
		</div>
	);
}

function ContributionGraph({
	days,
	locale,
	className = '',
}: {
	days: ContributionDay[];
	locale?: string;
	className?: string;
}) {
	const [hovered, setHovered] = useState<{ day: ContributionDay; left: number; top: number }>();
	const containerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const weeks = useMemo(() => {
		if (days.length === 0) return [];
		// Trim start so first day lands on Thursday (day 4) → 3 visible cells in first column
		const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
		const trimCount = (4 - firstDow + 7) % 7;
		const trimmedDays = days.slice(trimCount);
		const result: (ContributionDay | undefined)[][] = [];
		let week: (ContributionDay | undefined)[] = Array.from({
			length: new Date(`${trimmedDays[0].date}T00:00:00Z`).getUTCDay(),
		});
		for (const day of trimmedDays) {
			week.push(day);
			if (week.length === 7) {
				result.push(week);
				week = [];
			}
		}
		if (week.length > 0)
			result.push([...week, ...Array.from<undefined>({ length: 7 - week.length })]);
		return [...result.slice(0, -3), result[result.length - 1]];
	}, [days]);

	const formatter = useMemo(
		() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' }),
		[locale],
	);

	const containerWidth = containerRef.current?.clientWidth ?? 0;
	const tooltipWidth = tooltipRef.current?.clientWidth ?? 0;
	const left = hovered
		? Math.min(Math.max(hovered.left, tooltipWidth / 2), containerWidth - tooltipWidth / 2)
		: 0;

	return (
		<div
			ref={containerRef}
			onPointerOver={(event) => {
				const target = event.target as HTMLElement;
				const { date, count } = target.dataset;
				if (!date) return setHovered(undefined);
				setHovered({
					day: { date, count: Number(count) },
					left: target.offsetLeft + target.offsetWidth / 2,
					top: target.offsetTop,
				});
			}}
			onPointerLeave={() => setHovered(undefined)}
			className={`relative flex w-full flex-col gap-2 ${className}`}
		>
			<div
				className="grid grid-flow-col gap-[1.3px]"
				style={{
					gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
					gridTemplateRows: 'repeat(7, 5px)',
				}}
			>
				{weeks.map((week, weekIndex) => (
					<Fragment key={weekIndex}>
						{week.map((day, dayIndex) => (
							<div
								key={dayIndex}
								data-date={day?.date}
								data-count={day?.count}
								className={`rounded-[1px] ${
									day ? LEVELS[day.level ?? levelOf(day.count)] : ''
								}`}
								style={!day ? { opacity: 0 } : undefined}
							/>
						))}
					</Fragment>
				))}
			</div>

			<div
				ref={tooltipRef}
				style={{ left, top: hovered?.top ?? 0 }}
				className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+0.25rem)] rounded-xl bg-zinc-950 px-2 py-1 text-xs whitespace-nowrap text-zinc-100 shadow-lg transition-opacity duration-100 ${
					hovered ? 'opacity-100' : 'opacity-0'
				}`}
			>
				{hovered
					? `${hovered.day.count} contribution${hovered.day.count === 1 ? '' : 's'} · ${formatter.format(new Date(hovered.day.date))}`
					: ''}
			</div>
		</div>
	);
}

function levelOf(count: number): 0 | 1 | 2 | 3 | 4 {
	return count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
}

function GithubIcon() {
	return (
		<svg viewBox="0 0 24 24" className="size-6 fill-current">
			<path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
		</svg>
	);
}

export function XIcon() {
	return (
		<svg viewBox="0 0 24 24" className="size-6 fill-current">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

export function LinkedinIcon() {
	return (
		<svg viewBox="0 0 24 24" className="size-6 fill-current">
			<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95 4 0 4.4 2.4 4.4 5.6V21h-4v-5.6c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.2 1.45-2.2 2.99V21h-4V9Z" />
		</svg>
	);
}
