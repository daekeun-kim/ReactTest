import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {
    Redirect,
    withRouter
  } from 'react-router-dom'
import Cookies from 'universal-cookie';


// Details form display the detail information of request. 
export class TestGrid extends React.Component<any,any>{

    constructor(props){
        super(props);

        this.state = {
          columnDefs: [
            { headerName: "emp_no", field: "_EMP_NO",editable:true },
            { headerName: "Date", field: "_DATE",editable:true },
            { headerName: "Time", field: "_TIME",editable:true },
            { headerName: "Name", field: "_EMP_NAME",editable:true },

            { headerName: "file_name", field: "_FILE_NAME",editable:true },
            { headerName: "ReadFlag", field: "_READ_FLAG",editable:true },
            { headerName: "GenerateDate", field: "_GENERATE_DATE",editable:true }],
            
          rowData: []
        }
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });      
    };

    componentDidMount(){

        console.log("componentDidMount");
        this.getRowData();
        console.log(this.state);     
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    
        console.log("componentDidUpdate");
        console.log(this.state);        ;

    }

    public getRowData = ():Promise<any> =>{

      debugger;
      console.log("start")
  
    const sAddrforSVC = "";
    
    let resultfromSAP = {};        
    const cookies = new Cookies();
    let token = cookies.get('testKey');       
  
    return fetch('https://kor1vmiisqa01/mirinae/home/index2',{
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      })
      .then(function (response) {      
        return response.json()
      })
      .then(data => {
  
        console.log(data);
        this.setState({
          rowData:data
        });
  
      })
      .catch(function (error) {
   
      });
    }
  

    public render(){
        
        console.log("Main render");
        console.log(this.state);             

        return(            
          <div className="ag-theme-balham" style={ {height: '200px', width: '600px'} }>
          <AgGridReact
              editType={"fullRow"}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
          </AgGridReact>
        </div>
        );
    }




}

export default withRouter(TestGrid);
