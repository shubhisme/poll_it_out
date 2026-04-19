export default interface Options_data{
    text : string;
    votes_count?: number;
    
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default interface Poll_data{
    question: string;
    description?: string;
    created_by?: string;
    options: Array<Options_data>;
    is_active?: boolean;
    share_code?: number;
    qr: string;
    multi_true?: boolean;
    duration:string;
    expires_at?: Date | string;

    _id?: string;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}

export default interface MongoCastError {
  stringValue?: string;
  valueType?: string;
  kind?: string;
  value?: unknown;
  path?: string;
  reason?: unknown;
  name?: "CastError";
  message: string;
}

/*

    question: {type: String, required: true},
    description: {type: String},
    created_by: {type: mongoose.Schema.Types.ObjectId , ref: "User" , index: true},

    options: [optionsSchema],

    is_active: {type: Boolean},
    share_code: {type: Number, unique: true},
    qr : {type: String},

    multi_true: {type: Boolean, default: false},
    duration: {type: String, default: "Forever"},
    expires_at  : {type: Date}
 
    */