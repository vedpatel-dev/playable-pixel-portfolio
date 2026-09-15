/**
 * Single source of truth for every piece of portfolio content.
 * Sections render from here, and the AI agent's system prompt is built from
 * here too, so the agent can never drift from what the site actually says.
 */

export const profile = {
  name: "Ved Patel",
  fullName: "Ved Rajeshkumar Patel",
  role: "Software Engineer",
  tagline: "Software Development · AI Agents · Automation",
  location: "Tampa, Florida, United States",
  email: "vedpatel.dev@gmail.com",
  phone: "813-570-2647",
  linkedin: "https://www.linkedin.com/in/ved-rajeshkumar-patel-vrp/",
  linkedinLabel: "ved-rajeshkumar-patel-vrp",
  github: "https://github.com/vedpatel-dev",
  githubLabel: "github.com/vedpatel-dev",
  summary:
    "Computer Science student at the University of South Florida with hands-on experience in software engineering, AI agent development, and automated testing pipelines. Focused on leveraging Python, cloud technologies (such as Azure), and data processing libraries to build efficient tools and workflows. Practical background includes developing document evaluation pipelines, orchestrating multi-device configuration software, and deploying multi-agent AI systems to streamline organizational inquiries. Comfortable working across the stack with a strong emphasis on data analytics, API integrations, and practical problem-solving.",
} as const;

/** Headline numbers used for the animated HUD counters. */
export const stats = [
  { label: "GPA", value: 3.8, decimals: 1, suffix: "", accent: "cyan" },
  {
    label: "Inquiries Automated",
    value: 2500,
    decimals: 0,
    suffix: "+",
    accent: "magenta",
  },
  {
    label: "Test Cases Parsed",
    value: 10000,
    decimals: 0,
    suffix: "+",
    accent: "amber",
  },
  {
    label: "SLA Compliance",
    value: 95,
    decimals: 0,
    suffix: "%",
    accent: "violet",
  },
] as const;

export const education = {
  school: "University of South Florida",
  degree: "Bachelor of Science in Computer Science",
  graduation: "Expected Graduation: May 2028",
  gpa: "GPA: 3.8",
  coursework: [
    {
      title: "Data Structures & Analysis of Algorithms",
      detail:
        "Covered core algorithmic concepts, performance optimizations, and efficient memory management using C++ and Python.",
    },
    {
      title: "Artificial Intelligence & Machine Learning",
      detail:
        "Explored foundational models, data pipelines, and predictive algorithms, establishing a basis for projects in natural language processing and data classification.",
    },
    {
      title: "Discrete Structures & Linear Systems",
      detail:
        "Gained mathematical fundamentals necessary for vector-based workflows and quantitative finance models.",
    },
    {
      title: "Probability & Statistics",
      detail:
        "Applied statistical methods crucial for building models, calculating standard deviations for financial applications, and evaluating test data metrics.",
    },
    {
      title: "Computer Architecture",
      detail:
        "Developed a foundational understanding of hardware-software interaction, aiding in low-level test automation and configuration workflows.",
    },
  ],
} as const;

export const skillGroups = [
  {
    category: "Programming Languages",
    icon: "code",
    accent: "cyan",
    items: [
      "Python",
      "C/C++",
      "SQL",
      "JavaScript",
      "HTML",
      "CSS",
      "JSON",
      "PowerShell",
      "KQL",
      "Bash/Shell",
      "DAX",
    ],
  },
  {
    category: "Libraries & Frameworks",
    icon: "stack",
    accent: "magenta",
    items: [
      "NumPy",
      "Pandas",
      "SciPy",
      "Scikit-Learn",
      "Pytest",
      "PyTorch",
      "Plotly",
      "Selenium",
      "LangChain",
      "React",
      "FastAPI",
    ],
  },
  {
    category: "Developer & Cloud Tools",
    icon: "cloud",
    accent: "amber",
    items: [
      "Azure Portal",
      "Azure OpenAI",
      "Azure AI Foundry",
      "Claude Code",
      "Codex",
      "Cursor",
      "n8n",
      "Git/GitHub",
      "Power Apps",
      "Copilot Studio",
      "VS Code",
      "Power BI",
      "Jupyter Notebooks",
      "Postman",
      "Azure DevOps",
      "Linux/Unix",
      "Dataverse",
    ],
  },
] as const;

export const certifications = [
  "Streamlining Your Work with Microsoft Copilot",
  "Learning Arduino: Foundations",
  "Stanford University's Code in Place",
  "Introduction to Artificial Intelligence",
  "Machine Learning",
] as const;

export const experience = [
  {
    title: "AI Agent Student Developer",
    org: "University of South Florida Information Technology",
    location: "Remote (Tampa, FL)",
    period: "December 2024 – Present",
    current: true,
    accent: "cyan",
    blurb:
      "Responsible for developing internal tools and automated agents to assist with routing and handling university IT inquiries. The role involves designing flows that connect various Microsoft services and deploying internal AI solutions.",
    bullets: [
      "Developed internal support agents using Copilot Studio and Claude 3.5 Sonnet to help automate and manage over 2,500 user inquiries.",
      "Utilized the Microsoft Graph API to orchestrate data movement and communication flows across SharePoint, Microsoft Teams, and Outlook.",
      "Created custom MCP (Model Context Protocol) servers in Python to expand the tool-calling capabilities of Claude Code, utilizing REST APIs and local file indexing to help reduce manual information retrieval time by 40%.",
      "Set up vector-based intent matching workflows using Azure AI Foundry, which helped reduce misrouting of tickets by 85% through the implementation of cosine similarity and structured JSON logic.",
      "Managed continuous integration and deployment (CI/CD) pipelines for internal large language model applications via Azure DevOps.",
      "Created Power BI semantic models with DAX measures to visualize chatbot analytics, tracking conversation completion rates, user satisfaction scores, and response accuracy metrics across departments.",
      "Achieved a 95% SLA compliance rate while automating responses to thousands of monthly inquiries.",
    ],
    tech: [
      "Copilot Studio",
      "Claude 3.5 Sonnet",
      "Microsoft Graph API",
      "Python",
      "MCP",
      "Azure AI Foundry",
      "Azure DevOps",
      "Power BI",
      "DAX",
    ],
  },
  {
    title: "Software Engineering Intern",
    org: "UL Solutions",
    location: "Fremont, CA",
    period: "May 2026 – August 2026",
    current: false,
    accent: "magenta",
    blurb:
      "Focused on process automation and test data analysis to reduce the overhead associated with large-scale device configurations and outcome evaluations.",
    bullets: [
      "Developed a document evaluation pipeline in Python, utilizing pandas, NumPy, and scikit-learn.",
      "Trained a classification model to automatically parse and evaluate over 10,000 test case outcomes, which reduced the manual review time required by the team by 92%.",
      "Built automated software utilizing Python's subprocess and paramiko libraries to streamline configuration workflows for multiple devices.",
      "Supported device setups across Wi-Fi (6E), Bluetooth, and LTE/5G stacks, effectively cutting manual deployment overhead by 89%.",
    ],
    tech: [
      "Python",
      "pandas",
      "NumPy",
      "scikit-learn",
      "subprocess",
      "paramiko",
      "Wi-Fi 6E",
      "LTE/5G",
    ],
  },
  {
    title: "Software Testing Intern",
    org: "UL Solutions",
    location: "Fremont, CA",
    period: "May 2025 – August 2025",
    current: false,
    accent: "amber",
    blurb:
      "Responsible for ensuring hardware devices met regulatory compliance standards by creating and executing automated QA workflows.",
    bullets: [
      "Designed and implemented QA testing workflows for devices running Wi-Fi (802.11ax), Bluetooth 5.0, and LTE/5G protocols.",
      "Validated more than 1,200 individual units against industry compliance standards using Python-based test suites.",
      "Utilized pytest alongside pyserial for direct device communication, and applied pandas and NumPy to analyze the resulting test data.",
      "Successfully eliminated 86% of the repetitive manual testing processes through scripting and automation.",
      "Adhered to FCC and ISED guidelines during testing, creating an indirect impact on millions of cellphone users.",
    ],
    tech: [
      "pytest",
      "pyserial",
      "pandas",
      "NumPy",
      "802.11ax",
      "Bluetooth 5.0",
      "FCC / ISED",
    ],
  },
  {
    title: "Office Executive",
    org: "Royal Castor Products Limited",
    location: "India",
    period: "June 2023 – June 2024",
    current: false,
    accent: "violet",
    blurb:
      "Earlier professional experience in the sales department, spanning order operations, cross-department communication, and team mentorship.",
    bullets: [
      "Worked in the sales department, organizing sales and purchase orders and communicating directly with customers.",
      "Delivered presentations across departments and ensured projects were completed on time and within budget.",
      "Led and mentored a team of interns to complete tasks within tight deadlines, while collaborating effectively with colleagues to achieve shared goals.",
    ],
    tech: ["Sales Operations", "Presentations", "Team Mentorship"],
  },
] as const;

export const projects = [
  {
    name: "Quantitative Finance Dashboard",
    period: "December 2025",
    accent: "cyan",
    stack: ["Python", "NumPy", "Pandas", "Matplotlib", "SciPy", "Plotly", "API"],
    blurb:
      "A data analytics and interactive visualization platform designed to calculate options pricing and display financial metrics.",
    bullets: [
      "Engineered an option pricing engine using vectorized NumPy operations and SciPy algorithms to compute Black-Scholes premiums and Greek sensitivities efficiently.",
      "Constructed a fault-tolerant data pipeline using Pandas and the yfinance API to fetch and manage a year of historical market data, ensuring 100% uptime with a fallback simulation mechanism.",
      "Calculated 30-day rolling volatility and visualized the data through an interactive dashboard built with Streamlit.",
      "Implemented Plotly and Matplotlib to render 3D volatility surfaces, static heatmaps, and P&L charts, translating raw data into readable insights.",
    ],
    repo: "https://github.com/vedpatel-dev/Option-Pricing-Volatility-Analysis",
    live: "https://option-pricing-volatility-analysis.streamlit.app/",
  },
  {
    name: "Autonomous AI Voice Agent",
    period: "February 2026",
    accent: "magenta",
    stack: ["Python", "FastAPI", "Twilio", "Gemini API", "JSON"],
    blurb:
      "A communication tool integrating telephony and multimodal AI to handle conversational inputs and extract structured data.",
    bullets: [
      "Developed a caller agent that connects Twilio with the Gemini Multimodal Live API using asynchronous Python and bidirectional WebSockets.",
      "Created a backend pipeline with FastAPI that enforced strict JSON schemas for data formatting.",
      "Routed live audio payloads to the language model to process verbal inputs and extract relevant, structured data efficiently.",
    ],
    repo: "https://github.com/vedpatel-dev/ai-caller-agent",
    live: null,
  },
] as const;

export const leadership = [
  {
    role: "Tech Lead",
    org: "Google Developer Student Clubs",
    location: "University of South Florida",
    period: "November 2024 – June 2025",
    accent: "cyan",
    bullets: [
      "Developed machine learning models to predict financial asset management performance and Olympic medal outcomes using linear regression techniques.",
      "Presented these findings and codebase walkthroughs to club members during technical workshops.",
      "Engineered deep learning image and NLP classification systems using Keras, training neural networks on large-scale datasets (27,000+ records) to achieve a 95% precision rate.",
      "Developed an Image Corruption Detection system using PyTorch and TensorFlow, training CNN architectures on Kaggle datasets to identify visual artifacts with 86% precision.",
      "Implemented object detection using OpenCV and YOLOv5, optimizing algorithm performance for computer vision.",
    ],
  },
  {
    role: "Operation Lead",
    org: "Association for Computing Machinery",
    location: "University of South Florida",
    period: "October 2024 – September 2025",
    accent: "magenta",
    bullets: [
      "Directed operations for a 32-member executive board, documenting strategic decisions and maintaining organizational records.",
      "Managed comprehensive budget planning and coordinated logistics for large-scale club events that hosted over 190 attendees, ensuring all activities met university regulatory compliance.",
    ],
  },
  {
    role: "Events Chair",
    org: "Hindu Student Council",
    location: "University of South Florida",
    period: "August 2024 – August 2025",
    accent: "amber",
    bullets: [
      "Finalized events for the semester, accounting for all major clash-free dates.",
      "Collaborated with other USF clubs to produce merged events, managing bulk food purchasing, music setup, and decor.",
    ],
  },
  {
    role: "Volunteer",
    org: "Rotary Club",
    location: "India",
    period: "October 2023 – August 2024",
    accent: "violet",
    bullets: [
      "Collaborated with a team to distribute food and stationery to children, organizing more than 30 events and camps within a defined budget, supply, and time frame.",
      "Mentored more than 400 high school students from government-funded schools on career goals and skill development.",
      "Greeted and motivated young students to excel in their academic careers.",
    ],
  },
] as const;

export const beyondTheCode =
  "I'm always tinkering with code even when I'm off the clock. Lately, my main side-quest has been writing and testing algorithmic trading strategies to see if I can find sustainable, long-term market trends. I'm also slightly obsessed with optimizing my daily routine — I use AI to automate my life wherever possible. If I catch myself doing the same repetitive task a few times, I'm already thinking about how to build a workflow to do it for me.";

/** Easter egg behind the arcade coin slot in the contact section. */
export const confession = {
  buttonLabel: "Cringe.log",
  heading: "CRINGE.LOG — ENTRY 001",
  story:
    "I overthought my first day outfit so much that I showed up in a full suit, only to realize everyone else in the IT department was wearing t-shirts and jeans.",
  kicker: "Dress code acquired. Lesson retained.",
} as const;

export const navSections = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "experience", label: "WORK" },
  { id: "projects", label: "PROJECTS" },
  { id: "education", label: "EDU" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "contact", label: "CONTACT" },
] as const;
