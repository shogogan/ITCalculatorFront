import React, {Component} from "react"
import {Button, Col, Form, FormGroup, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import MaskedFormControl from "react-bootstrap-maskedinput";
import axios from "axios";
import "./PeopleList.css";

yup.addMethod(yup.number, 'delocalize', function () {
    return this.transform(function (currentValue, originalValue) {
        return parseFloat(originalValue.replace(',', '.'))
    })
});

const schema = yup.object({
    personId: yup.number(),
    cpf: yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF Inválido.").required("Campo obrigatório"),
    personName: yup.string().required("Campo obrigatório"),
    dependentsAmount: yup.number().positive("Valor inválido").integer("Valor inválido").required("Campo obrigatório"),
    monthlyGrossRevenue: yup.number().positive("Valor inválido").required("Campo obrigatório"),
});


class AddPersonDialog extends Component {

    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.state = {
            show: false,
            person: {}
        }
    }

    handleShow() {
        this.setState({show: true, person: {}});
    }

    handleClose() {
        this.setState({show: false});
    }

    handleSubmit() {
        this.form.submitForm();
    }

    componentWillReceiveProps(props) {
        if (props.person)
            this.setState({show: true, person: props.person})
    }

    sendRequest(form) {
        const url = form.personId ? "http://localhost:5000/api/person/updatePerson" : "http://localhost:5000/api/person/newPerson";
        axios.post(url, form, {
            headers: {
                Accept: "*/*",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                this.handleClose();
                this.props.onSubmit();
            });
    }

    render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow} className="addPersonButton">
                    Adicionar contribuinte
                </Button>
                <Modal show={this.state.show} size="lg" centered onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Adicionar contribuinte
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            ref={(ref) => this.form = ref}
                            id="formik"
                            validationSchema={schema}
                            onSubmit={this.sendRequest}
                            initialValues={this.state.person}
                        >
                            {({
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  touched,
                                  errors,
                              }) => (
                                <Form id="addForm" onSubmit={handleSubmit}>
                                    <Form.Row>
                                        <FormGroup as={Col} md="3" controlId="validationFormik01">
                                            <Form.Label>CPF</Form.Label>
                                            <Form.Control as={MaskedFormControl} mask="111.111.111-11"
                                                          name="cpf"
                                                          value={values.cpf}
                                                          onChange={handleChange}
                                                          isInvalid={!!errors.cpf}
                                                          isValid={touched.cpf && !errors.cpf}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.cpf}
                                            </Form.Control.Feedback>
                                        </FormGroup>

                                        <FormGroup as={Col} md="3" controlId="validationFormik02">
                                            <Form.Label>Nome do Contribuinte</Form.Label>
                                            <Form.Control value={values.personName}
                                                          name="personName"
                                                          onChange={handleChange}
                                                          isInvalid={!!errors.personName}
                                                          isValid={touched.personName && !errors.personName}/>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.personName}
                                            </Form.Control.Feedback>
                                        </FormGroup>

                                        <FormGroup as={Col} md="3" controlId="validationFormik03">
                                            <Form.Label>Qtd. de dependentes</Form.Label>
                                            <Form.Control value={values.dependentsAmount}
                                                          type="number"
                                                          name="dependentsAmount"
                                                          onChange={handleChange}
                                                          isInvalid={!!errors.dependentsAmount}
                                                          isValid={touched.dependentsAmount && !errors.dependentsAmount}/>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dependentsAmount}
                                            </Form.Control.Feedback>
                                        </FormGroup>

                                        <FormGroup as={Col} md="3" controlId="validationFormik04">
                                            <Form.Label>Renda bruta mensal</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon1">R$</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control value={values.monthlyGrossRevenue}
                                                              name="monthlyGrossRevenue"
                                                              type="number"
                                                              step="0.01"
                                                              onChange={handleChange}
                                                              isValid={touched.monthlyGrossRevenue && !errors.monthlyGrossRevenue}
                                                              isInvalid={!!errors.monthlyGrossRevenue}/>
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.monthlyGrossRevenue}
                                            </Form.Control.Feedback>
                                        </FormGroup>
                                    </Form.Row>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default AddPersonDialog
