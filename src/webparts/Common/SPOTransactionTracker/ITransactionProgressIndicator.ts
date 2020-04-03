export default interface ITransactionProgressIndicator {

    handleProgressWhenStartTransaction(TotalTransactionCount:number):void;
    handleProgressWhenCompletedCommand(CompletedTransactionCount:number,TotalTransactionCount:number):void;
    handleProgressWhenFailedCommand(CompletedTransactionCount:number,TotalTransactionCount:number):void;    
    handleProgressWhenCompletedTransation(TotalTransactionCount:number):void;
    handleProgressWhenFailedTransation(TotalTransactionCount:number):void;

}