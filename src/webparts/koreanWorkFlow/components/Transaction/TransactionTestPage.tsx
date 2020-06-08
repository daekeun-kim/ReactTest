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
import ModuleLoader from '@microsoft/sp-module-loader';
import * as jQuery from 'jquery';
import { PartList } from './PartList';
import { stockHeader } from './stockheaderlist';
require('jqueryui');
require('jqgride');
require('jqGrid');

let $:any = jQuery;

// Details form display the detail information of request. 
export class TransactionTestPage extends React.Component<any,any> implements ITransactionProgressIndicator{

    constructor(props){
        super(props);

        this.state = {
            isProcessing:false,
            progress:0,
            date:"",
            taskName:"",
            startDate:"",
            endDate:""

        }
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });      
    };

    async componentDidMount(){

            
/*             jQuery(document).ready(function() { 
                $("#list2").jqGrid({
                            url:'server.php?q=2',
                         datatype: "json",
                            colNames:['Inv No','Date', 'Client', 'Amount','Tax','Total','Notes'],
                            colModel:[
                                {name:'id',index:'id', width:55},
                                {name:'invdate',index:'invdate', width:90},
                                {name:'name',index:'name asc, invdate', width:100},
                                {name:'amount',index:'amount', width:80, align:"right"},
                                {name:'tax',index:'tax', width:80, align:"right"},		
                                {name:'total',index:'total', width:80,align:"right"},		
                                {name:'note',index:'note', width:150, sortable:false}		
                            ],
                            rowNum:10,
                            rowList:[10,20,30],
                            pager: '#pager2',
                            sortname: 'id',
                         viewrecords: true,
                         sortorder: "desc",
                         caption:"JSON Example"
                     }) as any;
                     
                     $("#list2").jqGrid('navGrid','#pager2',{edit:false,add:false,del:false}) as any;
                    }); 
             */



  /*       $(".test").click(function() {
            alert("test");
        });

        $(".test").hide(); */

/* 
        ModuleLoader.loadScript('https://code.jquery.com/jquery-1.12.4.min.js',
            'jQuery'
        ).then(($: any) => {
            this.jQuery = $;
            ModuleLoader.loadScript('http://trirand.com/blog/jqgrid/js/jquery-ui-custom.min.js',
                'jQuery'
            ).then(() => {
                // after all JS files are successfully loaded
                // ...
            

            });
        });
 */

            
 
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


    rollBackTransaction =async (e) =>{


        let tsInfo = new TransactionInfo("");
        tsInfo.setProgressIndicator(this);  // if you want to have progress on transaciton
        let apiTransaction = new ApiTransactionTracker(tsInfo);
        tsInfo._transationName ="Approve";
        tsInfo.setFormID("test");

        debugger;
        let rstheaderList:headerList[] = await apiTransaction.LoadAll(headerList,"Title eq 'HeaderTitle'");
    
        for (let index = 0; index < rstheaderList.length; index++) {
            
            let element = rstheaderList[index];
            element.Choice1.push("Test2");
            apiTransaction.CommandForUpdate(element);
        }

        await apiTransaction.ExecutePartialCommand("Rollback test- 1"); 

        for (let index = 0; index < rstheaderList.length; index++) {
            
            let element = rstheaderList[index];
            apiTransaction.CommandForDelete(element);
        }    
        
        
        let success = new headerList();
        success.Title ="test";
        success.YesOrNo = false;
        success.Number = 5
        success.formID = "test123";

        apiTransaction.CommandForAdd(success);

        let tempError = new headerList();
        tempError.Title ="test";
        tempError.YesOrNo = false;
        tempError.Number = "test" as any;


        apiTransaction.CommandForAdd(tempError);

        apiTransaction.ExecuteCommand("Rollback test - 2"); 
    }

    recover =async (e) =>{


        let tsInfo = new TransactionInfo("");
        tsInfo.setProgressIndicator(this);  // if you want to have progress on transaciton
        let apiTransaction = new ApiTransactionTracker(tsInfo);
        tsInfo._transationName ="Submit";
        tsInfo.setFormID("AdjustWareHouse");

        console.log("updated wh info");
        let rstheaderList:PartList[] = await apiTransaction.LoadAll(PartList,`Requested_x0020_Date ge '${this.state.startDate}' 
        and Requested_x0020_Date le '${this.state.endDate}' 
        and Status eq 'InProgress'`);

        let targetData = [];

        for (let index = 0; index < rstheaderList.length; index++) {
            const element = rstheaderList[index];

            let rststockheaderList:stockHeader[] = await apiTransaction.LoadAll(stockHeader,`Title eq '${element.Title}'`);

            if (rststockheaderList.length > 0){

                if ( rststockheaderList[0].Request_x0020_Status === "Completed"){
                    element.Status = "Completed";
                    element.Assigned_x0020_Approvers = [];
                    element.WH_x0020_Approved_x0020_Date = rststockheaderList[0].WarehouseUpdated;

                    apiTransaction.CommandForUpdate(element);
                    targetData.push(element)
                    console.log(element.Title);
                }
            }
            
        }
    
        await apiTransaction.ExecuteCommand("Update parts"); 
        
        console.log("updated wh info");
        for (let index = 0; index < targetData.length; index++) {
            const element = targetData[index];
            console.log(element.Title)
            
        }
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

<button onClick={
                this.rollBackTransaction
              }> Rollback test </button>

<br></br>
<br></br>

<button onClick={
                this.recover
              }> adjust ware house data </button>

<br></br>
<br></br>

<button className={'test'} > Rollback test </button>

<br></br>
<br></br>

<input 
                            name="startDate" value={this.state.startDate}
                           type="text"
                            onChange={this.handleChange} />   
                                    <input 
                            name="endDate" value={this.state.endDate}
                           type="text"
                            onChange={this.handleChange} />   

<table id="list2"></table>
<div id="pager2"></div>

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
