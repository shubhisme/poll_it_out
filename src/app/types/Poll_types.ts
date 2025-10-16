export default interface Poll_data{
    question: string;
    description?: string;
    options: Array<string>;
    multi_true?: boolean;
}