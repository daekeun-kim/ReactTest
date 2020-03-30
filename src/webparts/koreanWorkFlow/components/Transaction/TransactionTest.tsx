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

    testTransactionApi =(e) =>{

        let ApplicationInfo = new MirinaeTest("");
        ApplicationInfo.setProgressIndicator(this);
        let apiTransaction = new ApiTransactionTracker(ApplicationInfo);
        
/*         let header = new headerList();
        header.Title ="test";
        header.formID ="formid01";
        header.status ="requested";
        header.rqDate = new Date()
        header.requestor = new Person();
        header.requestor.Id = 7;
        
        apiTransaction.CommandForAdd(header);

        let header2 = new headerList();
        header2.Title ="test2";
        header2.formID ="formid02";
        header2.status ="requested";        
        header2.rqDate = new Date();        
        apiTransaction.CommandForAdd(header2); */


        for (let index = 0; index < 10; index++) {
            
            let header2 = new headerList();
            header2.Title ="test" + (index +1).toString();
            header2.formID ="formid" + new Date().toISOString();
            header2.status ="requested";        
            header2.rqDate = new Date();        
            apiTransaction.CommandForAdd(header2);
        }

        apiTransaction.ExecuteCommand().then(res=>{

            console.log("transaciton end")
        }); 

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
