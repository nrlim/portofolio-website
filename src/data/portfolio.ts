export const personalInfo = {
  name: "Nuralim",
  title: "Product & Technology Development Manager",
  email: "nuralim.mail@gmail.com",
  phone: "+62 811 144 1696",
  whatsapp: "https://wa.me/628111441696?text=Halo%20Nuralim,%20saya%20ingin%20diskusikan%20proyek%20software.",
  address: "Segara City Cluster Baltic, SC 2.9 No.8",
  
  // CARA MENGGUNAKAN FOTO:
  // 1. Dari LinkedIn: Klik kanan foto profile LinkedIn Anda → Copy Image Address → Paste URL di bawah
  //    Contoh: "https://media.licdn.com/dms/image/..."
  // 2. Dari Local: Taruh foto di public/profile-photo.jpg → Isi: "/profile-photo.jpg"
  // 3. Kosongkan untuk menggunakan initial "N" dengan gradient (default)
  
  photo: "https://media.licdn.com/dms/image/v2/D5603AQGosK48viiJsg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1667830699770?e=1763596800&v=beta&t=UM_4_ilPNBpMgvlL7c0U7ZCQiB4rPGDVWINZv22iYAw", // Kosong = Initial gradient, URL = LinkedIn photo, Path = Local photo
  
  social: {
    linkedin: "https://linkedin.com/in/nuralim",
    github: "https://github.com/nrlim",
    instagram: "https://instagram.com/nrlim_"
  }
};

export const hero = {
  headline: "Membangun software yang adaptif dan tim yang berdaya.",
  subheadline: "Product & Technology Development Manager dengan 6+ tahun pengalaman membangun solusi software end-to-end di berbagai domain industri. Berfokus pada arsitektur yang scalable, tim yang produktif, dan budaya engineering excellence.",
  techBadges: ["C#/.NET", "NHibernate", "RabbitMQ", "Camunda BPM", "Docker", "Elasticsearch"]
};

export const about = {
  description: "Saya adalah seorang Product & Technology Development Manager dengan pengalaman lebih dari 6 tahun dalam membangun solusi software yang scalable dan memberdayakan tim engineering. Keahlian saya mencakup pengembangan backend, mobile, hingga kepemimpinan teknis dan produk. Saya memiliki track record yang solid dalam menangani proyek-proyek kompleks di berbagai industri seperti asuransi, manufaktur, perbankan, dan sektor pemerintahan. Dengan pendekatan yang adaptif dan kolaboratif, saya berkomitmen untuk menghasilkan solusi berkualitas tinggi yang memberikan nilai bisnis nyata.",
  metrics: [
    {
      value: "6+",
      label: "Tahun Pengalaman Profesional"
    },
    {
      value: "Multi-Domain",
      label: "Asuransi, Manufaktur, Pemerintah, Perbankan"
    },
    {
      value: "End-to-End",
      label: "Backend, Mobile, Product & Tech Leadership"
    }
  ]
};

export const skills = {
  languages: ["C#", "JavaScript", "TypeScript"],
  backend: ["NHibernate", "RabbitMQ", "JWT", "OAuth", "Active Directory", "Log4net", "Camunda BPM", "Telerik Report", "FluentValidation", "Automapper", "Quartz", "EF"],
  databases: ["SQL Server", "PostgreSQL", "SQLite", "RavenDB", "CouchDB", "WatermelonDB", "MongoDB", "Redis"],
  devops: ["Docker", "Git", "Nexus", "Jenkins", "SonarQube", "Azure DevOps"],
  architecture: ["OOP", "Microservices", "Design Patterns", "Clean Code", "Clean Architecture", "SOLID", "DRY"],
  tools: ["Elasticsearch", "Firebase Cloud Messaging", "OAuth", "Active Directory"]
};

export const experience = [
  {
    company: "PT Quadrant Synergy International",
    location: "Jakarta, Indonesia",
    positions: [
      {
        title: "Product & Technology Development Manager",
        period: "2023 - Sekarang",
        achievements: [
          "Membangun tim (Product, Backend, Frontend, Mobile, QA) dari 0 hingga 15+ engineer dalam Q1",
          "Membentuk research team untuk continuous improvement arsitektur & framework internal",
          "Mempercepat time-to-market melalui standardisasi dan automation"
        ],
        achievementNarrative:
          "Ketika saya dipercaya untuk memimpin divisi Product & Technology Development, tantangan utama adalah membangun struktur organisasi yang solid dan scalable untuk mendukung pertumbuhan perusahaan. Dalam kuartal pertama, saya fokus pada recruitment strategy yang tepat—mengidentifikasi kompetensi kunci yang dibutuhkan, mendesain proses interview yang efektif, dan membangun employer branding untuk menarik talenta terbaik. Hasilnya, tim teknologi berkembang pesat dari beberapa engineer menjadi organisasi lengkap dengan 20+ profesional di berbagai fungsi: Backend, Frontend, Mobile, dan QA. Tidak hanya menambah headcount, saya juga membentuk research team khusus yang bertugas melakukan continuous improvement terhadap arsitektur dan framework internal—memastikan keputusan teknis kami berbasis data dan eksperimen, bukan asumsi. Melalui implementasi standardisasi workflow, automation pipeline CI/CD, dan penguatan quality gates, kami berhasil memangkas time-to-market secara signifikan. Tim kini tidak lagi terjebak dalam ritual release yang melelahkan, melainkan fokus menciptakan nilai bisnis yang terukur dan berkelanjutan."
      },
      {
        title: "Product Development Lead",
        period: "2021 - 2023",
        achievements: [
          "Memimpin tim 8+ developer dalam pengembangan produk digital insurance",
          "Adopsi SCRUM methodology untuk meningkatkan produktivitas tim 40%",
          "Merilis aplikasi mobile 'My Zurich Advisor' di Android & iOS"
        ],
        achievementNarrative:
          "Sebagai Product Development Lead, saya memimpin tim yang terdiri dari 8+ engineer dalam membangun solusi digital insurance yang kompleks. Tantangan terbesar adalah menciptakan ritme kerja yang sehat dan produktif. Saya mengadopsi metodologi SCRUM secara penuh—bukan hanya ceremonial, tetapi benar-benar internalisasi nilai-nilai Agile. Backlog dikelola berdasarkan prioritas bisnis, sprint dijalankan dengan terukur, dan retrospective menjadi ruang pembelajaran yang jujur. Hasilnya? Produktivitas tim meningkat 40%, kolaborasi semakin cair, dan prediktabilitas delivery jauh lebih baik. Puncaknya adalah peluncuran aplikasi mobile 'My Zurich Advisor' yang berhasil dirilis di platform Android dan iOS—dari konsep hingga produksi, kami jalankan dengan disiplin teknis tinggi dan kepekaan terhadap kebutuhan user yang kuat."
      },
      {
        title: "Backend Developer",
        period: "2019 - 2021",
        achievements: [
          "Fokus pada security implementation dan clean code/architecture",
          "Mengembangkan RESTful API untuk 'Agent AID' yang digunakan oleh 1000+ agen",
          "Implementasi JWT authentication dan role-based access control"
        ],
        achievementNarrative:
          "Di posisi ini, saya berperan sebagai penjaga fondasi sistem—memastikan setiap line of code yang ditulis adalah investasi jangka panjang, bukan technical debt. Dengan menerapkan prinsip clean architecture dan clean code secara konsisten, saya membangun RESTful API untuk platform 'Agent AID' yang tidak hanya powerful, tetapi juga maintainable dan secure. API ini menjadi tulang punggung operasional bagi lebih dari 1000+ agen asuransi yang mengandalkan sistem kami setiap hari. Implementasi JWT authentication dan role-based access control (RBAC) memastikan setiap request memiliki identitas yang terverifikasi dan permission yang jelas—sehingga sistem dapat scale dengan aman tanpa kompromi terhadap security. Keputusan arsitektur yang tepat di fase ini membuat sistem tetap stabil dan operasional berjalan tenang, bahkan saat traffic meningkat drastis."
      },
      {
        title: "Frontend Developer",
        period: "03/2019 - 2019",
        achievements: [
          "Mengembangkan mobile app 'Agent AID' menggunakan React Native",
          "Implementasi Redux untuk state management dan Axios untuk API integration",
          "Setup unit testing dengan Jest untuk code coverage 80%+"
        ],
        achievementNarrative:
          "Saya bertanggung jawab membangun mobile experience pertama untuk platform 'Agent AID' menggunakan React Native—memastikan aplikasi tidak hanya berfungsi, tetapi juga memberikan user experience yang responsif dan intuitif. Untuk mengelola kompleksitas state management, saya mengimplementasikan Redux dengan arsitektur yang terstruktur, membuat alur data menjadi predictable dan mudah di-debug. Integrasi API menggunakan Axios dirancang dengan clean separation of concerns, sehingga komunikasi antara frontend dan backend tetap maintainable. Yang tidak kalah penting, saya membangun budaya quality assurance sejak awal dengan setup unit testing menggunakan Jest, mencapai code coverage di atas 80%. Dengan fondasi testing yang kuat ini, aplikasi melangkah ke production dengan confidence level yang tinggi—bug minimal, refactoring aman, dan development velocity tetap terjaga."
      }
    ]
  },
  {
    company: "PT Invent Integrasi Indonesia",
    location: "Jakarta, Indonesia",
    positions: [
      {
        title: "Mobile Developer",
        period: "04/2017 - 09/2017",
        achievements: [
          "Mengembangkan aplikasi Android native (Java) untuk retail/POS system",
          "Implementasi offline-first architecture dengan SQLite",
          "Integrasi dengan payment gateway dan printer thermal"
        ],
        achievementNarrative:
          "Ini adalah pengalaman pertama saya membangun solusi untuk lingkungan retail yang menuntut reliability tinggi—bahkan ketika koneksi internet tidak stabil. Saya mengembangkan aplikasi Android native menggunakan Java untuk sistem Point of Sale (POS) yang harus beroperasi tanpa gangguan di berbagai kondisi. Kunci dari solusi ini adalah pendekatan offline-first architecture dengan SQLite sebagai local database, memastikan setiap transaksi tetap tercatat dan dapat disinkronisasi otomatis begitu koneksi tersedia kembali. Tidak hanya backend logic, saya juga mengintegrasikan aplikasi dengan payment gateway untuk proses pembayaran yang seamless, serta printer thermal untuk mencetak struk secara real-time. Hasilnya adalah aplikasi POS yang tidak hanya menjadi interface, tetapi menjadi pusat operasional di meja kasir—robust, cepat, dan dapat diandalkan dalam setiap transaksi."
      }
    ]
  }
];


export const projects = [
  {
    id: "liriq",
    title: "Liriq - RFID Asset Tracking System",
    category: "Product",
    description: "Real-time asset monitoring and management system menggunakan teknologi RFID untuk tracking inventory dan aset perusahaan",
    tech: [".NET 6", "RabbitMQ", "NHibernate", "Memory cache", "RFID Middleware", "JWT", "Log4net"],
    image: "/projects/liriq.png",
    caseStudy: {
      problem: "Perusahaan mengalami kesulitan dalam tracking dan monitoring aset secara real-time, sering terjadi kehilangan aset, inefficient inventory management, dan manual stock taking yang memakan waktu dan rawan error. Visibilitas lokasi aset yang rendah menyebabkan produktivitas menurun dan asset utilization tidak optimal.",
      solution: "Membangun comprehensive RFID tracking system dengan real-time monitoring dashboard. Implementasi RFID reader integration untuk automatic asset detection dan location tracking. SignalR untuk real-time updates ke client. Message queue (RabbitMQ) untuk handle high-volume RFID events. Redis untuk caching asset location dan fast lookup. Geofencing alerts untuk notifikasi ketika aset keluar dari zona authorized.",
      result: "Asset visibility meningkat 100% dengan real-time location tracking. Mengurangi waktu stock taking dari 3 hari menjadi 2 jam (95% lebih cepat). Asset utilization meningkat 40% karena easy discovery. Kehilangan aset berkurang 85%. ROI tercapai dalam 8 bulan. Sistem dapat handle 10,000+ RFID tag reads per second dengan latency <100ms."
    }
  },
  {
    id: "mitsubishi",
    title: "Mitsubishi Krama Yudha Motors & Manufacturing",
    category: "Manufacturing",
    description: "Web application dan integrasi API untuk sistem manufaktur otomotif dengan real-time data processing",
    tech: [".NET 6", "RabbitMQ", "NHibernate", "Automapper", "Quartz", "Log4net"],
    image: "/projects/mkm.png",
    caseStudy: {
      problem: "Client membutuhkan sistem terintegrasi untuk mengelola supply chain dan production planning dengan berbagai sistem legacy yang berbeda platform.",
      solution: "Membangun microservices architecture dengan message broker (RabbitMQ) untuk asynchronous communication antar sistem. Implementasi API gateway untuk centralized authentication dan rate limiting.",
      result: "Meningkatkan efisiensi operasional 35%, mengurangi manual data entry 80%, dan real-time visibility across all production stages."
    }
  },
  {
    id: "bpn",
    title: "Badan Pertanahan Nasional",
    category: "Government",
    description: "Platform digital untuk layanan pertanahan dengan integrasi ke berbagai sistem pemerintah",
    tech: [".NET 6", "RabbitMQ", "NHibernate", "Automapper", "Quartz", "Log4net"],
    image: "/projects/bpn.png",
    caseStudy: {
      problem: "Proses pengurusan sertifikat tanah memakan waktu berbulan-bulan karena manual processing dan koordinasi antar instansi yang kompleks.",
      solution: "Digitalisasi end-to-end workflow dengan approval chain automation. Integrasi API dengan sistem kementerian terkait untuk verifikasi data real-time.",
      result: "Waktu processing berkurang dari 3-4 bulan menjadi 2-3 minggu. Transparansi meningkat dengan tracking system real-time untuk applicant."
    }
  },
  {
    id: "impulse",
    title: "Impulse - Political Party Platform",
    category: "Government",
    description: "Web & mobile platform untuk manajemen data keanggotaan dan kampanye partai politik",
    tech: [".NET 6", "RabbitMQ", "FluentValidation", "NHibernate", "Automapper", "MongoDB", "Quartz", "Log4net"],
    image: "/projects/impulse.png",
    caseStudy: {
      problem: "Partai politik kesulitan mengelola jutaan data anggota dan volunteers yang tersebar di seluruh Indonesia, serta tracking aktivitas kampanye.",
      solution: "Membangun scalable platform dengan MongoDB untuk flexible schema dan geo-spatial queries. Implementasi API rate limiting untuk menangani traffic spike saat event besar.",
      result: "Mampu mengelola 1M+ member data dengan response time <200ms. Mobile app digunakan oleh 50K+ volunteers untuk real-time reporting."
    }
  },
  {
    id: "bni-life",
    title: "BNI Life Insurance",
    category: "Insurance",
    description: "Implementasi Cirrust platform dan integrasi dengan sistem third-party untuk digital insurance",
    tech: [".NET 6", "RabbitMQ", "FluentValidation", "NHibernate", "Telerik Reporting", "Quartz", "Log4net", "Automapper"],
    image: "/projects/bni.png",
    caseStudy: {
      problem: "BNI Life membutuhkan solusi document management yang terintegrasi dengan core insurance system dan memenuhi regulasi OJK.",
      solution: "Customize dan implement Cirrust platform dengan workflow automation. Integrasi dengan e-signature provider dan payment gateway. Generate dynamic reports dengan Telerik.",
      result: "Paperless process 95%, compliance dengan audit trail lengkap, policy issuance time berkurang 70%."
    }
  },
  {
    id: "cirrust",
    title: "Cirrust - Document Management System",
    category: "Product",
    description: "Enterprise document management system dengan version control dan collaboration features",
    tech: [".NET 6", "RabbitMQ", "FluentValidation", "NHibernate", "Redis", "Quartz", "JWT", "Log4net", "Automapper"],
    image: "/projects/cirrust.png",
    caseStudy: {
      problem: "Banyak enterprise client membutuhkan secure document management dengan fine-grained access control dan audit trail lengkap.",
      solution: "Build SaaS product dengan multi-tenancy architecture. Implementasi Redis untuk caching dan session management. JWT untuk stateless authentication.",
      result: "Digunakan oleh 15+ enterprise clients. Average uptime 99.9%. Mampu handle 100K+ documents per tenant dengan search <1s."
    }
  },
  {
    id: "cirrust-workflow",
    title: "Cirrust Workflow - Workflow Engine",
    category: "Product",
    description: "Business process automation engine dengan visual workflow designer",
    tech: [".NET 6", "RabbitMQ", "FluentValidation", "NHibernate", "Camunda", "Quartz", "Elasticsearch", "Log4net", "Automapper"],
    image: "/projects/cirrust-wf.png",
    caseStudy: {
      problem: "Client membutuhkan flexible workflow engine yang bisa handle complex approval chains dan conditional routing tanpa coding.",
      solution: "Integrate Camunda BPM engine dengan custom API layer. Build visual designer untuk business users. Elasticsearch untuk workflow analytics dan monitoring.",
      result: "Non-technical users dapat create workflow sendiri. Reduce development time untuk business process changes dari minggu ke hari."
    }
  },
  {
    id: "manulife",
    title: "Manulife Insurance - Agent AID Implementation",
    category: "Insurance",
    description: "Platform digital untuk agen asuransi dengan mobile app dan backend system",
    tech: [".NET Core 3.1", "RabbitMQ", "FluentValidation", "NHibernate", "Quartz", "JWT", "Log4net", "Automapper"],
    image: "/projects/manulife.png",
    caseStudy: {
      problem: "Agen Manulife kesulitan melakukan prospecting dan policy management secara mobile. Butuh akses real-time ke customer data.",
      solution: "Develop mobile-first platform dengan offline capability. Sync engine untuk handle offline transactions. Push notification untuk leads dan policy updates.",
      result: "Agent productivity meningkat 50%. Customer satisfaction score naik 30%. Mobile app rating 4.5+ di Play Store & App Store."
    }
  },
  {
    id: "zurich",
    title: "Zurich Insurance - Agent AID Implementation",
    category: "Insurance",
    description: "Implementasi dan customization Agent AID untuk Zurich Insurance Indonesia",
    tech: [".NET 6", "RabbitMQ", "NHibernate", "Quartz", "JWT", "Log4net", "Automapper"],
    image: "/projects/zurich.png",
    caseStudy: {
      problem: "Zurich ingin adopt Agent AID platform dengan custom requirements untuk compliance dan integration dengan existing systems.",
      solution: "Implement Agent AID dengan plugin architecture untuk customization. SSO integration dengan AD. Custom reporting untuk management dashboard.",
      result: "Onboarding 500+ agents dalam 2 bulan. Zero security incidents. Seamless integration dengan 5 legacy systems."
    }
  },
  {
    id: "agent-aid-product",
    title: "Agent AID - Core Product",
    category: "Product",
    description: "SaaS platform lengkap untuk digital enablement agen asuransi",
    tech: [".NET Core 3.1", "RabbitMQ", "FluentValidation", "NHibernate", "Quartz", "Saga", "EF", "JWT", "Log4net", "Automapper"],
    image: "/projects/aid.png",
    caseStudy: {
      problem: "Industri asuransi membutuhkan platform yang bisa accelerate digital transformation untuk field agents dengan onboarding cepat.",
      solution: "Build white-label platform dengan modular architecture. Saga pattern untuk distributed transactions. Multi-language support dan configurable workflows.",
      result: "Digunakan oleh 3 major insurance companies. 2000+ active agents. Platform stability 99.95% uptime."
    }
  },
  {
    id: "framework",
    title: "Internal Framework Improvement",
    category: "Framework",
    description: "Framework internal untuk accelerate project development dan standardisasi",
    tech: ["Authentication (JWT/AD/OAuth)", "Notification (SMS/Email/Push)", "Persistence & ORM", "Common Libraries", "MassTransit", "Project Generator"],
    image: "/projects/quadrant.png",
    caseStudy: {
      problem: "Setiap project baru memulai dari scratch, banyak duplicated code, dan inconsistent implementation across teams.",
      solution: "Build comprehensive framework dengan authentication module, notification service, ORM wrapper, dan project scaffolding tool. Documentation dan training untuk adoption.",
      result: "New project setup dari 2 minggu menjadi 2 hari. Code quality score naik 40%. Developer satisfaction meningkat significantly."
    }
  }
];

export const education = [
  {
    degree: "S1 Teknik Informatika",
    institution: "Universitas MH Thamrin Jakarta",
    period: "2019 - 2020",
    description: "Fokus pada Software Engineering dan System Architecture"
  },
  {
    degree: "D3 Teknik Informatika",
    institution: "Politeknik LP3I Jakarta",
    period: "2014 - 2017",
    description: "Fokus pada Application Development dan Database Management"
  }
];

export const interests = [
  "Insurance Technology",
  "Banking & Fintech",
  "Software Architecture",
  "Agile Methodology",
  "Servant Leadership",
  "AI & Machine Learning",
  "DevOps Culture",
  "Team Building"
];

export const projectCategories = ["All", "Insurance", "Government", "Manufacturing", "Product", "Framework"];
