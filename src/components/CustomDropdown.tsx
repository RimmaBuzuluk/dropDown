import React, { useState, useRef, useEffect } from 'react';
import arrow from '../img/Polygon 2.png';

const defaultItems = ['Option 1', 'Option 2', 'Option 3'];

type DropdownProps = {
	id: number;
	isOpen: boolean;
	onToggle: (id: number) => void;
	onSearch?: (query: string) => string[] | Promise<string[]>;
};

export const Dropdown: React.FC<DropdownProps> = ({ id, isOpen, onToggle, onSearch }) => {
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState<string | null>(null);
	const [items, setItems] = useState<string[]>(defaultItems);
	const [isLoading, setIsLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		onToggle(isOpen ? -1 : id);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			onToggle(-1);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [isOpen]);

	useEffect(() => {
		let active = true;

		const doSearch = async () => {
			if (onSearch) {
				setIsLoading(true);
				const result = await onSearch(query);
				if (active) {
					setItems(result);
					setIsLoading(false);
				}
			} else {
				setItems(defaultItems.filter(item => item.toLowerCase().includes(query.toLowerCase())));
			}
		};

		if (isOpen) {
			doSearch();
		}

		return () => {
			active = false;
		};
	}, [query, isOpen, onSearch]);

	return (
		<div
			className='dropDownWrapper'
			ref={dropdownRef}
			style={{
				border: isOpen ? '1px solid #333' : '',
				borderRadius: '16px',
			}}
		>
			<div
				className='dropDown'
				onClick={handleClick}
				tabIndex={0}
				style={{
					borderTopLeftRadius: '16px',
					borderTopRightRadius: '16px',
					borderBottomLeftRadius: isOpen ? '0px' : '16px',
					borderBottomRightRadius: isOpen ? '0px' : '16px',
				}}
			>
				<div>{selected || 'Оберіть ваше місто'}</div>
				<img className='dropDown__arrow' src={arrow} />
			</div>

			{isOpen && (
				<div className='dropDown__content'>
					<input className='dropDown__search' value={query} onChange={e => setQuery(e.target.value)} placeholder='Пошук...' />
					<ul className='dropDown__list'>
						{isLoading ? (
							<li className='dropDown__item'>Завантаження...</li>
						) : items.length === 0 ? (
							<li className='dropDown__item'>Нічого не знайдено</li>
						) : (
							items.map(item => (
								<li
									key={item}
									className='dropDown__item'
									onClick={() => {
										setSelected(item);
										onToggle(-1);
									}}
								>
									{item}
								</li>
							))
						)}
					</ul>
				</div>
			)}
		</div>
	);
};
