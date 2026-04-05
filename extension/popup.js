// ═══════════════════════════════════════════════════════════════
//  Intelligent Job Recommendation Assistant – Popup Logic
// ═══════════════════════════════════════════════════════════════

(function () {
  "use strict";

  // ── Skill Resources Mapping ────────────────────────────────────
  const SKILL_RESOURCES = {
    "python": {
      free: [
        { name: "Python Official Tutorial", link: "https://docs.python.org/3/tutorial/" },
        { name: "freeCodeCamp Python", link: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" }
      ],
      paid: [
        { name: "Complete Python Bootcamp (Udemy)", link: "https://www.udemy.com/course/complete-python-bootcamp/" }
      ],
      certification: [
        { name: "PCEP – Certified Entry-Level Python", platform: "Python Institute" }
      ]
    },
    "javascript": {
      free: [
        { name: "MDN JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
        { name: "JavaScript.info", link: "https://javascript.info/" }
      ],
      paid: [
        { name: "The Complete JavaScript Course (Udemy)", link: "https://www.udemy.com/course/the-complete-javascript-course/" }
      ],
      certification: [
        { name: "OpenJS Node.js Certification", platform: "Linux Foundation" }
      ]
    },
    "react": {
      free: [
        { name: "React Official Docs", link: "https://react.dev" },
        { name: "freeCodeCamp React Course", link: "https://www.freecodecamp.org/learn/front-end-development-libraries/" }
      ],
      paid: [
        { name: "React – The Complete Guide (Udemy)", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" }
      ],
      certification: [
        { name: "Meta Front-End Developer Certificate", platform: "Coursera" }
      ]
    },
    "typescript": {
      free: [
        { name: "TypeScript Handbook", link: "https://www.typescriptlang.org/docs/handbook/" },
        { name: "TypeScript Exercises", link: "https://typescript-exercises.github.io/" }
      ],
      paid: [
        { name: "Understanding TypeScript (Udemy)", link: "https://www.udemy.com/course/understanding-typescript/" }
      ],
      certification: []
    },
    "node.js": {
      free: [
        { name: "Node.js Official Docs", link: "https://nodejs.org/en/docs/" },
        { name: "The Odin Project – Node.js", link: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs" }
      ],
      paid: [
        { name: "Node.js – The Complete Guide (Udemy)", link: "https://www.udemy.com/course/nodejs-the-complete-guide/" }
      ],
      certification: [
        { name: "OpenJS Node.js Application Developer", platform: "Linux Foundation" }
      ]
    },
    "machine learning": {
      free: [
        { name: "Andrew Ng ML Course (Coursera audit)", link: "https://www.coursera.org/learn/machine-learning" },
        { name: "Google ML Crash Course", link: "https://developers.google.com/machine-learning/crash-course" }
      ],
      paid: [
        { name: "Machine Learning A-Z (Udemy)", link: "https://www.udemy.com/course/machinelearning/" }
      ],
      certification: [
        { name: "AWS Machine Learning Specialty", platform: "AWS" },
        { name: "Google Professional ML Engineer", platform: "Google Cloud" }
      ]
    },
    "deep learning": {
      free: [
        { name: "Deep Learning Specialization (Coursera audit)", link: "https://www.coursera.org/specializations/deep-learning" },
        { name: "fast.ai Practical Deep Learning", link: "https://course.fast.ai/" }
      ],
      paid: [
        { name: "Deep Learning A-Z (Udemy)", link: "https://www.udemy.com/course/deeplearning/" }
      ],
      certification: [
        { name: "TensorFlow Developer Certificate", platform: "Google" }
      ]
    },
    "tensorflow": {
      free: [
        { name: "TensorFlow Official Tutorials", link: "https://www.tensorflow.org/tutorials" }
      ],
      paid: [
        { name: "TensorFlow Developer Certificate Course (Udemy)", link: "https://www.udemy.com/course/tensorflow-developer-certificate-machine-learning-zero-to-mastery/" }
      ],
      certification: [
        { name: "TensorFlow Developer Certificate", platform: "Google" }
      ]
    },
    "pytorch": {
      free: [
        { name: "PyTorch Official Tutorials", link: "https://pytorch.org/tutorials/" },
        { name: "freeCodeCamp PyTorch Course", link: "https://www.youtube.com/watch?v=V_xro1bcAuE" }
      ],
      paid: [
        { name: "PyTorch for Deep Learning (Udemy)", link: "https://www.udemy.com/course/pytorch-for-deep-learning-with-python-bootcamp/" }
      ],
      certification: []
    },
    "docker": {
      free: [
        { name: "Docker Official Getting Started", link: "https://docs.docker.com/get-started/" },
        { name: "Play with Docker", link: "https://labs.play-with-docker.com/" }
      ],
      paid: [
        { name: "Docker & Kubernetes Complete Guide (Udemy)", link: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/" }
      ],
      certification: [
        { name: "Docker Certified Associate", platform: "Mirantis" }
      ]
    },
    "kubernetes": {
      free: [
        { name: "Kubernetes Official Docs", link: "https://kubernetes.io/docs/tutorials/" },
        { name: "KodeKloud Free Labs", link: "https://kodekloud.com/" }
      ],
      paid: [
        { name: "CKA Certification Course (Udemy)", link: "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/" }
      ],
      certification: [
        { name: "CKA – Certified Kubernetes Administrator", platform: "CNCF" }
      ]
    },
    "aws": {
      free: [
        { name: "AWS Free Tier + Training", link: "https://aws.amazon.com/training/digital/" },
        { name: "AWS Skill Builder", link: "https://skillbuilder.aws/" }
      ],
      paid: [
        { name: "AWS Solutions Architect Associate (Udemy)", link: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/" }
      ],
      certification: [
        { name: "AWS Solutions Architect Associate", platform: "AWS" },
        { name: "AWS Cloud Practitioner", platform: "AWS" }
      ]
    },
    "sql": {
      free: [
        { name: "SQLBolt Interactive Tutorial", link: "https://sqlbolt.com/" },
        { name: "Khan Academy SQL", link: "https://www.khanacademy.org/computing/computer-programming/sql" }
      ],
      paid: [
        { name: "The Complete SQL Bootcamp (Udemy)", link: "https://www.udemy.com/course/the-complete-sql-bootcamp/" }
      ],
      certification: [
        { name: "Oracle Database SQL Certified Associate", platform: "Oracle" }
      ]
    },
    "git": {
      free: [
        { name: "Pro Git Book", link: "https://git-scm.com/book/en/v2" },
        { name: "Learn Git Branching", link: "https://learngitbranching.js.org/" }
      ],
      paid: [],
      certification: []
    },
    "html": {
      free: [
        { name: "MDN HTML Basics", link: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
        { name: "freeCodeCamp Responsive Web Design", link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" }
      ],
      paid: [],
      certification: []
    },
    "css": {
      free: [
        { name: "MDN CSS Guide", link: "https://developer.mozilla.org/en-US/docs/Learn/CSS" },
        { name: "CSS-Tricks", link: "https://css-tricks.com/" }
      ],
      paid: [
        { name: "Advanced CSS & Sass (Udemy)", link: "https://www.udemy.com/course/advanced-css-and-sass/" }
      ],
      certification: []
    },
    "data visualization": {
      free: [
        { name: "D3.js Official Tutorials", link: "https://d3js.org/" },
        { name: "freeCodeCamp Data Visualization", link: "https://www.freecodecamp.org/learn/data-visualization/" }
      ],
      paid: [
        { name: "Data Visualization with Tableau (Coursera)", link: "https://www.coursera.org/specializations/data-visualization" }
      ],
      certification: [
        { name: "Tableau Desktop Specialist", platform: "Tableau" }
      ]
    },
    "statistics": {
      free: [
        { name: "Khan Academy Statistics", link: "https://www.khanacademy.org/math/statistics-probability" },
        { name: "Stat Quest (YouTube)", link: "https://www.youtube.com/c/joshstarmer" }
      ],
      paid: [
        { name: "Statistics for Data Science (Udemy)", link: "https://www.udemy.com/course/statistics-for-data-science-and-business-analysis/" }
      ],
      certification: []
    },
    "figma": {
      free: [
        { name: "Figma Official Tutorials", link: "https://help.figma.com/hc/en-us/categories/360002051613" }
      ],
      paid: [
        { name: "Figma UI/UX Design Essentials (Udemy)", link: "https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/" }
      ],
      certification: []
    },
    "linux": {
      free: [
        { name: "Linux Journey", link: "https://linuxjourney.com/" },
        { name: "The Linux Command Line (Book)", link: "https://linuxcommand.org/tlcl.php" }
      ],
      paid: [],
      certification: [
        { name: "CompTIA Linux+", platform: "CompTIA" },
        { name: "LFCS – Linux Foundation Certified Sysadmin", platform: "Linux Foundation" }
      ]
    },
    "java": {
      free: [
        { name: "Oracle Java Tutorials", link: "https://docs.oracle.com/javase/tutorial/" },
        { name: "Codecademy Java (Free Tier)", link: "https://www.codecademy.com/learn/learn-java" }
      ],
      paid: [
        { name: "Java Programming Masterclass (Udemy)", link: "https://www.udemy.com/course/java-the-complete-java-developer-course/" }
      ],
      certification: [
        { name: "Oracle Certified Associate Java SE", platform: "Oracle" }
      ]
    },
    "mongodb": {
      free: [
        { name: "MongoDB University", link: "https://university.mongodb.com/" }
      ],
      paid: [],
      certification: [
        { name: "MongoDB Associate Developer", platform: "MongoDB" }
      ]
    },
    "flutter": {
      free: [
        { name: "Flutter Official Docs", link: "https://docs.flutter.dev/" },
        { name: "Flutter Codelabs", link: "https://docs.flutter.dev/codelabs" }
      ],
      paid: [
        { name: "Flutter & Dart Complete Guide (Udemy)", link: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/" }
      ],
      certification: []
    },
    "solidity": {
      free: [
        { name: "CryptoZombies", link: "https://cryptozombies.io/" },
        { name: "Solidity by Example", link: "https://solidity-by-example.org/" }
      ],
      paid: [
        { name: "Ethereum & Solidity Complete Guide (Udemy)", link: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/" }
      ],
      certification: []
    },
    "nlp": {
      free: [
        { name: "Hugging Face NLP Course", link: "https://huggingface.co/learn/nlp-course" },
        { name: "Stanford NLP with Deep Learning (YouTube)", link: "https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ" }
      ],
      paid: [
        { name: "NLP with Transformers (Udemy)", link: "https://www.udemy.com/" }
      ],
      certification: []
    },
    "rest api": {
      free: [
        { name: "RESTful API Design (MDN)", link: "https://developer.mozilla.org/en-US/docs/Glossary/REST" },
        { name: "Postman Learning Center", link: "https://learning.postman.com/" }
      ],
      paid: [],
      certification: []
    },
    "ci/cd": {
      free: [
        { name: "GitHub Actions Docs", link: "https://docs.github.com/en/actions" },
        { name: "GitLab CI Tutorial", link: "https://docs.gitlab.com/ee/ci/" }
      ],
      paid: [],
      certification: []
    },
    "terraform": {
      free: [
        { name: "HashiCorp Learn – Terraform", link: "https://developer.hashicorp.com/terraform/tutorials" }
      ],
      paid: [
        { name: "Terraform for Beginners (Udemy)", link: "https://www.udemy.com/course/terraform-beginner-to-advanced/" }
      ],
      certification: [
        { name: "HashiCorp Certified: Terraform Associate", platform: "HashiCorp" }
      ]
    },
    "azure": {
      free: [
        { name: "Microsoft Learn – Azure", link: "https://learn.microsoft.com/en-us/training/azure/" }
      ],
      paid: [],
      certification: [
        { name: "Azure Fundamentals AZ-900", platform: "Microsoft" },
        { name: "Azure Solutions Architect Expert", platform: "Microsoft" }
      ]
    },
    "gcp": {
      free: [
        { name: "Google Cloud Skills Boost", link: "https://www.cloudskillsboost.google/" }
      ],
      paid: [],
      certification: [
        { name: "Google Associate Cloud Engineer", platform: "Google Cloud" }
      ]
    },
    "pandas": {
      free: [
        { name: "Pandas Official Docs", link: "https://pandas.pydata.org/docs/getting_started/" },
        { name: "Kaggle Pandas Course", link: "https://www.kaggle.com/learn/pandas" }
      ],
      paid: [],
      certification: []
    },
    "numpy": {
      free: [
        { name: "NumPy Official Tutorial", link: "https://numpy.org/doc/stable/user/absolute_beginners.html" }
      ],
      paid: [],
      certification: []
    },
    "scikit-learn": {
      free: [
        { name: "scikit-learn Official Tutorials", link: "https://scikit-learn.org/stable/tutorial/" }
      ],
      paid: [],
      certification: []
    },
    "selenium": {
      free: [
        { name: "Selenium Official Docs", link: "https://www.selenium.dev/documentation/" }
      ],
      paid: [
        { name: "Selenium WebDriver with Java (Udemy)", link: "https://www.udemy.com/" }
      ],
      certification: []
    },
    "angular": {
      free: [
        { name: "Angular Official Tutorial", link: "https://angular.io/tutorial" }
      ],
      paid: [
        { name: "Angular – The Complete Guide (Udemy)", link: "https://www.udemy.com/course/the-complete-guide-to-angular-2/" }
      ],
      certification: []
    },
    "vue": {
      free: [
        { name: "Vue.js Official Docs", link: "https://vuejs.org/guide/introduction.html" }
      ],
      paid: [
        { name: "Vue – The Complete Guide (Udemy)", link: "https://www.udemy.com/course/vuejs-2-the-complete-guide/" }
      ],
      certification: []
    },
    "react native": {
      free: [
        { name: "React Native Official Docs", link: "https://reactnative.dev/docs/getting-started" }
      ],
      paid: [
        { name: "React Native – Practical Guide (Udemy)", link: "https://www.udemy.com/course/react-native-the-practical-guide/" }
      ],
      certification: []
    }
  };

  // ── Get resources for a skill ──────────────────────────────────
  function getSkillResources(skill) {
    const normalized = skill.toLowerCase().trim();
    if (SKILL_RESOURCES[normalized]) {
      return SKILL_RESOURCES[normalized];
    }
    // Generic fallback
    return {
      free: [
        { name: `Search "${skill}" on YouTube`, link: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}` },
        { name: `Search "${skill}" on freeCodeCamp`, link: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}` }
      ],
      paid: [
        { name: `Find "${skill}" courses on Udemy`, link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}` },
        { name: `Find "${skill}" courses on Coursera`, link: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}` }
      ],
      certification: []
    };
  }

  // ── Determine proficiency level ────────────────────────────────
  function getUserLevel(profileData) {
    const skillCount = (profileData.skills || []).length;
    const projectCount = (profileData.projects || []).length;
    const hasCerts = (profileData.certifications || []).length > 0;
    if (skillCount >= 8 && projectCount >= 3 && hasCerts) return "advanced";
    if (skillCount >= 4 || projectCount >= 2) return "intermediate";
    return "beginner";
  }

  // ── Job Roles Dataset ──────────────────────────────────────────
  const JOB_ROLES = [
    {
      title: "Data Scientist",
      description: "Analyze complex datasets, build predictive models, and derive actionable insights using statistical methods and machine learning.",
      requiredSkills: ["python", "machine learning", "statistics", "pandas", "numpy", "sql", "data visualization", "r", "tensorflow", "scikit-learn", "deep learning", "data analysis"],
      keywords: ["data", "analytics", "model", "prediction", "regression", "classification", "nlp", "neural network", "jupyter", "matplotlib", "seaborn", "big data", "hadoop", "spark"]
    },
    {
      title: "ML Engineer",
      description: "Design, build, and deploy machine learning systems at scale. Bridge the gap between data science prototypes and production systems.",
      requiredSkills: ["python", "machine learning", "tensorflow", "pytorch", "docker", "kubernetes", "mlops", "deep learning", "aws", "gcp", "api development"],
      keywords: ["model deployment", "pipeline", "training", "inference", "gpu", "optimization", "feature engineering", "ci/cd", "microservices", "cloud"]
    },
    {
      title: "Frontend Developer",
      description: "Build beautiful, responsive, and performant user interfaces using modern web technologies and frameworks.",
      requiredSkills: ["javascript", "html", "css", "react", "typescript", "responsive design", "git", "webpack", "tailwind", "vue", "angular"],
      keywords: ["ui", "ux", "component", "spa", "pwa", "accessibility", "figma", "sass", "redux", "next.js", "dom", "browser", "animation", "frontend"]
    },
    {
      title: "Backend Developer",
      description: "Design and implement server-side logic, APIs, databases, and system architecture for scalable applications.",
      requiredSkills: ["node.js", "python", "java", "sql", "nosql", "rest api", "docker", "git", "linux", "postgresql", "mongodb", "redis"],
      keywords: ["server", "api", "database", "microservices", "authentication", "caching", "queue", "graphql", "express", "django", "spring", "backend"]
    },
    {
      title: "Full Stack Developer",
      description: "Handle both frontend and backend development, building complete web applications from database to user interface.",
      requiredSkills: ["javascript", "html", "css", "react", "node.js", "sql", "git", "typescript", "rest api", "docker"],
      keywords: ["full stack", "mern", "mean", "web application", "deployment", "frontend", "backend", "database", "responsive", "agile"]
    },
    {
      title: "DevOps Engineer",
      description: "Automate infrastructure, manage CI/CD pipelines, and ensure reliable deployment and monitoring of applications.",
      requiredSkills: ["docker", "kubernetes", "aws", "linux", "ci/cd", "terraform", "ansible", "git", "python", "bash", "monitoring"],
      keywords: ["infrastructure", "automation", "cloud", "pipeline", "deployment", "containerization", "orchestration", "logging", "devops", "sre"]
    },
    {
      title: "Mobile App Developer",
      description: "Build native or cross-platform mobile applications for iOS and Android with great user experiences.",
      requiredSkills: ["react native", "flutter", "swift", "kotlin", "javascript", "dart", "mobile ui", "git", "rest api", "firebase"],
      keywords: ["ios", "android", "mobile", "app store", "push notification", "responsive", "native", "cross-platform", "expo"]
    },
    {
      title: "Cloud Architect",
      description: "Design and oversee cloud computing strategies, ensuring scalable, secure, and cost-effective cloud infrastructure.",
      requiredSkills: ["aws", "azure", "gcp", "terraform", "docker", "kubernetes", "networking", "security", "linux", "python"],
      keywords: ["cloud", "architecture", "scalability", "migration", "serverless", "lambda", "vpc", "load balancer", "iam", "cost optimization"]
    },
    {
      title: "Cybersecurity Analyst",
      description: "Protect organizations from cyber threats by monitoring, analyzing, and responding to security incidents.",
      requiredSkills: ["network security", "linux", "python", "firewalls", "siem", "penetration testing", "encryption", "incident response"],
      keywords: ["security", "vulnerability", "threat", "malware", "ethical hacking", "compliance", "audit", "forensics", "zero trust", "owasp"]
    },
    {
      title: "AI/NLP Engineer",
      description: "Build intelligent systems that understand and generate human language using cutting-edge AI techniques.",
      requiredSkills: ["python", "nlp", "transformers", "pytorch", "tensorflow", "deep learning", "machine learning", "hugging face", "bert", "gpt"],
      keywords: ["language model", "text classification", "sentiment", "chatbot", "rag", "embedding", "tokenization", "ai", "llm", "fine-tuning"]
    },
    {
      title: "Data Engineer",
      description: "Build and maintain data pipelines and infrastructure that enable analytics and machine learning at scale.",
      requiredSkills: ["python", "sql", "apache spark", "airflow", "kafka", "aws", "etl", "data warehousing", "hadoop", "docker"],
      keywords: ["pipeline", "data lake", "batch processing", "stream", "schema", "parquet", "dbt", "redshift", "snowflake", "data infrastructure"]
    },
    {
      title: "Product Manager",
      description: "Define product vision, strategy, and roadmap while collaborating with engineering, design, and business teams.",
      requiredSkills: ["product strategy", "agile", "user research", "data analysis", "roadmapping", "stakeholder management", "a/b testing"],
      keywords: ["product", "sprint", "backlog", "mvp", "okr", "kpi", "user story", "prioritization", "jira", "scrum", "market research"]
    },
    {
      title: "UI/UX Designer",
      description: "Create intuitive, beautiful user experiences through research, wireframing, prototyping, and visual design.",
      requiredSkills: ["figma", "user research", "wireframing", "prototyping", "visual design", "usability testing", "design systems"],
      keywords: ["ux", "ui", "design", "user experience", "interaction", "accessibility", "responsive", "sketch", "adobe xd", "typography"]
    },
    {
      title: "Blockchain Developer",
      description: "Build decentralized applications and smart contracts on blockchain platforms.",
      requiredSkills: ["solidity", "ethereum", "web3.js", "smart contracts", "javascript", "cryptography", "rust", "defi"],
      keywords: ["blockchain", "crypto", "nft", "dao", "token", "consensus", "dapp", "metamask", "hardhat", "truffle"]
    },
    {
      title: "Game Developer",
      description: "Design and develop interactive games using game engines, graphics programming, and creative storytelling.",
      requiredSkills: ["unity", "unreal engine", "c#", "c++", "game design", "3d modeling", "physics", "animation"],
      keywords: ["game", "gaming", "shader", "rendering", "multiplayer", "vr", "ar", "godot", "gameplay", "level design"]
    },
    {
      title: "QA / Test Engineer",
      description: "Ensure software quality through automated and manual testing, CI integration, and defect tracking.",
      requiredSkills: ["selenium", "jest", "cypress", "test automation", "python", "javascript", "ci/cd", "api testing", "performance testing"],
      keywords: ["testing", "qa", "quality", "regression", "unit test", "integration test", "bug", "defect", "playwright", "load testing"]
    },
    {
      title: "Embedded Systems Engineer",
      description: "Develop firmware and software for embedded devices, IoT systems, and hardware interfaces.",
      requiredSkills: ["c", "c++", "embedded systems", "rtos", "microcontrollers", "assembly", "iot", "linux", "hardware"],
      keywords: ["firmware", "embedded", "iot", "sensor", "protocol", "spi", "i2c", "uart", "arm", "raspberry pi", "arduino"]
    },
    {
      title: "Site Reliability Engineer",
      description: "Ensure system reliability, scalability, and performance through engineering practices and automation.",
      requiredSkills: ["linux", "python", "kubernetes", "docker", "monitoring", "terraform", "aws", "networking", "ci/cd", "bash"],
      keywords: ["sre", "reliability", "uptime", "incident", "alerting", "prometheus", "grafana", "chaos engineering", "slo", "sli"]
    },
    {
      title: "Technical Writer",
      description: "Create clear, concise technical documentation, API references, guides, and tutorials for developers and users.",
      requiredSkills: ["technical writing", "documentation", "markdown", "api documentation", "git", "communication"],
      keywords: ["docs", "documentation", "tutorial", "guide", "readme", "swagger", "openapi", "content", "editing"]
    },
    {
      title: "Solutions Architect",
      description: "Design end-to-end technical solutions that align business requirements with technology capabilities.",
      requiredSkills: ["system design", "aws", "azure", "architecture", "networking", "security", "databases", "cloud", "api design"],
      keywords: ["architecture", "solution", "enterprise", "integration", "scalability", "migration", "consulting", "rfc", "diagram"]
    }
  ];

  // ── Utility: Normalize text ────────────────────────────────────
  function normalize(text) {
    return (text || "").toLowerCase().replace(/[^a-z0-9\s\+\#\.\/]/g, " ").replace(/\s+/g, " ").trim();
  }

  function tokenize(text) {
    const normalized = normalize(text);
    const tokens = normalized.split(" ").filter(t => t.length > 1);
    // Also create bigrams
    const bigrams = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(tokens[i] + " " + tokens[i + 1]);
    }
    return [...tokens, ...bigrams];
  }

  // ── Extract skills from raw text ──────────────────────────────
  function extractSkillsFromText(rawText) {
    const knownSkills = [
      "python", "javascript", "java", "c++", "c#", "c", "r", "ruby", "go", "rust", "swift",
      "kotlin", "dart", "php", "scala", "typescript", "sql", "nosql", "bash", "shell",
      "html", "css", "sass", "less", "tailwind", "bootstrap",
      "react", "angular", "vue", "svelte", "next.js", "nuxt", "gatsby",
      "node.js", "express", "django", "flask", "spring", "fastapi", "rails",
      "react native", "flutter", "swift", "kotlin",
      "tensorflow", "pytorch", "scikit-learn", "keras", "opencv", "hugging face",
      "machine learning", "deep learning", "nlp", "computer vision", "ai",
      "data analysis", "data visualization", "statistics", "pandas", "numpy", "matplotlib",
      "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible",
      "ci/cd", "jenkins", "github actions", "gitlab ci",
      "git", "linux", "agile", "scrum",
      "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "firebase",
      "graphql", "rest api", "microservices", "serverless",
      "figma", "sketch", "adobe xd", "photoshop",
      "unity", "unreal engine", "blender",
      "solidity", "web3.js", "ethereum", "blockchain",
      "selenium", "cypress", "jest", "playwright",
      "apache spark", "hadoop", "kafka", "airflow",
      "networking", "security", "encryption", "penetration testing",
      "embedded systems", "iot", "rtos", "microcontrollers",
      "product management", "technical writing", "user research"
    ];

    const text = normalize(rawText);
    const found = [];
    for (const skill of knownSkills) {
      if (text.includes(skill) && !found.includes(skill)) {
        found.push(skill);
      }
    }
    return found;
  }

  // ── Recommendation Engine ─────────────────────────────────────
  function generateRecommendations(profileData) {
    // Consolidate user data
    const userSkillsRaw = (profileData.skills || []).map(s => normalize(s));
    const rawTextSkills = extractSkillsFromText(
      (profileData.raw || "") + " " +
      (profileData.projects || []).join(" ") + " " +
      (profileData.education || []).join(" ") + " " +
      (profileData.certifications || []).join(" ")
    );

    const allUserSkills = [...new Set([...userSkillsRaw, ...rawTextSkills])];

    const projectTokens = tokenize((profileData.projects || []).join(" "));
    const educationTokens = tokenize((profileData.education || []).join(" "));
    const certTokens = tokenize((profileData.certifications || []).join(" "));
    const allTokens = tokenize(
      allUserSkills.join(" ") + " " +
      (profileData.raw || "") + " " +
      (profileData.projects || []).join(" ") + " " +
      (profileData.education || []).join(" ") + " " +
      (profileData.certifications || []).join(" ")
    );

    const results = JOB_ROLES.map(role => {
      const roleSkillsNorm = role.requiredSkills.map(s => normalize(s));
      const roleKeywordsNorm = role.keywords.map(k => normalize(k));
      const allRoleTerms = [...roleSkillsNorm, ...roleKeywordsNorm];

      // Step 1: Skill match score (40%)
      let skillMatches = 0;
      const matchedSkills = [];
      const missingSkills = [];
      for (const rs of roleSkillsNorm) {
        const matched = allUserSkills.some(us => us.includes(rs) || rs.includes(us));
        if (matched) {
          skillMatches++;
          matchedSkills.push(rs);
        } else {
          missingSkills.push(rs);
        }
      }
      const skillScore = roleSkillsNorm.length > 0 ? skillMatches / roleSkillsNorm.length : 0;

      // Step 2: Project relevance (30%)
      let projectHits = 0;
      for (const term of allRoleTerms) {
        if (projectTokens.some(t => t.includes(term) || term.includes(t))) projectHits++;
      }
      const projectScore = allRoleTerms.length > 0 ? Math.min(projectHits / (allRoleTerms.length * 0.3), 1) : 0;

      // Step 3: Education relevance (20%)
      let eduHits = 0;
      for (const term of allRoleTerms) {
        if (educationTokens.some(t => t.includes(term) || term.includes(t))) eduHits++;
      }
      const eduScore = allRoleTerms.length > 0 ? Math.min(eduHits / (allRoleTerms.length * 0.25), 1) : 0;

      // Step 4: Certification relevance (10%)
      let certHits = 0;
      for (const term of allRoleTerms) {
        if (certTokens.some(t => t.includes(term) || term.includes(t))) certHits++;
      }
      const certScore = allRoleTerms.length > 0 ? Math.min(certHits / (allRoleTerms.length * 0.2), 1) : 0;

      // Rule-based boosting
      let boost = 0;
      const hasSkill = (s) => allUserSkills.some(us => us.includes(s));
      if (role.title === "Data Scientist" && hasSkill("python") && (hasSkill("machine learning") || hasSkill("statistics"))) boost += 0.1;
      if (role.title === "ML Engineer" && hasSkill("python") && (hasSkill("tensorflow") || hasSkill("pytorch"))) boost += 0.1;
      if (role.title === "Frontend Developer" && hasSkill("javascript") && (hasSkill("react") || hasSkill("html"))) boost += 0.1;
      if (role.title === "Backend Developer" && (hasSkill("node.js") || hasSkill("python") || hasSkill("java")) && hasSkill("sql")) boost += 0.1;
      if (role.title === "Full Stack Developer" && hasSkill("javascript") && (hasSkill("node.js") || hasSkill("react"))) boost += 0.08;
      if (role.title === "DevOps Engineer" && hasSkill("docker") && (hasSkill("aws") || hasSkill("kubernetes"))) boost += 0.1;
      if (role.title === "Mobile App Developer" && (hasSkill("react native") || hasSkill("flutter") || hasSkill("swift"))) boost += 0.1;
      if (role.title === "AI/NLP Engineer" && hasSkill("python") && (hasSkill("nlp") || hasSkill("transformers"))) boost += 0.1;

      // Keyword overlap bonus using all tokens
      let keywordOverlap = 0;
      for (const term of allRoleTerms) {
        if (allTokens.some(t => t.includes(term) || term.includes(t))) keywordOverlap++;
      }
      const overlapBonus = allRoleTerms.length > 0 ? (keywordOverlap / allRoleTerms.length) * 0.08 : 0;

      // Weighted final score
      const rawScore = (skillScore * 0.4) + (projectScore * 0.3) + (eduScore * 0.2) + (certScore * 0.1) + boost + overlapBonus;
      const matchPercent = Math.min(Math.round(rawScore * 100), 99);

      // Generate suggestions
      const suggestions = missingSkills.slice(0, 4).map(skill => {
        const capitalized = skill.charAt(0).toUpperCase() + skill.slice(1);
        const tips = [
          `Learn ${capitalized}`,
          `Take a course on ${capitalized}`,
          `Build a project using ${capitalized}`,
          `Get certified in ${capitalized}`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
      });

      return {
        title: role.title,
        description: role.description,
        matchPercent,
        matchedSkills,
        missingSkills,
        suggestions,
        breakdown: {
          skills: Math.round(skillScore * 100),
          projects: Math.round(projectScore * 100),
          education: Math.round(eduScore * 100),
          certifications: Math.round(certScore * 100)
        }
      };
    });

    // Sort by match and return top 10
    results.sort((a, b) => b.matchPercent - a.matchPercent);
    return results.slice(0, 10);
  }



  // ── Start of new UI logic ──────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let currentMode = "auto";
  let profileData = null;
  let recommendations = [];
  let isML = false;

  document.addEventListener('DOMContentLoaded', () => {
    // Check Cache
    chrome.storage.local.get(['lastProfile', 'lastRecommendations', 'lastTimestamp', 'isML'], (data) => {
      if (data.lastProfile && data.lastRecommendations) {
        $('#btn-load-cached').classList.remove('hidden');
        const ts = new Date(data.lastTimestamp).toLocaleString();
        $('#cached-info').textContent = `Last run: ${ts}`;
        $('#cached-info').classList.remove('hidden');
        
        $('#btn-load-cached').addEventListener('click', () => {
          profileData = data.lastProfile;
          recommendations = data.lastRecommendations;
          isML = data.isML || false;
          showView('#results-view');
          renderResults();
        });
      }
    });

    // Toggle Modes
    $('#mode-auto').addEventListener('click', () => {
      currentMode = "auto";
      $('#mode-auto').classList.add('active');
      $('#mode-manual').classList.remove('active');
      showView('#input-view');
      $('#auto-section').classList.remove('hidden');
      $('#manual-section').classList.add('hidden');
    });

    $('#mode-manual').addEventListener('click', () => {
      currentMode = "manual";
      $('#mode-manual').classList.add('active');
      $('#mode-auto').classList.remove('active');
      showView('#input-view');
      $('#manual-section').classList.remove('hidden');
      $('#auto-section').classList.add('hidden');
    });

    // Resume Tools
    $('#btn-toggle-resume').addEventListener('click', () => {
      const container = $('#resume-container');
      container.classList.toggle('hidden');
    });

    $('#btn-parse-resume').addEventListener('click', () => {
      const txt = $('#resume-text').value;
      if (!txt) return;

      const findSection = (targets, txt, sections) => {
        const lower = txt.toLowerCase();
        let bestIdx = -1;
        let usedH = "";
        for (let h of targets) {
          let idx = lower.indexOf(h + ":");
          if (idx === -1) idx = lower.indexOf(h + "\n");
          if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) {
            bestIdx = idx;
            usedH = idx === lower.indexOf(h + ":") ? h + ":" : h + "\n";
          }
        }
        if (bestIdx === -1) return "";
        const start = bestIdx + usedH.length;
        let end = txt.length;
        for (let s of sections) {
          if (!targets.includes(s)) {
            let nextIdx1 = lower.indexOf(s + ":", start);
            let nextIdx2 = lower.indexOf("\n" + s + "\n", start);
            let next = Math.min(...[nextIdx1, nextIdx2].filter(i => i > -1));
            if (next !== Infinity && next < end) end = next;
          }
        }
        return txt.slice(start, end).trim();
      };

      const sections = ['skills', 'technical skills', 'core competencies', 'education', 'experience', 'projects', 'certifications'];
      
      const sStr = findSection(['skills', 'technical skills', 'core competencies'], txt, sections);
      const eStr = findSection(['education'], txt, sections);
      const pStr = findSection(['projects', 'experience'], txt, sections);
      const cStr = findSection(['certifications'], txt, sections);

      if (sStr) {
        const skills = sStr.split(/[\n,]/).map(x => x.trim()).filter(x => x);
        $('#manual-skills').value = [...new Set(skills)].slice(0, 15).join(', ');
      }
      if (eStr) $('#manual-education').value = eStr.split('\n')[0].trim();
      if (pStr) $('#manual-projects').value = pStr.split('\n').filter(x => x.length > 5).slice(0,3).join('\n');
      if (cStr) $('#manual-certs').value = cStr.split('\n')[0].trim();
      
      $('#resume-container').classList.add('hidden');
    });

    // Analyze Auto
    $('#btn-analyze').addEventListener('click', async () => {
      showLoading("Extracting profile data...");
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const url = activeTab.url;
        
        if (!url.includes('linkedin.com/') && !url.includes('github.com/')) {
          showError("Job Recommender works best on LinkedIn and GitHub profiles. Please navigate to one.");
          return;
        }

        chrome.scripting.executeScript(
          { target: { tabId: activeTab.id }, files: ["content.js"] },
          () => {
            chrome.tabs.sendMessage(activeTab.id, { action: "extractProfile" }, async (response) => {
              if (chrome.runtime.lastError || !response || !response.success) {
                showError("Failed to extract profile: " + (chrome.runtime.lastError?.message || response?.error || "Unknown error"));
                return;
              }

              const data = response.data;
              if (!data.skills || data.skills.length === 0) {
                 const extractedWords = extractSkillsFromText(data.raw || "");
                 data.skills = [...new Set(extractedWords)].slice(0, 10);
              }

              profileData = data;
              await fetchRecommendations(profileData);
            });
          }
        );
      });
    });

    // Analyze Manual
    $('#btn-submit-manual').addEventListener('click', async () => {
      const sVal = $('#manual-skills').value.trim();
      const pVal = $('#manual-projects').value.trim();
      const eVal = $('#manual-education').value.trim();
      const cVal = $('#manual-certs').value.trim();

      if (!sVal && !pVal) {
        showError("Please provide at least your skills or projects.");
        return;
      }

      profileData = {
        skills: sVal ? sVal.split(',').map(s => s.trim()) : [],
        projects: pVal ? pVal.split('\n').map(s => s.trim()) : [],
        education: eVal ? [eVal] : [],
        certifications: cVal ? [cVal] : []
      };

      await fetchRecommendations(profileData);
    });

    $('#btn-error-back').addEventListener('click', () => {
      showView('#input-view');
    });
    
    $('#btn-results-back').addEventListener('click', () => {
      showView('#input-view');
    });
  });

  async function fetchRecommendations(data) {
    if (data && Array.isArray(data.skills)) {
      data.skills = data.skills.filter(skill => {
        if (!skill) return false;
        return skill.length < 50 && skill.split(' ').length <= 4 && !skill.includes('http') && !skill.includes('LinkedIn') && !skill.includes('Join') && !skill.includes('Sign') && !skill.includes('repost') && !skill.includes('follower') && !skill.includes('connection');
      });
    }

    showLoading("Matching against 50 career paths using AI...");
    isML = false;

    // Timeout logic (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Backend failed');

      const resList = await response.json();
      
      // Map API Response to exactly match local engine formatting if needed
      recommendations = resList.recommendations.map(apiRec => {
         return {
           title: apiRec.role,
           description: apiRec.description,
           matchPercent: Math.round(apiRec.match_percentage),
           missingSkills: apiRec.missing_skills || [],
           suggestions: (apiRec.related_roles || []).map(r => `Consider looking into ${r}`),
           breakdown: {
             skills: Math.round(apiRec.match_percentage * 1.5) > 100 ? 100 : Math.round(apiRec.match_percentage * 1.5),
             projects: Math.round(apiRec.match_percentage * 0.9),
             education: Math.round(apiRec.match_percentage * 0.7),
             certifications: Math.round(apiRec.match_percentage * 0.5)
           }
         };
      });
      isML = true;

    } catch (err) {
      console.warn("Backend down or timeout, falling back to JS recommender...");
      recommendations = generateRecommendations(data);
      isML = false;
    }

    chrome.storage.local.set({
      lastProfile: data,
      lastRecommendations: recommendations,
      lastTimestamp: new Date().toISOString(),
      isML: isML
    });

    showView('#results-view');
    renderResults();
  }

  function showView(viewId) {
    $$(".view").forEach(v => v.classList.add("hidden"));
    $(viewId)?.classList.remove("hidden");
  }

  function showLoading(msg) {
    $("#loading-text").textContent = msg;
    showView("#loading-view");
  }

  function showError(msg) {
    $("#error-message").textContent = msg;
    showView("#error-view");
  }

  function renderResults() {
    if (!profileData || !recommendations.length) {
      showError("No matches resulted from provided input.");
      return;
    }

    const summaryEl = $("#profile-summary");
    summaryEl.innerHTML = "";

    if (profileData.skills?.length) {
      let displaySkills = profileData.skills;
      if (displaySkills.length === 1 && displaySkills[0].length > 100) {
        displaySkills = extractSkillsFromText(displaySkills[0]);
      }
      displaySkills = displaySkills.filter(s => s && s.length < 50 && s.trim().split(' ').length <= 4);
      
      if (displaySkills.length > 0) {
        summaryEl.innerHTML += `<div class="summary-section">
          <h4>Skills</h4>
          <div class="tag-list">${displaySkills.map(s => `<span class="tag tag-skill">${s}</span>`).join("")}</div>
        </div>`;
      }
    }
    if (profileData.projects?.length) {
      summaryEl.innerHTML += `<div class="summary-section">
        <h4>Projects</h4>
        ${profileData.projects.slice(0, 3).map(p => `<p class="project-item">• ${p}</p>`).join("")}
      </div>`;
    }
    if (profileData.education?.length) {
      summaryEl.innerHTML += `<div class="summary-section">
        <h4>Education</h4>
        ${profileData.education.slice(0, 2).map(e => `<p class="edu-item">${e}</p>`).join("")}
      </div>`;
    }

    const cardsContainer = $("#job-cards");
    cardsContainer.innerHTML = "";

    recommendations.forEach((rec, idx) => {
      const card = document.createElement("div");
      card.className = "job-card";
      
      const percentClass = rec.matchPercent >= 70 ? "high" : rec.matchPercent >= 40 ? "medium" : "low";

      let resourcesHTML = "";
      if (rec.missingSkills && rec.missingSkills.length) {
        const skillsToShow = rec.missingSkills.slice(0, 4);
        let resourceItems = "";
        skillsToShow.forEach(skill => {
          const res = getSkillResources(skill);
          const capSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
          let skillBlock = `<div class="resource-skill-block"><div class="resource-skill-name">🔴 ${capSkill}</div>`;
          
          if (res.free && res.free.length) {
            skillBlock += `<div class="resource-category"><span class="resource-cat-label">📘 Free</span><div class="resource-links">`;
            res.free.forEach(link => {
              skillBlock += `<a href="${link.link}" target="_blank" class="resource-link">${link.name}</a>`;
            });
            skillBlock += `</div></div>`;
          }
          if (res.paid && res.paid.length) {
            skillBlock += `<div class="resource-category"><span class="resource-cat-label">💰 Paid</span><div class="resource-links">`;
            res.paid.forEach(link => {
              skillBlock += `<a href="${link.link}" target="_blank" class="resource-link">${link.name}</a>`;
            });
            skillBlock += `</div></div>`;
          }
          if (res.certification && res.certification.length) {
            skillBlock += `<div class="resource-category"><span class="resource-cat-label">🏅 Certs</span><div class="resource-links">`;
            res.certification.forEach(link => {
              skillBlock += `<span class="resource-cert">${link.name}</span>`;
            });
            skillBlock += `</div></div>`;
          }
          skillBlock += `</div>`;
          resourceItems += skillBlock;
        });

        const collapseId = `resources-${idx}`;
        resourcesHTML = `
          <div class="learning-resources">
            <button class="resources-toggle" onclick="document.getElementById('${collapseId}').classList.toggle('open')">
              <span>📚 View Learning Paths</span>
              <span>▼</span>
            </button>
            <div id="${collapseId}" class="resources-content">
              ${resourceItems}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="job-card-header">
          <div class="job-rank">${idx + 1}</div>
          <div class="job-info">
            <h3 class="job-title">${rec.title} ${isML ? '<span class="engine-badge">🤖 ML Model</span>' : '<span class="engine-badge">⚡ Built-in Engine</span>'}</h3>
            <p class="job-desc">${rec.description}</p>
          </div>
          <div class="match-badge ${percentClass}">${rec.matchPercent}% Match</div>
        </div>
        
        <div class="match-progress-container">
          <div class="match-progress-bar ${percentClass}" style="width: ${rec.matchPercent}%"></div>
        </div>

        <div class="score-bars">
          <div class="score-bar-row">
            <span>Skills</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.skills || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.skills || 0}%</span>
          </div>
          <div class="score-bar-row">
            <span>Projects</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.projects || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.projects || 0}%</span>
          </div>
          <div class="score-bar-row">
            <span>Education</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.education || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.education || 0}%</span>
          </div>
          <div class="score-bar-row">
            <span>Certs</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.certifications || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.certifications || 0}%</span>
          </div>
        </div>

        ${rec.missingSkills && rec.missingSkills.length ? `<div class="missing-skills">
          <p>Missing Skills:</p>
          <div class="tag-list">${rec.missingSkills.map(s => `<span class="tag tag-missing">${s}</span>`).join("")}</div>
        </div>` : ''}

        ${resourcesHTML}
      `;
      cardsContainer.appendChild(card);
    });
  }
})();
