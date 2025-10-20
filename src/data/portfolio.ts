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
  subheadline: "Product & Technology Development Manager dengan 7+ tahun pengalaman membangun solusi software end-to-end di berbagai domain industri. Berfokus pada arsitektur yang scalable, tim yang produktif, dan budaya engineering excellence.",
  techBadges: ["C#/.NET", "NHibernate", "RabbitMQ", "Camunda BPM", "Docker", "Elasticsearch"]
};

export const about = {
  description: "Saya adalah seorang Product & Technology Development Manager dengan pengalaman lebih dari 7 tahun dalam membangun solusi software yang scalable dan memberdayakan tim engineering. Keahlian saya mencakup pengembangan backend, mobile, hingga kepemimpinan teknis dan produk. Saya memiliki track record yang solid dalam menangani proyek-proyek kompleks di berbagai industri seperti asuransi, manufaktur, perbankan, dan sektor pemerintahan. Dengan pendekatan yang adaptif dan kolaboratif, saya berkomitmen untuk menghasilkan solusi berkualitas tinggi yang memberikan nilai bisnis nyata.",
  metrics: [
    {
      value: "7+",
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
  backend: ["NHibernate", "Masstransit", "Authentication (Oauth/AD/JWT)", "Log4net", "Hangfire", "Camunda BPM", "Telerik Report", "FluentValidation", "Automapper", "Quartz", "EF", "Xunit"],
  databases: ["SQL Server", "PostgreSQL", "SQLite", "RavenDB", "CouchDB", "WatermelonDB", "MongoDB"],
  devops: ["Docker", "Git", "Nexus", "Jenkins", "SonarQube", "Azure DevOps", "Redmine"],
  architecture: ["OOP", "Microservices", "Design Patterns", "Clean Code", "Clean Architecture", "SOLID", "DRY"],
  tools: []
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
          "Ketika saya dipercaya untuk memimpin divisi Product & Technology Development, tantangan utama adalah membangun struktur organisasi yang solid dan scalable untuk mendukung pertumbuhan perusahaan. Dalam kuartal pertama, saya fokus pada recruitment strategy yang tepat—mengidentifikasi kompetensi kunci yang dibutuhkan, mendesain proses interview yang efektif, dan membangun employer branding untuk menarik talenta terbaik. Hasilnya, tim teknologi berkembang pesat dari beberapa engineer menjadi organisasi lengkap dengan 20+ profesional di berbagai fungsi: Backend, Frontend, Mobile, dan QA. Tidak hanya menambah headcount, saya juga membentuk research team khusus yang bertugas melakukan continuous improvement terhadap arsitektur dan framework internal—memastikan keputusan teknis kami berbasis data dan eksperimen, bukan asumsi. Namun, membangun tim yang besar tanpa kultur yang kuat adalah resep bencana. Saya menyadari bahwa skill dan headcount saja tidak cukup—yang lebih penting adalah membangun lingkungan kerja di mana setiap engineer merasa valued, challenged, dan continuously growing. Saya memulai dengan menetapkan engineering values yang jelas: ownership mindset, collaborative spirit, continuous learning, dan bias for action. Kami rutin mengadakan knowledge sharing session di mana setiap engineer, dari junior hingga senior, punya kesempatan untuk berbagi expertise mereka—menciptakan kultur belajar yang organik dan saling menghormati. Saya juga memperkenalkan konsep 'blameless postmortem' ketika ada incident atau bug kritis, fokus pada system improvement bukan mencari kambing hitam. Hasilnya? Psychological safety meningkat drastis, tim tidak takut eksperimen dan mengambil calculated risk, dan turnover rate turun signifikan karena engineer merasa engaged dan berkembang. Melalui implementasi standardisasi workflow, automation pipeline CI/CD, dan penguatan quality gates, kami berhasil memangkas time-to-market secara signifikan. Tim kini tidak lagi terjebak dalam ritual release yang melelahkan, melainkan fokus menciptakan nilai bisnis yang terukur dan berkelanjutan—semua ini dijalankan dalam kultur engineering excellence yang kami bangun bersama."
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
    tech: [".NET 6", "Masstransit", "ORM", "MemoryCache", "RFID Middleware", "JWT Authentication", "Log4net", "FluentValidation", "Automapper", "Quartz", "Email Gateway", "Swagger", "API Versioning"],
    image: "/projects/liriq.png",
    caseStudy: {
      problem: "Perusahaan mengalami kesulitan dalam tracking dan monitoring aset secara real-time, sering terjadi kehilangan aset, inefficient inventory management, dan manual stock taking yang memakan waktu dan rawan error. Visibilitas lokasi aset yang rendah menyebabkan produktivitas menurun dan asset utilization tidak optimal.",
      solution: "Membangun comprehensive RFID tracking system dengan real-time monitoring dashboard. Implementasi RFID reader integration untuk automatic asset detection dan location tracking. SignalR untuk real-time updates ke client. Message queue (RabbitMQ) untuk handle high-volume RFID events. Redis untuk caching asset location dan fast lookup. Geofencing alerts untuk notifikasi ketika aset keluar dari zona authorized.",
      result: "Asset visibility meningkat 100% dengan real-time location tracking. Mengurangi waktu stock taking dari 3 hari menjadi 2 jam (95% lebih cepat). Asset utilization meningkat 40% karena easy discovery. Kehilangan aset berkurang 85%. ROI tercapai dalam 8 bulan. Sistem dapat handle 10,000+ RFID tag reads per second dengan latency <100ms."
    }
  },
  {
    id: "impulse",
    title: "Impulse - Political Party Platform",
    category: "Government",
    description: "Web & mobile platform untuk manajemen data keanggotaan dan kampanye partai politik",
    tech: [".NET 6", "Masstransit", "FluentValidation", "ORM", "Automapper", "MongoDB", "Quartz", "Log4net", "FCM", "Email Gateway", "Swagger", "JWT Authentication", "API Versioning", "API Rate Limit"],
    image: "/projects/impulse.png",
    caseStudy: {
      problem: "Partai politik kesulitan mengelola jutaan data anggota dan volunteers yang tersebar di seluruh Indonesia, serta tracking aktivitas kampanye.",
      solution: "Membangun scalable platform dengan MongoDB untuk flexible schema dan geo-spatial queries. Implementasi API rate limiting untuk menangani traffic spike saat event besar.",
      result: "Mampu mengelola 1M+ member data dengan response time <200ms. Mobile app digunakan oleh 50K+ volunteers untuk real-time reporting."
    }
  },
  {
    id: "ematerai",
    title: "E-Materai",
    category: "Government",
    description: "Platform digital untuk penerbitan dan verifikasi materai elektronik sesuai regulasi Peraturan Pemerintah No. 86 Tahun 2021",
    tech: [".NET 6", "Masstransit", "ORM", "JWT Authentication", "Log4net", "FluentValidation", "Automapper", "Quartz", "Email Gateway", "Swagger", "Peruri Middleware", "Payment Gateway", "API Versioning", "API Rate Limit"],
    image: "/projects/ematerai.png",
    caseStudy: {
      problem: "Implementasi regulasi e-Materai membutuhkan sistem yang dapat menangani penerbitan materai elektronik secara massal, memastikan keamanan dan autentikasi dokumen, serta integrasi dengan berbagai platform dokumen elektronik. Tantangan utama adalah mencegah pemalsuan, memastikan validitas materai, dan menyediakan mekanisme verifikasi yang mudah bagi publik.",
      solution: "Membangun secure e-Materai issuance platform dengan digital signature implementation untuk autentikasi dokumen. Implementasi QR code generation untuk setiap materai dengan unique identifier dan blockchain-inspired verification chain. REST API untuk integrasi dengan document management systems dan e-signature platforms. Real-time validation service untuk public verification. Batch processing dengan Quartz untuk handle bulk issuance requests. RabbitMQ untuk reliable message delivery dan audit trail. JWT authentication untuk secure API access.",
      result: "Platform berhasil menerbitkan 500K+ e-Materai per bulan dengan zero forgery incidents. Verification response time <500ms untuk real-time validation. API uptime 99.95% dengan seamless integration ke 20+ partner platforms. Compliance 100% dengan regulasi Ditjen Pajak. Public verification portal diakses 100K+ times monthly. Mengurangi biaya operasional materai fisik hingga 70% untuk enterprise clients. User satisfaction score 4.6/5 dari survei partner integration."
    }
  },
  {
    id: "mitsubishi",
    title: "Mitsubishi Krama Yudha Motors & Manufacturing",
    category: "Manufacturing",
    description: "Web application dan integrasi API untuk sistem manufaktur otomotif dengan real-time data processing",
    tech: [".NET 6", "Masstransit", "ORM", "JWT Authentication", "Log4net", "FluentValidation", "Automapper", "Quartz", "Email Gateway", "Swagger", "Chilkat", "API Versioning"],
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
    tech: [".NET 6", "Masstransit", "ORM", "JWT Authentication", "Log4net", "FluentValidation", "Automapper", "Quartz", "Email Gateway", "Swagger", "Dynamic Forms", "API Versioning"],
    image: "/projects/bpn.png",
    caseStudy: {
      problem: "Proses pengurusan sertifikat tanah memakan waktu berbulan-bulan karena manual processing dan koordinasi antar instansi yang kompleks.",
      solution: "Digitalisasi end-to-end workflow dengan approval chain automation. Integrasi API dengan sistem kementerian terkait untuk verifikasi data real-time.",
      result: "Waktu processing berkurang dari 3-4 bulan menjadi 2-3 minggu. Transparansi meningkat dengan tracking system real-time untuk applicant."
    }
  },
  {
    id: "kansai",
    title: "Kansai Prakarsa Coating",
    category: "Manufacturing",
    description: "Implementasi Cirrust platform dengan custom services dan pages untuk customer profiling di industri coating",
    tech: [".NET 6", "Cirrust Platform", "Masstransit", "ORM", "JWT Authentication", "Log4net", "FluentValidation", "Automapper", "Quartz", "Email Gateway", "Swagger", "Telerik Reporting", "API Versioning", "Custom Services", "Custom Pages"],
    image: "/projects/kansai.png",
    caseStudy: {
      problem: "Kansai Prakarsa Coating menghadapi tantangan dalam mengelola customer relationship dan profiling di industri coating yang kompleks. Sales team kesulitan tracking customer history, preferences, dan buying patterns. Proses manual dalam dokumentasi customer requirements, quotation history, dan project specifications menyebabkan inefficiency dan kehilangan peluang sales. Tidak ada centralized system untuk customer data, sehingga setiap sales person memiliki versi data yang berbeda dan tidak tersinkronisasi.",
      solution: "Implementasi Cirrust platform sebagai core document management system dengan extensive customization untuk customer profiling use case. Develop custom services untuk customer relationship management yang terintegrasi dengan sales pipeline dan order management. Build custom pages untuk customer profiling yang mencakup company information, contact persons, industry segments, coating preferences, dan purchase history. Create custom forms untuk capturing customer requirements, technical specifications, dan color formulation requests. Develop custom API services untuk integration dengan sales CRM dan quotation system. Build custom workflow untuk approval chain dari customer inquiry hingga quotation dan order confirmation. Create custom reporting pages dengan Telerik untuk customer analytics: segmentation analysis, buying behavior, revenue contribution, dan customer lifetime value.",
      result: "Customer profiling accuracy meningkat 100% dengan centralized database dan custom forms. Sales conversion rate naik 35% karena better understanding of customer needs dan preferences. Follow-up time berkurang 50% dengan automated reminder system. Customer documentation sepenuhnya paperless dengan semua quotations, technical specs, dan purchase orders tersimpan di Cirrust. Sales team productivity meningkat 40% karena quick access to customer history dan buying patterns. Customer retention meningkat 25% dengan systematic follow-up dan personalized service. Management mendapat real-time visibility terhadap customer portfolio dengan custom analytics dashboard. Cross-selling opportunities meningkat dengan customer segmentation analysis. ROI tercapai dalam 8 bulan dengan increased sales dan improved customer satisfaction score 4.5/5."
    }
  },
  {
    id: "mtm",
    title: "Media Telekomunikasi Mandiri",
    category: "Others",
    description: "Implementasi Cirrust Document Management System untuk digitalisasi dokumen perusahaan.",
    tech: [".NET 6", "Cirrust Platform", "JWT Authentication", "Log4net", "Automapper", "Quartz", "Swagger", "API Versioning", "DocuViewer"],
    image: "/projects/mtm.png",
    caseStudy: {
      problem: "Media Telekomunikasi Mandiri menghadapi tantangan dalam mengelola dokumen perusahaan yang terus bertambah secara eksponensial. Proses filing manual menyebabkan kesulitan dalam pencarian dokumen, kehilangan file penting, dan tidak adanya version control. Koordinasi antar departemen terhambat karena dokumen fisik harus berpindah tangan, menyebabkan bottleneck dalam approval process. Compliance dan audit trail sulit dilacak karena tidak ada sistem tracking yang terstruktur.",
      solution: "Implementasi Cirrust Document Management System sebagai solusi paperless untuk centralized document repository. Setup folder structure yang sesuai dengan organizational hierarchy dan document taxonomy perusahaan. Konfigurasi user roles dan permissions untuk secure document access control. Implementasi document workflow untuk approval chain yang otomatis. Setup version control untuk tracking document revisions. Enable full-text search capability untuk quick document retrieval. Konfigurasi retention policy untuk document lifecycle management. Setup automated backup dan disaster recovery mechanism.",
      result: "Dokumen perusahaan 95% sudah terdigitalisasi dengan centralized repository. Document retrieval time berkurang dari 30 menit menjadi <1 menit dengan powerful search feature. Approval process accelerated 60% dengan automated workflow. Storage cost berkurang 40% dengan eliminasi physical filing cabinets. Compliance dan audit trail 100% traceable dengan complete activity logs. Document version control mencegah konflik dan kehilangan data. Cross-departmental collaboration meningkat dengan secure document sharing. User adoption rate 90% dalam 3 bulan pertama. ROI tercapai dalam 12 bulan dengan operational efficiency dan cost savings."
    }
  },
  {
    id: "bni-life",
    title: "BNI Life Insurance",
    category: "Insurance",
    description: "Implementasi Cirrust platform untuk auto underwriting & approval system dan policy management unit dashboard",
    tech: [".NET 6", "Cirrust Platform", "Masstransit", "ORM", "Telerik Reporting", "Quartz", "Log4net", "Automapper", "JWT Authentication", "Swagger", "API Versioning", "Custom Services", "Dashboard"],
    image: "/projects/bni.png",
    caseStudy: {
      problem: "BNI Life menghadapi bottleneck dalam proses underwriting dan approval polis yang masih manual, memakan waktu 5-7 hari per aplikasi. Underwriter kesulitan mengakses dokumen lengkap dan medical records yang tersebar. Tim management tidak memiliki visibility real-time terhadap performa Policy Management Unit—tidak ada dashboard untuk tracking policy status, approval pipeline, dan productivity metrics. Koordinasi antar tim (sales, underwriting, medical, approval) terhambat karena tidak ada centralized system, menyebabkan missed SLA dan customer complaints.",
      solution: "Implementasi Cirrust platform untuk dua use case kritis. Project 1 - Auto Underwriting & Approval: Build custom services untuk automated underwriting rules engine yang terintegrasi dengan medical database dan risk assessment system. Develop custom workflow untuk multi-stage approval chain (underwriter → medical reviewer → manager → final approval) dengan conditional routing based on sum assured dan risk level. Create custom forms untuk capturing application data dengan real-time validation. Implement document checklist automation untuk memastikan kelengkapan dokumen sebelum underwriting. Setup automated email notifications untuk setiap stage approval. Project 2 - Policy Management Unit Dashboard: Build custom dashboard pages untuk real-time monitoring policy pipeline, approval status, dan team productivity. Create custom reporting dengan Telerik untuk analytics: conversion funnel, processing time per stage, underwriter workload distribution, dan SLA compliance. Develop custom API services untuk integration dengan core insurance system untuk auto-sync policy data. Setup scheduled jobs (Quartz) untuk daily reports dan alert notifications.",
      result: "Auto underwriting & approval system mengurangi processing time dari 5-7 hari menjadi 2-3 hari (60% faster). Automated rules engine handle 40% of standard cases tanpa manual review. Document completeness check meningkatkan first-time-right submission dari 60% menjadi 85%. Approval workflow visibility mengeliminasi bottleneck dan missed handoffs. Policy Management Unit Dashboard memberikan real-time visibility: management dapat monitor 200+ active applications, track individual underwriter productivity, dan identify process bottlenecks instantly. SLA compliance meningkat dari 70% menjadi 92%. Underwriter productivity naik 35% dengan streamlined workflow dan quick access to documents. Customer satisfaction score meningkat ke 4.3/5 dengan faster turnaround time. Paperless process 95% dengan complete audit trail untuk compliance OJK. ROI tercapai dalam 9 bulan dengan operational efficiency dan reduced manual work."
    }
  },
  {
    id: "cirrust",
    title: "Cirrust - Document Management System",
    category: "Product",
    description: "Enterprise document management system dengan version control dan collaboration features",
    tech: [".NET 6", "Redis", "Hangfire", "JWT", "Automapper", "Swagger", "API Versioning", "DocuViewer"],
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
    tech: [".NET 6", "Masstransit", "FluentValidation", "ORM", "Camunda", "Quartz", "Log4net", "Automapper", "JWT Authentication", "Swagger", "API Versioning", "Telerik Report"],
    image: "/projects/cirrust-wf.png",
    caseStudy: {
      problem: "Client membutuhkan flexible workflow engine yang bisa handle complex approval chains dan conditional routing tanpa coding.",
      solution: "Integrate Camunda BPM engine dengan custom API layer. Build visual designer untuk business users. Elasticsearch untuk workflow analytics dan monitoring.",
      result: "Non-technical users dapat create workflow sendiri. Reduce development time untuk business process changes dari minggu ke hari."
    }
  },
  {
    id: "cirrust-one-klik-installer",
    title: "Cirrust One-Click Installer",
    category: "Product",
    description: "Automated installation tool untuk deploy Cirrust DMS + Workflow Engine dengan satu kali klik menggunakan Docker Compose dan batch script",
    tech: ["Docker", "Docker Compose", "DockerFile", "Batch Script", "PowerShell", "Automation", "Elastic Container Registry"],
    image: "/projects/cirrust-installer.png",
    caseStudy: {
      problem: "Proses instalasi Cirrust DMS dan Workflow Engine sangat kompleks dan memakan waktu. IT team client harus melakukan puluhan langkah manual: install SQL Server, configure database, install Hangfire, install Redis, configure database schema, deploy backend services, service auto binding IP address, dan masih banyak lagi. Satu instalasi bisa memakan waktu 2-3 hari dengan risiko kesalahan konfigurasi yang tinggi. Setiap kali ada update atau deployment ke client baru, tim harus repeat seluruh proses. Client non-technical kesulitan melakukan deployment sendiri dan selalu bergantung pada support tim.",
      solution: "Membangun One-Click Installer yang mengotomasi seluruh proses instalasi menggunakan Docker Compose dan batch script. Develop docker-compose.yml yang mendefinisikan semua services: SQL Server container dengan pre-configured database schema, Hangfire container untuk background job processing, Redis container untuk caching dan session management, Cirrust DMS backend service container, Cirrust Workflow Engine container. Create install.bat sebagai entry point yang melakukan: check Docker installation, validate system requirements (RAM, disk space), pull all Docker images dari Elastic Container Registry, execute docker-compose up dengan proper sequencing, run database migrations automatically, seed initial data dan default configurations, configure Hangfire dashboard dan scheduled jobs, setup Redis connection strings, auto-binding service IP addresses untuk service discovery, configure environment variables, health check untuk semua services (SQL Server, Hangfire, Redis, DMS, Workflow), generate installation report dengan service URLs dan credentials. Build PowerShell script untuk advanced customization options (custom ports, SSL certificates, database credentials). Create uninstall.bat untuk clean removal semua containers dan volumes. Package semuanya dalam single distributable file (bat/exe) yang bisa dijalankan oleh client.",
      result: "Installation time berkurang drastis dari 2-3 hari menjadi 15-20 menit (99% faster). Client dapat melakukan self-installation tanpa deep technical knowledge—cukup double-click install.bat dan tunggu selesai. Zero manual configuration errors karena semuanya automated dan pre-configured, termasuk Hangfire jobs dan Redis caching. Deployment consistency 100% across different environments—development, staging, production menggunakan exact same setup. Service auto-binding mengeliminasi manual IP configuration dan networking issues. Support tim workload berkurang 80% karena tidak perlu hands-on installation support untuk setup SQL Server, Hangfire, dan Redis. Update dan upgrade process menjadi trivial dengan versioned Docker images dari ECR. Client satisfaction meningkat signifikan karena easy onboarding dengan semua dependencies ter-handle otomatis. Adoption rate naik 60% karena reduced barrier to entry. Troubleshooting lebih mudah dengan standardized environment dan health check automation. Demo dan POC bisa di-setup dalam hitungan menit dengan semua services running. Sales cycle lebih cepat dengan quick deployment capability. Technical support cost berkurang dengan self-service installation. Zero downtime upgrades dengan Docker container replacement strategy."
    }
  },
  {
    id: "digital-signature",
    title: "Digital Signature Integration for Cirrust",
    category: "Product",
    description: "Integrasi digital signature untuk Cirrust DMS menggunakan third-party vendor DTA (Digital Tanda Tangan Asli) untuk legally binding electronic signatures",
    tech: [".NET 6", "DTA API", "Masstransit", "ORM", "API KEY Auth Schema", "Log4net", "Automapper", "Quartz", "Swagger", "API Versioning"],
    image: "/projects/cirrust-esign.png",
    caseStudy: {
      problem: "Cirrust DMS clients membutuhkan kemampuan untuk menandatangani dokumen secara digital dengan legally binding signatures yang compliant dengan regulasi ITE dan UU Tanda Tangan Elektronik. Manual wet signatures memperlambat approval process, terutama untuk stakeholder yang tersebar geografis. Dokumen harus dicetak, ditandatangani manual, di-scan kembali—process yang inefficient dan rawan error. Client di industri regulated (asuransi, perbankan, pemerintah) membutuhkan digital signatures yang memiliki kekuatan hukum setara dengan tanda tangan basah. Tidak ada standar internal untuk signature verification dan audit trail yang memadai.",
      solution: "Membangun comprehensive digital signature integration dengan DTA (Digital Tanda Tangan Asli) sebagai trusted Certificate Authority provider. Develop REST API wrapper untuk DTA signature services yang terintegrasi seamlessly dengan Cirrust DMS workflow. Implementasi signing workflow: user select document → trigger signature request → DTA generate signing link → user complete OTP verification → DTA apply digital signature → signed document auto-saved to Cirrust. Build custom UI components untuk signature placement dan visualization dalam document viewer. Create certificate management module untuk tracking certificate validity dan renewal. Implement signature verification service untuk validating signed documents. Setup webhook integration untuk real-time notification saat signing completed. Develop bulk signing capability untuk multiple documents. Create comprehensive audit trail untuk compliance: siapa sign dokumen, kapan, dari device apa, dengan certificate apa. Implement signature appearance customization (visible vs invisible signature, position, image). Handle multi-party signing dengan sequential atau parallel signing workflow.",
      result: "Document signing time berkurang dari hari/minggu menjadi menit dengan fully digital process. 100% legally compliant dengan UU ITE dan regulasi OJK/peraturan terkait. Zero paper usage untuk signing process—fully paperless dan environmentally friendly. Approval velocity meningkat 70% karena stakeholder dapat sign dari mana saja dengan mobile device. Audit trail compliance 100% dengan tamper-proof logging. Client satisfaction meningkat dengan seamless user experience—OTP verification dalam 2-3 menit. Integration dengan existing Cirrust workflow tanpa disruption—backwards compatible dengan non-signed documents. Security enhanced dengan digital encryption dan certificate validation. Cost savings significant dengan eliminasi printing, courier, dan storage untuk physical signed documents. Certificate management automated dengan renewal reminders dan expiry alerts. Multi-party signing capability handle complex approval chains dengan 5+ signers seamlessly."
    }
  },
  {
    id: "manulife",
    title: "Manulife Insurance - Agent AID Implementation",
    category: "Insurance",
    description: "Platform digital untuk agen asuransi dengan mobile app dan backend system",
    tech: [".NetCore 3.1", "Masstransit", "FluentValidation", "ORM", "Quartz", "JWT Authentication", "Log4net", "Automapper", "Swagger", "API Versioning"],
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
    tech: [".NET 8", "Masstransit", "ORM", "FluentValidation", "Quartz", "Oauth", "Log4net", "Automapper", "Swagger", "API Versioning", "Email Gateway", "FCM", "Dynamic Forms", "Json Evaluate"],
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
    tech: [".NET Core 3.1", "Masstransit", "FluentValidation", "ORM", "Quartz", "Saga", "EF", "JWT Authentication", "Log4net", "Automapper", "API Versioning", "Swagger"],
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
    category: "Others",
    description: "Framework internal untuk accelerate project development dan standardisasi",
    tech: ["Authentication (JWT/AD/OAuth)", "Notification (SMS/Email/Push)", "Persistence & ORM", "Common Libraries", "Security Libraries", "Project Generator"],
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

export const projectCategories = ["All", "Insurance", "Government", "Manufacturing", "Product", "Others"];
