import React from 'react';

export default class ReTree extends React.Component {
	
	onCheck =  (x) => this.props.onChange(setPropCascadingDFS(this.props.data, "id", x, "checked", true));

  	onUncheck = (x) => this.props.onChange(setPropCascadingDFS(this.props.data, "id", x, "checked", false));
	
	onCollapse = (x) => this.props.onChange(setPropDFS(this.props.data, "id", x, "collapsed", true));

	onUncollapse = (x) => this.props.onChange(setPropDFS(this.props.data, "id", x, "collapsed", false));

	/*filterRepo = (e) => {
		this.setState({searchString:e.target.value}, ()=> this.props.onChange(treeFilter(this.props.data, this.state.searchString)));
	}*/

	render() {
		return <StatelessTree 
			    onCollapse={this.onCollapse}	    
			    onUncollapse={this.onUncollapse}
			    onCheck={this.onCheck}
			    onUncheck={this.onUncheck}
			    id={this.props.data.id}
			    label={this.props.data.label}
			    collapsed={this.props.data.collapsed}
			    checked={this.props.data.checked}
			    children={this.props.data.children}
		    />	    
	  }
}

export function prepareData(x) {
	x.checked = false;	
	x.hidden = false;
	x.path==='root' ? x.collapsed = false : x.collapsed = true;
	if(x.children) x.children.map(prepareData);
	//console.log(x);
	return x;
}

function setPropDFS(x, key, keyVal, prop, value) {
	//console.log(`Finding node with ${key}=${keyVal} to set ${prop}=${value}`)
	if(x[key]===keyVal) 
	{
		x[prop]=value;
		//console.log(x)
		return x;
	}

	else {
		if(x.children) {
			x.children.map(t=>setPropDFS(t, key, keyVal, prop, value));
			//console.log(x)
			return x;
		}
		else
		{
			//console.log('Node not found');
			return x;
		}
	}
}

function setPropCascadingDFS(x, key, keyVal, prop, value) {
	//console.log(`Finding node with ${key}=${keyVal} to set ${prop}=${value}`)
	if(x[key]===keyVal) setPropCascadingNoFilter(x, prop, value);

	else {
		if(x.children) {
			x.children.map(t=>setPropCascadingDFS(t, key, keyVal, prop, value));
			//console.log(x)
			return x;
		}
		else
		{
			//console.log('Node not found');
			return x;
		}
	}
}

function setPropCascadingNoFilter(x, prop, value) {
	if(x.hidden === false){
		x[prop]=value;
		if(x.children) x.children.map(t=>setPropCascadingNoFilter(t, prop, value));
	}	
	return x;
}

export function getChecked(x, accum) {	
	if(x.checked) accum.add(x);
	if(x.children)
		for(let i=0; i<x.children.length; i++)
			accum = getChecked(x.children[i], accum);
	return accum;
}

class StatelessTree extends React.Component {

	toggleCollapse = () => this.props.collapsed ? this.props.onUncollapse(this.props.id) : this.props.onCollapse(this.props.id);

	toggleChecked = () => this.props.checked ? this.props.onUncheck(this.props.id) : this.props.onCheck(this.props.id);
	
	render() {
		if(!this.props.hidden)
			return <div className={this.props.className}>
					{(this.props.children && this.props.children.length) ?
						<span className={this.props.collapsed ? 'tree-view_arrow-collapsed tree-view_arrow':'tree-view_arrow'} onClick={this.toggleCollapse}/>
						: <span className="tree-view_children spacer"></span>}
					{this.props.checkable ? <input
			            type="checkbox"
			            checked={this.props.checked}
			            onChange={this.toggleChecked} /> : ""}
					<span>{" "}{" "}{this.props.label}</span>
					{(this.props.children && this.props.children.length) ?
					 <div>
						{
							this.props.children.map(
							(t,i)=>
							<StatelessTree							
							checkable={true}
							collapsed={t.collapsed}
							onCheck={this.props.onCheck}
							onUncheck={this.props.onUncheck}
							onCollapse={this.props.onCollapse}
							onUncollapse={this.props.onUncollapse}							
							checked={t.checked}
							className={this.props.collapsed ? "tree-view_children tree-view_children-collapsed" : "tree-view_children"}
							id={t.id}
							key={t.id}
							label={t.label}
							children={t.children}
							hidden={t.hidden}							
							/>
							)
						}
					</div>
					:""}
				   </div>
	   else return null;
	}
}