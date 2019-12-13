import React from "react";
import axios from "axios";
class UserLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            formControls: {
                email: {
                    value: ""
                },
                password: {
                    value: ""
                }
            },
            errorValue: '',
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
                formControls
            }
        } = this;

        if (isLoading) {

            return false;

        } else {

            this.setState({
                isLoading: true
            });

        }

        this.sendRequest(formControls.email.value, formControls.password.value)
            .then(data => {
                if (data.status) {
                    this.setState({
                        isLoading: false
                    });

                    window.localStorage.setItem('access_broadcast_token', data.data.access_broadcast_token);
                    window.localStorage.setItem('token_type', data.data.token_type);
                    window.localStorage.setItem('access_token', data.data.access_token);
                    window.localStorage.setItem('__usr', data.data.user_auth.id);
                    this.props.__parentInitEcho(`${data.data.token_type} ${data.data.access_token}`, data.data.access_broadcast_token);
                    window.location.reload();
                } else {
                    this.setState({
                        isLoading: false,
                        errorValue: "User not found."
                    })
                }
            });
    };

    sendRequest = async (email, password) => {

        let slug = window.localStorage.getItem('slug');

        return await axios({
            method: "POST",
            url: `https://${slug}.driff.online/api/login?email=${email}&password=${password}`,
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
                        <h5 className="card-title">{window.localStorage.getItem('slug')} user login</h5>
                        {
                            this.state.errorValue ? <small id="driffHelp" className="form-text text-danger">{this.state.errorValue}</small> : null
                        }
                        <div className="form-group">
                            <input
                                type="email"
                                className={'form-control'}
                                name='email'
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleInputOnKeypress}
                                placeholder='Email'
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className={'form-control'}
                                name='password'
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleInputOnKeypress}
                                placeholder='Password'
                            />
                        </div>
                        <button type="button" className="btn btn-primary float-right" onClick={this.btnContinueOnClick}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserLogin;