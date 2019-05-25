import React, {Component} from 'react';
import {Button, Pagination, Table} from "react-bootstrap";
import AddPersonDialog from "./AddPersonDialog";
import axios from "axios";
import './PeopleList.css';

class PeopleList extends Component {

    constructor(props, context) {
        super(props, context);
        this.peopleList = [];
        this.reloadPeople = this.reloadPeople.bind(this);
        this.editPerson = this.editPerson.bind(this);
        this.show = false;
        this.state = {
            loaded: false,
            person: null
        }
    }

    componentDidMount() {
        this.page = 0;
        this.pages = [];
        this.reloadPeople();
    }

    editPerson(evt) {
        this.person = evt;
        this.setState(() => {
            return {
                ...this.state,
                person: evt
            }
        });
    }

    deletePerson(personId) {
        axios.delete("http://localhost:5000/api/person/" + personId)
            .then(() => {
                this.reloadPeople();
            })
    }


    loadPage(value) {
        this.page = value - 1;
        this.reloadPeople();
    }


    reloadPeople() {
        axios.get("http://localhost:5000/api/person/list", {
            params: {
                page: this.page,
                amount: 10
            }
        }).then((response) => {
            this.peopleList = response.data.result;
            this.pages = [];
            for (let number = 1; number <= response.data.pages; number++) {
                this.pages.push(number);
            }
            this.pages = this.pages.map((value, i) =>
                <Pagination.Item onClick={() => {
                    this.loadPage(value)
                }} key={i} active={value - 1 === this.page}>
                    {value}
                </Pagination.Item>
            );
            this.list = this.peopleList.map((person, i) =>
                <tr key={i}>
                    <td>{person.personId}</td>
                    <td>{person.cpf}</td>
                    <td>{person.personName}</td>
                    <td>{person.dependentsAmount}</td>
                    <td>R$ {person.monthlyGrossRevenue}</td>
                    <td>
                        <Button onClick={() => {
                            this.editPerson(person)
                        }}>Editar</Button>
                        &nbsp;
                        <Button onClick={() => {
                            this.deletePerson(person.personId)
                        }}>Excluir</Button>

                    </td>
                </tr>);

            this.setState(() => {
                return {...this.state, loaded: true, person: null}
            })
        });
    }

    render() {
        return (
            <div className="listContainer">
                <AddPersonDialog person={this.state.person} onSubmit={this.reloadPeople}/>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>CPF do contribuinte</th>
                        <th>Nome do contribuinte</th>
                        <th>Quantidade de dependentes</th>
                        <th>Receita bruta mensal</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.list}
                    </tbody>
                </Table>
                <Pagination >{this.pages}</Pagination>
            </div>
        );
    }
}

export default PeopleList;
