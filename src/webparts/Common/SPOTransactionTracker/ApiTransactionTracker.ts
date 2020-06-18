import ISPTransactionCommand from "./ISPTransactionCommand"
import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult } from "sp-pnp-js";
import { Person } from "../SPOType/Person";
import ISPTransactionTrackerHeader from "./ISPTransactionTrackerHeader";
import { Guid } from "@microsoft/sp-core-library";

export class ApiTransactionTracker {


    private _transactionID:string;
    private _commandQueue:ApiCommand[]
    private _transactionCount:number;

    private _spTrackerTacker:ISPTransactionTrackerHeader;
    private _completedCommand:number;

    private _totalSpoWebserviceCount:number;
    private _completedSpoWebserviceCount:number;
    private _partialExecuteCount :number;
    private _isOpen:boolean
    private _currentTaskName:string;
    private _checkTransactionMessage:string;


    constructor(spTransactionTracker:ISPTransactionTrackerHeader){

        this._isOpen = false;
        this._commandQueue = [] as ApiCommand[];        
        this._transactionCount = 0;
        this._spTrackerTacker = spTransactionTracker;        
        this._completedCommand = 0;
        this._totalSpoWebserviceCount = 0;
        this._completedSpoWebserviceCount = 0;
        this._transactionID = spTransactionTracker.getTrackerHeaderId();        
        this._partialExecuteCount = 0;
        this._currentTaskName = "";
        this._checkTransactionMessage = spTransactionTracker.checkifOtherTransactionMessage()
    }

    private async OpenConnection(){
        
        let createHeader;
        let transactionDetailCount =0
        
        let apiList = []

        if (this._isOpen === false){

            this._spTrackerTacker.handleWhenStartTransaction(this._totalSpoWebserviceCount,this._checkTransactionMessage);
            let result = await this._spTrackerTacker.checkifOtherTransactionWorking();

            if (result == false){
                return false;
            }

            createHeader = this._spTrackerTacker.createTrackerHeader(this._currentTaskName);
            apiList.push(
                new Promise(function(resolve,reject){
                    createHeader.then(res=>{
                        console.log(`createTrackerHeader`)
                        resolve(res)
                    })                 
                })
            );
            
        }


        for (let index = 0; index < this._commandQueue.length; index++) {
            
            const element = this._commandQueue[index];   

            if (element.isDetailCreated() === true){
                transactionDetailCount++;
                continue;
            }
            element.setDetailCreated();            
            
            let tempPromise;
            tempPromise = this._spTrackerTacker.createTrackerDetails(element,this._currentTaskName);

            apiList.push(
                new Promise(function(resolve,reject){
                    tempPromise.then(res=>{
                        console.log(`createTrackerDetails`)
                        resolve(res)
                    })                 
                })
            );
        }

        

        return await Promise.all(apiList).then(res =>{
            console.log("connection success");
            let result = true;
            let startindex = transactionDetailCount;
            
            for (let index = 0; index < res.length; index++) {

                const element:ItemAddResult = res[index];
                if (element != null && element.data != null&& element.data.Id){
                    if ( index === 0){
                        if (this._isOpen === false){
                            this._spTrackerTacker.setTrackerHeaderListItemId(element.data.Id);
                        }else{
                            this._commandQueue[index+startindex].setTrackerDetailId(element.data.Id);
                        }                        
                    }
                    else{

                        if (this._isOpen === false){
                            this._commandQueue[index-1].setTrackerDetailId(element.data.Id);
                        }else{
                            this._commandQueue[index+startindex].setTrackerDetailId(element.data.Id);
                        }
                    }
                }
                else{
                    result = false;
                }                

            }         

            this._isOpen = true;
            return result;
        }); 

    }
    private async closeConnecion(res:any){

        let apiList = [];
        let transactionResult = true;       
        let completedHedaerUpdate = false; 

        for (let index = 0; index < this._commandQueue.length; index++) {

            if (this._commandQueue[index].getTargetObj().getResult() === false){
                transactionResult = false;
                this._spTrackerTacker.handleWhenFailedTransation(this._totalSpoWebserviceCount,this._currentTaskName);
                break;
            }
        }

        console.log("start udpdate header")
        completedHedaerUpdate = await this._spTrackerTacker.updateTrackerHeader(transactionResult,this._currentTaskName);
        this._completedSpoWebserviceCount++
        this._spTrackerTacker.handleWhenCompletedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,this._currentTaskName);

        console.log("completed udpdate header")
        
        for (let index = 0; index < this._commandQueue.length; index++) {
            
            const element = this._commandQueue[index];
            let result = element.getTargetObj().getResult();
            
            let tempPromise;
            tempPromise = this._spTrackerTacker.updateTrackerDetails(result,element,this._currentTaskName);
            apiList.push(
                new Promise(function(resolve,reject){
                    tempPromise.then(res=>{
                        console.log(`updateTrackerDetails`)
                        resolve(res)
                    })                 
                })
            );

        }

        Promise.all(apiList).then(res =>{     
            console.log("complete detail updaste");
            return res;
        });  

        console.log("return  - completed header");
        console.log(completedHedaerUpdate);

        this._spTrackerTacker.handleWhenCompletedTransation(this._transactionCount,this._currentTaskName);
        return completedHedaerUpdate;

    }

    public CommandForAdd(target:ISPTransactionCommand,targetObj?:any){

        let tempTargetObj

        if ( targetObj != null){
            tempTargetObj = targetObj;
        }
        else{

            tempTargetObj = target.getTargetObjForAdd()
        }

        target.setRedoValue(tempTargetObj);

        let targetApi = new ApiCommand(target,"add",tempTargetObj);        
        targetApi.setSeq(this._transactionCount);
        this._commandQueue.push(targetApi);
        this._transactionCount++;
    }

    public CommandForDelete(target:ISPTransactionCommand){

        let targetApi = new ApiCommand(target,"delete",null);
        targetApi.setSeq(this._transactionCount);
        this._commandQueue.push(targetApi);
        this._transactionCount++;

    }
    
    public CommandForUpdate(target:ISPTransactionCommand,targetObj?:any){
        
        let tempTargetObj;

        if ( targetObj != null){
            tempTargetObj = targetObj;
        }
        else{

            tempTargetObj = target.getTargetObjForUpdate()
        }

        target.setRedoValue(tempTargetObj);

        let targetApi = new ApiCommand(target,"update",tempTargetObj);    
        targetApi.setSeq(this._transactionCount);    
        this._commandQueue.push(targetApi);
        this._transactionCount++;

    }
    
    public async ExecuteCommand(taskName?:string){

        this._currentTaskName = taskName != null ? taskName:"";

        let totalTransactionCount = this._transactionCount;
        this._totalSpoWebserviceCount = this._isOpen === false ?( this._transactionCount * 2 ) + 2 : ( this._transactionCount * 2 ) + 1 // isOpen is true then it has header created and update else if isopen is false then it has only header update
        this._completedSpoWebserviceCount = this._transactionCount + 1; // start from count of detail web services. completed for detail
        
        this._spTrackerTacker.setTotalSpoWebServiceCount(this._totalSpoWebserviceCount);

        if ( this._isOpen === false){
            this._spTrackerTacker.handleWhenStartTransaction(this._totalSpoWebserviceCount,taskName);
        }        

        let connectionResult = await this.OpenConnection();

        if (connectionResult === false){
            this._spTrackerTacker.handleWhenFailedTransation(this._totalSpoWebserviceCount,taskName);
            return false;
        }

        let commandList = [];

        console.log("excuteCommand - start");

        for (let index = 0; index < this._commandQueue.length; index++) {
            
            const element = this._commandQueue[index];
            if (element.isProcessed() === true){
                continue;
            }
            element.setProcessed();
            let commandType = element.getCommandType();
            let targetObj = element.getTargetObj();
            let _targetValue = element.getTargetValue();
            let tempPromise;
            
            if ( commandType === "add"){

                tempPromise = this.add(targetObj,_targetValue,taskName);
                commandList.push(
                    new Promise(function(resolve,reject){
                        tempPromise.then(res=>{
                            console.log(`add api command - add`)
                            resolve(res)
                        })                 
                    })
                );
            }
            else if ( commandType === "update"){

                tempPromise = this.update(targetObj,_targetValue,taskName); 
                commandList.push(
                    new Promise(function(resolve,reject){
                        tempPromise.then(res=>{                            
                            console.log(`add api command - update`)
                            resolve(res)
                        })                 
                    })
                );

            }
            else if( commandType === "delete"){
                tempPromise = this.delete(targetObj,taskName);
                commandList.push(
                    new Promise(function(resolve,reject){
                        tempPromise.then(res=>{
                            console.log(`add api command - delete`)
                            resolve(res)
                        })                 
                    })
                );
            }
        }


        return await Promise.all(commandList).then(async res =>{

            console.log("excuteCommand - end");
            console.log("closeConnection - start");
            return await this.closeConnecion(res);
        });  

    }


    public async ExecutePartialCommand(taskName?:string){

        this._currentTaskName = taskName != null ? taskName:"";

        this._partialExecuteCount++;
        let totalTransactionCount = this._transactionCount;
        this._totalSpoWebserviceCount = (this._transactionCount * 2 ) + 2;
        this._completedSpoWebserviceCount = this._transactionCount + 1; // start from count of detail web services
        
        this._spTrackerTacker.setTotalSpoWebServiceCount(this._totalSpoWebserviceCount);

        if ( this._isOpen === false){
            this._spTrackerTacker.handleWhenStartTransaction(this._totalSpoWebserviceCount,taskName);
        }        

        let connectionResult = await this.OpenConnection();

        if (connectionResult === false){
            this._spTrackerTacker.handleWhenFailedTransation(this._totalSpoWebserviceCount,taskName);
            return false;
        }

        let commandList = [];

        console.log("excuteCommand - start");

        for (let index = 0; index < this._commandQueue.length; index++) {

            const element = this._commandQueue[index];
            if (element.isProcessed() === true){
                continue;
            }
            element.setProcessed();
            let commandType = element.getCommandType();
            let targetObj = element.getTargetObj();
            let _targetValue = element.getTargetValue();
            let tempPromise;
            
            if ( commandType === "add"){

                tempPromise = this.add(targetObj,_targetValue,taskName);
                commandList.push(
                    new Promise(function(resolve,reject){
                        tempPromise.then(res=>{
                            console.log(`add api command - add`)
                            resolve(res)
                        })                 
                    })
                );
            }
            else if ( commandType === "update"){

                tempPromise = this.update(targetObj,_targetValue,taskName); 
                commandList.push(
                    new Promise(function(resolve,reject){
                        tempPromise.then(res=>{                            
                            console.log(`add api command - update`)
                            resolve(res)
                        })                 
                    })
                );

            }
            else if( commandType === "delete"){
                tempPromise = this.delete(targetObj,taskName);
                commandList.push(
                    new Promise(function(resolve,reject){
                        tempPromise.then(res=>{
                            console.log(`add api command - delete`)
                            resolve(res)
                        })                 
                    })
                );
            }
        }


        return await Promise.all(commandList).then(async res =>{

            console.log("excutePartialCommand - end");           

            let transactionResult = true;   

            for (let index = 0; index < this._commandQueue.length; index++) {

                if (this._commandQueue[index].getTargetObj().getResult() === false){
                    transactionResult = false;
                    this._spTrackerTacker.handleWhenFailedTransation(this._totalSpoWebserviceCount,taskName);
                    break;
                }
            }
            
            for (let index = 0; index < this._commandQueue.length; index++) {
            
                const element = this._commandQueue[index];
                let result = element.getTargetObj().getResult();

                if ( result === false){
                    this._spTrackerTacker.updateTrackerDetails(result,element,this._currentTaskName);
                }
            }

            if ( transactionResult === false){
                await this._spTrackerTacker.updateTrackerHeader(transactionResult);
            }

            return transactionResult;
        });  

    }


    private async add(target:ISPTransactionCommand,targetObj:any,taskName?:string):Promise<any>{

        let result:boolean =  target.beforeAdd();
        let ListName:string =  target.getListName();    

        //target.targetObjforAdd = targetObj;
        console.log(`add Command start : ${this._completedCommand}`);

        if ( result === true){

             return pnp.sp.web.lists.getByTitle(ListName).items.add(targetObj)
            .then(async (result)=>{                 
                 target.afterAdd(result);
                 this._completedCommand++
                 this._completedSpoWebserviceCount++
                 this._spTrackerTacker.handleWhenCompletedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,taskName);
                 console.log(`add Command completed : ${this._completedCommand}`);
                 return result;
            })
            .catch(async error=>{ 
                 target.errorWhenAdd(error);      
                 this._spTrackerTacker.handleWhenFailedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,taskName);
                 return error;             
            }); 
        }
    }

    private async update(target:ISPTransactionCommand,targetObj:any,taskName?:string):Promise<any>{

        let result:boolean = target.beforeUpdate();
        let ListName:string =  target.getListName();
        let tgId:number =  target.getId(); 

        //target.targetObjforUpdate = targetObj;
        console.log(`update Command start : ${this._completedCommand}`);

        if ( result === true){

            return pnp.sp.web.lists.getByTitle(ListName).items.getById(tgId).update(targetObj)
            .then(async result=>{
                target.afterUpdate(result);
                this._completedCommand++
                this._completedSpoWebserviceCount++
                this._spTrackerTacker.handleWhenCompletedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,taskName);
                console.log(`update Command completed : ${this._completedCommand}`);
                return result;
            })
            .catch(async error=>{ 
                 target.errorWhenUpdate(error);       
                 this._spTrackerTacker.handleWhenFailedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,taskName);            
                 return error;
            }); 
        }
    }

    private async delete(target:ISPTransactionCommand,taskName?:string):Promise<any>{

        let result:boolean =  target.beforeDelete();
        let ListName:string =  target.getListName();
        let tgId:number =  target.getId(); 

        console.log(`delete Command start : ${this._completedCommand}`);

        if ( result === true){

             return pnp.sp.web.lists.getByTitle(ListName).items.getById(tgId).delete()
            .then(async result=>{
               target.afterDelete(result);
               this._completedCommand++      
               this._completedSpoWebserviceCount++ 
               this._spTrackerTacker.handleWhenCompletedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,taskName);      
               console.log(`delete Command completed : ${this._completedCommand}`);
               return result;
            })
            .catch(async error=>{ 
                target.errorWhenDelete(error);    
                this._spTrackerTacker.handleWhenFailedCommand(this._completedSpoWebserviceCount,this._totalSpoWebserviceCount,taskName);
                return error;               
            }); 
        }
    }

    public async LoadAll<T extends ISPTransactionCommand>(T:{new():T;},filterStmt?:string):Promise<T[]>{

        let target = new T();

        try{          

            target.beforeLoad();            

            let returnedItems = []
            let results = [] as T[];
            const getData:any = await target.LoadQuery(filterStmt).then(page => {
                if(page) {
                    if(page.results){                        
                        // data was returned, so concat the results                    
                        returnedItems = returnedItems.concat(page.results);
                    }else{
                        returnedItems = returnedItems.concat(page);
                    }      
                    return page;    
                } else {
                    return returnedItems;
                }
            });
    
            if(getData.nextUrl) {
                returnedItems = returnedItems.concat(await this.pageData(getData,target));
            } else {            
                
            }    
            
            for (let index = 0; index < returnedItems.length; index++) {
                const element = returnedItems[index];
                let tempObj = new T();
                for (var props in tempObj) {              
                    
                    if (element[props] != null){
                        tempObj[props] = element[props];
                    }
                }
                await tempObj.onCompletedLoad();
                results.push(tempObj);                    
            }
            target.afterLoad(results);                
            return results;

        } catch (e){
            console.log('error - ', e);
            target.errorWhenLoad(e);      
            throw e;
        }
    }

    public async LoadCustomAll<T extends ISPTransactionCommand>(T:{new():T;},filterStmt?:string):Promise<T[]>{

        let target = new T();

        try{          

            target.beforeLoad();            

            let returnedItems = []
            let results = [] as T[];
            const getData:any = await target.customQuery(filterStmt).then(page => {
                if(page) {
                    if(page.results){                        
                        // data was returned, so concat the results                    
                        returnedItems = returnedItems.concat(page.results);
                    }else{
                        returnedItems = returnedItems.concat(page);
                    }      
                    return page;    
                } else {
                    return returnedItems;
                }
            });
    
            if(getData.nextUrl) {
                returnedItems =  returnedItems.concat(await this.pageData(getData,target));
            } else {            


            }    

            for (let index = 0; index < returnedItems.length; index++) {
                const element = returnedItems[index];
                let tempObj = new T();
                for (var props in tempObj) {              
                    
                    if (element[props] != null){
                        tempObj[props] = element[props];
                    }
                }
                await tempObj.onCompletedLoad();
                results.push(tempObj);                    
            }
            target.afterLoad(results);                
            return results;

        } catch (e){
            console.log('error - ', e);
            target.errorWhenLoad(e);      
            throw e;
        }
    }

    
    pageData =  async (data:any,target:ISPTransactionCommand) => {
        try{
            let returnedItems = [];    
            const getPage = await data.getNext().then(page => {
                if(page) {
                    // data was returned so concat the results
                    returnedItems = returnedItems.concat(page.results);
                    return page;
                } else {
                    return;
                }
            });     
            if(getPage.nextUrl) {
                // still have more pages, so go get more
                return returnedItems.concat(await this.pageData(getPage,target));
            } else { 
                // we've reached the last page
                return returnedItems; 
            }
        } catch (e){

            target.errorWhenLoad(e);
            return {
                body: e.data.responseBody ? e.data.responseBody['odata.error'].message.value : e,
                status: e.status,
                statusText: e.statusText
            }
        }
    }

    
}

export class ApiCommand{

    private _targetObj:ISPTransactionCommand;
    private _CommandType:string
    private _targetValue:any;
    private _CommmandID:string
    private _TrackerDetailId:number;
    private _Seq:number
    private _isProcessed:boolean;
    private _isDetailCreated:boolean;

    constructor(itargetObj:ISPTransactionCommand,iCommandType:string,iTargeValue:any){
        this._targetObj = itargetObj;
        this._CommandType = iCommandType;
        this._targetValue = iTargeValue;
        this._CommmandID =  Guid.newGuid().toString();
        this._TrackerDetailId= null;
        this._Seq = null;
        this._isProcessed = false;
        this._isDetailCreated = false;
    }

    public getTargetObj(){

        return this._targetObj;
    }

    public getCommandId(){
        return this._CommmandID;
    }

    public getCommandType(){
        return this._CommandType;
    }

    public getTargetValue(){
        return this._targetValue;
    }

    public setTrackerDetailId(Id:number){
        this._TrackerDetailId = Id;
    }

    public getTrackerDetailId(){
        return this._TrackerDetailId;
    }

    public getSeq(){
        return this._Seq;
    }

    public setSeq(iSeq:number){
        this._Seq = iSeq;
    }

    public getUndoType(){

        if ( this._CommandType === "add"){
            return "delete"
        }
        else if (this._CommandType === "delete"){
            return "add"
        }
        else if (this._CommandType === "update"){
            return "update"
        }
    }

    public getRedoType(){

        return this._CommandType;

    }

    public setProcessed(){
        this._isProcessed = true;
    }

    public isProcessed(){
        return this._isProcessed;
    }

    public setDetailCreated(){
        this._isDetailCreated = true;
    }

    public isDetailCreated(){
        return this._isDetailCreated;
    }


}
