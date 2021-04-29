
const AWS = require("aws-sdk")
const uuid = require("uuid")
const documentClient = new AWS.DynamoDB.DocumentClient();
 
      


module.exports.updateValues = async(allData)=>{
    let {price,volume,daily_yield,monthly_yield,
        three_monthly_yield,six_monthly_yield,yearly_yield} = allData
    var params = {
        TableName : 'FundMetrics-65e776yxknfzlddagx47d36qku-staging',
        Item: {
            id : uuid.v4(),
            price : price,
            date: Date.now(),
            volume : volume,
            daily_yield: daily_yield,
            monthly_yield: monthly_yield,
            three_monthly_yield: three_monthly_yield,
            six_monthly_yield: six_monthly_yield,
            yearly_yield: yearly_yield
        }
      };
      // Call DynamoDB to add the item to the table
    let result = await documentClient.put(params, (err, res)=>{
        if(err) console.log(err);
        console.log(res, "DB ROBO-BES Log")
    })
    
    return result;
}



module.exports.getMarkowitz = async () =>{
    var s3 = new AWS.S3();

    var options = {
        Bucket: 'model-predictions',
        Key: "Markowitz_Allianz_MaxSharpe.txt",
    };

    let data = s3.getObject(options);
    return data;
}