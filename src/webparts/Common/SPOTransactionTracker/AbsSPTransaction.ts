import ISPTransactionCommand from "./ISPTransactionCommand";
import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult, sp } from "sp-pnp-js";
import { Person } from "../SPOType/Person";
import { LookUp } from "../SPOType/LookUp";
import { Guid } from "@microsoft/sp-core-library";

export abstract class AbsSPTransaction implements ISPTransactionCommand {

    protected Id:number;
    public Title:string
    public Author:Person;

    protected _isPagedLoad:boolean;
    protected _PagedCount:number;

    protected _UnDoValues:string
    protected _ReDoValues:string
    protected _Result:boolean;
    protected _ErrorMessage:string

    constructor(){
        this.Id = null;
        this.Title = "";
        this.Author = new Person();
        this._isPagedLoad = false;
        this._PagedCount = 100;      
        this._Result = true;      
        this._ErrorMessage = "";
    }    


    abstract getPrimaryMemeberFields(): string[]
    abstract getCalculatedMemeberFields(): string[]
    abstract getMultiChoiceMemeberFields(): string[]
    abstract getLookupMemeberFields(): string[];
    abstract getMultiLookupMemeberFields(): string[]    
    abstract getGroupMemeberFields(): string[];
    abstract getDateMemeberFields():string[];
    abstract getPersonMemeberFields():string[];
    abstract getVirtualMemeberFields():string[];
    abstract getListName():string;

    public setId(Id:number){
        this.Id = Id;        
    }

    public setTitle(iTitle:string){
        this.Title = iTitle
    }

    public setPageCount(iCount:number){
        this._PagedCount = iCount;
    }

    public setPagedLoad(iflag:boolean){
        this._isPagedLoad = iflag;
    }

    public customQuery(iFilterString):Promise<any>{

        return;
    }

    getUndoValue(): string {
        return this._UnDoValues;
    }
    getRedoValue(): string {
        return this._ReDoValues;
    }

    getErrorMessage():string{
        return this._ErrorMessage;
    }


    getTargetSharepointSite(): string {

        return "https://klatencor.sharepoint.com/teams/dev_mirinae";      
        
    }

    getResult(): boolean {    
        return this._Result;
    }

    

    protected getOutofTargetMemberFields():string[]{

        let rst =["_ErrorMessage","_UnDoValues","_ReDoValues","_isPagedLoad","_PagedCount","_Result","Id","Author"];
        return rst;
    }

    protected getTargetObjForFlow(obj):string{

        let listName = this.getListItemEntityTypeFullName();
        let objMeta = {
            type: `SP.Data.${listName}ListItem`
        }

        let tempObj ={
            __metadata : objMeta,
            ...obj
        }

        return JSON.stringify(tempObj);        
    }


    protected getTargetSPOValue(){

        let memberValInDate = this.getDateMemeberFields();
        let memberValInPerson = this.getPersonMemeberFields();
        let memberValInGroup = this.getGroupMemeberFields();
        let memeberValInVitual  = this.getVirtualMemeberFields();
        let memeberValInCaculated  = this.getCalculatedMemeberFields();

        let memeberValMulitiLookup  = this.getMultiLookupMemeberFields();
        let memeberValLookupMemeber  = this.getLookupMemeberFields();

        let memeberValMultiChoice  = this.getMultiChoiceMemeberFields();
        let OutofTargetMemberFields  = this.getOutofTargetMemberFields();

        let rstObj = {};

        for (var props in this) {

            let targetValue = this[props] as any;
            let targetobj = {};

            if ( typeof targetValue == "function"){
                continue;
            }

            if (memeberValInVitual.filter(p=>p === props.toString()).length > 0){
                continue;
            }

            if (memeberValInCaculated.filter(p=>p === props.toString()).length > 0){
                continue;
            }
            
            if (OutofTargetMemberFields.filter(p=>p === props.toString()).length > 0){
                continue;
            }

            if (memberValInPerson.filter(p=>p === props.toString()).length > 0){
                
                let tempJson = "";
                if (targetValue == null){
                    tempJson = `{"${props.toString()}Id":null}`
                }
                else if (targetValue.Id == null){
                    tempJson = `{"${props.toString()}Id":null}`
                }
                else{
                    tempJson = `{"${props.toString()}Id":"${targetValue.Id}"}`
                }
                
                targetobj = JSON.parse(tempJson);
                
            }
            else if (memberValInGroup.filter(p=>p === props.toString()).length > 0){

                let tempJson = "";
                if ( targetValue.length > 0){                    

                    for (let index = 0; index < targetValue.length; index++) {
                        const element = targetValue[index];

                        if (element == null){
                            
                        }else if (element.Id == null){
                            
                        }
                        else{
                            tempJson += `${element.Id},`
                        }                         
                    }

                    tempJson=tempJson.substring(0,tempJson.length-1);
                    tempJson = `{"${props.toString()}Id":{"results":[${tempJson}]}}`;
                    
                }else{
                    tempJson = `{"${props.toString()}Id":{"results":[]}}`;
                }    

                targetobj = JSON.parse(tempJson);
            } 
            else if (memeberValLookupMemeber.filter(p=>p === props.toString()).length > 0){
                
                let tempJson = "";

                
                if (targetValue == null){
                    tempJson = `{"${props.toString()}Id":null}`
                }
                else if (targetValue.Id == null){
                    tempJson = `{"${props.toString()}Id":null}`
                }
                else{
                    tempJson = `{"${props.toString()}Id":"${targetValue.Id}"}`
                }
                
                targetobj = JSON.parse(tempJson);
                
            }
            else if (memeberValMulitiLookup.filter(p=>p === props.toString()).length > 0){

                let tempJson = "";
                if ( targetValue.length > 0){                    

                    for (let index = 0; index < targetValue.length; index++) {
                        const element = targetValue[index];

                        if (element == null){
                            
                        }
                        else if (element.Id == null){
                            
                        }
                        else{
                            tempJson += `${element.Id},`
                        }                         
                    }

                    tempJson=tempJson.substring(0,tempJson.length-1);
                    tempJson = `{"${props.toString()}Id":{"results":[${tempJson}]}}`;
                    
                }else{
                    tempJson = `{"${props.toString()}Id":{"results":[]}}`;
                }
                targetobj = JSON.parse(tempJson);
            } 
            else if (memeberValMultiChoice.filter(p=>p === props.toString()).length > 0){

                let tempJson = "";
                if ( targetValue.length > 0){

                    for (let index = 0; index < targetValue.length; index++) {
                        const element = targetValue[index];    
                        tempJson += `"${element}",`
                                                 
                    }
                        tempJson=tempJson.substring(0,tempJson.length-1);
                        tempJson = `{"${props.toString()}":{"results":[${tempJson}]}}`;

                }else{

                    tempJson = `{"${props.toString()}":{"results":[]}}`;
                }        

                targetobj = JSON.parse(tempJson);
            } 
            else if (memberValInDate.filter(p=>p === props.toString()).length > 0){

                let tempJson = "";

                if ( targetValue == null){
                    tempJson = `{"${props.toString()}":null}`
                }
                else{
                    tempJson = `{"${props.toString()}":"${targetValue.toISOString()}"}`
                }               

                targetobj = JSON.parse(tempJson);
            }  
            else if (typeof targetValue == "boolean"){

                let tempJson = "";

                if ( targetValue == null){
                    tempJson = `{"${props.toString()}":null}`
                }
                else{
                    tempJson = `{"${props.toString()}":${targetValue}}`
                }
                console.log(tempJson);
                targetobj = JSON.parse(tempJson);

            }
            else if (typeof targetValue == "number"){

                let tempJson = "";

                if ( targetValue == null){
                    tempJson = `{"${props.toString()}":null}`
                }
                else{                              
                    tempJson = `{"${props.toString()}":"${targetValue}"}`;                                       
                }

                targetobj = JSON.parse(tempJson);
            
            }
            else{

                let tempJson = "";

                if ( targetValue == null){
                    tempJson = `{"${props.toString()}":null}`
                }
                else{

                    let tempTargetValue = JSON.stringify(targetValue);                    
                    tempJson = `{"${props.toString()}":${tempTargetValue}}`;                    
                   
                }
                console.log(tempJson);
                targetobj = JSON.parse(tempJson);
            }

            
            rstObj ={
                ...rstObj
                ,...targetobj
            }
        }


        return rstObj;
    }


    getFilterForPrimary():string{

        let memeberPrimaryMember  = this.getPrimaryMemeberFields();

        let memberValInDate = this.getDateMemeberFields();
        let memberValInPerson = this.getPersonMemeberFields();
        let memberValInGroup = this.getGroupMemeberFields();

        let memeberValMulitiLookup  = this.getMultiLookupMemeberFields();
        let memeberValLookupMemeber  = this.getLookupMemeberFields();
        let memeberValMultiChoice  = this.getMultiChoiceMemeberFields();

        let filterString = "";
        let result = true;

        for (let index = 0; index < memeberPrimaryMember.length; index++) {
            
            const element = memeberPrimaryMember[index];
            let targetValue = this[element] as any;

            if (memberValInPerson.filter(p=>p === element).length > 0){
                
                if (targetValue == null){
                    result = false;
                    break;                
                }
                else if (targetValue.Id == null){
                    result = false;
                    break;   
                }
                else{
                    filterString += ` ${element}Id eq ${targetValue.Id}  and `
                }                
                
            }
            else if (memberValInGroup.filter(p=>p === element).length > 0){

                let temp ="";

                if ( targetValue.length > 0){                    

                    for (let index = 0; index < targetValue.length; index++) {
                        const elementValue = targetValue[index];

                        if (elementValue == null){
                            
                            result = false;
                            break; 
                            
                        }
                        else if (elementValue.Id == null){
                            result = false;
                            break;   
                        }
                        else{
                            temp += ` ${element}Id eq ${elementValue.Id} or  `
                        }                         
                    }     
                    
                }

                if (temp.length > 5){
                    temp=temp.substring(0,temp.length-5)
                    filterString += "( " + temp + ")  and "
                }

            } 
            else if (memeberValLookupMemeber.filter(p=>p === element).length > 0){
                
                if (targetValue == null){
                    result = false;
                    break;   
                }
                else if (targetValue.Id == null){
                    result = false;
                    break;   
                }
                else{
                    filterString += ` ${element}Id eq ${targetValue.Id} and `
                }                
            }
            else if (memeberValMulitiLookup.filter(p=>p === element).length > 0){

                let temp ="";

                if ( targetValue.length > 0){                    

                    for (let index = 0; index < targetValue.length; index++) {
                        const elementValue = targetValue[index];

                        if (elementValue == null){
                            result = false;
                            break;   
                            
                        }
                        else if (elementValue.Id == null){
                            result = false;
                            break;   
                            
                        }
                        else{
                            temp += ` ${element}Id eq ${elementValue.Id}  or  `
                        }                         
                    }     
                    
                }

                if (temp.length > 5){
                    temp=temp.substring(0,temp.length-5)
                    filterString += "( " + temp + ")  and "
                }

            } 
            else if (memeberValMultiChoice.filter(p=>p === element).length > 0){

                let temp ="";
                
                if ( targetValue.length > 0){                    

                    for (let index = 0; index < targetValue.length; index++) {
                        const elementValue = targetValue[index];

                        if (elementValue == null){
                            result = false;
                            break;   
                            
                        }
                        else{
                            temp += ` ${element} eq '${encodeURIComponent(elementValue)}'  or  `
                        }                         
                    }     
                    
                }

                if (temp.length > 5){
                    temp=temp.substring(0,temp.length-5)
                    filterString += "( " + temp + ")  and "
                }

            } 
            else if (memberValInDate.filter(p=>p === element).length > 0){

                if ( targetValue == null){
                    result = false;
                    break;   

                }
                else{
                    filterString += ` ${element} eq '${targetValue.toISOString()}'  and `
                }               

            }  
            else if (typeof targetValue == "boolean"){

                if ( targetValue == null){

                    result = false;
                    break;   

                }
                else{
                    filterString += ` ${element} eq ${targetValue === true?1:0}  and `
                }

            }
            else if (typeof targetValue == "number"){

                if ( targetValue == null){

                    result = false;
                    break;   

                }
                else{          
                    filterString += ` ${element} eq ${targetValue}  and `                    
                                    
                }
            
            }
            else{

                if ( targetValue == null){

                    result = false;
                    break;   
                }
                else{
                    filterString += ` ${element} eq '${encodeURIComponent(targetValue)}'  and `             
                }
            }    
            
        }


        if (filterString.length > 5){
            filterString=filterString.substring(0,filterString.length-5)
        }

        if (result === false){
            return `Title eq '${Guid.newGuid().toString()}'`;
        }        

        return filterString;
    }


    protected getAllFields(){
        
        let memberValInPerson = this.getPersonMemeberFields();
        let memberValInGroup = this.getGroupMemeberFields();
        let memeberValInVitual  = this.getVirtualMemeberFields();
        let memeberValMulitiLookup  = this.getMultiLookupMemeberFields();
        let memeberValLookupMemeber  = this.getLookupMemeberFields();
        let OutofTargetMemberFields  = this.getOutofTargetMemberFields().filter(p=> p != "Author" && p != "Id");

        memberValInPerson.push("Author");

        let rstFields = [] as string[];

        for (var props in this) {         
            console.log("getAllFields");                        
            console.log( this[props]);
            console.log( props);

            if ( typeof this[props] == "function"){
                continue;
            }
            
            if (memeberValInVitual.filter(p=>p === props.toString()).length > 0){
                continue;
            }
            
            if (OutofTargetMemberFields.filter(p=>p === props.toString()).length > 0){
                continue;
            }

            if (memeberValMulitiLookup.filter(p=>p === props.toString()).length > 0){
                rstFields.push(`${props.toString()}/Id`);
                rstFields.push(`${props.toString()}/Title`);
            }


            if (memeberValLookupMemeber.filter(p=>p === props.toString()).length > 0){
                rstFields.push(`${props.toString()}/Id`);
                rstFields.push(`${props.toString()}/Title`);
            }

            if (memberValInPerson.filter(p=>p === props.toString()).length > 0){
                
                rstFields.push(`${props.toString()}/Id`);
                rstFields.push(`${props.toString()}/Title`);
                rstFields.push(`${props.toString()}/EMail`);
                rstFields.push(`${props.toString()}/Department`);
                rstFields.push(`${props.toString()}/Office`);
                rstFields.push(`${props.toString()}/WorkPhone`);
                
            }  
            if (memberValInGroup.filter(p=>p === props.toString()).length > 0){
                
                rstFields.push(`${props.toString()}/Id`);
                rstFields.push(`${props.toString()}/Title`);
/*                 rstFields.push(`${props.toString()}/EMail`);
                rstFields.push(`${props.toString()}/Department`);
                rstFields.push(`${props.toString()}/Office`);
                rstFields.push(`${props.toString()}/WorkPhone`); */
                // if email account is empty it will have error
                
            } 
            else{
                rstFields.push(`${props.toString()}`);
            }

        }

        return rstFields;
    }


    protected setUndoValues(){

        let rstObj = this.getTargetSPOValue();

        this._UnDoValues = this.getTargetObjForFlow(rstObj);
        
        return new Promise<any>((resolve) => {
            resolve();
        });

    }
    

    setRedoValue(targetObj: any): void {
        this._ReDoValues = this.getTargetObjForFlow(targetObj);        
    }


    getId():number{

        return  this.Id;
     }

    beforeAdd(){
        this._Result = true;
        return true;
    }

    afterAdd(result:ItemAddResult){

        this.Id = result.data.Id;
        this._Result = true;

        return true;
    }
   
    beforeUpdate(){
        this._Result = true;
        return true;
    }
    afterUpdate(result:any){
        this._Result = true;

        return true;
    }
    beforeDelete(){
        this._Result = true;
        return true;
    }
    afterDelete(result:any){
        this._Result = true;
        return true;
    }

    errorWhenAdd(error:any){

        this._Result = false;
        this._ErrorMessage = JSON.stringify(error);
        return;
    }

    errorWhenUpdate(error:any){

        this._Result = false;
        this._ErrorMessage = JSON.stringify(error);
        return;
    }


    errorWhenDelete(error:any){

        this._Result = false;
        this._ErrorMessage = JSON.stringify(error);
        return; 
    }

    getFormID(){

        return "";
    }


   getTargetObjForAdd():any{

    return this.getTargetSPOValue();

   }
   getTargetObjForUpdate():any{

    return this.getTargetSPOValue();
   }

   protected getListItemEntityTypeFullName():string{

        let listName = this.getListName();
        listName = listName.replace(/_/g, "_x005f_");
        listName = listName.split(" ").join("_x0020_");
        return listName;
        
   }

   LoadQuery(filterString?:string) {

    
    let selectField:string[] = this.getAllFields();
    let expandField:string[] = this.getPersonMemeberFields()
    let expandFieldGroup:string[] = this.getGroupMemeberFields()
    let expandFieldLookup:string[] = this.getLookupMemeberFields()
    let expandFieldMultiLookup:string[] = this.getMultiLookupMemeberFields()

    
       if (this._isPagedLoad === true) {


           if (filterString != null) {

               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField,...expandFieldGroup,...expandFieldLookup,...expandFieldMultiLookup)
                   .get()

           } else {

               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField,...expandFieldGroup,...expandFieldLookup,...expandFieldMultiLookup)
                   .get()

           }



       } else {
           if (filterString != null) {
               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField,...expandFieldGroup,...expandFieldLookup,...expandFieldMultiLookup)
                   .top(this._PagedCount).getPaged().then(res=>{
                    return res;
                   })

           } else {
               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField,...expandFieldGroup,...expandFieldLookup,...expandFieldMultiLookup)
                   .top(this._PagedCount).getPaged().then(res=>{
                    return res;
                   })
           }
    }



   }

   beforeLoad() {
    this._Result = true;
        return true;
   }

    

    onCompletedLoad():Promise<any>{

        let memberValInDate = this.getDateMemeberFields();
        let memberValInPerson = this.getPersonMemeberFields();
        memberValInPerson.push("Author");
        let memberValInGroup = this.getGroupMemeberFields();

        let memberValInLookup = this.getLookupMemeberFields();
        let memberValInMultiLookup = this.getMultiLookupMemeberFields();

        for (var props in this) {

            if (memberValInPerson.filter(p=>p === props.toString()).length > 0){

                let tempPerson = new Person()
                tempPerson.setPerson(this[props]);
                this[props] =  tempPerson as any;

            }else if (memberValInDate.filter(p=>p === props.toString()).length > 0){

                let tempDate;      
                
                if (this[props] != null){

                    tempDate = new Date(this[props] as any);
                    this[props] =  tempDate;

                }else{
                    this[props] =  tempDate;
                }

            } 
            else if (memberValInLookup.filter(p=>p === props.toString()).length > 0){

                let tempLookup = new LookUp()
                tempLookup.setLookUp(this[props]);
                this[props] =  tempLookup as any;

            }           
            else if (memberValInMultiLookup.filter(p=>p === props.toString()).length > 0){

                let target = this[props] as any;
                let result = [] as LookUp[]

                for (let index = 0; index < target.length; index++) {
                    const element = target[index];
                    let temp = new LookUp();
                    temp.setLookUp(element)
                    result.push(temp);                    
                }

                this[props] =  result as any;                
            }                             
            else if (memberValInGroup.filter(p=>p === props.toString()).length > 0){

                let target = this[props] as any;
                let result = [] as Person[]

                for (let index = 0; index < target.length; index++) {
                    const element = target[index];
                    let temp = new Person();
                    temp.setPerson(element)
                    result.push(temp);                    
                }

                this[props] =  result as any;   
            } 
        }

        this.setUndoValues();

        return new Promise<any>((resolve) => {
            resolve();
        });

    }
    afterLoad(result: any) {
        this._Result = true;
        console.log(`result from SharePoint - ${this.getListName()}`)
        console.log(result);
        return result;
    }

    errorWhenLoad(error: any) {
        this._Result = false;
        console.log(error);
        return;
    }

}