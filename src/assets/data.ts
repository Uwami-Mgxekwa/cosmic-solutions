export const admin = {
  email: "techadmin@cosmic.com",
  password: "1234"
}

export const user = {
  pc: "001",
  room: "1",
  password: "1234"
}

export const reports = [
  {
    tokenID: "cs-8900",
    category: "network",
    description: "",
    status: "open",
    submittedOn: " 5 may at 14:22",
    notes: "",
    pc: "001",
    room: "1"
  },
  {
    tokenID: "cs-6509",
    category: "hardware",
    description: "",
    status: "in progress",
    submittedOn: "6 may at 13:30",
    notes: "",
    pc: "001",
    room: "1"
  },
  {
    tokenID: "cs-4570",
    category: "software",
    description: "",
    status: "resolved",
    submittedOn: "6 may at 10:10",
    notes: "",
    pc: "001",
    room: "1"
  }

]

export interface IReport {
  tokenID: string,
  category: string,
  description: string,
  status: string,
  submittedOn: string,
  notes: string,
  pc: string,
  room: string
}
