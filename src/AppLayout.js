import * as React from "react";
import {Layout, Menu, Breadcrumb, Icon} from 'antd';


const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

export class AppLayout extends React.Component {
	render() {
		return (
			<Layout>
				<Header className="header">
					<div className="logo">
					</div>
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={['2']}
						style={{lineHeight: '64px'}}
					>

					</Menu>
					<h1 style={{color: 'white'}}>Client Management</h1>

				</Header>

				<Layout>

					<Sider width={200}>

					</Sider>
					<Layout style={{padding: '0 24px 24px'}}>
						<Content
							style={{
								background: '#fff',
								padding: 24,
								margin: 0,
								minHeight: 900,
							}}
						>
							{this.props.children}
						</Content>
					</Layout>
				</Layout>
				<footer style={{background: '#021529'}}>bla</footer>
			</Layout>

		)
	}
}
