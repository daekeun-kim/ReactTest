import * as React from 'react';
import {
    Redirect,
    withRouter
  } from 'react-router-dom'
import { ApiTransactionTracker } from '../../../Common/SPOTransactionTracker/ApiTransactionTracker';
import { headerList } from './headerList';
import { MirinaeTest } from './MirinaeTest';
import ITransactionProgressIndicator from '../../../Common/SPOTransactionTracker/ITransactionProgressIndicator';
import { ProgressIndicator, Spinner, Dialog, SpinnerSize } from 'office-ui-fabric-react';
import { detailList } from './detailList';
import { TransactionInfo } from './TransactionInfo';




// Details form display the detail information of request. 
export class TransactionTestPage extends React.Component<any,any> implements ITransactionProgressIndicator{

    constructor(props){
        super(props);

        this.state = {
            isProcessing:false,
            progress:0,
            date:"",
            taskName:""

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

    handleProgressWhenStartTransaction(TotalTransactionCount: number,taskName?:string): void {
        this.setState({
            progress:0
            ,isProcessing:true
            ,taskName:taskName
        })

    }
    handleProgressWhenCompletedCommand(CompletedTransactionCount: number, TotalTransactionCount: number,taskName?:string): void {

        let percentage = Math.round((CompletedTransactionCount / TotalTransactionCount) * 100) /100

        console.log(`process ${CompletedTransactionCount} /  ${TotalTransactionCount} `)

        this.setState({
            progress:percentage
            ,taskName:taskName
        })
        
    }
    handleProgressWhenFailedCommand(CompletedTransactionCount: number, TotalTransactionCount: number,taskName?:string): void {
       
    }
    handleProgressWhenCompletedTransation(TotalTransactionCount: number,taskName?:string): void {


        this.setState({
            progress:1
            ,isProcessing:false
            ,taskName:taskName
        })
        
    }
    handleProgressWhenFailedTransation(TotalTransactionCount: number,taskName?:string): void {
        this.setState({
            progress:0
            ,isProcessing:false
            ,taskName:taskName
        })
    }

    

    createTransaction =async (e) =>{


        let tsInfo = new TransactionInfo("");
        tsInfo.setProgressIndicator(this);  // if you want to have progress on transaciton
        let apiTransaction = new ApiTransactionTracker(tsInfo);
    

        for (let index = 0; index < 3; index++) {
            
            let header2 = new headerList();
            header2.Title =`HeaderTitle`;
            header2.formID =`FormID_${Math.ceil(Math.random() * 1000)}`
            header2.status ="requested";        
            header2.rqDate = new Date();        
            apiTransaction.CommandForAdd(header2);
        }

        
        await apiTransaction.ExecuteCommand("Create Header");  

    }


    updateTransaction =async (e) =>{


        let tsInfo = new TransactionInfo("");
        tsInfo.setProgressIndicator(this);  // if you want to have progress on transaciton
        let apiTransaction = new ApiTransactionTracker(tsInfo);
        tsInfo._transationName ="Approve";
        tsInfo.setFormID("test");

        let rstheaderList:headerList[] = await apiTransaction.LoadAll(headerList,"Title eq 'HeaderTitle'");
    
        for (let index = 0; index < rstheaderList.length; index++) {
            
            let element = rstheaderList[index];
            element.Choice1.push("Test2");
            apiTransaction.CommandForUpdate(element);
        }


        apiTransaction.ExecuteCommand("update"); 
    }

    deleteTransaction =async (e) =>{


        let tsInfo = new TransactionInfo("");
        tsInfo.setProgressIndicator(this);  // if you want to have progress on transaciton
        let apiTransaction = new ApiTransactionTracker(tsInfo);
        tsInfo._transationName ="Approve";

        let rstheaderList:headerList[] = await apiTransaction.LoadAll(headerList,"Title eq 'HeaderTitle'");
    
        for (let index = 0; index < 1; index++) {
            
            let element = rstheaderList[index];            
            apiTransaction.CommandForDelete(element);
        }


        apiTransaction.ExecuteCommand("delete"); 


    }

   


    public render(){
        
        console.log("Main render");
        console.log(this.state);             

        return(            
          <div className="ag-theme-balham">

              <button onClick={
                this.createTransaction
              }> Create header list </button>
            <br></br>
            <br></br>

              <button onClick={
                this.updateTransaction
              }> Update Header List </button>

<br></br>
<br></br>

<button onClick={
                this.deleteTransaction
              }> delete Header List </button>

<br></br>
<br></br>

        <Dialog
            hidden={!this.state.isProcessing}                                                        
            modalProps={{                
                isBlocking: true,                            
            }}
            >                        
            <div style={{height:"120px",width:"150px",left:"3%",position:"relative"}}>          
                <Spinner size={ SpinnerSize.large} label='Processing...'/>              
            </div> 

            
            <div>
                {this.state.taskName}: {Math.round(this.state.progress * 100) }% completed 
              <ProgressIndicator label="" description="" percentComplete={this.state.progress} />
            </div>
        </Dialog>

        </div>
        );
    }




}

export default withRouter(TransactionTestPage);
