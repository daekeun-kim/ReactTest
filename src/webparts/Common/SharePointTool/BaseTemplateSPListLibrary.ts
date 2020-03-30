import ISPLitLibaray from "./ISPListLibrary";
import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult } from "sp-pnp-js";

export abstract class BaseTemplateSPListLibrary implements ISPLitLibaray {

    Id:number;

    targetObjforAdd:any;
    targetObjforUpdate:any;

    protected _LoadType:string;
    protected _EditType:string;

    constructor(){

        this.Id = null;
    }    

    
    setLoadType(iLoadType:string){
        this._LoadType = iLoadType;
    }

    abstract getDateMemeberFields():string[];
    abstract getPersonMemeberFields():string[];
    abstract getVirtualMemeberFields():string[];
    
    setEditType(iEditType:string){
        this._EditType = iEditType;
    }


    getId():number{

        return  this.Id;
     }

    beforeAdd(){
        return true;
    }

    afterAdd(result:ItemAddResult){

        this.Id = result.data.Id;

        return true;
    }
   
    beforeUpdate(){
        return true;
    }
    afterUpdate(result:any){

        return true;
    }
    beforeDelete(){
        return true;
    }
    afterDelete(result:any){
        return true;
    }

    

    errorWhenAdd(error:any){

        let listName = this.getListItemEntityTypeFullName();
        let listObj = this.targetObjforAdd;

        let objMeta = {
            type: `SP.Data.${listName}ListItem`
        }

        let obj ={
            __metadata : objMeta,
            ...listObj
        }
        
        pnp.sp.web.lists.getByTitle("StockAdjErrorLog").items.add({
            FormID : this.getFormID(),
            ListName : listName,
            RunYN : false,
            ApiType :"add",
            ErrorMessage: JSON.stringify(error),
            TargetValue : JSON.stringify(obj)
        });

        return;
    }

    errorWhenUpdate(error:any){

        let listName = this.getListItemEntityTypeFullName();
        let listObj = this.targetObjforUpdate;
        let targetId = this.getId();

        let objMeta = {
            type: `SP.Data.${listName}ListItem`
        }

        let obj ={
            __metadata : objMeta,
            ...listObj
        }
        
        pnp.sp.web.lists.getByTitle("StockAdjErrorLog").items.add({
            FormID : this.getFormID(),
            ListName : listName,
            TargetId : targetId,
            RunYN : false,
            ApiType :"update",
            ErrorMessage: JSON.stringify(error),
            TargetValue : JSON.stringify(obj)
        });

        return;
    }


    errorWhenDelete(error:any){

        let listName = this.getListItemEntityTypeFullName();
        let targetId = this.getId();
        
        pnp.sp.web.lists.getByTitle("StockAdjErrorLog").items.add({
            FormID : this.getFormID(),
            ListName : listName,
            TargetId : targetId,
            RunYN : false,
            ApiType :"Delete",
            ErrorMessage: JSON.stringify(error)
        });

        return;
    }

    getFormID(){

        return "";
    }

   abstract getListName():string;
   abstract getTargetObjForAdd():any;
   abstract getTargetObjForUpdate():any;

    getListItemEntityTypeFullName():string{

        let listName = this.getListName();
        listName = listName.replace(/_/g, "_x005f_");
        listName = listName.split(" ").join("_x0020_");
        return listName;
        
    }

    LoadQuery(filterString?:string) {

    }

    beforeLoad() {
        return true;
    }
    onCompletedLoad():Promise<any>{
        return;
    }
    afterLoad(result: any) {
        console.log(`result from SharePoint - ${this.getListName()}`)
        console.log(result);
        return result;
    }

    errorWhenLoad(error: any) {
        console.log(error);
        return;
    }

}