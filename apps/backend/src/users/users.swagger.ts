import { applyDecorators } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"



export const ApiCurrentUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Get the current authenticated user",
      description: "Returns the details of the currently authenticated user."
    })
  )
}