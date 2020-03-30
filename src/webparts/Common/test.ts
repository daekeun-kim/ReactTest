
export class Person {

    public Id:number;
    public Email:string;
    public Title:string;


    constructor(){

        this.Id = 0;
        this.Email = "";
        this.Title = "";
    }

    getPersonName(){

        return this.Title;
    }

    setPerson(data){
   
        for (var props in this) {

            if ( data[props] != null){
                this[props] = data[props];
            }                                          
        }    

    }

    
}
