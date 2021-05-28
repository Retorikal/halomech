import React, { useState, useEffect, Component } from "react";
import AuthContextProvider, { UseAuth } from "context/Auth";

import logo from 'logo.svg';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import {Line} from 'react-chartjs-2';

import 'App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function Content(props) {
  const [motor, onMotorChange] = useState("");
  const [dataRpm, onRpmChange] = useState([]);
  const [dataVib, onVibChange] = useState([]);
  const [dataMil, onMilChange] = useState([]);
  const [dataTime, onTimeChange] = useState([]);
  
  const auth = UseAuth();
  
  const getMotor = async () => {
    await auth.set_id(motor);
    await auth.populate(motor);
    onRpmChange(auth.get_rpm());
    onVibChange(auth.get_vib());
    onMilChange(auth.get_mil());
    onTimeChange(auth.get_time());
  }

  const chartOpt = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales:{
      y: {
        ticks: {
            color: "white",
        }
      },
      x: {
        ticks: {
            color: "white",
        }
      }
    }
  }

  let rpmstate = {
    labels: dataTime,
    fontColor: '#fff',
    datasets: [{
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
        data: dataRpm
    }]
  }

  let milstate = {
    labels: dataTime,
    fontColor: '#fff',
    datasets: [{
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
        data: dataMil
    }]
  }

  let vibstate = {
    labels: dataTime,
    fontColor: '#fff',
    datasets: [{
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
        data: dataVib
    }]
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">HALOMech</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"/>
          <Form inline>
            <FormControl 
              type="text" 
              placeholder="Motor name" 
              className="mr-sm-2" 
              onChange = {(e) => {onMotorChange(e.target.value)}}/>
            <Button variant="outline-success" onClick={getMotor}>Change</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <Container className="content bg-light">
        <Card className="bg-dark text-white my-2"> 
          <Card.Body>
            <Card.Title>RPM</Card.Title>
            <Line
              height={100}
              options={chartOpt}
              data={rpmstate}
            />
          </Card.Body>
        </Card>

        <Card className="bg-dark text-white my-2"> 
          <Card.Body>
            <Card.Title>Mileage (m)</Card.Title>
            <Line
              height={100}
              options={chartOpt}
              data={milstate}
            />
          </Card.Body>
        </Card>

        <Card className="bg-dark text-white my-2"> 
          <Card.Body>
            <Card.Title>Vibration</Card.Title>
            <Line
              height={100}
              options={chartOpt}
              data={vibstate}
            />

          </Card.Body>
          <Card.Footer >
            <Button variant="primary">
              Get vibration analysis
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
}

function App(props) {
  return (
    <AuthContextProvider>
      <Content/>  
    </AuthContextProvider>
  );
}

export default App;
