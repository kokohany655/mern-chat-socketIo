const { Conversion } = require("../models/chatModel")

exports.getConversation =async(currentUser)=>{
    const getUserConversation = await Conversion.find({
        "$or":[
          {sender:currentUser },
        {  receiver : currentUser}
        ]
        
      }).populate('messages').populate('sender').populate('receiver')
     
      const conversation = getUserConversation.map(conv=>{
        const conversationMsg = conv.messages.reduce((prev , curr)=> prev + (curr.seen ? 0 : 1) , 0)
        return{
          _id:conv._id,
          sender : conv?.sender,
          receiver: conv?.receiver,
          unseenMsg : conversationMsg,
          lastMsg : conv?.messages[ conv?.messages?.length - 1]
        }
      })

      return conversation
}