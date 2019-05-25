import React, {Component} from "react"
import AddPersonDialog from "../people/AddPersonDialog";
import {Table} from "react-bootstrap";

class TaxList extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            taxList: []
        }
    }

    componentDidMount() {
        if (this.props.taxList) {
            this.list = this.props.taxList.map((person) => {
                return (
                    <tr>
                        <td>{person.cpf}</td>
                        <td>{person.personName}</td>
                        <td>R$ {person.taxValue}</td>
                    </tr>
                );
            });
            this.setState(() => {
                return {
                    loaded: true
                }
            });
        }
    }

    componentWillReceiveProps(props) {
        if (props.taxList) {
            this.list = props.taxList.map((person) => {
                return (
                    <tr>
                        <td>{person.cpf}</td>
                        <td>{person.personName}</td>
                        <td>R$ {person.taxValue}</td>
                    </tr>
                );
            });
            this.setState(() => {
                return {
                    loaded: true
                }
            });
        }
    }


    render() {
        return (
            <>
                <AddPersonDialog person={this.state.person} onSubmit={this.reloadPeople}/>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>CPF do contribuinte</th>
                        <th>Nome do contribuinte</th>
                        <th>Valor do imposto de renda</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.list}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default TaxList;
