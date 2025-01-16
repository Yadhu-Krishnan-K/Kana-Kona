export const formatMessageTime = (date) =>(
    new Date(date).toLocaleTimeString("en-us",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    })
)