const fs = require('fs');
const content = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const additions = {
  en: {
    nav: { sign_out: "Sign Out" },
    footer: { terms: "Terms", privacy: "Privacy", help: "Help", copyright: "The Proven X. Community vetted answers." },
    about: { sponsorship: "Sponsorship", active_members: "Active Members", verified_answers: "Verified Answers", questions_asked: "Questions Asked", trust_rate: "Trust Rate" },
    products: { open_app: "Open App", get_app: "Get the App", join_now: "Join Now", price_free: "$0/mo", price_paid: "???/mo", feature_ask: "Ask unlimited questions", feature_post: "Post and verify answers", feature_vote: "Vote on content", feature_profile: "Basic profile", feature_everything: "Everything in Free", feature_support: "Priority support", feature_analytics: "Advanced analytics", feature_badges: "Custom profile badges" },
    blog: { subtitle: "Insights, updates, and stories from the community.", p1_title: "Why First-Hand Answers Beat Generic Advice", p1_excerpt: "The internet is full of theories. We built this platform because we realized that the only advice worth following comes from someone who has actually been there.", p2_title: "How the 'Proven' Verification System Works", p2_excerpt: "A deep dive into our verification algorithm and why we don't just rely on simple upvotes to determine the best answer.", p3_title: "Community Spotlight: Solving the Undocumentable", p3_excerpt: "Highlighting three instances where our community solved obscure problems that had zero documentation anywhere else on the web." }
  },
  ar: {
    nav: { sign_out: "تسجيل الخروج" },
    footer: { terms: "الشروط", privacy: "الخصوصية", help: "مساعدة", copyright: "The Proven X. إجابات مدققة من المجتمع." },
    about: { sponsorship: "رعاية", active_members: "الأعضاء النشطين", verified_answers: "الإجابات المؤكدة", questions_asked: "الأسئلة المطروحة", trust_rate: "معدل الثقة" },
    products: { open_app: "افتح التطبيق", get_app: "احصل على التطبيق", join_now: "انضم الآن", price_free: "$0/شهر", price_paid: "؟؟؟/شهر", feature_ask: "اسأل عدداً غير محدود من الأسئلة", feature_post: "انشر وتحقق من الإجابات", feature_vote: "صوّت على المحتوى", feature_profile: "ملف شخصي أساسي", feature_everything: "كل شيء في المجاني", feature_support: "دعم ذو أولوية", feature_analytics: "تحليلات متقدمة", feature_badges: "شارات مخصصة للملف الشخصي" },
    blog: { subtitle: "رؤى، تحديثات، وقصص من المجتمع.", p1_title: "لماذا تتفوق الإجابات المباشرة على النصائح العامة", p1_excerpt: "الإنترنت مليء بالنظريات. بنينا هذه المنصة لأننا أدركنا أن النصيحة الوحيدة التي تستحق الاتباع تأتي ممن خاض التجربة بالفعل.", p2_title: "كيف يعمل نظام التحقق 'Proven'", p2_excerpt: "نظرة عميقة على خوارزمية التحقق لدينا ولماذا لا نعتمد فقط على التصويتات البسيطة لتحديد أفضل إجابة.", p3_title: "تسليط الضوء على المجتمع: حل ما لا يمكن توثيقه", p3_excerpt: "إبراز ثلاث حالات قام فيها مجتمعنا بحل مشكلات غامضة لم يكن لها أي توثيق في أي مكان آخر على الويب." }
  },
  tl: {
    nav: { sign_out: "Mag-sign Out" },
    footer: { terms: "Mga Tuntunin", privacy: "Pagkapribado", help: "Tulong", copyright: "The Proven X. Mga sagot na sinuri ng komunidad." },
    about: { sponsorship: "Sponsorship", active_members: "Mga Aktibong Miyembro", verified_answers: "Mga Beripikadong Sagot", questions_asked: "Mga Tanong", trust_rate: "Rate ng Tiwala" },
    products: { open_app: "Buksan ang App", get_app: "Kunin ang App", join_now: "Sumali Ngayon", price_free: "$0/buwan", price_paid: "???/buwan", feature_ask: "Magtanong ng walang limitasyon", feature_post: "Mag-post at patunayan ang mga sagot", feature_vote: "Bumoto sa nilalaman", feature_profile: "Pangunahing profile", feature_everything: "Lahat sa Libre", feature_support: "Priority na suporta", feature_analytics: "Advanced na analytics", feature_badges: "Pasadyang mga badge ng profile" },
    blog: { subtitle: "Mga insight, update, at kwento mula sa komunidad.", p1_title: "Bakit Mas Mahusay ang mga Sagot sa Unang Kamay kaysa sa Pangkalahatang Payo", p1_excerpt: "Ang internet ay puno ng mga teorya. Binuo namin ang platform na ito dahil natanto namin na ang tanging payo na nagkakahalagang sundin ay mula sa isang tao na nakaranas na nito.", p2_title: "Paano Gumagana ang Sistema ng Pagpapatunay na 'Proven'", p2_excerpt: "Isang malalim na pagtingin sa aming algorithm sa pagpapatunay at kung bakit hindi lamang kami umaasa sa mga simpleng upvote upang matukoy ang pinakamahusay na sagot.", p3_title: "Spotlight ng Komunidad: Paglutas sa Hindi Dokumentado", p3_excerpt: "Itinatampok ang tatlong pagkakataon kung saan nilutas ng aming komunidad ang mga malabong problema na walang dokumentasyon kahit saan man sa web." }
  },
  hi: {
    nav: { sign_out: "साइन आउट" },
    footer: { terms: "शर्तें", privacy: "गोपनीयता", help: "सहायता", copyright: "The Proven X. समुदाय द्वारा जाँचे गए उत्तर।" },
    about: { sponsorship: "प्रायोजन", active_members: "सक्रिय सदस्य", verified_answers: "सत्यापित उत्तर", questions_asked: "पूछे गए प्रश्न", trust_rate: "विश्वास दर" },
    products: { open_app: "ऐप खोलें", get_app: "ऐप प्राप्त करें", join_now: "अभी जुड़ें", price_free: "$0/माह", price_paid: "???/माह", feature_ask: "असीमित प्रश्न पूछें", feature_post: "उत्तर पोस्ट करें और सत्यापित करें", feature_vote: "सामग्री पर वोट करें", feature_profile: "मूल प्रोफ़ाइल", feature_everything: "मुफ़्त में सब कुछ", feature_support: "प्राथमिकता समर्थन", feature_analytics: "उन्नत विश्लेषिकी", feature_badges: "कस्टम प्रोफ़ाइल बैज" },
    blog: { subtitle: "समुदाय से अंतर्दृष्टि, अपडेट और कहानियाँ।", p1_title: "प्रत्यक्ष उत्तर सामान्य सलाह से बेहतर क्यों हैं", p1_excerpt: "इंटरनेट सिद्धांतों से भरा है। हमने यह मंच इसलिए बनाया क्योंकि हमने महसूस किया कि पालन करने योग्य एकमात्र सलाह उस व्यक्ति से आती है जो वास्तव में वहां रहा है।", p2_title: "'Proven' सत्यापन प्रणाली कैसे काम करती है", p2_excerpt: "हमारे सत्यापन एल्गोरिदम में गहराई से उतरें और हम सबसे अच्छे उत्तर का निर्धारण करने के लिए केवल साधारण अपवोट पर निर्भर क्यों नहीं रहते।", p3_title: "सामुदायिक स्पॉटलाइट: गैर-दस्तावेजी को हल करना", p3_excerpt: "तीन ऐसे उदाहरणों को उजागर करना जहां हमारे समुदाय ने ऐसी अस्पष्ट समस्याओं को हल किया जिनका वेब पर कहीं और शून्य प्रलेखन था।" }
  },
  zh: {
    nav: { sign_out: "登出" },
    footer: { terms: "条款", privacy: "隐私", help: "帮助", copyright: "The Proven X. 社区审核的回答。" },
    about: { sponsorship: "赞助", active_members: "活跃成员", verified_answers: "已验证回答", questions_asked: "已提问数", trust_rate: "信任率" },
    products: { open_app: "打开应用", get_app: "获取应用", join_now: "立即加入", price_free: "$0/月", price_paid: "???/月", feature_ask: "无限制提问", feature_post: "发布并验证回答", feature_vote: "对内容进行投票", feature_profile: "基本个人资料", feature_everything: "免费版中的所有内容", feature_support: "优先支持", feature_analytics: "高级分析", feature_badges: "自定义个人资料徽章" },
    blog: { subtitle: "来自社区的见解、更新和故事。", p1_title: "为什么亲身经历的回答胜过泛泛的建议", p1_excerpt: "互联网充满了理论。我们建立这个平台是因为我们意识到，唯一值得遵循的建议来自真正亲历过的人。", p2_title: "'Proven' 验证系统如何运作", p2_excerpt: "深入了解我们的验证算法，以及为什么我们不仅仅依靠简单的点赞来决定最佳答案。", p3_title: "社区聚焦：解决无文档记录的问题", p3_excerpt: "重点介绍三个案例，我们的社区解决了在网络上其他地方没有任何文档记录的冷门问题。" }
  },
  fr: {
    nav: { sign_out: "Se déconnecter" },
    footer: { terms: "Conditions", privacy: "Confidentialité", help: "Aide", copyright: "The Proven X. Réponses validées par la communauté." },
    about: { sponsorship: "Sponsoring", active_members: "Membres actifs", verified_answers: "Réponses vérifiées", questions_asked: "Questions posées", trust_rate: "Taux de confiance" },
    products: { open_app: "Ouvrir l'application", get_app: "Obtenir l'application", join_now: "Rejoindre maintenant", price_free: "0 $/mois", price_paid: "???/mois", feature_ask: "Poser des questions illimitées", feature_post: "Publier et vérifier des réponses", feature_vote: "Voter sur le contenu", feature_profile: "Profil de base", feature_everything: "Tout dans Gratuit", feature_support: "Support prioritaire", feature_analytics: "Analyses avancées", feature_badges: "Badges de profil personnalisés" },
    blog: { subtitle: "Aperçus, mises à jour et histoires de la communauté.", p1_title: "Pourquoi les réponses directes valent mieux que les conseils génériques", p1_excerpt: "Internet est plein de théories. Nous avons créé cette plateforme parce que nous avons réalisé que le seul conseil qui vaut la peine d'être suivi vient de quelqu'un qui a réellement vécu la situation.", p2_title: "Comment fonctionne le système de vérification 'Proven'", p2_excerpt: "Une plongée en profondeur dans notre algorithme de vérification et pourquoi nous ne nous fions pas simplement aux votes positifs pour déterminer la meilleure réponse.", p3_title: "Pleins feux sur la communauté : Résoudre l'indocumentable", p3_excerpt: "Mise en évidence de trois cas où notre communauté a résolu des problèmes obscurs qui n'avaient aucune documentation ailleurs sur le web." }
  },
  es: {
    nav: { sign_out: "Cerrar sesión" },
    footer: { terms: "Términos", privacy: "Privacidad", help: "Ayuda", copyright: "The Proven X. Respuestas verificadas por la comunidad." },
    about: { sponsorship: "Patrocinio", active_members: "Miembros activos", verified_answers: "Respuestas verificadas", questions_asked: "Preguntas realizadas", trust_rate: "Tasa de confianza" },
    products: { open_app: "Abrir la aplicación", get_app: "Obtener la aplicación", join_now: "Únete ahora", price_free: "$0/mes", price_paid: "???/mes", feature_ask: "Haz preguntas ilimitadas", feature_post: "Publica y verifica respuestas", feature_vote: "Vota por el contenido", feature_profile: "Perfil básico", feature_everything: "Todo en Gratis", feature_support: "Soporte prioritario", feature_analytics: "Análisis avanzados", feature_badges: "Insignias de perfil personalizadas" },
    blog: { subtitle: "Información, actualizaciones e historias de la comunidad.", p1_title: "Por qué las respuestas de primera mano superan a los consejos genéricos", p1_excerpt: "Internet está lleno de teorías. Construimos esta plataforma porque nos dimos cuenta de que el único consejo que vale la pena seguir proviene de alguien que realmente ha estado allí.", p2_title: "Cómo funciona el sistema de verificación 'Proven'", p2_excerpt: "Un análisis profundo de nuestro algoritmo de verificación y por qué no nos basamos solo en simples votos positivos para determinar la mejor respuesta.", p3_title: "En el foco de la comunidad: Resolviendo lo indocumentable", p3_excerpt: "Destacando tres casos en los que nuestra comunidad resolvió problemas oscuros que no tenían ninguna documentación en ningún otro lugar de la web." }
  },
  ru: {
    nav: { sign_out: "Выйти" },
    footer: { terms: "Условия", privacy: "Конфиденциальность", help: "Помощь", copyright: "The Proven X. Ответы, проверенные сообществом." },
    about: { sponsorship: "Спонсорство", active_members: "Активные участники", verified_answers: "Проверенные ответы", questions_asked: "Задано вопросов", trust_rate: "Уровень доверия" },
    products: { open_app: "Открыть приложение", get_app: "Получить приложение", join_now: "Присоединиться", price_free: "$0/мес", price_paid: "???/мес", feature_ask: "Задавайте неограниченное количество вопросов", feature_post: "Публикуйте и проверяйте ответы", feature_vote: "Голосуйте за контент", feature_profile: "Базовый профиль", feature_everything: "Всё в Бесплатном", feature_support: "Приоритетная поддержка", feature_analytics: "Расширенная аналитика", feature_badges: "Пользовательские значки профиля" },
    blog: { subtitle: "Инсайты, обновления и истории из сообщества.", p1_title: "Почему ответы из первых уст лучше общих советов", p1_excerpt: "Интернет полон теорий. Мы создали эту платформу, потому что поняли, что единственный совет, которому стоит следовать, исходит от того, кто действительно там был.", p2_title: "Как работает система проверки 'Proven'", p2_excerpt: "Глубокое погружение в наш алгоритм проверки и почему мы не полагаемся только на простые голоса, чтобы определить лучший ответ.", p3_title: "В центре внимания сообщества: Решение недокументированного", p3_excerpt: "Освещение трех случаев, когда наше сообщество решило непонятные проблемы, не имевшие никакой документации где-либо еще в сети." }
  },
  uk: {
    nav: { sign_out: "Вийти" },
    footer: { terms: "Умови", privacy: "Конфіденційність", help: "Допомога", copyright: "The Proven X. Відповіді, перевірені спільнотою." },
    about: { sponsorship: "Спонсорство", active_members: "Активні учасники", verified_answers: "Перевірені відповіді", questions_asked: "Задано питань", trust_rate: "Рівень довіри" },
    products: { open_app: "Відкрити додаток", get_app: "Отримати додаток", join_now: "Приєднатися", price_free: "$0/міс", price_paid: "???/міс", feature_ask: "Задавайте необмежену кількість питань", feature_post: "Публікуйте та перевіряйте відповіді", feature_vote: "Голосуйте за контент", feature_profile: "Базовий профіль", feature_everything: "Все в Безкоштовному", feature_support: "Пріоритетна підтримка", feature_analytics: "Розширена аналітика", feature_badges: "Спеціальні значки профілю" },
    blog: { subtitle: "Інсайти, оновлення та історії від спільноти.", p1_title: "Чому відповіді з перших вуст кращі за загальні поради", p1_excerpt: "Інтернет повний теорій. Ми створили цю платформу, тому що зрозуміли, що єдина порада, якої варто дотримуватися, виходить від того, хто дійсно там був.", p2_title: "Як працює система перевірки 'Proven'", p2_excerpt: "Глибоке занурення в наш алгоритм перевірки і чому ми не покладаємося лише на прості голоси, щоб визначити найкращу відповідь.", p3_title: "У центрі уваги спільноти: Вирішення незадокументованого", p3_excerpt: "Висвітлення трьох випадків, коли наша спільнота вирішила незрозумілі проблеми, які не мали жодної документації деінде в мережі." }
  },
  fa: {
    nav: { sign_out: "خروج" },
    footer: { terms: "شرایط", privacy: "حریم خصوصی", help: "راهنما", copyright: "The Proven X. پاسخ‌های تایید شده جامعه." },
    about: { sponsorship: "حمایت مالی", active_members: "اعضای فعال", verified_answers: "پاسخ‌های تایید شده", questions_asked: "سوالات پرسیده شده", trust_rate: "نرخ اعتماد" },
    products: { open_app: "باز کردن برنامه", get_app: "دریافت برنامه", join_now: "اکنون بپیوندید", price_free: "$0/ماه", price_paid: "؟؟؟/ماه", feature_ask: "پرسش نامحدود سوال", feature_post: "ارسال و تایید پاسخ", feature_vote: "رای دادن به محتوا", feature_profile: "پروفایل پایه", feature_everything: "همه چیز در رایگان", feature_support: "پشتیبانی ویژه", feature_analytics: "تجزیه و تحلیل پیشرفته", feature_badges: "نشان‌های اختصاصی پروفایل" },
    blog: { subtitle: "بینش‌ها، به‌روزرسانی‌ها و داستان‌هایی از جامعه.", p1_title: "چرا پاسخ‌های مستقیم بهتر از توصیه‌های عمومی هستند", p1_excerpt: "اینترنت پر از نظریه است. ما این پلتفرم را ساختیم زیرا متوجه شدیم که تنها توصیه‌ای که ارزش پیروی دارد از طرف کسی است که واقعاً آن را تجربه کرده است.", p2_title: "سیستم تایید 'Proven' چگونه کار می‌کند", p2_excerpt: "نگاهی عمیق به الگوریتم تایید ما و اینکه چرا برای تعیین بهترین پاسخ فقط به رای‌های مثبت ساده متکی نیستیم.", p3_title: "تمرکز بر جامعه: حل مشکلات بدون مستندات", p3_excerpt: "برجسته کردن سه مورد که در آن جامعه ما مشکلات مبهمی را حل کرد که هیچ مستنداتی در هیچ جای وب نداشتند." }
  },
  ur: {
    nav: { sign_out: "سائن آؤٹ" },
    footer: { terms: "شرائط", privacy: "رازداری", help: "مدد", copyright: "The Proven X. کمیونٹی کے تصدیق شدہ جوابات۔" },
    about: { sponsorship: "اسپانسرشپ", active_members: "فعال ممبران", verified_answers: "تصدیق شدہ جوابات", questions_asked: "پوچھے گئے سوالات", trust_rate: "اعتماد کی شرح" },
    products: { open_app: "ایپ کھولیں", get_app: "ایپ حاصل کریں", join_now: "ابھی شامل ہوں", price_free: "$0/ماہ", price_paid: "؟؟؟/ماہ", feature_ask: "لامحدود سوالات پوچھیں", feature_post: "جوابات شائع اور تصدیق کریں", feature_vote: "مواد پر ووٹ دیں", feature_profile: "بنیادی پروفائل", feature_everything: "مفت میں سب کچھ", feature_support: "ترجیحی تعاون", feature_analytics: "اعلیٰ تجزیات", feature_badges: "حسب ضرورت پروفائل بیج" },
    blog: { subtitle: "کمیونٹی کی بصیرتیں، اپ ڈیٹس، اور کہانیاں۔", p1_title: "براہ راست جوابات عام مشورے سے بہتر کیوں ہیں", p1_excerpt: "انٹرنیٹ نظریات سے بھرا پڑا ہے۔ ہم نے یہ پلیٹ فارم اس لیے بنایا کیونکہ ہمیں احساس ہوا کہ عمل کرنے کے لائق واحد مشورہ اس شخص سے آتا ہے جس نے واقعی اس کا تجربہ کیا ہو۔", p2_title: "'Proven' تصدیق کا نظام کیسے کام کرتا ہے", p2_excerpt: "ہمارے تصدیق کے الگورتھم کا گہرا جائزہ اور یہ کہ ہم بہترین جواب کا تعین کرنے کے لیے صرف سادہ اپ ووٹ پر انحصار کیوں نہیں کرتے۔", p3_title: "کمیونٹی کی جھلک: غیر دستاویزی مسائل کو حل کرنا", p3_excerpt: "تین ایسی مثالوں کو اجاگر کرنا جہاں ہماری کمیونٹی نے ایسے مبہم مسائل کو حل کیا جن کی ویب پر کہیں اور کوئی دستاویزات نہیں تھیں۔" }
  },
  bn: {
    nav: { sign_out: "সাইন আউট" },
    footer: { terms: "শর্তাবলী", privacy: "গোপনীয়তা", help: "সাহায্য", copyright: "The Proven X. কমিউনিটি যাচাইকৃত উত্তর।" },
    about: { sponsorship: "স্পন্সরশিপ", active_members: "সক্রিয় সদস্য", verified_answers: "যাচাইকৃত উত্তর", questions_asked: "জিজ্ঞাসিত প্রশ্ন", trust_rate: "বিশ্বাসের হার" },
    products: { open_app: "অ্যাপ খুলুন", get_app: "অ্যাপ পান", join_now: "এখনই যোগ দিন", price_free: "$0/মাস", price_paid: "???/মাস", feature_ask: "সীমাহীন প্রশ্ন করুন", feature_post: "উত্তর পোস্ট এবং যাচাই করুন", feature_vote: "কন্টেন্টে ভোট দিন", feature_profile: "মৌলিক প্রোফাইল", feature_everything: "বিনামূল্যের সবকিছু", feature_support: "অগ্রাধিকার সমর্থন", feature_analytics: "উন্নত অ্যানালিটিক্স", feature_badges: "কাস্টম প্রোফাইল ব্যাজ" },
    blog: { subtitle: "কমিউনিটি থেকে অন্তর্দৃষ্টি, আপডেট এবং গল্প।", p1_title: "কেন প্রথম হাতের উত্তর সাধারণ পরামর্শের চেয়ে ভালো", p1_excerpt: "ইন্টারনেট তত্ত্ব দিয়ে পূর্ণ। আমরা এই প্ল্যাটফর্মটি তৈরি করেছি কারণ আমরা বুঝতে পেরেছিলাম যে অনুসরণ করার মতো একমাত্র পরামর্শ আসে এমন একজনের কাছ থেকে যিনি সত্যিই সেখানে ছিলেন।", p2_title: "'Proven' যাচাইকরণ সিস্টেম কীভাবে কাজ করে", p2_excerpt: "আমাদের যাচাইকরণ অ্যালগরিদমের একটি গভীর ডুব এবং কেন আমরা সেরা উত্তর নির্ধারণের জন্য শুধুমাত্র সাধারণ আপভোটের উপর নির্ভর করি না।", p3_title: "কমিউনিটি স্পটলাইট: অনথিভুক্ত সমাধান", p3_excerpt: "তিনটি দৃষ্টান্ত হাইলাইট করা যেখানে আমাদের সম্প্রদায় অস্পষ্ট সমস্যার সমাধান করেছে যার ওয়েবে অন্য কোথাও শূন্য ডকুমেন্টেশন ছিল।" }
  },
  tr: {
    nav: { sign_out: "Çıkış Yap" },
    footer: { terms: "Şartlar", privacy: "Gizlilik", help: "Yardım", copyright: "The Proven X. Topluluk tarafından doğrulanan cevaplar." },
    about: { sponsorship: "Sponsorluk", active_members: "Aktif Üyeler", verified_answers: "Doğrulanmış Cevaplar", questions_asked: "Sorulan Sorular", trust_rate: "Güven Oranı" },
    products: { open_app: "Uygulamayı Aç", get_app: "Uygulamayı Al", join_now: "Şimdi Katıl", price_free: "$0/ay", price_paid: "???/ay", feature_ask: "Sınırsız soru sor", feature_post: "Cevapları paylaş ve doğrula", feature_vote: "İçeriği oyla", feature_profile: "Temel profil", feature_everything: "Ücretsizdeki her şey", feature_support: "Öncelikli destek", feature_analytics: "Gelişmiş analitik", feature_badges: "Özel profil rozetleri" },
    blog: { subtitle: "Topluluktan içgörüler, güncellemeler ve hikayeler.", p1_title: "Neden Birinci Elden Cevaplar Genel Tavsiyelerden Daha İyidir?", p1_excerpt: "İnternet teorilerle dolu. Bu platformu kurduk çünkü takip etmeye değer tek tavsiyenin o durumu gerçekten yaşamış birinden geldiğini fark ettik.", p2_title: "'Proven' Doğrulama Sistemi Nasıl Çalışır?", p2_excerpt: "Doğrulama algoritmamıza derinlemesine bir bakış ve neden en iyi cevabı belirlemek için sadece basit oylara güvenmiyoruz.", p3_title: "Topluluk Gündemi: Belgesiz Olanı Çözmek", p3_excerpt: "Topluluğumuzun web'de başka hiçbir yerde belgelenmemiş karmaşık sorunları çözdüğü üç durumu vurguluyoruz." }
  }
};

let matchResult = content.match(/const resources = (\{[\s\S]*?\n\});\n\ni18n/);
if (matchResult) {
  let original = JSON.parse(matchResult[1]);
  for (const lang of Object.keys(original)) {
    Object.assign(original[lang].translation.nav, additions[lang].nav);
    original[lang].translation.footer = additions[lang].footer;
    Object.assign(original[lang].translation.about, additions[lang].about);
    Object.assign(original[lang].translation.products, additions[lang].products);
    Object.assign(original[lang].translation.blog, additions[lang].blog);
  }
  
  const fileContent = content.replace(matchResult[1], JSON.stringify(original, null, 2));
  fs.writeFileSync('src/lib/i18n.ts', fileContent);
}

