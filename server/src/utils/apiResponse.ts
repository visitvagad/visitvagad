class ApiResponse<T = any> {
    public success: boolean;
    public message: string;
    public data: T;
    public statusCode: number;

    constructor(statusCode: number, data: T, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;
