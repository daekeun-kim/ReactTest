
export class LookUp {

    public Id:number;
    public Title:string;


    constructor(){

        this.Id = null;
        this.Title = "";

    }

    setLookUp(data){
   
        for (var props in this) {

            if ( data[props] != null){
                this[props] = data[props];
            }                                          
        }    

    }

    
}
