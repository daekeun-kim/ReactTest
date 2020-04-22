
export class Person {

    public Id:number;
    public EMail:string;
    public Title:string;
    public Department:string;
    public Office:string;
    public WorkPhone:string;


    constructor(){

        this.Id = null;
        this.EMail = "";
        this.Title = "";
        this.Department ="";
        this.Office ="";
        this.WorkPhone ="";
    }

    getPersonName(){

        return this.Title;
    }

    setPerson(data){
   
        for (var props in this) {

            if ( data[props] != null){
                this[props] = data[props];
            } 
            
            if ( data.Email != null && data.Email != ""){
                this.EMail = data.Email;
            }
            
        }    

    }

    
}
