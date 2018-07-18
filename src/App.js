import React, { Component } from 'react';
import './App.css';

const countryLister = [{
  AUD: 'Australian Dollars',
  CAD: 'Canadian Dollars',
  IDR: 'Indonesian Rupiah',
  GBP: 'Poundsterling',
  CHF: 'Swiss Franc',
  SGD: 'Singapore Dollars',
  INR: 'Indian Rupee',
  MYR: 'Malaysian Ringgit',
  JPY: 'Japanes Yen',
  KRW: 'South Korean Won',
}];

class App extends Component {
  constructor(props){
    super(props);
    this.appendConv = [];
    this.state = {
      exrate: [],
      list: [],
      code: [],
      valListed: [],
      countryListed: [],
      base_val: 1,
      isLoaded: false,
      isShow: false,
      isShow2: true,
      value: 'AUD',
      appendConv:this.appendConv,
      listed: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlerBase  = this.handlerBase.bind(this);
  }

  componentDidMount(){
    fetch('https://exchangeratesapi.io/api/latest?base=USD')
      .then(res => res.json())
      .then(api => {
          this.setState({
            isLoaded: true,
            exrate: api,
            list: api.rates,
          })
      });
  }

  addMore() {
    this.setState({ isShow: true })
    this.setState({ isShow2: false })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    let getval    = this.state.list
    let listedval = this.state.listed
    let listedcnt = this.state.valListed
    let listedctr = this.state.countryListed
    let getAppend = this.state.appendConv

    let listchecker = listedctr.includes(this.state.value)
    if(listchecker === true){
      alert('Currency is already exist')
      event.preventDefault()
    }else{

      let converted = getval[this.state.value] * this.state.base_val

      listedcnt.push(getval[this.state.value])
      listedctr.push(this.state.value)

      listedval.push(converted)
      let count_listed = listedval.length - 1

      let stateval = this.state.value

      getAppend.push(
        <div className="row no-gutters rowcontent">

            <div className="col-sm-10 con_left">
                <div className="row no-gutters con_left_ins">
                  <div className="col-sm-6">
                    {this.state.value}
                    <p className="p_exrate"><strong><em>{this.state.value} - {countryLister[0][stateval]}</em></strong></p>
                    <p><em>1 USD = {this.state.value} {getval[this.state.value]}</em></p>
                  </div>
                  <div className="col-sm-6 text-right">
                    { this.state.listed[count_listed] }
                  </div>
                </div>
            </div>

            <div className="col-sm-2 flex_center">
              <a onClick={this.removeTag.bind(null, this.state.value)}>(-)</a>
            </div>

        </div>
      );

      this.setState({
         appendConv: getAppend
      });

      this.setState({ isShow: false })
      this.setState({ isShow2: true })

      event.preventDefault();
    }
  }

  handlerBase = (e) => {
    let listed_base  = this.state.valListed
    let count_lb = listed_base.length

    let curre = []

    for(let a=0; a < count_lb; a++){
      let assignNew = listed_base[a] * e.target.value
      curre.push(assignNew);
    }

    this.setState({
      listed: curre,
      base_val: e.target.value
    });
    this.redraw(curre)
  }

  redraw(curre){
    let getCountry = this.state.countryListed
    let getval     = curre

    let counter = getCountry.length - 1

    let newRate = []

    for(let i=0;i<=counter;i++){
      newRate.push(
        <div className="row no-gutters rowcontent">

            <div className="col-sm-10 con_left">
                <div className="row no-gutters con_left_ins">
                  <div className="col-sm-6">
                    {getCountry[i]}
                    <p className="p_exrate"><strong><em>{getCountry[i]} - {countryLister[0][getCountry[i]]}</em></strong></p>
                    <p><em>1 USD = {getCountry[i]} {this.state.list[getCountry[i]]}</em></p>
                  </div>
                  <div className="col-sm-6 text-right">
                    { getval[i] }
                  </div>
                </div>
            </div>

            <div className="col-sm-2 flex_center">
              <a onClick={this.removeTag.bind(null, getCountry[i])}>(-)</a>
            </div>

        </div>
      );
    }

    this.setState({
       appendConv: newRate
    });
  }

  removeTag = (i) => {
    let getCountry = this.state.countryListed
    let lst = this.state.listed

    let array = getCountry;
    let index = array.indexOf(i)
    array.splice(index, 1);

    this.setState({
       countryListed: array
    });

    let curre = lst
    this.redraw(curre)
  }

  render() {

    let { isLoaded, list } = this.state;

    let curr = [];
    for(let key in list){
      curr.push(<option value={key}>{ key }</option>);
    }

    // console.log(countryLister[0].AUD)

    if(!isLoaded) {
      return <div>loading...</div>;
    }

    else{

      return (
        <div className="App">
          Change this value: <input type="number" onChange={this.handlerBase} value={this.state.base_val}/>
          <div className="upper"><p><em>USD - United States Dollars</em></p>
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <h5><strong>USD</strong></h5>
                </div>
                <div className="col-sm">
                  <h5><strong>{this.state.base_val}</strong></h5>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom">
            <div>
            {this.state.appendConv}
            </div>

            {this.state.isShow2 &&
              <div className="row no-gutters rowcontent p-3" onClick={this.addMore.bind(this)}>
                (+) Add More Currency
              </div>
            }

            {this.state.isShow &&
              <form onSubmit={this.handleSubmit}>
                <div className="row no-gutters rowcontent p-3">
                  <select value={this.state.value} onChange={this.handleChange}>
                    { curr }
                  </select>
                  <input type="submit" value="Submit" />
                </div>
              </form>
            }

          </div>

        </div>
      );
    }

  }
}

export default App;
