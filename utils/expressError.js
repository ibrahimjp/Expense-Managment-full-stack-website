class ExpenseError extends Error{
    constructor(status,message){
        super();
        this.status=status;
        this.message=message;
    }
}