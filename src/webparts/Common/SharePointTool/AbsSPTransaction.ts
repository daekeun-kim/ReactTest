import ISPTransactionCommand from "./ISPTransactionCommand";
import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult, sp } from "sp-pnp-js";
import ISPTransactdion from "./ISPTransactionTracker";
import { Person } from "./Person";

export abstract class AbsSPTransaction implements ISPTransactionCommand {

    protected Id:number;
    protected Author:Person;

    protected _isPagedLoad:boolean;
    protected _PagedCount:number;

    protected _UnDoValues:string
    protected _ReDoValues:string
    protected _Result:boolean;


    constructor(){
        this.Id = null;
        this.Author = new Person();
        this._isPagedLoad = false;
        this._PagedCount = 100;      
        this._Result = true;  
    }    


    abstract getDateMemeberFields():string[];
    abstract getPersonMemeberFields():string[];
    abstract getVirtualMemeberFields():string[];
    abstract getListName():string;

    public setPageCount(iCount:number){
        this._PagedCount = iCount;
    }

    public setPagedLoad(iflag:boolean){
        this._isPagedLoad = iflag;
    }

    getUndoValue(): string {
        return this._UnDoValues;
    }
    getRedoValue(): string {
        return this._ReDoValues;
    }


    getTargetSharepointSite(): string {

        return "https://klatencor.sharepoint.com/teams/dev_mirinae";      
        
    }

    getResult(): boolean {    
        return this._Result;
    }

    

    protected getOutofTargetMemberFields():string[]{

        let rst =["_UnDoValues","_ReDoValues","_isPagedLoad","_PagedCount","_Result","Id","Author"];
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
        let memeberValInVitual  = this.getVirtualMemeberFields();
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
            
            if (OutofTargetMemberFields.filter(p=>p === props.toString()).length > 0){
                continue;
            }

            if (memberValInPerson.filter(p=>p === props.toString()).length > 0){
                
                let tempJson = "";

                if (targetValue.Id == 0  || targetValue.Id == null){
                    tempJson = `{"${props.toString()}Id":null}`
                }
                else{
                    tempJson = `{"${props.toString()}Id":"${targetValue.Id}"}`
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
            else{

                let tempJson = `{"${props.toString()}":"${targetValue}"}`
                targetobj = JSON.parse(tempJson);

            }

            
            rstObj ={
                ...rstObj
                ,...targetobj
            }
        }


        return rstObj;

    }

    protected getAllFields(){
        
        let memberValInPerson = this.getPersonMemeberFields();
        let memeberValInVitual  = this.getVirtualMemeberFields();
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

            if (memberValInPerson.filter(p=>p === props.toString()).length > 0){
                
                rstFields.push(`${props.toString()}/Id`);
                rstFields.push(`${props.toString()}/Title`);
                rstFields.push(`${props.toString()}/EMail`);
                rstFields.push(`${props.toString()}/Department`);
                rstFields.push(`${props.toString()}/Office`);
                rstFields.push(`${props.toString()}/WorkPhone`);
                
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
        return;
    }

    errorWhenUpdate(error:any){

        this._Result = false;
        return;
    }


    errorWhenDelete(error:any){

        this._Result = false;
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
    
       if (this._isPagedLoad === true) {


           if (filterString != null) {

               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField)
                   .get()

           } else {

               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField)
                   .get()

           }



       } else {
           if (filterString != null) {
               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField)
                   .top(this._PagedCount).getPaged().then(res=>{
                    return res;
                   })

           } else {
               return pnp.sp.web.lists.getByTitle(this.getListName()).items
                   .select(...selectField)
                   .filter(filterString) // to integrate with OnlineForms SP, has to search against serial number
                   .expand("Author", ...expandField)
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

        for (var props in this) {

            if (memberValInPerson.filter(p=>p === props.toString()).length > 0){

                let tempPerson = new Person()
                tempPerson.setPerson(this[props]);
                this[props] =  tempPerson as any;

            }else if (memberValInDate.filter(p=>p === props.toString()).length > 0){

                let tempDate;                
                tempDate = new Date(this[props] as any);
                this[props] =  tempDate;

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