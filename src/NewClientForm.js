import React from 'react';

import {
	Form,
	Input,
	Cascader,
	Button,
} from 'antd';


const residences = [
	{
		value: 'zhejiang',
		label: 'Zhejiang',
		children: [
			{
				value: 'hangzhou',
				label: 'Hangzhou',
				children: [
					{
						value: 'xihu',
						label: 'West Lake',
					},
				],
			},
		],
	},
	{
		value: 'jiangsu',
		label: 'Jiangsu',
		children: [
			{
				value: 'nanjing',
				label: 'Nanjing',
				children: [
					{
						value: 'zhonghuamen',
						label: 'Zhong Hua Men',
					},
				],
			},
		],
	},
];

class RegistrationForm extends React.Component {
	state = {
		confirmDirty: false,
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.address = values.address.toString();
				console.log(values);

				this.props.submit(values);
			}
		});
	};


	render() {
		const {cancel} = this.props;
		const {getFieldDecorator} = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 8},
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 16},
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 8,
				},
			},
		};


		return (
			<Form {...formItemLayout} onSubmit={this.handleSubmit}>
				<Form.Item label="Name">
					{getFieldDecorator('name', {
						rules: [

							{
								required: true,
								message: 'Please input your Name!',
							},
						],
					})(<Input/>)}
				</Form.Item>
				<Form.Item label="Contact Name">
					{getFieldDecorator('contactName', {
						rules: [

							{
								required: true,
								message: 'Please input Cutomer Name!',
							},
						],
					})(<Input/>)}
				</Form.Item>
				<Form.Item label="E-mail">
					{getFieldDecorator('emailAddress', {
						rules: [
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
							},
						],
					})(<Input/>)}
				</Form.Item>

				<Form.Item label="Address">
					{getFieldDecorator('address', {
						initialValue: ['zhejiang', 'hangzhou', 'xihu'],
						rules: [
							{type: 'array', required: true, message: 'Please select your habitual residence!'},
						],
					})(<Cascader options={residences}/>)}
				</Form.Item>
				<Form.Item label="Phone Number">
					{getFieldDecorator('phoneNumber', {
						rules: [{required: true, message: 'Please input your phone number!'}],
					})(<Input style={{width: '100%'}}/>)}
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit" style={{margin: '5px'}}>
						Save Client
					</Button>
					<Button onClick={() => {
						cancel();
					}}> Cancel</Button>
				</Form.Item>
			</Form>
		);
	}
}

export const NewClientForm = Form.create({name: 'register'})(RegistrationForm);
