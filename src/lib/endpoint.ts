import { ENV, type TEnv } from "../env";

const environment: TEnv = ENV;

let Endpoints = {
  userLoginUrl: "",
  userLogoutUrl: "",
  adminLoginUrl: "",
  adminLogoutUrl: "",
  technicianLoginUrl: "",
  technicianLogoutUrl: "",
  techniciansUrl: "",
  userReportsUrl: "",
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
  updateReportDeleteUrl: (id: any) => {
    return "" + id
  }
};

if (environment == "DEV") {
  //local endpoints only
  Endpoints = {
    userLoginUrl: "http://localhost:6969/api/user/login",
    userLogoutUrl: "http://localhost:6969/api/user/logout",
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
    updateReportDeleteUrl: (id: any) => {
      return `http://localhost:6969/api/report/delete/${id}`
    }
  };

} else {
  Endpoints = {
    userLoginUrl: "https://nodeserver-v2.onrender.com/api/user/login",
    userLogoutUrl: "https://nodeserver-v2.onrender.com/api/user/logout",
    adminLoginUrl: "https://nodeserver-v2.onrender.com/api/admin/login",
    adminLogoutUrl: "https://nodeserver-v2.onrender.com/api/admin/logout",
    technicianLoginUrl: "https://nodeserver-v2.onrender.com/api/technician/login",
    technicianLogoutUrl: "https://nodeserver-v2.onrender.com/api/technician/logout",
    techniciansUrl: "https://nodeserver-v2.onrender.com/api/technician/all",
    userReportsUrl: "https://nodeserver-v2.onrender.com/api/report/all/user",
    reportsUrl: "https://nodeserver-v2.onrender.com/api/report/all/user",
    createReportUrl: "https://nodeserver-v2.onrender.com/api/report/new",
    registerUrl: "https://nodeserver-v2.onrender.com/api/user/register",

    reportIdUrl: (id: any) => {
      return `https://nodeserver-v2.onrender.com/api/report/id/${id}`

    },
    updateReportStatusUrl: (id: any) => {
      return `https://nodeserver-v2.onrender.com/api/report/status/${id}`
    },
    updateReportNotesUrl: (id: any) => {
      return `https://nodeserver-v2.onrender.com/api/report/notes/${id}`
    },
    assignReportUrl: (id: any) => {
      return `https://nodeserver-v2.onrender.com/api/report/assign/${id}`
    },
    updateReportDeleteUrl: (id: any) => {
      return `https://nodeserver-v2.onrender.com/api/report/delete/${id}`
    }
  }

}

export default Endpoints;
