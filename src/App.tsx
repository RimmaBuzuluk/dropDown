import './App.css';
import { Dropdown } from './components/CustomDropdown';
import { useState } from 'react';

const search = async (query: string): Promise<string[]> => {
	await new Promise(resolve => setTimeout(resolve, 500));
	return ['Київ', 'Львів', 'Одеса', 'Харків'].filter(city => city.toLowerCase().includes(query.toLowerCase()));
};

function App() {
	const [openId, setOpenId] = useState<number | null>(null);

	const handleToggle = (id: number) => {
		setOpenId(prev => (prev === id ? null : id));
	};

	return (
		<div className='App'>
			{[0, 1, 2, 3].map(id => (
				<Dropdown key={id} id={id} isOpen={openId === id} onToggle={handleToggle} onSearch={search} />
			))}
		</div>
	);
}

export default App;
