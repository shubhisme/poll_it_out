export default interface Poll_data{
    question: string;
    description?: string;
    options: Array<string>;
    duration:string;
    qr: string;
    multi_true?: boolean;
}