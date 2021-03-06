import React, { Component } from 'react';
import './main.css';
import DateComponent from '../date/DateComponent';
import moment from 'moment';
import _ from 'lodash';
import { connect } from "react-redux";
import { changeLeaveType, changeLoginStatus, changeUserInfo } from "../../actions/actions";

class HomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: null,
            endDate: null,
            daysLeave: 0,
            leaveTypeChoose: '',
            erroSubmit: {
                leaveType: '',
                startDay: '',
                endDay: ''
            }
        }
    }
    componentWillMount() {
        if (localStorage.getItem('isLogin')) {
            if (localStorage.getItem('email')) {
                let user = { email: localStorage.getItem('email'), pass: localStorage.getItem('pass') };
                this.props.changeUserInfo(user)
            }
            if (localStorage.getItem('balance')) {
                let balance = localStorage.getItem('balance');
                console.log("test", JSON.parse(balance));
                this.props.changeLeaveType(JSON.parse(balance));
            }

        } else {
            if (!this.props.reducers.isLogin) {
                this.props.history.push('/')
            }
        }
    }
    setLocalStorage = (key, value) => {
        localStorage.setItem(key, value);
    }
    getDate = (type, date) => {
        if (type === "startDate") {
            this.setState({
                startDate: date
            }, function () {
                this.checkStartDate();
                this.calDaysLeave(this.state.startDate, this.state.endDate);
            })
        } else {
            this.setState({
                endDate: date
            }, function () {
                this.checkEndDate();
                this.calDaysLeave(this.state.startDate, this.state.endDate);
            })
        }
    }
    calDaysLeave = (startDate, endDate) => {
        if (startDate && endDate) {
            let days = this.enumerateDaysBetweenDates(startDate, endDate);
            this.setState({
                daysLeave: days,
            })

        }
    }
    enumerateDaysBetweenDates = (startDate, endDate) => {
        var dates = [];

        var currDate = moment(startDate).startOf('day');
        var lastDate = moment(endDate).startOf('day');
        do {
            let day = currDate.clone().toDate().getDay()
            if (day !== 6 && day !== 0) {
                dates.push(day);
            }
        } while (currDate.add(1, 'days').diff(lastDate) <= 0);

        console.log("currDate.toDate()", dates, dates.length);
        return dates.length;
    }
    submitLeaveRequest = () => {
        if (!this.checkSubmitForm()) {
            setTimeout(function () { alert("You have just send leave request success") }, 100);
            this.updateBalance();
            this.resetForm();
        } else {
        }
    }
    updateBalance = () => {
        let leaveDays = this.state.daysLeave;
        let oldState = _.cloneDeep(this.props.reducers.leaveType);
        // let a =_.get(this.props, 'props.reducers.leaveType', {})
        if (this.state.leaveTypeChoose === "Annual") {
            oldState = {
                ...oldState,
                annual: {
                    ...oldState.annual,
                    remaining: (oldState.annual.total - oldState.annual.leave - leaveDays) > 0 ? oldState.annual.total - oldState.annual.leave - leaveDays : 0,
                    leave: oldState.annual.leave + leaveDays,
                }
            }
        } else {
            oldState = {
                ...oldState,
                compensation: {
                    ...oldState.compensation,
                    remaining: (oldState.compensation.total - oldState.compensation.leave - leaveDays) > 0 ? oldState.compensation.total - oldState.compensation.leave - leaveDays : 0,
                    leave: oldState.compensation.leave + leaveDays,
                }
            }
        }
        this.props.changeLeaveType(oldState);
        localStorage.setItem('balance', JSON.stringify(oldState));
    }
    resetForm = () => {
        this.setState({
            startDate: null,
            endDate: null,
            daysLeave: 0,
            leaveTypeChoose: '',
            erroSubmit: {
                leaveType: '',
                startDay: '',
                endDay: ''
            },
        })
    }
    checkLeaveType = () => {
        if (this.state.leaveTypeChoose === '') {
            this.setState({
                erroSubmit: {
                    ...this.state.erroSubmit,
                    leaveType: "Leave type id can't be empty"
                }
            })
        } else {
            this.setState({
                erroSubmit: {
                    ...this.state.erroSubmit,
                    leaveType: ''
                }
            })
        }
    }
    checkStartDate = () => {
        if (!this.state.startDate) {
            this.setState({
                erroSubmit: {
                    ...this.state.erroSubmit,
                    startDay: "Start day can't be empty"
                }
            })
        } else {
            this.setState({
                erroSubmit: {
                    ...this.state.erroSubmit,
                    startDay: ''
                }
            })
        }
    }
    checkEndDate = () => {
        if (!this.state.endDate) {
            this.setState({
                erroSubmit: {
                    ...this.state.erroSubmit,
                    endDay: "End day can't be empty"
                }
            })
        } else {
            this.setState({
                erroSubmit: {
                    ...this.state.erroSubmit,
                    endDay: ''
                }
            })
        }
    }
    checkSubmitForm = () => {
        let isErro = false;
        if (this.state.leaveTypeChoose === '') {
            this.state.erroSubmit.leaveType = "Leave type id can't be empty"
            this.state.error = true;
        } else {
            this.state.erroSubmit.leaveType = ''
        }
        if (!this.state.startDate) {
            this.state.erroSubmit.startDay = "Start day can't be empty"
        } else {
            this.state.erroSubmit.startDay = ''
        }
        if (!this.state.endDate) {
            this.state.erroSubmit.endDay = "End day can't be empty"
        } else {
            this.state.erroSubmit.endDay = ''
        }
        let obj = this.state.erroSubmit
        Object.keys(obj).forEach(function (prop) {
            let value = obj[prop];
            if (value !== '') {
                isErro = true;
                return isErro;
            }
            console.log(value);
        });
        this.forceUpdate();
        return isErro;

    }
    getLeaveType = (e) => {
        this.setState({
            leaveTypeChoose: e.target.value
        }, function () {
            this.checkLeaveType();
        })
    }
    resetData = () => {
        this.props.changeLoginStatus(false);
        let user = { email: '', pass: '' };
        let leaveType = {
            annual: {
                type: 'Annual',
                total: 12,
                remaining: 12,
                leave: 0,
            },
            compensation: {
                type: 'Compensation',
                total: 12,
                remaining: 12,
                leave: 0,
            }
        }
        this.props.changeUserInfo(user);
        this.props.changeLeaveType(leaveType);
        localStorage.clear();
    }
    signOut = () => {
        this.props.history.push('/');
        this.resetData();
    }

    render() {
        return (
            <div className='MainComponent'>
                <div className='MainComponent-header col-md-12'>
                    <div className='MainComponent-header-logo col-md-6 col-sm-6 col-xs-6'>
                        <img src="https://image4.owler.com/logo/terralogic_owler_20170814_141309_original.jpg" style={{ width: '140px' }} />
                    </div>
                    <div className='MainComponent-header-avatar col-md-6 col-sm-6 col-xs-6'>
                        <div>
                            <div data-toggle="dropdown">
                                <img src='https://png.icons8.com/color/1600/avatar.png' />
                                <div className="wrapUserInfo">
                                    <span className="wrapUserInfo-aloha">Welcome</span>
                                    <span className="wrapUserInfo-userInfo">{this.props.reducers.user.email}</span>
                                </div>
                            </div>
                            <ul className="dropdown-menu">
                                <li onClick={this.signOut}><a style={{ color: '#337ab7', fontWeight: '700' }}>SIGN OUT</a></li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div className="container">
                    <div className="MainComponent-top MainComponent-frame col-md-12">
                        <p>Annual Balance</p>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th >Total annual leave</th>
                                        <th >Remaining annual leave day</th>
                                        <th >Annual leave taken</th>
                                        <th >Total compensation leave</th>
                                        <th >Remaining compensation leave day</th>
                                        <th >Compensation leave taken</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.props.reducers.leaveType.annual.total}</td>
                                        <td>{this.props.reducers.leaveType.annual.remaining}</td>
                                        <td>{this.props.reducers.leaveType.annual.leave}</td>
                                        <td>{this.props.reducers.leaveType.compensation.total}</td>
                                        <td>{this.props.reducers.leaveType.compensation.remaining}</td>
                                        <td>{this.props.reducers.leaveType.compensation.leave}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="MainComponent-bottom MainComponent-frame col-md-12">
                        <p>Leave Request</p>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="control-label col-sm-2 col-xs-4" htmlFor="sel1">Leave type(*)</label>
                                <div className="col-sm-10 col-xs-8 dropdown">
                                    <select value={this.state.leaveTypeChoose === '' ? '-- Select leave type --' : this.state.leaveTypeChoose} className="form-control btn btn-primary dropdown-toggle" id="sel1" onChange={this.getLeaveType}>
                                        <option disabled>-- Select leave type --</option>
                                        <option>{this.props.reducers.leaveType.annual.type}</option>
                                        <option>{this.props.reducers.leaveType.compensation.type}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-2 col-xs-4" ></div>
                                <div className="col-sm-10 col-xs-8 erro">{this.state.erroSubmit.leaveType}</div>
                            </div>

                            <DateComponent type="startDate" startDate={this.state.startDate} endDate={this.state.endDate} notifyDate={this.getDate} />
                            <div className="form-group">
                                <div className="col-sm-2 col-xs-4" ></div>
                                <div className="col-sm-10 col-xs-8 erro"> {this.state.erroSubmit.startDay}</div>
                            </div>

                            <DateComponent type="endDate" startDate={this.state.startDate} endDate={this.state.endDate} notifyDate={this.getDate} />
                            <div className="form-group">
                                <div className="col-sm-2 col-xs-4" ></div>
                                <div className="col-sm-10 col-xs-8 erro">{this.state.erroSubmit.endDay}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label  col-md-2 col-sm-3 col-xs-4">
                                    {this.state.daysLeave === 0 ? 'No selected days' : `Number of days: `}
                                </label>
                                <div className=" col-md-10 col-sm-9 col-xs-6 dropdown mumberLeave">
                                    {this.state.daysLeave === 0 ? '' : this.state.daysLeave + ' days'}
                                </div>
                            </div>
                        </form>

                        <div style={{ textAlign: 'right' }}>
                            <button type="button" className="btn btn-success" onClick={this.submitLeaveRequest}>Submit</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
const mapStateToProps = state => {
    return {
        ...state
    }
}
export default connect(
    mapStateToProps,
    {
        changeLeaveType: changeLeaveType,
        changeLoginStatus: changeLoginStatus,
        changeUserInfo: changeUserInfo
    }
)((HomeComponent));