export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'zh' | 'ja' | 'ar';

export interface Translations {
    // Navigation & Tabs
    dashboard: string;
    personalDetails: string;
    experience: string;
    education: string;
    achievements: string;
    design: string;
    jobMatch: string;

    // Personal Details
    personalDetailsTitle: string;
    personalDetailsSubtitle: string;
    fullName: string;
    jobTitle: string;
    address: string;
    email: string;
    phone: string;
    linkedin: string;
    telegram: string;
    professionalSummary: string;

    // Experience
    experienceTitle: string;
    experienceSubtitle: string;
    addRole: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorkHere: string;
    description: string;

    // Education
    educationTitle: string;
    educationSubtitle: string;
    addSchool: string;
    school: string;
    degree: string;
    graduationYear: string;
    skillsCertifications: string;
    technicalSkills: string;
    certifications: string;

    // Achievements
    achievementsTitle: string;
    achievementsSubtitle: string;
    keyAchievements: string;

    // Design
    designTitle: string;
    designSubtitle: string;
    templateStructure: string;
    typography: string;
    fontFamily: string;
    saveTag: string;
    templateTag: string;
    saveAsNewTemplate: string;
    accentColor: string;
    chooseColor: string;
    customColor: string;

    // Job Match
    jobMatchTitle: string;
    jobMatchSubtitle: string;
    targetJobDescription: string;
    analyzeOptimize: string;
    optimizationProtocol: string;

    // Common
    optional: string;
    enhance: string;
    generate: string;
    enhancing: string;
    download: string;
    saved: string;

    // Placeholders
    namePlaceholder: string;
    jobTitlePlaceholder: string;
    addressPlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    linkedinPlaceholder: string;
    telegramPlaceholder: string;
    summaryPlaceholder: string;
    rolePlaceholder: string;
    companyPlaceholder: string;
    locationPlaceholder: string;
    descriptionPlaceholder: string;
    schoolPlaceholder: string;
    degreePlaceholder: string;
    yearPlaceholder: string;
    skillsPlaceholder: string;
    achievementsPlaceholder: string;
    jobDescriptionPlaceholder: string;
    tagPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
    en: {
        // Navigation & Tabs
        dashboard: 'Dashboard',
        personalDetails: 'Personal',
        experience: 'Experience',
        education: 'Education',
        achievements: 'Achievements',
        design: 'Design',
        jobMatch: 'Job Match',

        // Personal Details
        personalDetailsTitle: 'Personal Details',
        personalDetailsSubtitle: 'The foundation of your professional identity.',
        fullName: 'Full Name',
        jobTitle: 'Job Title',
        address: 'Address',
        email: 'Email',
        phone: 'Phone',
        linkedin: 'LinkedIn',
        telegram: 'Telegram',
        professionalSummary: 'Professional Summary',

        // Experience
        experienceTitle: 'Experience',
        experienceSubtitle: 'Your professional journey.',
        addRole: 'Add Role',
        role: 'Role',
        company: 'Company',
        location: 'Location',
        startDate: 'Start Date',
        endDate: 'End Date',
        currentlyWorkHere: 'I currently work here',
        description: 'Description',

        // Education
        educationTitle: 'Education',
        educationSubtitle: 'Academic background.',
        addSchool: 'Add School',
        school: 'School / University',
        degree: 'Degree / Major',
        graduationYear: 'Graduation Year',
        skillsCertifications: 'Skills & Certifications',
        technicalSkills: 'Technical Skills',
        certifications: 'Certifications',

        // Achievements
        achievementsTitle: 'Key Achievements',
        achievementsSubtitle: 'Stand out with quantifiable successes.',
        keyAchievements: 'Key Achievements',

        // Design
        designTitle: 'Design & Layout',
        designSubtitle: 'Customize the visual language of your resume.',
        templateStructure: 'Template Structure',
        typography: 'Typography',
        fontFamily: 'Font Family',
        saveTag: 'Save & Tag',
        templateTag: 'Template Tag',
        saveAsNewTemplate: 'Save as New Template',
        accentColor: 'Accent Color',
        chooseColor: 'Choose Color',
        customColor: 'Custom Color',

        // Job Match
        jobMatchTitle: 'Job Match Optimization',
        jobMatchSubtitle: 'Paste the job description below. Our AI will reconstruct your resume to perfectly align with the requirements.',
        targetJobDescription: 'Target Job Description',
        analyzeOptimize: 'Analyze & Optimize Resume',
        optimizationProtocol: 'Optimization Protocol',

        // Common
        optional: 'Optional',
        enhance: 'Enhance',
        generate: 'Generate',
        enhancing: 'Enhancing...',
        download: 'Download PDF',
        saved: 'Saved',

        // Placeholders
        namePlaceholder: 'e.g. Steve Jobs',
        jobTitlePlaceholder: 'e.g. Product Designer',
        addressPlaceholder: 'e.g. San Francisco, CA',
        emailPlaceholder: 'your@email.com',
        phonePlaceholder: '+1 (555) 123-4567',
        linkedinPlaceholder: 'linkedin.com/in/username',
        telegramPlaceholder: 'username',
        summaryPlaceholder: 'Briefly describe your professional background...',
        rolePlaceholder: 'e.g. Senior Product Designer',
        companyPlaceholder: 'e.g. Google',
        locationPlaceholder: 'e.g. San Francisco, CA',
        descriptionPlaceholder: '• Achieved X by doing Y...',
        schoolPlaceholder: 'e.g. Stanford University',
        degreePlaceholder: 'e.g. Bachelor of Science in Computer Science',
        yearPlaceholder: '2019',
        skillsPlaceholder: 'Java, React, Leadership, Public Speaking...',
        achievementsPlaceholder: '• Built and managed partnership pipelines...',
        jobDescriptionPlaceholder: 'Paste the full job description here...',
        tagPlaceholder: 'e.g. For Senior Roles',
    },

    es: {
        // Navigation & Tabs
        dashboard: 'Panel',
        personalDetails: 'Personal',
        experience: 'Experiencia',
        education: 'Educación',
        achievements: 'Logros',
        design: 'Diseño',
        jobMatch: 'Coincidencia',

        // Personal Details
        personalDetailsTitle: 'Detalles Personales',
        personalDetailsSubtitle: 'La base de tu identidad profesional.',
        fullName: 'Nombre Completo',
        jobTitle: 'Título del Trabajo',
        address: 'Dirección',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        linkedin: 'LinkedIn',
        telegram: 'Telegram',
        professionalSummary: 'Resumen Profesional',

        // Experience
        experienceTitle: 'Experiencia',
        experienceSubtitle: 'Tu trayectoria profesional.',
        addRole: 'Agregar Rol',
        role: 'Rol',
        company: 'Empresa',
        location: 'Ubicación',
        startDate: 'Fecha de Inicio',
        endDate: 'Fecha de Fin',
        currentlyWorkHere: 'Actualmente trabajo aquí',
        description: 'Descripción',

        // Education
        educationTitle: 'Educación',
        educationSubtitle: 'Formación académica.',
        addSchool: 'Agregar Escuela',
        school: 'Escuela / Universidad',
        degree: 'Título / Especialización',
        graduationYear: 'Año de Graduación',
        skillsCertifications: 'Habilidades y Certificaciones',
        technicalSkills: 'Habilidades Técnicas',
        certifications: 'Certificaciones',

        // Achievements
        achievementsTitle: 'Logros Clave',
        achievementsSubtitle: 'Destaca con éxitos cuantificables.',
        keyAchievements: 'Logros Clave',

        // Design
        designTitle: 'Diseño y Maquetación',
        designSubtitle: 'Personaliza el lenguaje visual de tu currículum.',
        templateStructure: 'Estructura de Plantilla',
        typography: 'Tipografía',
        fontFamily: 'Familia de Fuente',
        saveTag: 'Guardar y Etiquetar',
        templateTag: 'Etiqueta de Plantilla',
        saveAsNewTemplate: 'Guardar como Nueva Plantilla',
        accentColor: 'Color de Acento',
        chooseColor: 'Elegir Color',
        customColor: 'Color Personalizado',

        // Job Match
        jobMatchTitle: 'Optimización de Coincidencia',
        jobMatchSubtitle: 'Pega la descripción del trabajo a continuación. Nuestra IA reconstruirá tu currículum para alinearse perfectamente con los requisitos.',
        targetJobDescription: 'Descripción del Trabajo Objetivo',
        analyzeOptimize: 'Analizar y Optimizar Currículum',
        optimizationProtocol: 'Protocolo de Optimización',

        // Common
        optional: 'Opcional',
        enhance: 'Mejorar',
        generate: 'Generar',
        enhancing: 'Mejorando...',
        download: 'Descargar PDF',
        saved: 'Guardado',

        // Placeholders
        namePlaceholder: 'ej. Juan Pérez',
        jobTitlePlaceholder: 'ej. Diseñador de Productos',
        addressPlaceholder: 'ej. Madrid, España',
        emailPlaceholder: 'tu@email.com',
        phonePlaceholder: '+34 123 456 789',
        linkedinPlaceholder: 'linkedin.com/in/usuario',
        telegramPlaceholder: 'usuario',
        summaryPlaceholder: 'Describe brevemente tu trayectoria profesional...',
        rolePlaceholder: 'ej. Diseñador Senior de Productos',
        companyPlaceholder: 'ej. Google',
        locationPlaceholder: 'ej. San Francisco, CA',
        descriptionPlaceholder: '• Logré X haciendo Y...',
        schoolPlaceholder: 'ej. Universidad Complutense',
        degreePlaceholder: 'ej. Licenciatura en Informática',
        yearPlaceholder: '2019',
        skillsPlaceholder: 'Java, React, Liderazgo, Oratoria...',
        achievementsPlaceholder: '• Construí y gestioné canales de asociación...',
        jobDescriptionPlaceholder: 'Pega la descripción completa del trabajo aquí...',
        tagPlaceholder: 'ej. Para Roles Senior',
    },

    fr: {
        // Navigation & Tabs
        dashboard: 'Tableau de bord',
        personalDetails: 'Personnel',
        experience: 'Expérience',
        education: 'Éducation',
        achievements: 'Réalisations',
        design: 'Design',
        jobMatch: 'Correspondance',

        // Personal Details
        personalDetailsTitle: 'Détails Personnels',
        personalDetailsSubtitle: 'La base de votre identité professionnelle.',
        fullName: 'Nom Complet',
        jobTitle: 'Titre du Poste',
        address: 'Adresse',
        email: 'Email',
        phone: 'Téléphone',
        linkedin: 'LinkedIn',
        telegram: 'Telegram',
        professionalSummary: 'Résumé Professionnel',

        // Experience
        experienceTitle: 'Expérience',
        experienceSubtitle: 'Votre parcours professionnel.',
        addRole: 'Ajouter un Rôle',
        role: 'Rôle',
        company: 'Entreprise',
        location: 'Lieu',
        startDate: 'Date de Début',
        endDate: 'Date de Fin',
        currentlyWorkHere: 'Je travaille actuellement ici',
        description: 'Description',

        // Education
        educationTitle: 'Éducation',
        educationSubtitle: 'Formation académique.',
        addSchool: 'Ajouter une École',
        school: 'École / Université',
        degree: 'Diplôme / Spécialisation',
        graduationYear: 'Année de Diplôme',
        skillsCertifications: 'Compétences et Certifications',
        technicalSkills: 'Compétences Techniques',
        certifications: 'Certifications',

        // Achievements
        achievementsTitle: 'Réalisations Clés',
        achievementsSubtitle: 'Démarquez-vous avec des succès quantifiables.',
        keyAchievements: 'Réalisations Clés',

        // Design
        designTitle: 'Design et Mise en Page',
        designSubtitle: 'Personnalisez le langage visuel de votre CV.',
        templateStructure: 'Structure du Modèle',
        typography: 'Typographie',
        fontFamily: 'Famille de Police',
        saveTag: 'Enregistrer et Étiqueter',
        templateTag: 'Étiquette du Modèle',
        saveAsNewTemplate: 'Enregistrer comme Nouveau Modèle',
        accentColor: 'Couleur d\'Accent',
        chooseColor: 'Choisir la Couleur',
        customColor: 'Couleur Personnalisée',

        // Job Match
        jobMatchTitle: 'Optimisation de Correspondance',
        jobMatchSubtitle: 'Collez la description du poste ci-dessous. Notre IA reconstruira votre CV pour s\'aligner parfaitement avec les exigences.',
        targetJobDescription: 'Description du Poste Cible',
        analyzeOptimize: 'Analyser et Optimiser le CV',
        optimizationProtocol: 'Protocole d\'Optimisation',

        // Common
        optional: 'Optionnel',
        enhance: 'Améliorer',
        generate: 'Générer',
        enhancing: 'Amélioration...',
        download: 'Télécharger PDF',
        saved: 'Enregistré',

        // Placeholders
        namePlaceholder: 'ex. Jean Dupont',
        jobTitlePlaceholder: 'ex. Designer de Produits',
        addressPlaceholder: 'ex. Paris, France',
        emailPlaceholder: 'votre@email.com',
        phonePlaceholder: '+33 1 23 45 67 89',
        linkedinPlaceholder: 'linkedin.com/in/username',
        telegramPlaceholder: 'username',
        summaryPlaceholder: 'Décrivez brièvement votre parcours professionnel...',
        rolePlaceholder: 'ex. Designer Senior',
        companyPlaceholder: 'ex. Google',
        locationPlaceholder: 'ex. Paris, France',
        descriptionPlaceholder: '• Réalisé X en faisant Y...',
        schoolPlaceholder: 'ex. Sorbonne Université',
        degreePlaceholder: 'ex. Master en Informatique',
        yearPlaceholder: '2019',
        skillsPlaceholder: 'Java, React, Leadership...',
        achievementsPlaceholder: '• Construit et géré...',
        jobDescriptionPlaceholder: '完全な求人説明をここに貼り付けてください...',
        tagPlaceholder: '例：シニア職向け',
    },

    ar: {
        // Navigation & Tabs
        dashboard: 'لوحة التحكم',
        personalDetails: 'شخصي',
        experience: 'الخبرة',
        education: 'التعليم',
        achievements: 'الإنجازات',
        design: 'التصميم',
        jobMatch: 'مطابقة الوظيفة',

        // Personal Details
        personalDetailsTitle: 'التفاصيل الشخصية',
        personalDetailsSubtitle: 'أساس هويتك المهنية.',
        fullName: 'الاسم الكامل',
        jobTitle: 'المسمى الوظيفي',
        address: 'العنوان',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        linkedin: 'لينكد إن',
        telegram: 'تيليجرام',
        professionalSummary: 'الملخص المهني',

        // Experience
        experienceTitle: 'الخبرة',
        experienceSubtitle: 'رحلتك المهنية.',
        addRole: 'إضافة دور',
        role: 'الدور',
        company: 'الشركة',
        location: 'الموقع',
        startDate: 'تاريخ البدء',
        endDate: 'تاريخ الانتهاء',
        currentlyWorkHere: 'أعمل هنا حالياً',
        description: 'الوصف',

        // Education
        educationTitle: 'التعليم',
        educationSubtitle: 'الخلفية الأكاديمية.',
        addSchool: 'إضافة مدرسة',
        school: 'المدرسة / الجامعة',
        degree: 'الدرجة / التخصص',
        graduationYear: 'سنة التخرج',
        skillsCertifications: 'المهارات والشهادات',
        technicalSkills: 'المهارات التقنية',
        certifications: 'الشهادات',

        // Achievements
        achievementsTitle: 'الإنجازات الرئيسية',
        achievementsSubtitle: 'تميز بنجاحات قابلة للقياس.',
        keyAchievements: 'الإنجازات الرئيسية',

        // Design
        designTitle: 'التصميم والتخطيط',
        designSubtitle: 'خصص اللغة البصرية لسيرتك الذاتية.',
        templateStructure: 'هيكل القالب',
        typography: 'الطباعة',
        fontFamily: 'عائلة الخط',
        saveTag: 'حفظ ووسم',
        templateTag: 'وسم القالب',
        saveAsNewTemplate: 'حفظ كقالب جديد',
        accentColor: 'لون التمييز',
        chooseColor: 'اختر اللون',
        customColor: 'لون مخصص',

        // Job Match
        jobMatchTitle: 'تحسين مطابقة الوظيفة',
        jobMatchSubtitle: 'الصق وصف الوظيفة أدناه. سيقوم الذكاء الاصطناعي بإعادة بناء سيرتك الذاتية لتتماشى تماماً مع المتطلبات.',
        targetJobDescription: 'وصف الوظيفة المستهدفة',
        analyzeOptimize: 'تحليل وتحسين السيرة الذاتية',
        optimizationProtocol: 'بروتوكول التحسين',

        // Common
        optional: 'اختياري',
        enhance: 'تحسين',
        generate: 'توليد',
        enhancing: 'جاري التحسين...',
        download: 'تحميل PDF',
        saved: 'محفوظ',

        // Placeholders
        namePlaceholder: 'مثال: أحمد محمد',
        jobTitlePlaceholder: 'مثال: مصمم منتجات',
        addressPlaceholder: 'مثال: دبي، الإمارات',
        locationPlaceholder: 'مثال: دبي، الإمارات',
        emailPlaceholder: 'your@email.com',
        phonePlaceholder: '+971 50 123 4567',
        linkedinPlaceholder: 'linkedin.com/in/username',
        telegramPlaceholder: 'username',
        summaryPlaceholder: 'صف بإيجاز خلفيتك المهنية...',
        rolePlaceholder: 'مثال: مصمم منتجات أول',
        companyPlaceholder: 'مثال: جوجل',
        descriptionPlaceholder: '• حققت X من خلال القيام بـ Y...',
        schoolPlaceholder: 'مثال: جامعة الإمارات',
        degreePlaceholder: 'مثال: بكالوريوس علوم الحاسوب',
        yearPlaceholder: '2019',
        skillsPlaceholder: 'Java, React, القيادة, التحدث أمام الجمهور...',
        achievementsPlaceholder: '• بنيت وأدرت خطوط الشراكة...',
        jobDescriptionPlaceholder: 'الصق وصف الوظيفة الكامل هنا...',
        tagPlaceholder: 'مثال: للوظائف العليا',
    },
};

export const getTranslation = (lang: Language): Translations => {
    return translations[lang] || translations.en;
};

export const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
    it: 'Italiano',
    zh: '中文',
    ja: '日本語',
    ar: 'العربية',
};
