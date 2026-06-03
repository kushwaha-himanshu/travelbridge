import History from "../models/history.model.js"
const createHistory = async(req,res) => {
    try {

        const history_res =await History.create({
            userId:req.id, 
            type:req.body.type,
            title:req.body.title,
            description: req.body.description,
        }) 
        res.status(200).json({
            success:true,
            history:history_res,
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}
export default createHistory;