import * as React from 'react';
import {
    Redirect,
    withRouter
  } from 'react-router-dom'
import { ApiTransactionTracker } from '../../../Common/SharePointTool/ApiTransactionTracker';
import { StockAdjRequestsTasks } from './StockAdjRequestsTasks';
import { headerList } from './headerList';
import { Person } from '../../../Common/SharePointTool/Person';
import { MirinaeTest } from './MirinaeTest';
import ITest from '../../../Common/SharePointTool/ITest';
import { AbsISPTRansactionTracker } from '../../../Common/SharePointTool/AbsISPTransactionTracker';



// Details form display the detail information of request. 
export class TransactionTest extends React.Component<any,any> implements ITest{

    constructor(props){
        super(props);

        this.state = {

        }
    }


    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });      
    };

    async componentDidMount(){

        //let apiTransaction = new ApiTransactionTracker();

        //let result:StockAdjRequestsTasks[] =  await apiTransaction.LoadAll(StockAdjRequestsTasks,"Approval_x0020_Status eq 'Assigned'")

        //console.log(result);
        
  
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    
        console.log("componentDidUpdate");
        console.log(this.state);    
    }

    testTransactionApi =(e) =>{

        let ApplicationInfo = new MirinaeTest("");

        let apiTransaction = new ApiTransactionTracker(ApplicationInfo);
        let header = new headerList(this);
        header.Title ="test";
        header.formID ="formid01";
        header.status ="requested";
        header.rqDate = new Date()
        header.requestor = new Person();
        header.requestor.Id = 7;
        
        apiTransaction.CommandForAdd(header);

        let header2 = new headerList(this);
        header2.Title ="test2";
        header2.formID ="formid02";
        header2.status ="requested";        
        //header2.rqDate = new Date()

        
        //apiTransaction.CommandForAdd(header2);
       // apiTransaction.ExecuteCommand().then(res=>{
/* 
            console.log("transaciton end")

        });  */




    


    }
    update(){

        this.setState({},()=>{

console.log("update22");
        })

        return true;

    }

    public render(){
        
        console.log("Main render");
        console.log(this.state);             

        return(            
          <div className="ag-theme-balham" style={ {height: '200px', width: '600px'} }>
              test
              <button onClick={
                this.testTransactionApi
              }> Test api </button>

        </div>
        );
    }




}

export default withRouter(TransactionTest);
