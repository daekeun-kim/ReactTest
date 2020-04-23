import * as React from 'react';
import {
    Redirect,
    withRouter
  } from 'react-router-dom'
import { ApiTransactionTracker } from '../../../Common/SPOTransactionTracker/ApiTransactionTracker';
import { StockAdjRequestsTasks } from './StockAdjRequestsTasks';
import { headerList } from './headerList';
import { Person } from "../../../Common/SPOType/Person";
import { MirinaeTest } from './MirinaeTest';
import { AbsISPTRansactionTracker } from '../../../Common/SPOTransactionTracker/AbsISPTransactionTracker';
import ITransactionProgressIndicator from '../../../Common/SPOTransactionTracker/ITransactionProgressIndicator';
import { ProgressIndicator, Spinner, Dialog, SpinnerSize } from 'office-ui-fabric-react';
import { detailList } from './detailList';
import { PartList } from './PartList';
import { TaskList } from './TaskList';
import { uniqBy } from '@microsoft/sp-lodash-subset';
import { PnPClientStorage } from 'sp-pnp-js';
import pnp  from "sp-pnp-js";



// Details form display the detail information of request. 
export class TransactionTest extends React.Component<any,any> implements ITransactionProgressIndicator{

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
       
    }

    
    testTransactionApi3 =async (e) =>{

        let ApplicationInfo = new MirinaeTest("");
        ApplicationInfo.setProgressIndicator(this);
        let apiTransaction = new ApiTransactionTracker(ApplicationInfo);
        
        const {date} = this.state

/*         let resultPart = await apiTransaction.LoadAll(PartList, "Modified ge datetime'2020-04-02T04:50:00.942Z'")
        let resultTask = await apiTransaction.LoadAll(TaskList, "Created ge datetime'2020-04-02T04:50:00.942Z'"); */

        let resultPart = await apiTransaction.LoadAll(PartList, `Modified ge datetime'${this.state.date}'`)
        let resultTask = await apiTransaction.LoadAll(TaskList, `Created ge datetime'${this.state.date}'`);


        let targetValuePart = uniqBy(resultPart, p=> [p.Title,p.Part_x0020_No,p.DR_x0020_QTY].join());
        let targetValueTask = uniqBy(resultTask, p=> [p.Title,p.Phase,p.Step,p.Assigned_x0020_To.Title].join());

        debugger;

        for (let index = 0; index < targetValuePart.length; index++) {
            const element = targetValuePart[index];

            if (  resultPart.filter(p=>p.Title === element.Title 
                && p.Part_x0020_No === element.Part_x0020_No
                && p.DR_x0020_QTY === element.DR_x0020_QTY
                && p.Title === element.Title
                ).length > 1){

                    ///console.log(element.Title+ " Part")
                   // console.log(element.Title);

                    //pnp.sp.web.lists.getByTitle("StockAdjRequestsParts").items.getById(element.getId()).recycle()
                }


            
        }
        for (let index = 0; index < targetValueTask.length; index++) {
            const element2 = targetValueTask[index];

            if (  resultTask.filter(p=>p.FormID === element2.FormID 
                && p.Phase === element2.Phase
                && p.Step === element2.Step
                && p.Assigned_x0020_To.Title === element2.Assigned_x0020_To.Title
             ).length > 1){

                    //pnp.sp.web.lists.getByTitle("StockAdjRequestsTasks").items.getById(element2.getId()).recycle()

                    //console.log(element2.Title+ " task")
                    console.log(element2.FormID);
                }            
        }

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



        let result = await apiTransaction.ExecutePartialCommand("SubTask");


        if ( result === true){

            
            for (let index = 0; index < 5; index++) {
                
                let header2 = new headerList();
                header2.Title ="mirinaeTest2" + (index +1).toString();
                header2.formID ="formid" + new Date().toISOString();
                header2.status ="requested";        
                header2.rqDate = new Date();        
                apiTransaction.CommandForAdd(header2);
            }

            apiTransaction.ExecuteCommand("LastTask");  

        }

    }


    testTransactionApi5 =async (e) =>{

        let ApplicationInfo = new MirinaeTest("");
        ApplicationInfo.setProgressIndicator(this);
        let apiTransaction = new ApiTransactionTracker(ApplicationInfo);

        let rstheaderList:headerList[] = await apiTransaction.LoadAll(headerList,"headerID eq 'dsd'");
        //let rstheaderList:headerList[] = await apiTransaction.LoadAll(headerList,"Title eq 'mirinaeTest25'");

        rstheaderList[0].status ="Approved";
        rstheaderList[0].Choice1 = ["Test1","Test3"];
//        rstheaderList[0].group = [];
  //      rstheaderList[0].lookup1 = null;
        rstheaderList[0].requestor = null;
        rstheaderList[0].YesOrNo = true;




        apiTransaction.CommandForDelete(rstheaderList[0]);
        apiTransaction.ExecuteCommand();
        

        console.log(rstheaderList);


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

        
        let detail = new detailList();
        detail.Title ="Error";
 
        apiTransaction.CommandForAdd(detail);


        result = await apiTransaction.ExecutePartialCommand();

        console.log("ExecutePartialCommand  ");
        console.log(result);
        //error
        debugger;

        
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
                this.testTransactionApi5
              }> TEst with header list </button>


              <button onClick={
                this.testTransactionApi
              }> Test api </button>

              <button onClick={
                this.testTransactionApi2
              }> update api </button>


            <button onClick={
                    this.testTransactionApi3
              }> TEST </button>
yrd
            <input 
                            name="date" value={this.state.date}
                           type="text"
                            onChange={this.handleChange} />   


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

export default withRouter(TransactionTest);
