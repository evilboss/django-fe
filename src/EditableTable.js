import React from 'react';
import axios from 'axios';
import qs from 'qs';
import {Table, Input, Button, Popconfirm, Form, Icon} from 'antd';
import Highlighter from 'react-highlight-words';

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
	state = {
		editing: false,
	};

	toggleEdit = () => {
		const editing = !this.state.editing;
		this.setState({editing}, () => {
			if (editing) {
				this.input.focus();
			}
		});
	};


	save = e => {
		const {record, handleSave} = this.props;
		this.form.validateFields((error, values) => {
			if (error && error[e.currentTarget.id]) {
				return;
			}
			this.toggleEdit();
			handleSave({...record, ...values});
		});
	};

	renderCell = form => {
		this.form = form;
		const {children, dataIndex, record, title} = this.props;
		const {editing} = this.state;
		return editing ? (
			<Form.Item style={{margin: 0}}>
				{form.getFieldDecorator(dataIndex, {
					rules: [
						{
							required: true,
							message: `${title} is required.`,
						},
					],
					initialValue: record[dataIndex],
				})(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}/>)}
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{paddingRight: 24}}
				onClick={this.toggleEdit}
			>
				{children}
			</div>
		);
	};

	render() {
		const {
			editable,
			dataIndex,
			title,
			record,
			index,
			handleSave,
			children,
			...restProps
		} = this.props;
		return (
			<td {...restProps}>
				{editable ? (
					<EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
				) : (
					children
				)}
			</td>
		);
	}
}

export class EditableTable extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: 'Client Name',
				dataIndex: 'name',
				width: '30%',
				editable: true,
				sorter: (a, b) => a.name.length - b.name.length,
				...this.getColumnSearchProps('name'),


			},
			{
				title: 'Contact Name',
				sorter: (a, b) => a.name.length - b.name.length,

				dataIndex: 'contactName',
				editable: true,
				...this.getColumnSearchProps('contactName'),


			},
			{
				title: 'address',
				sorter: (a, b) => a.name.length - b.name.length,

				dataIndex: 'address',
				editable: true,
				...this.getColumnSearchProps('address'),

			},
			{
				title: 'Email',
				dataIndex: 'emailAddress',
				sorter: (a, b) => a.name.length - b.name.length,

				editable: true,
				...this.getColumnSearchProps('emailAddress'),


			},
			{
				title: 'Phone Number',
				sorter: (a, b) => a.name.length - b.name.length,

				dataIndex: 'phoneNumber',
				editable: true,
				...this.getColumnSearchProps('phoneNumber'),
			},
			{
				title: 'operation',
				dataIndex: 'operation',
				render: (text, record) =>

					this.state.dataSource.length >= 1 ? (

						<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
							<a>Delete</a>
						</Popconfirm>
					) : null,
			},
		];

		this.state = {
			dataSource: [],
			count: 0,
		};
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
			<div style={{padding: 8}}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					style={{width: 188, marginBottom: 8, display: 'block'}}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					icon="search"
					size="small"
					style={{width: 90, marginRight: 8}}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => (
			<Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
				text
			),
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({searchText: ''});
	};

	updateClient(id, data) {

		axios.put(`http://localhost:8000/api/client/${id}/`, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}}).then(res => {
			console.log(res)
		}).catch(err => {
			console.error(err);
		}).finally(() => {
			this.getData();
		});

	}

	deleteData(id) {
		axios.delete(`http://localhost:8000/api/client/${id}`, {}, {headers: {'Content-Type': 'application/json'}}).then(res => {
			console.log(res)
		}).catch(err => {
			console.error(err);
		}).finally(() => {
			this.getData();

		});
	}

	getData() {
		fetch('http://localhost:8000/api/client/').then((response) => {
			return response.json();
		})
			.then((dataSource) => {
				this.setState({dataSource})
			});
	}

	componentDidMount() {
		this.getData();

	}

	handleDelete = key => {
		const dataSource = [...this.state.dataSource];
		this.deleteData(key);

	};

	addClient(data) {

		axios.post(`http://localhost:8000/api/client/`, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}}).then(res => {
			console.log(res)
		}).catch(err => {
			console.error(err);
		}).finally(() => {
			this.getData();

		});

	}


	handleAdd = () => {
		const {count, dataSource} = this.state;
		const newData = {
			name: "APITEST",
			contactName: "test apit",
			address: "test",
			emailAddress: "test@test.com",
			phoneNumber: "12345"
		};
		this.addClient(newData);
		this.setState({
			dataSource: [...dataSource, newData],
			count: count + 1,
		});
	};

	handleSave = row => {
		console.log(row);
		this.updateClient(row.id, row);
	};

	render() {
		const {dataSource} = this.state;
		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
			},
		};
		const columns = this.columns.map(col => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave: this.handleSave,
				}),
			};
		});
		return (
			<div>
				<Button onClick={this.handleAdd} type="primary" style={{marginBottom: 16}}>
					Add a row
				</Button>
				<Table
					components={components}
					rowClassName={() => 'editable-row'}
					bordered
					dataSource={dataSource}
					columns={columns}
				/>
			</div>
		);
	}
}

