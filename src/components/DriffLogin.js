import React, {Component} from "react";
import axios from "axios";

class DriffLogin extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
            formControls: {
                driff: {
                    value: "",
                    error: null
                }
            },
            noslugerror: false
        }
    }

    handleInputChange = (e) => {

        let name = e.currentTarget.name;
        let value = e.currentTarget.value.trim().toLowerCase();

        this.setState({
            formControls: {
                ...this.state.formControls,
                [name]: {
                    error: null,
                    value: value
                }
            }
        });

    };

    handleInputOnKeypress = (e) => {
        if (e.which === 32) {
            e.preventDefault()
        }

        if (e.key === 'Enter') {
            this.btnContinueOnClick(e);
        }
    };


    btnContinueOnClick = (e) => {

        const {
            state: {
                isLoading,
                formControls: {
                    driff,
                }
            }
        } = this;

        if (isLoading) {

            return false;

        } else {

            this.setState({
                isLoading: true
            });

        }

        let slugName = driff.value;
        console.log(slugName);
        this.sendRequest(slugName)
            .then(data => {
                if (data.status) {
                    window.localStorage.setItem('slug', slugName);
                    this.setState({
                        isLoading: false
                    });
                    this.props.parentHandleUpdateSlug();
                } else {
                    this.setState({
                        isLoading: false,
                        formControls: {
                            ...this.state.formControls,
                            driff: {
                                ...driff,
                                error: "Driff does not exist."
                            }
                        }
                    })
                }
            });
    };

    sendRequest = async (slug) => {
        return await axios({
            method: "POST",
            url: `https://driff.online/api/slug?slug=${slug}`,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return {
                    status: true,
                    data: res.data
                }
            })
            .catch(err => {
                return {
                    status: false,
                    data: err
                }
            });
    };

    render() {
        return (
            <div className="container">
                <div className="card mt-5">
                    <div className="card-body">
                        <h5 className="card-title">Driff Login</h5>
                        <div className="form-group">
                            <input
                                type="text"
                                className={'form-control'}
                                name={'driff'}
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleInputOnKeypress}
                                placeholder='Company name'
                            />
                            {
                                this.state.formControls.driff.error ? <small id="driffHelp" className="form-text text-danger">{this.state.formControls.driff.error}</small> : null
                            }
                        </div>
                        <button type="button" className="btn btn-primary float-right" onClick={this.btnContinueOnClick}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DriffLogin;