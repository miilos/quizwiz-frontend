import type { ErrorLike } from "@apollo/client";
import { ServerError } from "@apollo/client";

export default class ErrorHandler {
  public static isNetworkError(error: ErrorLike) {
    return ServerError.is(error)
  }

  public static getNetworkErrorStatusCode(error: ServerError) {
      return error.statusCode
  }
}