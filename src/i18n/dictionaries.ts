/**
 * Bilingual copy (EN/FA) — the single source of truth for every user-facing
 * string. Components never hard-code copy; they read `t` from
 * LanguageContext. Technical proper nouns (repo names, chip labels like
 * `LangGraph`, categories like `GenAI · FastAPI`) intentionally stay in
 * English in both languages — transliterating them hurts scannability for
 * the hiring managers this portfolio targets.
 */

export type Lang = 'en' | 'fa';

export interface ProjectEntry {
  id: string;
  index: string;
  title: string;
  description: string;
  learnings: string[];
  category: string;
  repoUrl: string;
}

export interface SkillGroupEntry {
  group: string;
  items: string[];
}

export interface Dictionary {
  dir: 'ltr' | 'rtl';
  meta: { title: string; description: string };
  nav: { home: string; about: string; projects: string; skills: string };
  menu: { open: string; close: string; label: string };
  cta: string;
  hero: {
    greeting: string;
    nameLine1: string;
    nameLine2: string;
    lead: string;
    downloadCV: string;
    viewProjects: string;
    tags: { num: string; label: string }[];
    roleKicker: string;
    roleLine1: string;
    roleLine2: string;
    scrollDown: string;
  };
  about: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    leadBefore: string;
    leadName: string;
    leadAfter: string;
    facts: { title: string; text: string }[];
  };
  projects: {
    kicker: string;
    title: string;
    viewRepo: string;
    items: ProjectEntry[];
  };
  skills: {
    kicker: string;
    title: string;
    groups: SkillGroupEntry[];
  };
  contact: {
    kicker: string;
    title: string;
    intro: string;
    location: string;
    emailAriaLabel: string;
    formHeading: string;
  };
  form: {
    nameLabel: string;
    namePh: string;
    emailLabel: string;
    emailPh: string;
    phoneLabel: string;
    phonePh: string;
    websiteLabel: string;
    websitePh: string;
    messageLabel: string;
    messagePh: string;
    requiredNote: string;
    send: string;
    sending: string;
    errRequiredName: string;
    errRequiredEmail: string;
    errInvalidEmail: string;
    errRequiredPhone: string;
    errInvalidPhone: string;
    errRequiredMessage: string;
    errInvalidWebsite: string;
    errorSummary: string;
    successTitle: string;
    successMsg: string;
    sendAnother: string;
    failTitle: string;
    failMsg: string;
    retry: string;
    emailMe: string;
    missingKeyMsg: string;
  };
  theme: { label: string; light: string; dark: string; system: string };
  language: { label: string; toggleTo: string };
  footer: { role: string; rights: string };
}

/* Shared technical chip labels — identical in both languages by design. */
const SKILL_ITEMS: string[][] = [
  ['System Design', 'Clean Architecture', 'Design Patterns', 'Testing Patterns'],
  ['PyTorch', 'Hugging Face', 'LangGraph', 'OpenCV', 'Classical ML'],
  ['Python', 'FastAPI', 'Celery', 'Airflow', 'PostgreSQL', 'MongoDB', 'Qdrant', 'Weaviate', 'Redis'],
  ['Docker', 'K8s', 'Git', 'MLFlow', 'DVC', 'Nginx', 'CI/CD', 'vLLM', 'Langfuse'],
  ['N8n', 'Neo4j', 'ELK', 'Grafana', 'Prometheus', 'RabbitMQ', 'Kafka', 'ArgoCD', 'Terraform'],
];

/* Shared repo URLs — content, not copy; identical in both languages. */
const REPO = (slug: string): string => `https://github.com/pouria98sarmasti/${slug}`;

const en: Dictionary = {
  dir: 'ltr',
  meta: {
    title: 'Pouria Sarmasti — Software Engineer',
    description: 'Pouria Sarmasti — Software Engineer. AI that ships, not just demos.',
  },
  nav: { home: 'Home', about: 'About', projects: 'Projects', skills: 'Skills' },
  menu: { open: 'Open menu', close: 'Close menu', label: 'Site menu' },
  cta: 'Get in touch',
  hero: {
    greeting: "Hi, I'm",
    nameLine1: 'Pouria',
    nameLine2: 'Sarmasti',
    lead: 'From agents to speech, I build production-grade AI systems that deploy, scale and stay observable.',
    downloadCV: 'Download CV',
    viewProjects: 'View Projects',
    tags: [
      { num: '#01', label: 'AI Agents' },
      { num: '#02', label: 'RAG Systems' },
      { num: '#03', label: 'MLOps & Docker' },
      { num: '#04', label: 'LLM Fine-tuning' },
    ],
    roleKicker: 'AI that ships',
    roleLine1: 'Software',
    roleLine2: 'Engineer',
    scrollDown: 'Scroll down',
  },
  about: {
    kicker: 'About',
    titleLine1: 'Bridging research',
    titleLine2: 'and reliability.',
    leadBefore: "I'm ",
    leadName: 'Pouria Sarmasti',
    leadAfter:
      ' — a Software Engineer with 2.5+ years of hands-on experience deploying production-grade AI Agents, RAG systems, and Speech & Vision APIs. I specialize in containerized (Docker/K8s), observable AI systems for on-premise environments.',
    facts: [
      {
        title: '9 AI microservices',
        text: 'Delivered to production — secure, on-premise deployments built on clean architecture.',
      },
      {
        title: 'Technical lead',
        text: 'Mentored 2–3 junior AI developers; code reviews on FastAPI, LangGraph and MLOps practices.',
      },
      {
        title: 'Sharif University',
        text: 'BSc in Electrical Engineering, graduated 2023.',
      },
    ],
  },
  projects: {
    kicker: 'Selected Work',
    title: "What I've shipped.",
    viewRepo: 'View repo',
    items: [
      {
        id: 'rag-agents-text-to-sql',
        index: '01',
        title: 'RAG Agents & Text-to-SQL',
        description:
          'GenAI microservices for retrieval-augmented agents and natural-language database queries — containerized, observable, on-premise.',
        learnings: [
          'Structuring LangGraph agents so each tool is testable in isolation',
          'Schema guardrails that keep generated SQL valid before it hits the database',
          'Tuning chunking strategy against a retrieval eval set instead of intuition',
        ],
        category: 'GenAI · FastAPI',
        repoUrl: REPO('rag-agents-text-to-sql'),
      },
      {
        id: 'speech-to-speech-translation',
        index: '02',
        title: 'Speech-to-Speech Translation',
        description:
          'Full speech pipeline: transcription, speaker diarization, and real-time speech-to-speech translation microservices.',
        learnings: [
          'Diarization error propagation across pipeline stages — and where to cut it off',
          'Latency budgeting across ASR → translation → TTS for near-real-time output',
          'Streaming chunk boundaries that keep transcription accuracy intact',
        ],
        category: 'Speech · ASR',
        repoUrl: REPO('speech-to-speech-translation'),
      },
      {
        id: 'face-search-system',
        index: '03',
        title: 'Face Search System',
        description:
          'ML microservice for large-scale face retrieval with vector databases — built for privacy-first, on-premise deployment.',
        learnings: [
          'Embedding normalization and index choice (HNSW) trade-offs for recall vs latency',
          'Consistent vector/index sync when face galleries are re-enrolled',
          'Privacy-first deployment: keeping biometric data inside the network boundary',
        ],
        category: 'Vision · Vector DB',
        repoUrl: REPO('face-search-system'),
      },
      {
        id: 'eeg-task-classification',
        index: '04',
        title: 'EEG Task Classification',
        description:
          'Classifying cognitive tasks from EEG signals — classical ML pipelines wired into production ETL flows.',
        learnings: [
          'Feature engineering (band power, epoching) beats end-to-end nets on small EEG sets',
          'Contaminating leakage between train/test epochs when subjects repeat tasks',
          'Packaging classical-ML preprocessing as versioned, reproducible ETL steps',
        ],
        category: 'ML · Signals',
        repoUrl: REPO('eeg-task-classification'),
      },
      {
        id: 'llm-asr-fine-tuning',
        index: '05',
        title: 'LLM & ASR Fine-tuning',
        description:
          'Fine-tuning open-source LLMs and speech recognition models, plus NER-based word clouds and keyword extraction services.',
        learnings: [
          'LoRA rank/dataset-size trade-offs when GPUs and data are both limited',
          'Catastrophic forgetting in ASR fine-tuning and curbing it with replay data',
          'Serving fine-tuned checkpoints with vLLM without regressing base-model latency',
        ],
        category: 'NLP · Training',
        repoUrl: REPO('llm-asr-fine-tuning'),
      },
      {
        id: 'etl-mlops-pipelines',
        index: '06',
        title: 'ETL & MLOps Pipelines',
        description:
          'Designed and implemented ETL pipelines with Airflow/Celery, tracked with MLFlow & DVC, deployed via Docker/K8s.',
        learnings: [
          'Idempotent DAG design so backfills and retries never double-load data',
          'Data/model versioning with DVC + MLflow making every deployment reproducible',
          'K8s resource tuning for bursty training jobs vs always-on inference services',
        ],
        category: 'MLOps · Infra',
        repoUrl: REPO('etl-mlops-pipelines'),
      },
    ],
  },
  skills: {
    kicker: 'Technical Skills',
    title: 'The toolbox.',
    groups: [
      { group: 'Software Engineering', items: SKILL_ITEMS[0] },
      { group: 'AI / ML', items: SKILL_ITEMS[1] },
      { group: 'Backend & Data', items: SKILL_ITEMS[2] },
      { group: 'MLOps & Infra', items: SKILL_ITEMS[3] },
      { group: 'Exploring', items: SKILL_ITEMS[4] },
    ],
  },
  contact: {
    kicker: 'Contact',
    title: "Let's build something.",
    intro: 'Have a project in mind? Send a message — I usually reply within a day.',
    location: 'Tehran, Iran',
    emailAriaLabel: 'Email me at',
    formHeading: 'Send a message',
  },
  form: {
    nameLabel: 'Your name',
    namePh: 'Your Name*',
    emailLabel: 'Email address',
    emailPh: 'Email Address*',
    phoneLabel: 'Phone number',
    phonePh: 'Phone Number*',
    websiteLabel: 'Website',
    websitePh: 'Your Website (Optional)',
    messageLabel: 'Message',
    messagePh: 'Write your message...',
    requiredNote: 'Fields marked * are required.',
    send: 'Send Message',
    sending: 'Sending…',
    errRequiredName: 'Please enter your name.',
    errRequiredEmail: 'Please enter your email address.',
    errInvalidEmail: 'Please enter a valid email address.',
    errRequiredPhone: 'Please enter your phone number.',
    errInvalidPhone: 'Please enter a valid phone number.',
    errRequiredMessage: 'Please write your message (at least 10 characters).',
    errInvalidWebsite: 'Please enter a valid URL, starting with https://',
    errorSummary: 'Please fix the following:',
    successTitle: 'Message sent!',
    successMsg: "Thanks for reaching out — I'll get back to you soon.",
    sendAnother: 'Send another message',
    failTitle: 'Something went wrong',
    failMsg: "Your message couldn't be sent. Please try again or email me directly.",
    retry: 'Try again',
    emailMe: 'Email me directly',
    missingKeyMsg:
      'The contact form needs a Web3Forms key (VITE_WEB3FORMS_KEY). Meanwhile, you can email me directly.',
  },
  theme: { label: 'Color theme', light: 'Light', dark: 'Dark', system: 'System' },
  language: { label: 'Switch language', toggleTo: 'فارسی' },
  footer: { role: 'Software Engineer — Tehran', rights: '© 2026 Pouria Sarmasti' },
};

const fa: Dictionary = {
  dir: 'rtl',
  meta: {
    title: 'پوریا سرمستی — مهندس نرم‌افزار',
    description: 'پوریا سرمستی — مهندس نرم‌افزار. هوش مصنوعی که به محصول می‌رسد، نه فقط دمو.',
  },
  nav: { home: 'خانه', about: 'درباره من', projects: 'پروژه‌ها', skills: 'مهارت‌ها' },
  menu: { open: 'باز کردن منو', close: 'بستن منو', label: 'منوی سایت' },
  cta: 'در تماس باشیم',
  hero: {
    greeting: 'سلام، من',
    nameLine1: 'پوریا',
    nameLine2: 'سرمستی',
    lead: 'از ایجنت تا گفتار، سیستم‌های هوش مصنوعی در سطح پروداکشن می‌سازم؛ آماده‌ی دیپلوی، مقیاس‌پذیر و قابل پایش.',
    downloadCV: 'دانلود رزومه',
    viewProjects: 'مشاهده پروژه‌ها',
    tags: [
      { num: '#01', label: 'ایجنت‌های هوش مصنوعی' },
      { num: '#02', label: 'سیستم‌های RAG' },
      { num: '#03', label: 'MLOps و داکر' },
      { num: '#04', label: 'فاین‌تیون LLM' },
    ],
    roleKicker: 'هوش مصنوعی که به محصول می‌رسد',
    roleLine1: 'مهندس',
    roleLine2: 'نرم‌افزار',
    scrollDown: 'اسکرول کنید',
  },
  about: {
    kicker: 'درباره من',
    titleLine1: 'پلی میان پژوهش',
    titleLine2: 'و اطمینان.',
    leadBefore: 'من ',
    leadName: 'پوریا سرمستی',
    leadAfter:
      ' هستم — مهندس نرم‌افزار با بیش از ۲.۵ سال تجربه‌ی عملی در استقرار ایجنت‌های هوش مصنوعی، سیستم‌های RAG و APIهای گفتار و بینایی در سطح پروداکشن. تخصص من سیستم‌های هوش مصنوعی کانتینری (Docker/K8s) و قابل پایش برای محیط‌های آن‌پرمیس است.',
    facts: [
      {
        title: '۹ میکروسرویس هوش مصنوعی',
        text: 'تحویل به پروداکشن — استقرارهای امن آن‌پرمیس بر پایه‌ی معماری تمیز.',
      },
      {
        title: 'راهبر فنی',
        text: 'منتورینگ ۲ تا ۳ توسعه‌دهنده‌ی جونیور هوش مصنوعی؛ کدریویو در FastAPI ،LangGraph و شیوه‌های MLOps.',
      },
      {
        title: 'دانشگاه صنعتی شریف',
        text: 'کارشناسی مهندسی برق، فارغ‌التحصیل ۱۴۰۲.',
      },
    ],
  },
  projects: {
    kicker: 'منتخب آثار',
    title: 'آنچه ساخته و تحویل داده‌ام.',
    viewRepo: 'مشاهده ریپو',
    items: [
      {
        id: 'rag-agents-text-to-sql',
        index: '01',
        title: 'ایجنت‌های RAG و Text-to-SQL',
        description:
          'میکروسرویس‌های GenAI برای ایجنت‌های بازیابی‌محور و کوئری‌زدن به دیتابیس با زبان طبیعی — کانتینری، قابل پایش و آن‌پرمیس.',
        learnings: [
          'ساختاردهی ایجنت‌های LangGraph به‌گونه‌ای که هر ابزار به‌صورت ایزوله قابل تست باشد',
          'گاردریل‌های اسکیما که SQL تولیدشده را پیش از رسیدن به دیتابیس معتبر نگه می‌دارند',
          'تنظیم استراتژی چانکینگ بر اساس ست ارزیابی ریتریوال، نه حدس و شهود',
        ],
        category: 'GenAI · FastAPI',
        repoUrl: REPO('rag-agents-text-to-sql'),
      },
      {
        id: 'speech-to-speech-translation',
        index: '02',
        title: 'ترجمه‌ی گفتار به گفتار',
        description:
          'پایپ‌لاین کامل گفتار: میکروسرویس‌های رونویسی، تفکیک گوینده و ترجمه‌ی بلادرنگ گفتار به گفتار.',
        learnings: [
          'انتشار خطای تفکیک گوینده در مراحل پایپ‌لاین — و نقطه‌ای که باید جلویش را گرفت',
          'بودجه‌بندی تأخیر در زنجیره‌ی ASR ← ترجمه ← TTS برای خروجی نزدیک به بلادرنگ',
          'مرزبندی چانک‌های استریم به‌گونه‌ای که دقت رونویسی حفظ شود',
        ],
        category: 'Speech · ASR',
        repoUrl: REPO('speech-to-speech-translation'),
      },
      {
        id: 'face-search-system',
        index: '03',
        title: 'سیستم جست‌وجوی چهره',
        description:
          'میکروسرویس ML برای بازیابی چهره در مقیاس بزرگ با وکتور دیتابیس — ساخته‌شده برای استقرار آن‌پرمیس با اولویت حریم خصوصی.',
        learnings: [
          'نرمال‌سازی امبدینگ و موازنه‌ی انتخاب ایندکس (HNSW) میان ریکال و تأخیر',
          'همگام‌سازی یکپارچه‌ی وکتور و ایندکس هنگام ثبت‌نام مجدد گالری چهره‌ها',
          'استقرار با اولویت حریم خصوصی: نگه‌داشتن داده‌ی بیومتریک داخل مرز شبکه',
        ],
        category: 'Vision · Vector DB',
        repoUrl: REPO('face-search-system'),
      },
      {
        id: 'eeg-task-classification',
        index: '04',
        title: 'طبقه‌بندی تسک از سیگنال EEG',
        description:
          'طبقه‌بندی تسک‌های شناختی از سیگنال‌های EEG — پایپ‌لاین‌های ML کلاسیک متصل به فلوهای ETL پروداکشن.',
        learnings: [
          'مهندسی ویژگی (توان باندی، اپوک‌بندی) روی ست‌های کوچک EEG از شبکه‌های اند-تو-اند بهتر جواب می‌دهد',
          'نشت آلوده‌کننده میان اپوک‌های ترین و تست وقتی سوژه‌ها تسک‌ها را تکرار می‌کنند',
          'بسته‌بندی پیش‌پردازش ML کلاسیک به‌صورت گام‌های ETL نسخه‌دار و بازتولیدپذیر',
        ],
        category: 'ML · Signals',
        repoUrl: REPO('eeg-task-classification'),
      },
      {
        id: 'llm-asr-fine-tuning',
        index: '05',
        title: 'فاین‌تیون LLM و ASR',
        description:
          'فاین‌تیون مدل‌های زبانی و بازشناسی گفتار اوپن‌سورس، به‌علاوه‌ی سرویس‌های ابر کلمات مبتنی بر NER و استخراج کلیدواژه.',
        learnings: [
          'موازنه‌ی رنک LoRA و اندازه‌ی دیتاست وقتی هم GPU و هم داده محدود است',
          'فراموشی فاجعه‌بار در فاین‌تیون ASR و مهار آن با داده‌ی بازپخش (replay)',
          'سرو کردن چک‌پوینت‌های فاین‌تیون‌شده با vLLM بدون افت تأخیر نسبت به مدل پایه',
        ],
        category: 'NLP · Training',
        repoUrl: REPO('llm-asr-fine-tuning'),
      },
      {
        id: 'etl-mlops-pipelines',
        index: '06',
        title: 'پایپ‌لاین‌های ETL و MLOps',
        description:
          'طراحی و پیاده‌سازی پایپ‌لاین‌های ETL با Airflow و Celery، ردیابی با MLFlow و DVC و استقرار با Docker و K8s.',
        learnings: [
          'طراحی DAG آیدم‌پوتنت تا بک‌فیل و تلاش مجدد هیچ‌وقت داده را دوبار بارگذاری نکنند',
          'نسخه‌بندی داده و مدل با DVC و MLflow که هر استقرار را بازتولیدپذیر می‌کند',
          'تنظیم منابع K8s برای جاب‌های آموزشی انفجاری در برابر سرویس‌های استنتاج همیشه‌روشن',
        ],
        category: 'MLOps · Infra',
        repoUrl: REPO('etl-mlops-pipelines'),
      },
    ],
  },
  skills: {
    kicker: 'مهارت‌های فنی',
    title: 'جعبه‌ابزار.',
    groups: [
      { group: 'مهندسی نرم‌افزار', items: SKILL_ITEMS[0] },
      { group: 'هوش مصنوعی / یادگیری ماشین', items: SKILL_ITEMS[1] },
      { group: 'بک‌اند و داده', items: SKILL_ITEMS[2] },
      { group: 'MLOps و زیرساخت', items: SKILL_ITEMS[3] },
      { group: 'در حال کاوش', items: SKILL_ITEMS[4] },
    ],
  },
  contact: {
    kicker: 'تماس',
    title: 'بیایید چیزی بسازیم.',
    intro: 'پروژه‌ای در ذهن دارید؟ پیام بفرستید — معمولاً ظرف یک روز جواب می‌دهم.',
    location: 'تهران، ایران',
    emailAriaLabel: 'ایمیل به آدرس',
    formHeading: 'ارسال پیام',
  },
  form: {
    nameLabel: 'نام شما',
    namePh: '*نام شما',
    emailLabel: 'آدرس ایمیل',
    emailPh: '*آدرس ایمیل',
    phoneLabel: 'شماره تماس',
    phonePh: '*شماره تماس',
    websiteLabel: 'وب‌سایت',
    websitePh: 'وب‌سایت شما (اختیاری)',
    messageLabel: 'پیام',
    messagePh: '...پیام خود را بنویسید',
    requiredNote: 'فیلدهای ستاره‌دار (*) الزامی‌اند.',
    send: 'ارسال پیام',
    sending: '...در حال ارسال',
    errRequiredName: 'لطفاً نام خود را وارد کنید.',
    errRequiredEmail: 'لطفاً آدرس ایمیل خود را وارد کنید.',
    errInvalidEmail: 'لطفاً یک آدرس ایمیل معتبر وارد کنید.',
    errRequiredPhone: 'لطفاً شماره تماس خود را وارد کنید.',
    errInvalidPhone: 'لطفاً یک شماره تماس معتبر وارد کنید.',
    errRequiredMessage: 'لطفاً پیام خود را بنویسید (حداقل ۱۰ کاراکتر).',
    errInvalidWebsite: 'لطفاً یک آدرس معتبر وارد کنید که با https:// شروع شود.',
    errorSummary: 'لطفاً موارد زیر را اصلاح کنید:',
    successTitle: 'پیام ارسال شد!',
    successMsg: 'ممنون که پیام دادید — به‌زودی جواب می‌دهم.',
    sendAnother: 'ارسال پیام دیگر',
    failTitle: 'مشکلی پیش آمد',
    failMsg: 'پیام شما ارسال نشد. لطفاً دوباره تلاش کنید یا مستقیم ایمیل بزنید.',
    retry: 'تلاش مجدد',
    emailMe: 'ایمیل مستقیم',
    missingKeyMsg:
      'فرم تماس هنوز کلید Web3Forms ندارد (VITE_WEB3FORMS_KEY). در ضمن می‌توانید مستقیم ایمیل بزنید.',
  },
  theme: { label: 'تم رنگی', light: 'روشن', dark: 'تیره', system: 'سیستم' },
  language: { label: 'تغییر زبان', toggleTo: 'English' },
  footer: { role: 'مهندس نرم‌افزار — تهران', rights: '© 2026 پوریا سرمستی' },
};

export const dictionaries: Record<Lang, Dictionary> = { en, fa };
