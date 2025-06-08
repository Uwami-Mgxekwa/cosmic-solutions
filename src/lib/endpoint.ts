import { ENV, type TEnv } from "../env";

const environment: TEnv = ENV;

let Endpoints = {
  userSignupUrl: "",
  userLoginUrl: "",
  userLogoutUrl: "",
  adminLoginUrl: "",
  adminLogoutUrl: "",
  technicianLoginUrl: "",
  technicianLogoutUrl: "",
  techniciansUrl: "",
  userReportsUrl: "",
  usersUrl: "",
  reportsUrl: "",
  createReportUrl: "",
  registerUrl: "",
  reportIdUrl: (id: any) => {
    return "" + id
  },
  updateReportStatusUrl: (id: any) => {
    return "" + id
  },
  updateReportNotesUrl: (id: any) => {
    return "" + id
  },
  assignReportUrl: (id: any) => {
    return "" + id
  },
  assignedTechniciansReportsUrl: (email: any) => {
    return "" + email
  },
  updateReportDeleteUrl: (id: any) => {
    return "" + id
  }
};

if (environment == "DEV") {
  //local endpoints only
  Endpoints = {
    userSignupUrl: "http://localhost:6969/api/user/signup",
    userLoginUrl: "http://localhost:6969/api/user/login",
    userLogoutUrl: "http://localhost:6969/api/user/logout",
    usersUrl: "http://localhost:6969/api/user/all",
    adminLoginUrl: "http://localhost:6969/api/admin/login",
    adminLogoutUrl: "http://localhost:6969/api/admin/logout",
    technicianLoginUrl: "http://localhost:6969/api/technician/login",
    technicianLogoutUrl: "http://localhost:6969/api/technician/logout",
    techniciansUrl: "http://localhost:6969/api/technician/all",
    userReportsUrl: "http://localhost:6969/api/report/all/user",
    reportsUrl: "http://localhost:6969/api/report/all",
    registerUrl: "http://localhost:6969/api/user/register",
    createReportUrl: "http://localhost:6969/api/report/new",
    reportIdUrl: (id: any) => {
      return `http://localhost:6969/api/report/id/${id}`
    },
    updateReportStatusUrl: (id: any) => {
      return `http://localhost:6969/api/report/status/${id}`
    },
    updateReportNotesUrl: (id: any) => {
      return `http://localhost:6969/api/report/notes/${id}`
    },
    assignReportUrl: (id: any) => {
      return `http://localhost:6969/api/report/assign/${id}`
    },
    assignedTechniciansReportsUrl: (email: any) => {
      return `http://localhost:6969/api/report/email/${email}`

    },
    updateReportDeleteUrl: (id: any) => {
      return `http://localhost:6969/api/report/delete/${id}`
    }
  };

} else {
  Endpoints = {
    userSignupUrl: "https://api.devnil.site/api/user/signup",
    userLoginUrl: "https://api.devnil.site/api/user/login",
    userLogoutUrl: "https://api.devnil.site/api/user/logout",
    usersUrl: "https://api.devnil.site/api/user/all",
    adminLoginUrl: "https://api.devnil.site/api/admin/login",
    adminLogoutUrl: "https://api.devnil.site/api/admin/logout",
    technicianLoginUrl: "https://api.devnil.site/api/technician/login",
    technicianLogoutUrl: "https://api.devnil.site/api/technician/logout",
    techniciansUrl: "https://api.devnil.site/api/technician/all",
    userReportsUrl: "https://api.devnil.site/api/report/all/user",
    reportsUrl: "https://api.devnil.site/api/report/all",
    createReportUrl: "https://api.devnil.site/api/report/new",
    registerUrl: "https://api.devnil.site/api/user/register",

    reportIdUrl: (id: any) => {
      return `https://api.devnil.site/api/report/id/${id}`

    },
    updateReportStatusUrl: (id: any) => {
      return `https://api.devnil.site/api/report/status/${id}`
    },
    updateReportNotesUrl: (id: any) => {
      return `https://api.devnil.site/api/report/notes/${id}`
    },
    assignReportUrl: (id: any) => {
      return `https://api.devnil.site/api/report/assign/${id}`
    },
    assignedTechniciansReportsUrl: (email: any) => {
      return `https://api.devnil.site/api/report/email/${email}`

    },
    updateReportDeleteUrl: (id: any) => {
      return `https://api.devnil.site/api/report/delete/${id}`
    }
  }

}

export default Endpoints;
