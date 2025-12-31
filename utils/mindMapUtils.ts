import { 
  MapIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  ScaleIcon, 
  ExclamationTriangleIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon, 
  BuildingStorefrontIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  BanknotesIcon, 
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  BookOpenIcon,
  FolderIcon, 
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';

export interface MapNode {
  id: string;
  label: string;
  type: 'root' | 'category' | 'item' | 'warning' | 'expert' | 'project';
  role?: 'Oversight' | 'Quantum' | 'Delay' | 'Forensic' | 'Legal';
  x: number;
  y: number;
  icon?: any;
  color?: string;
  description?: string;
  imageUrl?: string;
  allocatedTo?: string; // ID of the category/node this expert is 'parenting' (Legacy/Strategy View)
  parentId?: string; // ID of the parent node for collapsible tree logic
  assignedExpert?: {    // New: Embedded expert for Project Anatomy view
      name: string;
      role: string;
      imageUrl: string;
  };
}

export interface Connection {
  from: string;
  to: string;
}

export interface CrossLink {
  from: string;
  to: string;
  label: string;
  type: 'data' | 'dependency' | 'oversight';
}

// --- SIDEBAR DATA TYPES ---
export interface MockEmail {
  id: string;
  from: string;
  fromImg: string;
  subject: string;
  date: string;
  preview: string;
  priority: 'High' | 'Normal';
}

export interface MockFile {
  id: string;
  name: string;
  type: 'pdf' | 'xls' | 'doc' | 'img';
  size: string;
  date: string;
}

export interface SidebarData {
  latestUpdate: MockEmail;
  documents: MockFile[];
  subNodeUpdates?: { label: string; status: string; completion: number }[]; // For Parent Nodes
}

export const ALAN_CLARKE_IMG = "https://media.licdn.com/dms/image/v2/C4D03AQFUbXSaSR7Dug/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516499833773?e=1769040000&v=beta&t=Q6xb-gjp-XdkmIFXsCx0WH2fnFe6YPuZGokpKG9-rWk";
export const ZOHIB_HABIB_IMG = "https://ajbowlerconsult.com/wp-content/uploads/2023/07/zohaid-resized-600x550-1.jpg";
export const IAN_BARTLETT_IMG = "https://ajbowlerconsult.com/wp-content/uploads/2023/07/IanBartlett-1.png";
export const ANDREW_BOWLER_IMG = "https://ajbowlerconsult.com/wp-content/uploads/2023/07/AJBOWLERpng-2.png";
export const PHILIP_HOSKINS_IMG = "https://ajbowlerconsult.com/wp-content/uploads/2023/07/Philliphoskins.png";
export const DAVID_HUGILL_IMG = "https://ajbowlerconsult.com/wp-content/uploads/2023/07/Davidhughill-1.png";
export const WILLIAM_BAXTER_IMG = "https://ajbowlerconsult.com/wp-content/uploads/2023/07/williambaxter.png";
export const FERNANDO_ORTEGA_IMG = "https://ui-avatars.com/api/?name=Fernando+Ortega&background=random&color=fff&size=200";

// The "Bench" - Experts available to be subbed in for tactical allocation
export const EXPERT_POOL = [
  { id: 'exp_ac', name: 'Alan Clarke', role: 'Quantum', img: ALAN_CLARKE_IMG, rating: 92 },
  { id: 'exp_zh', name: 'Zohib Habib', role: 'Forensic', img: ZOHIB_HABIB_IMG, rating: 89 },
  { id: 'exp_ib', name: 'Ian Bartlett', role: 'Delay', img: IAN_BARTLETT_IMG, rating: 91 },
  { id: 'exp_ph', name: 'Philip Hoskins', role: 'Delay', img: PHILIP_HOSKINS_IMG, rating: 85 },
  { id: 'exp_dh', name: 'David Hugill', role: 'Forensic', img: DAVID_HUGILL_IMG, rating: 90 },
  { id: 'exp_wb', name: 'William Baxter', role: 'Quantum', img: WILLIAM_BAXTER_IMG, rating: 88 },
  { id: 'exp_fo', name: 'Fernando Ortega', role: 'Legal', img: FERNANDO_ORTEGA_IMG, rating: 95 },
];

// Full contact directory for the landing page
export const CONTACT_DIRECTORY = {
  expertWitnesses: {
    title: 'Expert Witness Registry',
    contacts: [
      { id: 'c1', name: 'Alan Clarke', title: 'Director, Quantum Expert', company: 'AJBowler Consult', email: 'a.clarke@ajbowler.com', phone: '+44 7700 900123', img: ALAN_CLARKE_IMG, priorProjects: 'Dubai Metro, London Crossrail Section 7' },
      { id: 'c2', name: 'Zohib Habib', title: 'Forensic & Disruption Analyst', company: 'AJBowler Consult', email: 'z.habib@ajbowler.com', phone: '+44 7700 900456', img: ZOHIB_HABIB_IMG, priorProjects: 'Midfield Terminal Abu Dhabi, Doha Metro Gold Line' },
      { id: 'c3', name: 'Ian Bartlett', title: 'Senior Delay Analyst', company: 'AJBowler Consult', email: 'i.bartlett@ajbowler.com', phone: '+44 7700 900789', img: IAN_BARTLETT_IMG, priorProjects: 'HS2 Enabling Works, Doha Expressway' },
      { id: 'c4', name: 'Philip Hoskins', title: 'Associate, Delay & Quantum', company: 'AJBowler Consult', email: 'p.hoskins@ajbowler.com', phone: '+44 7700 900987', img: PHILIP_HOSKINS_IMG, priorProjects: 'Hinkley Point C, Thames Tideway Tunnel' },
      { id: 'c11', name: 'David Hugill', title: 'Director, Quantum & Forensic Expert', company: 'AJBowler Consult', email: 'd.hugill@ajbowler.com', phone: '+44 7700 900333', img: DAVID_HUGILL_IMG, priorProjects: 'Qatar Metro Project, Riyadh Metro, Sydney Light Rail' },
      { id: 'c12', name: 'William Baxter', title: 'Senior Quantum Consultant', company: 'AJBowler Consult', email: 'w.baxter@ajbowler.com', phone: '+44 7700 900555', img: WILLIAM_BAXTER_IMG, priorProjects: 'Doha Port Expansion, The Shard Fit-Out' },
      { id: 'c13', name: 'Fernando Ortega', title: 'Appointed Lawyer', company: 'External Legal Counsel', email: 'f.ortega@lawfirm.com', phone: '+34 600 123 456', img: FERNANDO_ORTEGA_IMG, priorProjects: 'ICC Arbitration Paris, DIAC Dispute Resolution' },
    ]
  },
  ajbStaff: {
    title: 'AJBowler Consult Contacts',
    contacts: [
      { id: 'c5', name: 'Andrew Bowler', title: 'Managing Director', company: 'AJBowler Consult', email: 'ajb@ajbowler.com', phone: '+44 7700 900001', img: ANDREW_BOWLER_IMG },
      { id: 'c6', name: 'Monica Bowler', title: 'Office Manager', company: 'AJBowler Consult', email: 'm.bowler@ajbowler.com', phone: '+44 7700 900111', img: 'https://i.pravatar.cc/150?u=monicabowler' },
      { id: 'c7', name: 'Benjamin Bowler', title: 'Junior QS', company: 'AJBowler Consult', email: 'b.bowler@ajbowler.com', phone: '+44 7700 900222', img: 'https://i.pravatar.cc/150?u=benjaminbowler' },
    ]
  },
  externalContacts: {
    title: 'Previous Engagements',
    contacts: [
      { id: 'c8', name: 'David Chen', title: 'Project Director', company: 'MegaCorp Construction', email: 'd.chen@megacorp.com', phone: '+65 9123 4567', img: 'https://i.pravatar.cc/150?u=davidchen' },
      { id: 'c9', name: 'Maria Garcia', title: 'Lead Counsel', company: 'Global Legal LLP', email: 'm.garcia@globallegal.com', phone: '+1 212 555 0123', img: 'https://i.pravatar.cc/150?u=mariagarcia' },
      { id: 'c10', name: 'Robert Miller', title: 'Chief Engineer', company: 'City Infrastructure Dept.', email: 'r.miller@city.gov', phone: '+44 20 7946 0123', img: 'https://i.pravatar.cc/150?u=robertmiller' },
    ]
  }
};

export const getProjectData = (pid: string, projectType: string = 'Claim') => {
    // Determine which project name to use, or default
    let projectName = 'Skyline Tower';
    if (pid === 'p2') projectName = 'Metro Phase 2';
    if (pid === 'p3') projectName = 'Harbor Warehouse';
    if (pid === 'p4') projectName = 'Lotus Tower Fit-out';
    if (pid === 'p5') projectName = 'Jumeirah Palm Infra';

    // --- ARBITRATION SPECIFIC STRATEGY MAP ---
    if (projectType === 'Arbitration' || pid === 'p2' || pid === 'p5') {
       return {
          label: `${projectName} - Arbitration`,
          sub: "Tribunal Strategy Layout",
          nodes: [
             { id: 'root', label: 'ICC Arbitration', type: 'root', x: 600, y: 450, icon: ScaleIcon, color: 'bg-red-700', description: 'Central Legal & Expert Hub' },
             
             { id: 'cat_pleadings', label: 'Tribunal & Pleadings', type: 'category', x: 600, y: 150, icon: BookOpenIcon, color: 'bg-slate-800' },
             { id: 'cat_quantum', label: 'Quantum Evidence', type: 'category', x: 200, y: 750, icon: BanknotesIcon, color: 'bg-emerald-700' },
             { id: 'cat_evidence', label: 'Factual Evidence', type: 'category', x: 1000, y: 750, icon: DocumentTextIcon, color: 'bg-blue-600' },

             // Experts: Specialized Roles
             { id: 'expert_andrew', label: 'Andrew Bowler', type: 'expert', role: 'Oversight', x: 600, y: 800, imageUrl: ANDREW_BOWLER_IMG, description: 'Lead Expert Witness', allocatedTo: 'cat_pleadings' },
             { id: 'expert_zohib', label: 'Zohib Habib', type: 'expert', role: 'Quantum', x: 350, y: 600, imageUrl: ZOHIB_HABIB_IMG, description: 'Quantum Expert Witness', allocatedTo: 'cat_quantum' },
             { id: 'expert_ian', label: 'Ian Bartlett', type: 'expert', role: 'Delay', x: 850, y: 600, imageUrl: IAN_BARTLETT_IMG, description: 'Delay Expert Witness', allocatedTo: 'cat_evidence' },
             
             // Lawyer linked to pleadings
             { id: 'expert_fernando', label: 'Fernando Ortega', type: 'expert', role: 'Legal', x: 400, y: 150, imageUrl: FERNANDO_ORTEGA_IMG, description: 'Appointed Lawyer', allocatedTo: 'cat_pleadings' },

             { id: 'item_claim', label: 'Statement of Claim', type: 'item', x: 600, y: 50, description: 'Submission Due: 15 Oct' },
          ] as MapNode[],
          connections: [
             { from: 'root', to: 'cat_pleadings' }, { from: 'root', to: 'cat_quantum' }, { from: 'root', to: 'cat_evidence' },
             { from: 'cat_pleadings', to: 'item_claim' },
          ] as Connection[],
          crossLinks: [] as CrossLink[]
       };
    }

    // --- STANDARD CLAIM STRATEGY MAP ---
    if (pid === 'p3' || pid === 'p4') {
        return {
            label: projectName,
            sub: "Asset Claim",
            nodes: [
                { id: 'root', label: projectName, type: 'root', x: 600, y: 450, icon: BuildingStorefrontIcon, color: 'bg-orange-600', description: 'Logistics Hub Asset Claim.' },
                { id: 'cat_contract', label: 'Lease Agreement', type: 'category', x: 600, y: 200, icon: DocumentTextIcon, color: 'bg-slate-700' },
                { id: 'cat_finance', label: 'Damages', type: 'category', x: 300, y: 650, icon: BanknotesIcon, color: 'bg-emerald-600' },
                { id: 'cat_events', label: 'Defects', type: 'category', x: 900, y: 650, icon: ExclamationTriangleIcon, color: 'bg-red-500' },

                // Experts
                { id: 'expert_andrew', label: 'Andrew Bowler', type: 'expert', role: 'Oversight', x: 600, y: 800, imageUrl: ANDREW_BOWLER_IMG, description: 'Managing Director.' },
                { id: 'expert_william', label: 'William Baxter', type: 'expert', role: 'Quantum', x: 450, y: 550, imageUrl: WILLIAM_BAXTER_IMG, description: 'Quantum Consultant.', allocatedTo: 'cat_finance' },
                { id: 'expert_david', label: 'David Hugill', type: 'expert', role: 'Forensic', x: 750, y: 550, imageUrl: DAVID_HUGILL_IMG, description: 'Forensic Expert.', allocatedTo: 'cat_events' },
            ] as MapNode[],
            connections: [
                { from: 'root', to: 'cat_contract' }, { from: 'root', to: 'cat_finance' }, { from: 'root', to: 'cat_events' },
            ] as Connection[],
            crossLinks: [] as CrossLink[]
        };
    }

    // Default (Skyline Tower / p1)
    return {
        label: projectName,
        sub: "Case Strategy Layout",
        nodes: [
          { id: 'root', label: projectName, type: 'root', x: 600, y: 450, icon: MapIcon, color: 'bg-indigo-600', description: 'Central Hub. Click to enter Project Anatomy.' },
          { id: 'cat_contract', label: 'Contract Baseline', type: 'category', x: 600, y: 150, icon: ScaleIcon, color: 'bg-slate-700' },
          { id: 'cat_finance', label: 'Quantum Audit', type: 'category', x: 200, y: 750, icon: CurrencyDollarIcon, color: 'bg-emerald-600' },
          { id: 'cat_events', label: 'Delay Events', type: 'category', x: 1000, y: 750, icon: CalendarDaysIcon, color: 'bg-orange-500' },

          { id: 'expert_andrew', label: 'Andrew Bowler', type: 'expert', role: 'Oversight', x: 600, y: 800, imageUrl: ANDREW_BOWLER_IMG, description: 'Managing Director & Portfolio Oversight.' },
          { id: 'expert_alan', label: 'Alan Clarke', type: 'expert', role: 'Quantum', x: 350, y: 600, imageUrl: ALAN_CLARKE_IMG, description: 'Infrastructure Valuation Lead.', allocatedTo: 'cat_finance' },
          { id: 'expert_ian', label: 'Ian Bartlett', type: 'expert', role: 'Delay', x: 850, y: 600, imageUrl: IAN_BARTLETT_IMG, description: 'Forensic Delay Analyst.', allocatedTo: 'cat_events' },
          
          { id: 'item_fidic', label: 'Cl 8.4 Entitlement', type: 'item', x: 600, y: 50, description: 'EOT Basis.' },
        ] as MapNode[],
        connections: [
          { from: 'root', to: 'cat_contract' }, { from: 'root', to: 'cat_finance' }, { from: 'root', to: 'cat_events' },
          { from: 'cat_contract', to: 'item_fidic' },
        ] as Connection[],
        crossLinks: [] as CrossLink[]
    };
};

// NEW FUNCTION: Detailed project anatomy breakdown (Drill-down view)
export const getProjectDetailData = (pid: string, projectType: string = 'Claim') => {
    // Determine Project Name for the Center Node
    let projectTitle = 'Skyline Tower';
    if (pid === 'p2') projectTitle = 'Metro Phase 2';
    if (pid === 'p3') projectTitle = 'Harbor Warehouse';
    if (pid === 'p4') projectTitle = 'Lotus Tower Fit-out';
    if (pid === 'p5') projectTitle = 'Jumeirah Palm Infra';

    // ARBITRATION ANATOMY
    if (projectType === 'Arbitration' || pid === 'p2' || pid === 'p5') {
        const expertPleading = { name: 'Andrew Bowler', role: 'Lead Expert', imageUrl: ANDREW_BOWLER_IMG };
        const expertQuantum = { name: 'Zohib Habib', role: 'Quantum Expert', imageUrl: ZOHIB_HABIB_IMG };
        const expertDelay = { name: 'Ian Bartlett', role: 'Delay Expert', imageUrl: IAN_BARTLETT_IMG };
        const expertLegal = { name: 'Fernando Ortega', role: 'Appointed Lawyer', imageUrl: FERNANDO_ORTEGA_IMG };

        const nodes: MapNode[] = [
            { id: 'root_detail', label: 'Arbitration Workstreams', type: 'root', x: 600, y: 450, icon: ScaleIcon, color: 'bg-red-800', description: 'Tribunal Preparation & Evidence' },
            
            { 
              id: 'd_plead', 
              label: 'Pleadings', 
              type: 'category', 
              x: 600, y: 150, 
              icon: BookOpenIcon, 
              color: 'bg-slate-700',
              assignedExpert: expertPleading
            },
            { 
              id: 'd_expert', 
              label: 'Expert Reports', 
              type: 'category', 
              x: 900, y: 300, 
              icon: DocumentTextIcon, 
              color: 'bg-emerald-600',
              assignedExpert: expertQuantum
            },
            { 
              id: 'd_evidence', 
              label: 'Witness Evidence', 
              type: 'category', 
              x: 900, y: 600, 
              icon: UserGroupIcon, 
              color: 'bg-blue-600',
              assignedExpert: expertDelay
            },
            { 
              id: 'd_disclosure', 
              label: 'Disclosure', 
              type: 'category', 
              x: 600, y: 750, 
              icon: FolderIcon, 
              color: 'bg-slate-500',
              assignedExpert: expertLegal 
            },
            { id: 'd_hearing', label: 'Hearing Prep', type: 'category', x: 300, y: 600, icon: ScaleIcon, color: 'bg-red-600' },
            { id: 'd_admin', label: 'Tribunal Admin', type: 'category', x: 300, y: 300, icon: ClipboardDocumentListIcon, color: 'bg-orange-500' },

            // Leaves - Pleadings
            { id: 'l_soc', label: 'Statement of Claim', type: 'item', x: 500, y: 50, parentId: 'd_plead' },
            { id: 'l_def', label: 'Statement of Defence', type: 'item', x: 700, y: 50, parentId: 'd_plead' },

            // Leaves - Expert Reports
            { id: 'l_rep1', label: 'Report No. 1', type: 'item', x: 1100, y: 250, parentId: 'd_expert' },
            { id: 'l_joint', label: 'Joint Statement', type: 'item', x: 1100, y: 350, parentId: 'd_expert' },
            { id: 'l_scott', label: 'Scott Schedule', type: 'item', x: 1300, y: 300, parentId: 'l_joint' }, 

            { id: 'l_witness', label: 'Factual Witnesses', type: 'item', x: 1100, y: 600, parentId: 'd_evidence' },
            { id: 'l_redfern', label: 'Redfern Schedule', type: 'item', x: 600, y: 850, parentId: 'd_disclosure' },
        ];

        const connections: Connection[] = [
            { from: 'root_detail', to: 'd_plead' }, { from: 'root_detail', to: 'd_expert' },
            { from: 'root_detail', to: 'd_evidence' }, { from: 'root_detail', to: 'd_disclosure' },
            { from: 'root_detail', to: 'd_hearing' }, { from: 'root_detail', to: 'd_admin' },

            { from: 'd_plead', to: 'l_soc' }, { from: 'd_plead', to: 'l_def' },
            { from: 'd_expert', to: 'l_rep1' }, { from: 'd_expert', to: 'l_joint' },
            { from: 'l_joint', to: 'l_scott' },
            { from: 'd_evidence', to: 'l_witness' }, { from: 'd_disclosure', to: 'l_redfern' },
        ];

        return { label: `${projectTitle} - Anatomy`, nodes, connections, crossLinks: [] };
    }

    // STANDARD CLAIM ANATOMY
    
    let expertSched = { name: 'Ian Bartlett', role: 'Lead Planner', imageUrl: IAN_BARTLETT_IMG };
    let expertCost = { name: 'Alan Clarke', role: 'Cost Lead', imageUrl: ALAN_CLARKE_IMG };
    let expertRisk = { name: 'Zohib Habib', role: 'Risk Analyst', imageUrl: ZOHIB_HABIB_IMG };

    if (pid === 'p3' || pid === 'p4') {
        expertCost = { name: 'William Baxter', role: 'Quantum Lead', imageUrl: WILLIAM_BAXTER_IMG };
        expertRisk = { name: 'David Hugill', role: 'Risk Expert', imageUrl: DAVID_HUGILL_IMG };
    }

    const nodes: MapNode[] = [
        { id: 'root_detail', label: projectTitle, type: 'root', x: 600, y: 450, icon: BuildingStorefrontIcon, color: (pid === 'p3' || pid === 'p4') ? 'bg-orange-600' : 'bg-red-600', description: 'Internal Project Structure & Work Packages' },
        
        { 
          id: 'd_sched', 
          label: 'Master Schedule', 
          type: 'category', 
          x: 600, y: 150, 
          icon: CalendarDaysIcon, 
          color: 'bg-blue-500',
          assignedExpert: expertSched
        },
        { 
          id: 'd_cost', 
          label: 'Cost Plan', 
          type: 'category', 
          x: 900, y: 300, 
          icon: BanknotesIcon, 
          color: 'bg-emerald-500',
          assignedExpert: expertCost
        },
        { 
          id: 'd_risk', 
          label: 'Risk Register', 
          type: 'category', 
          x: 900, y: 600, 
          icon: ExclamationTriangleIcon, 
          color: 'bg-orange-500',
          assignedExpert: expertRisk
        },
        { id: 'd_log', label: 'Logistics', type: 'category', x: 600, y: 750, icon: TruckIcon, color: 'bg-slate-500' },
        { id: 'd_qa', label: 'QA/QC', type: 'category', x: 300, y: 600, icon: ScaleIcon, color: 'bg-indigo-500' },
        { id: 'd_stake', label: 'Stakeholders', type: 'category', x: 300, y: 300, icon: UserGroupIcon, color: 'bg-pink-500' },

        // Leaves - Schedule
        { id: 'l_s1', label: 'Baseline V4', type: 'item', x: 500, y: 50, parentId: 'd_sched' },
        { id: 'l_s2', label: 'Critical Path', type: 'item', x: 700, y: 50, parentId: 'd_sched' },

        // Leaves - Cost
        { id: 'l_c1', label: 'Budget Tracker', type: 'item', x: 1100, y: 250, parentId: 'd_cost' },
        { id: 'l_c2', label: 'Cash Flow', type: 'item', x: 1100, y: 350, parentId: 'd_cost' },
        { id: 'l_c3', label: 'Invoices', type: 'item', x: 1300, y: 250, parentId: 'l_c1' },     
        { id: 'l_c4', label: 'Appendices', type: 'item', x: 1300, y: 350, parentId: 'l_c1' },   
        { id: 'l_c5', label: 'Final Reports', type: 'item', x: 1500, y: 300, parentId: 'l_c3' }, 

        { id: 'l_r1', label: 'Top 5 Risks', type: 'warning', x: 1100, y: 600, parentId: 'd_risk' },
        { id: 'l_l1', label: 'Procurement', type: 'item', x: 600, y: 850, parentId: 'd_log' },
    ];

    const connections: Connection[] = [
        { from: 'root_detail', to: 'd_sched' }, { from: 'root_detail', to: 'd_cost' },
        { from: 'root_detail', to: 'd_risk' }, { from: 'root_detail', to: 'd_log' },
        { from: 'root_detail', to: 'd_qa' }, { from: 'root_detail', to: 'd_stake' },

        { from: 'd_sched', to: 'l_s1' }, { from: 'd_sched', to: 'l_s2' },
        
        { from: 'd_cost', to: 'l_c1' }, { from: 'd_cost', to: 'l_c2' },
        { from: 'l_c1', to: 'l_c3' }, { from: 'l_c1', to: 'l_c4' }, 
        { from: 'l_c3', to: 'l_c5' },

        { from: 'd_risk', to: 'l_r1' }, { from: 'd_log', to: 'l_l1' },
    ];

    return { label: `${projectTitle} - Anatomy`, nodes, connections, crossLinks: [] };
};

// NEW FUNCTION: Company Operations Overview Map (Hierarchy)
export const getCompanyOverviewData = () => {
   const nodes: MapNode[] = [
      // HQ Root
      { id: 'hq_root', label: 'AJBowler Consult', type: 'root', x: 600, y: 100, icon: GlobeAltIcon, description: 'Managing Director & Global Operations', imageUrl: ANDREW_BOWLER_IMG },
      
      // Projects (Level 1)
      { 
        id: 'proj_skyline', 
        label: 'Skyline Tower', 
        type: 'project', 
        x: 250, 
        y: 300, 
        color: 'bg-indigo-600', 
        description: 'Contract Management\nCommercial Management\nClaims Drafting (EOT/VO\'s)' 
      },
      { 
        id: 'proj_metro', 
        label: 'Metro Phase 2', 
        type: 'project', 
        x: 600, 
        y: 300, 
        color: 'bg-emerald-600', 
        description: 'Dispute Resolution & Arbitration Management\nQuantum/Engineering/Delay Experts\nDisruption Analysis' 
      },
      { 
        id: 'proj_harbor', 
        label: 'Harbor Warehouse', 
        type: 'project', 
        x: 950, 
        y: 300, 
        color: 'bg-orange-500', 
        description: 'Prep & Audit of Programme Baseline\nIntl Property/Risk Management\nFraud Investigation/Liquidation' 
      },

      // Leads (Level 2)
      // Skyline Team (Commercial & EOT)
      { id: 'lead_alan', label: 'Alan Clarke', type: 'expert', role: 'Quantum', x: 150, y: 500, imageUrl: ALAN_CLARKE_IMG }, // Commercial
      { id: 'lead_ian', label: 'Ian Bartlett', type: 'expert', role: 'Delay', x: 350, y: 500, imageUrl: IAN_BARTLETT_IMG }, // EOT/Claims

      // Metro Team (Arbitration & Disruption)
      { id: 'lead_fernando', label: 'Fernando Ortega', type: 'expert', role: 'Legal', x: 500, y: 500, imageUrl: FERNANDO_ORTEGA_IMG }, // Dispute/Arbitration
      { id: 'lead_zohib', label: 'Zohib Habib', type: 'expert', role: 'Forensic', x: 700, y: 500, imageUrl: ZOHIB_HABIB_IMG }, // Disruption

      // Harbor Team (Fraud/Liquidation & Baseline)
      { id: 'lead_david', label: 'David Hugill', type: 'expert', role: 'Forensic', x: 850, y: 500, imageUrl: DAVID_HUGILL_IMG }, // Fraud/Liquidation
      { id: 'lead_philip', label: 'Philip Hoskins', type: 'expert', role: 'Delay', x: 1050, y: 500, imageUrl: PHILIP_HOSKINS_IMG }, // Programme Baseline
   ];

   const connections: Connection[] = [
      { from: 'hq_root', to: 'proj_skyline' },
      { from: 'hq_root', to: 'proj_metro' },
      { from: 'hq_root', to: 'proj_harbor' },
      
      { from: 'proj_skyline', to: 'lead_alan' },
      { from: 'proj_skyline', to: 'lead_ian' },
      
      { from: 'proj_metro', to: 'lead_fernando' },
      { from: 'proj_metro', to: 'lead_zohib' },
      
      { from: 'proj_harbor', to: 'lead_david' },
      { from: 'proj_harbor', to: 'lead_philip' },
   ];

   return { nodes, connections };
};

// NEW HELPER: Get Sidebar Data (Emails, Files, Child Updates) based on node selection
export const getNodeSidebarData = (node: MapNode, allNodes: MapNode[]): SidebarData => {
    // 1. Identify if Parent or Leaf
    const children = allNodes.filter(n => n.parentId === node.id);
    const isParent = children.length > 0;
    
    // 2. Identify Expert
    const expertName = node.assignedExpert?.name || (isParent ? 'Lead Expert' : 'Project Admin');
    const expertImg = node.assignedExpert?.imageUrl || "https://ui-avatars.com/api/?name=Expert&background=random";

    // 3. Mock Email Logic
    let email: MockEmail = {
        id: 'msg_1',
        from: expertName,
        fromImg: expertImg,
        subject: `Update: ${node.label} Status`,
        date: '10:45 AM',
        preview: `I've updated the ${node.label} documentation. Please review the attached files.`,
        priority: 'Normal'
    };

    if (node.label.includes('Cost')) {
        email.subject = "Budget Variance Alert";
        email.preview = "We are seeing a 5% drift in the substructure package. See attached Excel.";
        email.priority = "High";
    } else if (node.label.includes('Schedule')) {
        email.subject = "Baseline V4 Approval";
        email.preview = "The client has accepted the V4 baseline. Critical path remains unaffected.";
    }

    // 4. Mock File Logic
    let files: MockFile[] = [
        { id: 'f1', name: `${node.label}_Report.pdf`, type: 'pdf', size: '2.4 MB', date: 'Today' },
        { id: 'f2', name: `${node.label}_Data.xlsx`, type: 'xls', size: '850 KB', date: 'Yesterday' }
    ];

    if (isParent) {
        // Aggregate files from children (simplified mock)
        children.forEach((child, i) => {
             if (i < 2) { // Limit to 2 child files to avoid clutter
                 files.push({
                     id: `fc_${child.id}`,
                     name: `${child.label}_Summary.pdf`,
                     type: 'pdf',
                     size: '1.2 MB',
                     date: '2d ago'
                 });
             }
        });
    }

    // 5. Parent Aggregation (Sub-node updates)
    let subNodeUpdates: { label: string; status: string; completion: number }[] | undefined;
    
    if (isParent) {
        subNodeUpdates = children.map(child => ({
            label: child.label,
            status: child.label.includes('Invoices') ? 'Processing' : (child.label.includes('Risk') ? 'Flagged' : 'On Track'),
            completion: Math.floor(Math.random() * 40) + 60 // Random 60-100%
        }));
    }

    return {
        latestUpdate: email,
        documents: files,
        subNodeUpdates
    };
};