import React, { Component } from 'react';
import './main.css';
import DateComponent from '../date/DateComponent';
import moment from 'moment';

export default class MainComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: null,
            endDate: null,
            daysLeave: 0,
            leaveType: '',
            erroSubmit: {
                leaveType: '',
                startDay: '',
                endDay: ''
            }
        }
    }
    getDate = (type, date) => {
        if (type === "startDate") {
            this.setState({
                startDate: date
            }, function () {
                this.calDaysLeave(this.state.startDate, this.state.endDate);
            })
        } else {
            this.setState({
                endDate: date
            }, function () {
                this.calDaysLeave(this.state.startDate, this.state.endDate);
            })
        }
    }
    calDaysLeave = (startDate, endDate) => {
        if (startDate && endDate) {
            let days = this.enumerateDaysBetweenDates(startDate, endDate);
            this.setState({
                daysLeave: days
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
            setTimeout(function(){alert("You have just send leave request success")},100)
        } else {
        }
    }
    checkSubmitForm = () => {
        let isErro = false;
        if (this.state.leaveType === '') {
            this.state.erroSubmit.leaveType = "Leave type id can't be empty"
        }else{
            this.state.erroSubmit.leaveType = ''
        }
        if (!this.state.startDate) {
            this.state.erroSubmit.startDay = "Start day can't be empty"
        }else{
            this.state.erroSubmit.startDay = ''
        }
        if (!this.state.endDate) {
            this.state.erroSubmit.endDay = "End day can't be empty"
        }else{
            this.state.erroSubmit.endDay = ''
        }
        let obj = this.state.erroSubmit
        Object.keys(obj).forEach(function (prop) {
            let value = obj[prop];
            if(value!==''){
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
            leaveType: e.target.value
        })
    }

    render() {
        return (
            <div className='MainComponent'>
                <div className='MainComponent-header col-md-12'>
                    <div className='MainComponent-header-logo col-md-6 col-sm-6 col-xs-6'>
                        <img src="https://image4.owler.com/logo/terralogic_owler_20170814_141309_original.jpg" style={{width:'140px'}}/>
                    </div>
                    <div className='MainComponent-header-avatar col-md-6 col-sm-6 col-xs-6'>
                        <img src = 'https://png.icons8.com/color/1600/avatar.png'/>
                    </div>
                </div>
                <div className="container">
                <div className="MainComponent-top MainComponent-frame col-md-12">
                    <p>Annual Balance</p>
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
                                <td>0.0</td>
                                <td>0.0</td>
                                <td>0.0</td>
                                <td>0.0</td>
                                <td>0.0</td>
                                <td>0.0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="MainComponent-bottom MainComponent-frame col-md-12">
                    <p>Leave Request</p>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="control-label col-sm-2 col-xs-4" htmlFor="sel1">Leave type(*)</label>
                            <div className="col-sm-10 col-xs-8 dropdown">
                                <select className="form-control btn btn-primary dropdown-toggle" id="sel1" onChange={this.getLeaveType}>
                                    <option selected disabled>-- Select leave type --</option>
                                    <option>Annual</option>
                                    <option>Compensation</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-2 col-xs-4" ></div>
                            <div className="col-sm-10 col-xs-8">{this.state.erroSubmit.leaveType}</div>
                        </div>

                        <DateComponent type="startDate" endDate={this.state.endDate} notifyDate={this.getDate} />
                        <div className="form-group">
                            <div className="col-sm-2 col-xs-4" ></div>
                            <div className="col-sm-10 col-xs-8"> {this.state.erroSubmit.startDay}</div>
                        </div>

                        <DateComponent type="endDate" startDate={this.state.startDate} notifyDate={this.getDate} />
                        <div className="form-group">
                            <div className="col-sm-2 col-xs-4" ></div>
                            <div className="col-sm-10 col-xs-8">{this.state.erroSubmit.endDay}</div>
                        </div>

                    </form>
                    <div className="form-group">
                        {this.state.daysLeave === 0 ? 'No selected days' : `Number of days: ${this.state.daysLeave} days`}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button type="button" className="btn btn-success" onClick={this.submitLeaveRequest}>Submit</button>
                    </div>
                </div>
                </div>
            </div >
        );
    }
}
