
import { Approval, Decision, Proposal, Report, Tender, Vendor } from "../types";

// Mock data for the application
const mockTenders: Tender[] = [
  {
    id: "t1",
    title: "IT Infrastructure Upgrade",
    description: "Looking for vendors to upgrade our IT infrastructure including servers, networking equipment, and workstations.",
    type: "RFP",
    status: "published",
    createdAt: "2023-09-15T00:00:00Z",
    updatedAt: "2023-09-20T00:00:00Z",
    publishedAt: "2023-09-20T00:00:00Z",
    deadline: "2024-08-15T00:00:00Z",
    budget: 250000,
    documents: [
      {
        id: "d1",
        name: "RFP Document",
        type: "pdf",
        url: "/documents/rfp-it-infrastructure.pdf",
        uploadedAt: "2023-09-15T00:00:00Z",
        size: 1024000
      }
    ],
    requirements: [
      {
        id: "r1",
        title: "Server Specifications",
        description: "Minimum requirements for server hardware",
        required: true
      },
      {
        id: "r2",
        title: "Network Infrastructure",
        description: "Requirements for networking equipment",
        required: true
      }
    ],
    evaluation: [
      {
        id: "e1",
        name: "Technical Compliance",
        description: "How well the proposal meets technical requirements",
        weight: 40
      },
      {
        id: "e2",
        name: "Cost",
        description: "Total cost of ownership",
        weight: 30
      },
      {
        id: "e3",
        name: "Implementation Timeline",
        description: "Timeframe for deployment",
        weight: 15
      },
      {
        id: "e4",
        name: "Vendor Experience",
        description: "Previous relevant experience",
        weight: 15
      }
    ]
  },
  {
    id: "t2",
    title: "Office Supplies Procurement",
    description: "Seeking vendors for annual office supplies contract including paper, stationery, and printer consumables.",
    type: "RFQ",
    status: "evaluating",
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-10-05T00:00:00Z",
    publishedAt: "2023-10-05T00:00:00Z",
    deadline: "2023-10-25T00:00:00Z",
    budget: 50000,
    documents: [
      {
        id: "d2",
        name: "Supply List",
        type: "xlsx",
        url: "/documents/office-supplies-list.xlsx",
        uploadedAt: "2023-10-01T00:00:00Z",
        size: 512000
      }
    ],
    requirements: [
      {
        id: "r3",
        title: "Product Quality",
        description: "All products must meet specified quality standards",
        required: true
      },
      {
        id: "r4",
        title: "Delivery Schedule",
        description: "Ability to deliver supplies on a quarterly basis",
        required: true
      }
    ],
    evaluation: [
      {
        id: "e5",
        name: "Price",
        description: "Competitive pricing",
        weight: 50
      },
      {
        id: "e6",
        name: "Product Quality",
        description: "Quality of sample products",
        weight: 30
      },
      {
        id: "e7",
        name: "Delivery Terms",
        description: "Reliability and flexibility of delivery",
        weight: 20
      }
    ]
  },
  {
    id: "t3",
    title: "Training and Development Services",
    description: "Seeking training providers for staff development programs in leadership, project management, and technical skills.",
    type: "RFP",
    status: "awarded",
    createdAt: "2023-08-01T00:00:00Z",
    updatedAt: "2023-09-15T00:00:00Z",
    publishedAt: "2023-08-05T00:00:00Z",
    deadline: "2023-08-25T00:00:00Z",
    budget: 100000,
    documents: [
      {
        id: "d3",
        name: "Training Requirements",
        type: "pdf",
        url: "/documents/training-requirements.pdf",
        uploadedAt: "2023-08-01T00:00:00Z",
        size: 768000
      }
    ],
    requirements: [
      {
        id: "r5",
        title: "Trainer Qualifications",
        description: "Minimum qualifications for trainers",
        required: true
      },
      {
        id: "r6",
        title: "Training Materials",
        description: "Quality and comprehensiveness of training materials",
        required: true
      }
    ],
    evaluation: [
      {
        id: "e8",
        name: "Trainer Experience",
        description: "Experience and qualifications of trainers",
        weight: 35
      },
      {
        id: "e9",
        name: "Training Methodology",
        description: "Approach and teaching methods",
        weight: 25
      },
      {
        id: "e10",
        name: "Cost",
        description: "Overall cost-effectiveness",
        weight: 25
      },
      {
        id: "e11",
        name: "References",
        description: "Feedback from previous clients",
        weight: 15
      }
    ]
  },
  {
    id: "t4",
    title: "Facility Maintenance Contract",
    description: "Comprehensive maintenance services for office buildings including HVAC, electrical, plumbing, and general repairs.",
    type: "ITB",
    status: "archived",
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: "2023-06-20T00:00:00Z",
    publishedAt: "2023-05-05T00:00:00Z",
    deadline: "2023-05-30T00:00:00Z",
    budget: 200000,
    documents: [
      {
        id: "d4",
        name: "Facility Specifications",
        type: "pdf",
        url: "/documents/facility-specs.pdf",
        uploadedAt: "2023-05-01T00:00:00Z",
        size: 1536000
      }
    ],
    requirements: [
      {
        id: "r7",
        title: "Service Coverage",
        description: "Types of maintenance services provided",
        required: true
      },
      {
        id: "r8",
        title: "Response Time",
        description: "Maximum response time for emergency repairs",
        required: true
      }
    ],
    evaluation: [
      {
        id: "e12",
        name: "Price",
        description: "Overall contract cost",
        weight: 40
      },
      {
        id: "e13",
        name: "Experience",
        description: "Company experience with similar facilities",
        weight: 30
      },
      {
        id: "e14",
        name: "Staffing",
        description: "Qualifications of maintenance staff",
        weight: 20
      },
      {
        id: "e15",
        name: "References",
        description: "Quality of references",
        weight: 10
      }
    ]
  },
  {
    id: "t5",
    title: "Marketing Campaign Management",
    description: "Seeking a marketing agency to develop and execute a comprehensive marketing campaign for new product launch.",
    type: "RFP",
    status: "published",
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-05T00:00:00Z",
    publishedAt: "2023-11-05T00:00:00Z",
    deadline: "2024-07-01T00:00:00Z",
    budget: 150000,
    documents: [
      {
        id: "d5",
        name: "Campaign Brief",
        type: "pdf",
        url: "/documents/marketing-brief.pdf",
        uploadedAt: "2023-11-01T00:00:00Z",
        size: 1024000
      }
    ],
    requirements: [
      {
        id: "r9",
        title: "Campaign Strategy",
        description: "Development of comprehensive marketing strategy",
        required: true
      },
      {
        id: "r10",
        title: "Channel Management",
        description: "Management of multiple marketing channels",
        required: true
      }
    ],
    evaluation: [
      {
        id: "e16",
        name: "Creative Approach",
        description: "Creativity and innovation in proposed campaigns",
        weight: 35
      },
      {
        id: "e17",
        name: "Agency Experience",
        description: "Previous experience with similar campaigns",
        weight: 25
      },
      {
        id: "e18",
        name: "Budget Allocation",
        description: "Efficient allocation of marketing budget",
        weight: 25
      },
      {
        id: "e19",
        name: "Timeline",
        description: "Feasibility of proposed timeline",
        weight: 15
      }
    ]
  }
];

// Mock API service
export const api = {
  tenders: {
    getAll: async (): Promise<Tender[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTenders;
    },
    getById: async (id: string): Promise<Tender | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockTenders.find(tender => tender.id === id);
    },
    create: async (tender: Omit<Tender, "id" | "createdAt" | "updatedAt">): Promise<Tender> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newTender: Tender = {
        ...tender,
        id: `t${mockTenders.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockTenders.push(newTender);
      return newTender;
    },
    update: async (id: string, updates: Partial<Tender>): Promise<Tender> => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const index = mockTenders.findIndex(tender => tender.id === id);
      if (index === -1) throw new Error("Tender not found");
      
      const updatedTender = {
        ...mockTenders[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      mockTenders[index] = updatedTender;
      return updatedTender;
    }
  },
  proposals: {
    getByTenderId: async (tenderId: string): Promise<Proposal[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return []; // Mock implementation
    },
    getById: async (id: string): Promise<Proposal | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return undefined; // Mock implementation
    },
    submit: async (proposal: Omit<Proposal, "id" | "submittedAt" | "status">): Promise<Proposal> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        ...proposal,
        id: `p${Math.floor(Math.random() * 1000)}`,
        submittedAt: new Date().toISOString(),
        status: "submitted"
      };
    }
  },
  decisions: {
    getAll: async (): Promise<Decision[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return []; // Mock implementation
    },
    getById: async (id: string): Promise<Decision | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return undefined; // Mock implementation
    },
    approve: async (decisionId: string, approval: Approval): Promise<Decision> => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return {} as Decision; // Mock implementation
    }
  },
  vendors: {
    getAll: async (): Promise<Vendor[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return []; // Mock implementation
    },
    getById: async (id: string): Promise<Vendor | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return undefined; // Mock implementation
    }
  },
  reports: {
    getAll: async (): Promise<Report[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return []; // Mock implementation
    },
    getById: async (id: string): Promise<Report | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return undefined; // Mock implementation
    },
    generate: async (type: string, parameters: any): Promise<Report> => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {} as Report; // Mock implementation
    }
  }
};
