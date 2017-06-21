import React, { Component } from 'react';
import './App.css';
import ReTree from './ReTree';
import {prepareData, getChecked} from './ReTree';
import './tree-view.css';

class App extends Component {

	state = {
		data: prepareData({label:'Pets', id:0, children:[{label:'Cats', id:4, children:[{label:'Bubbles', id:5}, {label:'Riddles', id:6}]}, {label:'Dogs', id:1, children:[{label:'Scooby', id:2}, {label:'Snowy', id:3}]},]})
	}

	onChangeTree = (newData) => this.setState({data:newData});
	
	render() {
		return (
			<div style={{padding: "2em"}}>
		<h1> retree Demo </h1>
		  <div style={{textAlign:"left"}} >		  
		   <ReTree data= {this.state.data} onChange={this.onChangeTree} />
		  <h5>Checked Items are...</h5>
		  <ol> {Array.from(getChecked(this.state.data, new Set())).map( (i,k) => <li key={k}> {i.label} </li>)}</ol>
		  </div>
		  </div>
		);
	}
}

export default App;
