export class ApiResponse {
  success: boolean
  statusCode: number
  data: any
  message: string

  constructor(statusCode: number, data: any, message = "Success") {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}
