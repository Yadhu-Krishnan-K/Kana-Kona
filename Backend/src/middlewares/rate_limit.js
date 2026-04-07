import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,

  handler: (req, res, next) => {
    const enabledRateLimit = false
    if(enabledRateLimit){
      const error = new Error("Too many requests, please try again later.");
      error.statusCode = 429;
      next(error); 
    }
  },
});

export default limiter;