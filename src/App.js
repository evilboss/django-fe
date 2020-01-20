import React from 'react';
import {Button} from 'antd';
import {EditableTable} from './EditableTable';
import {AppLayout} from './AppLayout';
import './App.css';

function App() {
	return (

		<div className="App">
			<AppLayout>
				<EditableTable/>

			</AppLayout>

		</div>
	);
}

export default App;
