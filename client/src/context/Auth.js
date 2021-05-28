import { Component } from "react";
import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const UseAuth = () => useContext(AuthContext);

export default class AuthContextProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			 // True if mounting finishes
			ready: false,

			// motor information
			motor_id: "",
			data_time: [],
			data_rpm: [],
			data_vib: [],
			data_mil: [],

			// Exposed functions
			set_id: async (id) => {
				this.setState({ motor_id: id });
			},
			populate: async () => {
				return await this.populate();
			},
			get_rpm: () => {
				return this.state.data_rpm;
			},
			get_vib: () => {
				return this.state.data_vib;
			},
			get_mil: () => {
				return this.state.data_mil;
			},
			get_time: () => {
				return this.state.data_time;
			},
		};
	}

	// Fetch all relevant data and put to place
	async populate(){
		let data_rpm = [];
		let data_mil = [];
		let data_vib = [];
		let data_time = [];

		let rpm = await this.get_data(this.state.motor_id, "rpm");	

		for(let i = 0; i < rpm.length; i++){
			data_rpm[i] = rpm[i].data;
			data_time[i] = rpm[i].time.slice(11,16);
		}

		let vib = await this.get_data(this.state.motor_id, "vib");	

		for(let i = 0; i < vib.length; i++){
			data_vib[i] = vib[i].data;
		}

		let mil = await this.get_data(this.state.motor_id, "mil");	

		for(let i = 0; i < mil.length; i++){
			data_mil[i] = mil[i].data;
		}

		await this.setState({
			data_rpm: data_rpm.reverse(),
			data_vib: data_vib.reverse(),
			data_mil: data_mil.reverse(),
			data_time: data_time.reverse()
		});
	}

	// Get motor data
	async get_data(id, targetData) {
		// Takes signup information: email, password, first_name, last_name
		let url = `/api/${targetData}`;
		let init = {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({motor: id}),
		};
		let response = await fetch(url, init);
		let data = "";

		data = await response.json();

		if (response.status >= 400) {
			console.log(response)
			return null;
		} else {
			return data;
		}
	}

	render() {
	    return (
	      <AuthContext.Provider value={this.state}>
	        {this.props.children}
	      </AuthContext.Provider>
	    );
	  }

}
