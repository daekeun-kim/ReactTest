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
import { AbsISPTRansactionTracker } from '../../../Common/SharePointTool/AbsISPTransactionTracker';
import ITransactionProgressIndicator from '../../../Common/SharePointTool/ITransactionProgressIndicator';
import { ProgressIndicator, Spinner, Dialog, SpinnerSize } from 'office-ui-fabric-react';



// Details form display the detail information of request. 
export class TransactionTest extends React.Component<any,any> implements ITransactionProgressIndicator{

    constructor(props){
        super(props);

        this.state = {
            isProcessing:false,
            progress:0

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

    handleProgressWhenStartTransaction(TotalTransactionCount: number): void {
        this.setState({
            progress:0
            ,isProcessing:true
        })

    }
    handleProgressWhenCompletedCommand(CompletedTransactionCount: number, TotalTransactionCount: number): void {

        let percentage = Math.round((CompletedTransactionCount / TotalTransactionCount) * 100) /100

        console.log(`process ${CompletedTransactionCount} /  ${TotalTransactionCount} `)

        this.setState({
            progress:percentage
        })
        
    }
    handleProgressWhenFailedCommand(CompletedTransactionCount: number, TotalTransactionCount: number): void {
       
    }
    handleProgressWhenCompletedTransation(TotalTransactionCount: number): void {


        this.setState({
            progress:100
            ,isProcessing:false
        })
        
    }
    handleProgressWhenFailedTransation(TotalTransactionCount: number): void {
       
    }

    testTransactionApi =async (e) =>{

        let ApplicationInfo = new MirinaeTest("");
        ApplicationInfo.setProgressIndicator(this);
        let apiTransaction = new ApiTransactionTracker(ApplicationInfo);
    


        for (let index = 0; index < 3; index++) {
            
            let header2 = new headerList();
            header2.Title ="mirinaeTest" + (index +1).toString();
            header2.formID ="formid" + new Date().toISOString();
            header2.status ="requested";        
            header2.rqDate = new Date();        
            apiTransaction.CommandForAdd(header2);
        }

        let result = await apiTransaction.ExecutePartialCommand();

        if ( result === true){

            
            for (let index = 0; index < 5; index++) {
                
                let header2 = new headerList();
                header2.Title ="mirinaeTest2" + (index +1).toString();
                header2.formID ="formid" + new Date().toISOString();
                header2.status ="requested";        
                header2.rqDate = new Date();        
                apiTransaction.CommandForAdd(header2);
            }

            apiTransaction.ExecuteCommand();

        }



    }

    testTransactionApi2 =async (e) =>{

        let ApplicationInfo = new MirinaeTest("");
        ApplicationInfo.setProgressIndicator(this);
        let apiTransaction = new ApiTransactionTracker(ApplicationInfo);

        let rstheaderList:headerList[] = await apiTransaction.LoadAll(headerList,"formID eq 'formid2'");
        
        for (let index = 0; index < rstheaderList.length; index++) {
            
            let target = rstheaderList[index]
            
            target.Title ="test" + (index +1).toString();
            target.formID ="formid" +index.toString();
            target.status ="requested";        
            target.rqDate = new Date();        
            apiTransaction.CommandForUpdate(target);
        }

        for (let index = 0; index < 3; index++) {
            
            let header2 = new headerList();
            header2.Title ="test" + (index +1).toString();
            header2.formID ="formid" + index.toString();
            header2.status ="requested";        
            header2.rqDate = new Date();        
            apiTransaction.CommandForAdd(header2);
        }

       let result = await apiTransaction.ExecutePartialCommand();

        if ( result == false){

            return;

        }
        

        for (let index = 0; index < rstheaderList.length; index++) {
            
            let target = rstheaderList[index]
            
            target.Title ="test" + (index +1).toString();
            target.formID ="formid" +index.toString();
            target.status ="update1";        
            target.rqDate = new Date();        
            apiTransaction.CommandForUpdate(target);
        }

        result = await apiTransaction.ExecutePartialCommand();

        
        if ( result == false){

            return;

        }


        for (let index = 0; index < 3; index++) {
            
            let header2 = new headerList();
            header2.Title ="test" + (index +1).toString();
            header2.formID ="formid" + index.toString();
            header2.status ="requested2222";        
            header2.rqDate = new Date();        
            apiTransaction.CommandForAdd(header2);
        }

        apiTransaction.ExecuteCommand()

    }


    public render(){
        
        console.log("Main render");
        console.log(this.state);             

        return(            
          <div className="ag-theme-balham">
              test
              <button onClick={
                this.testTransactionApi
              }> Test api </button>

              <button onClick={
                this.testTransactionApi2
              }> update api </button>

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
                {Math.round(this.state.progress * 100) }% completed
              <ProgressIndicator label="" description="" percentComplete={this.state.progress} />
            </div>
             </Dialog>

        </div>
        );
    }




}

export default withRouter(TransactionTest);
