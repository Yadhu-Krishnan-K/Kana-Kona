import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {

    console.log('validations working.... req.body = ', req.body)
    schema.parse(req.body);

    next()

  } catch (error) {
    console.log('error from zodvalidation====', error)
    if (error instanceof ZodError) {
      const err = error.issues[0];

      const firstError = err.message

      return res.status(400).json({
        success: false,
        message: firstError
      });
    }
  }

};