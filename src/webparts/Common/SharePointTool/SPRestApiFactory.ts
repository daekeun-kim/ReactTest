import ISPLitLibaray from "./ISPListLibrary";
import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult } from "sp-pnp-js";

export class SPRestApiFactory {

    constructor(){

    }

    public addWith(target:ISPLitLibaray,targetObj:any):Promise<any>{

        let result:boolean =  target.beforeAdd();
        let ListName:string =  target.getListName();

        //target.targetObjforAdd = targetObj;

        if ( result === true){

             return pnp.sp.web.lists.getByTitle(ListName).items.add(targetObj)
            .then(async (result)=>{                 
                 target.afterAdd(result);
                 console.log("add");
                 return result;
            })
            .catch(async error=>{ 
                 target.errorWhenAdd(error);      
                 return error;             
            }); 
        }
    }

    public async updateWith(target:ISPLitLibaray,targetObj:any):Promise<any>{

        let result:boolean =  target.beforeUpdate();
        let ListName:string =  target.getListName();
        let tgId:number =  target.getId(); 

//        target.targetObjforUpdate = targetObj;

        if ( result === true){

            return pnp.sp.web.lists.getByTitle(ListName).items.getById(tgId).update(targetObj)
            .then(async result=>{
                await target.afterUpdate(result);
                console.log("update");
                return result;
            })
            .catch(async error=>{ 
                 target.errorWhenUpdate(error);                   
                 return error;
            }); 
        }
    }

    public async add(target:ISPLitLibaray):Promise<any>{

        let result:boolean =  await target.beforeAdd();
        let ListName:string =  target.getListName();
        let targetObj  =   target.getTargetObjForAdd();

        //target.targetObjforAdd = targetObj;

        if ( result === true){

             return pnp.sp.web.lists.getByTitle(ListName).items.add(targetObj)
            .then(async (result)=>{                 
                await target.afterAdd(result);
                console.log("add");
                return result;
            })
            .catch(async error=>{ 
                 target.errorWhenAdd(error);    
                 return error;               
            }); 
        }
    }

    public async update(target:ISPLitLibaray):Promise<any>{

        let result:boolean =  await target.beforeUpdate();
        let ListName:string =  target.getListName();
        let tgId:number =  target.getId(); 
        let targetObj  =   target.getTargetObjForUpdate();

        //target.targetObjforUpdate = targetObj;

        if ( result === true){

             return pnp.sp.web.lists.getByTitle(ListName).items.getById(tgId).update(targetObj)
            .then(async result=>{
               await target.afterUpdate(result);
               console.log("update");
               return result;
            })
            .catch(async error=>{ 
                target.errorWhenUpdate(error);     
                return error;              
            }); 
        }
    }

    public async delete(target:ISPLitLibaray):Promise<any>{

        let result:boolean =  await target.beforeDelete();
        let ListName:string =  target.getListName();
        let tgId:number =  target.getId(); 

        if ( result === true){

             return pnp.sp.web.lists.getByTitle(ListName).items.getById(tgId).delete()
            .then(async result=>{
               await target.afterDelete(result);
               console.log("delete");
               return result;
            })
            .catch(async error=>{ 
                target.errorWhenDelete(error);    
                return error;               
            }); 
        }
    }

    public async LoadAll<T extends ISPLitLibaray>(T:{new():T;},target:ISPLitLibaray):Promise<T[]>{   

        try{

            await target.beforeLoad();

            let returnedItems = []
            let results = [] as T[];
            const getData:any = await target.LoadQuery().then(page => {
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
                 return returnedItems.concat(await this.pageData(getData,target).then(result => {
                    return result;
                }));
            } else {            

                for (let index = 0; index < returnedItems.length; index++) {
                    const element = returnedItems[index];

                    let tempObj = new T();

                    for (var props in tempObj) {              
                        
                        if (element[props] != null){
                            tempObj[props] = element[props];
                        }                                          
                    }    

                    results.push(tempObj);     
                    await tempObj.onCompletedLoad();
                    
                }

                await target.afterLoad(results);

                return results;
            }
    
        } catch (e){
            console.log('error - ', e);

            target.errorWhenLoad(e);      
            
            throw e;
        }
    }

    
    pageData =  async (data:any,target:ISPLitLibaray) => {
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
