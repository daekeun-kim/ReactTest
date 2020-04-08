export default interface ITransactionProgressIndicator {

    handleProgressWhenStartTransaction(TotalTransactionCount:number,taskName?:string):void;
    handleProgressWhenCompletedCommand(CompletedTransactionCount:number,TotalTransactionCount:number,taskName?:string):void;
    handleProgressWhenFailedCommand(CompletedTransactionCount:number,TotalTransactionCount:number,taskName?:string):void;    
    handleProgressWhenCompletedTransation(TotalTransactionCount:number,taskName?:string):void;
    handleProgressWhenFailedTransation(TotalTransactionCount:number,taskName?:string):void;

}