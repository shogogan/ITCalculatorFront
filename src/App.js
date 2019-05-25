import React, {Component} from 'react';
import './App.css';
import PeopleList from "./people/PeopleList";
import {Button, Col, Form, FormGroup, InputGroup} from "react-bootstrap";
import TaxList from "./tax/TaxList";
import axios from "axios";

class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.showTaxList = this.showTaxList.bind(this);
        this.showPeople = this.showPeople.bind(this);

        this.state = {
            showPeopleList: true
        }
    }

    showPeople() {
        this.setState(() => {
            return {showPeopleList: true}
        });
    }

    showTaxList() {
        if (this.minimumWageInput) {
            axios.post("http://localhost:5000/api/tax", {
                MinimumWage: Number(this.minimumWageInput.value)
            })
                .then((response) => {
                    const taxList = response.data;

                    this.setState(() => {
                        return {showPeopleList: false, taxList: taxList}
                    });
                });
        } else {
            alert("É necessário informar um valor para o salario minimo")
        }
    }

    render() {
        return (
            <div className="App">

                {
                    this.state.showPeopleList &&
                    <div>
                        <h1>Cálculo de Imposto de Renda</h1>
                        <PeopleList/>
                    </div>
                }
                {
                    !this.state.showPeopleList &&
                    <div>
                        <h1>Resultado do imposto de renda</h1>
                        <TaxList onBack={this.showPeople} taxList={this.state.taxList}/>
                    </div>
                }
                <div className="calcContainer">
                    <FormGroup as={Col} md="3" controlId="validationFormik01" className="minimumWageInput">
                        <Form.Label>Valor do salário mínimo</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">R$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control ref={(ref) => this.minimumWageInput = ref} type="number" step="0.01"/>
                        </InputGroup>
                    </FormGroup>

                    <Button className="calcTaxButton" onClick={this.showTaxList}>Calcular imposto de renda</Button>
                </div>
            </div>
        );
    }
}

export default App;
