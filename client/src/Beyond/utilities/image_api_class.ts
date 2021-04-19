

// This is our special type of Error that represents
// when a request got a 401 Unauthorized response
class UnauthorizedError {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = "UnauthorizedError";
    this.message = message;
  }
}
export class APIClass {
  images: string[];
  
  constructor() {
    this.images = [];
  }

  logErrorReason = (reason: string) => {
    // log the error reason but keep the rejection
    console.log("Response error reason:", reason);
    return Promise.reject(reason);
  };

  checkStatus = (response: any) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else if (response.status === 401) {
      let unauthorizedError = new UnauthorizedError(response.statusText);
      return Promise.reject(unauthorizedError);
    } else {
      var error = new Error(response.statusText);
      return Promise.reject(error);
    }
  };

  wakeUp() {
    fetch(`/wake-up`)
      .then(res => {
        const msg = 'Something is/went wrong with Heroku'; 
        console.log(msg);
      })
  }

  upload = async (image: any, data_type: string, id: string) => {
    const response = await this.uploadData(`/api/image/upload/${data_type}/${id}`, image);
    const res = await this.processResponse(response);
    return res;
  };

  uploadData = async (path: string, data: any) => {
    return await fetch(`${path}`, {
      method: 'POST',
      body: data
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  fetchData = async (path: string, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers
      }
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  postData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "POST",
      body: data
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  putData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "PUT",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  patchData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "PATCH",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  deleteData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "DELETE",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  processResponse = async (response: any) => {
    const body = await response.json();
    if (response.status !== 200) { 
      throw Error(body.message);
    } else {
      let response: any = body;
      return response;
    };
  };

  getSessionData = (sessionName: string) => {
    const sessionStr = sessionStorage.getItem(sessionName);
    if (sessionStr !== null) {
      const sessionObj = JSON.parse(sessionStr);
      if (sessionObj.expiresAt !== undefined && 
        (sessionObj.expiresAt === "never" || new Date(sessionObj.expiresAt) > new Date())) {
        return sessionObj.response;
      }
    }
    return null;
  };
}
